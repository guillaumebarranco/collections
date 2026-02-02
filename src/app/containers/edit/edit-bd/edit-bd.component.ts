import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Bd } from '../../../models/bd-model';
import { getBdsByUser } from '../../../facades/bds/bds.facade';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';
import { QuizzCreateModalComponent } from '../../../components/quizz-create-modal/quizz-create-modal.component';
import { QuizzEntityType } from '../../../models/quizz-model';

type EditBdForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
};

type EditBdEntityForm = {
  pages: number;
  genre: string;
  nbTomes: number;
  isFinished: boolean;
  writer: string;
  coverUrl: string;
};

type EditBdDialogData = {
  bd: Bd;
  userId?: string;
  list?: Bd[];
  index?: number;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-bd',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-bd.component.html',
  styleUrls: ['./edit-bd.component.scss'],
})
export class EditBdComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef<EditBdComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditBdDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly bd = signal<Bd | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly bdForm = signal<EditBdForm | null>(null);
  readonly bdEntityForm = signal<EditBdEntityForm | null>(null);
  readonly bdNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly isAdmin = computed(() => this.authService.isAdmin());
  readonly isAdminView = computed(
    () => this.authService.isAdmin() && this.router.url.startsWith('/admin')
  );
  readonly isTitleModified = computed(
    () => this.adminTitle().trim() !== this.originalTitle().trim()
  );
  readonly isSecondaryModified = computed(
    () => this.adminSecondary().trim() !== this.originalSecondary().trim()
  );
  readonly disableTitleEdit = computed(() => this.isSecondaryModified());
  readonly disableSecondaryEdit = computed(() => this.isTitleModified());
  readonly hasDialogUpdates = signal<boolean>(false);
  readonly dialogList = signal<Bd[]>([]);
  readonly dialogIndex = signal<number>(-1);
  readonly hasDialogNavigation = computed(() => {
    return (
      this.isDialogMode() &&
      this.dialogList().length > 1 &&
      this.dialogIndex() >= 0
    );
  });
  readonly canNavigatePrevious = computed(() => {
    return this.hasDialogNavigation() && this.dialogIndex() > 0;
  });
  readonly canNavigateNext = computed(() => {
    return (
      this.hasDialogNavigation() &&
      this.dialogIndex() < this.dialogList().length - 1
    );
  });
  readonly dialogPositionLabel = computed(() => {
    if (!this.hasDialogNavigation()) return '';
    return `${this.dialogIndex() + 1}/${this.dialogList().length}`;
  });

  readonly bdSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.bd) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadBdFromSlug(params);
    });
  }

  updateField<K extends keyof EditBdForm>(field: K, value: string | number) {
    const current = this.bdForm();
    if (!current) return;

    let nextValue: EditBdForm[K] = value as EditBdForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditBdForm[K];
    }

    this.bdForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'owned', checked: boolean) {
    const current = this.bdForm();
    if (!current) return;
    this.bdForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditBdEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.bdEntityForm();
    if (!current) return;
    let nextValue: EditBdEntityForm[K] = value as EditBdEntityForm[K];
    if (field !== 'genre' && field !== 'writer' && field !== 'coverUrl') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditBdEntityForm[K];
    }
    this.bdEntityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityCheckbox(field: 'isFinished', checked: boolean) {
    const current = this.bdEntityForm();
    if (!current) return;
    this.bdEntityForm.set({
      ...current,
      [field]: checked,
    });
  }

  setRatingFromClick(star: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    const half = target.clientWidth / 2;
    const nextValue = event.offsetX < half ? star - 0.5 : star;
    this.updateField('rating', Math.max(0, nextValue));
  }

  getStarType(rating: number, star: number): 'full' | 'half' | 'empty' {
    if (rating >= star) {
      return 'full';
    }
    if (rating >= star - 0.5) {
      return 'half';
    }
    return 'empty';
  }

  async onSubmit(navigateAfterSave = false) {
    if (this.isAdminView()) {
      await this.onAdminSubmit();
      return;
    }
    const form = this.bdForm();
    const bd = this.bd();
    if (!form || !bd) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/bds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: bd.title,
          writer: bd.writer,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
          owned: form.owned,
          entity: this.isAdmin()
            ? this.toEntityPayload(this.bdEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-bd:error', payload);
        return;
      }

      if (this.dialogRef) {
        if (navigateAfterSave && this.canNavigateNext()) {
          this.hasDialogUpdates.set(true);
          this.navigateNext();
          return;
        }
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-bd:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const bd = this.bd();
    if (!bd) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer cette BD de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/bds/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: bd.title,
          writer: bd.writer,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-bd:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToBds();
    } catch (error) {
      console.error('edit-bd:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const bd = this.bd();
    const entityForm = this.bdEntityForm();
    if (!bd || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        "Merci de modifier soit le titre, soit le scénariste, pas les deux en même temps."
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/bds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getAdminUserId(),
          title: this.adminTitle().trim(),
          writer: this.adminSecondary().trim(),
          entityOnly: true,
          originalTitle: this.originalTitle(),
          originalWriter: this.originalSecondary(),
          entity: this.toEntityPayload(entityForm),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-bd:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-bd:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const bd = this.bd();
    if (!bd) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: bd.title,
        entityType: QuizzEntityType.BD,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToBds() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'bds']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  navigatePrevious(): void {
    this.navigateToOffset(-1);
  }

  navigateNext(): void {
    this.navigateToOffset(1);
  }

  private async loadBdFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const bds = await getBdsByUser(userId);
    const matched = bds.find((bd) => {
      return this.toSlug(`${bd.title} ${bd.writer}`) === slug;
    });

    if (!matched) {
      this.bd.set(null);
      this.bdForm.set(null);
      this.bdNotFound.set(true);
      return;
    }

    this.bd.set(matched);
    this.bdForm.set(this.toForm(matched));
    this.bdEntityForm.set(this.toEntityForm(matched));
    this.bdNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private getQuizzCreator(): string {
    return this.authService.getAuthenticatedUserId() || this.getCurrentUserId();
  }

  private toForm(bd: Bd): EditBdForm {
    return {
      rating: bd.rating,
      readTimes: bd.readTimes || 0,
      readDate: bd.readDate,
      owned: bd.owned,
    };
  }

  private toEntityForm(bd: Bd): EditBdEntityForm {
    return {
      pages: bd.pages || 0,
      genre: bd.genre || '',
      nbTomes: bd.nbTomes || 0,
      isFinished: bd.isFinished !== false,
      writer: bd.writer || '',
      coverUrl: bd.coverUrl || '',
    };
  }

  private toEntityPayload(form: EditBdEntityForm | null) {
    if (!form) return undefined;
    return {
      pages: form.pages,
      genre: form.genre,
      nbTomes: form.nbTomes,
      isFinished: form.isFinished,
      writer: form.writer,
      coverUrl: form.coverUrl,
    };
  }

  private canEditCurrentUser(): boolean {
    return this.isAdminView() || this.authService.canEdit(this.getCurrentUserId());
  }

  private getAdminUserId(): string {
    return this.authService.getAuthenticatedUserId() || this.getCurrentUserId();
  }

  private setupDialogNavigation(data: EditBdDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.bd];
    const index = this.resolveDialogIndex(list, data.index, data.bd);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setBd(list[index] ?? data.bd);
  }

  private resolveDialogIndex(
    list: Bd[],
    index: number | undefined,
    bd: Bd
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === bd.title && item.writer === bd.writer
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setBd(list[nextIndex]);
  }

  private setBd(bd: Bd): void {
    this.bd.set(bd);
    this.bdForm.set(this.toForm(bd));
    this.bdEntityForm.set(this.toEntityForm(bd));
    this.adminTitle.set(bd.title);
    this.adminSecondary.set(bd.writer);
    this.originalTitle.set(bd.title);
    this.originalSecondary.set(bd.writer);
    this.bdNotFound.set(false);
  }

  private toSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }
}
