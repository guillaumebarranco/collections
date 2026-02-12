import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Manwha } from '../../../models/manwha-model';
import { getManwhasByUser } from '../../../facades/manwhas/manwhas.facade';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { EditEntityHeaderComponent } from '../../../components/edit-entity-header/edit-entity-header.component';
import { AuthService } from '../../../core/auth.service';
import { QuizzCreateModalComponent } from '../../../components/quizz-create-modal/quizz-create-modal.component';
import { EntityType } from '../../../models/quizz-model';

type EditManwhaForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
  wantToReadAgain: boolean;
  ratingComment: string;
};

type EditManwhaEntityForm = {
  genre: string;
  nbChapters: number;
  isFinished: boolean;
  coverUrl: string;
  description: string;
};

type EditManwhaDialogData = {
  manwha: Manwha;
  userId?: string;
  list?: Manwha[];
  index?: number;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-manwha',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    EditEntityHeaderComponent,
  ],
  templateUrl: './edit-manwha.component.html',
  styleUrls: ['./edit-manwha.component.scss'],
})
export class EditManwhaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditManwhaComponent>, {
    optional: true,
  });
  public EntityType = EntityType;
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditManwhaDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly manwha = signal<Manwha | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly manwhaForm = signal<EditManwhaForm | null>(null);
  readonly manwhaEntityForm = signal<EditManwhaEntityForm | null>(null);
  readonly manwhaNotFound = signal<boolean>(false);
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
  readonly dialogList = signal<Manwha[]>([]);
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

  readonly manwhaSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.manwha) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadManwhaFromSlug(params);
    });
  }

  updateField<K extends keyof EditManwhaForm>(
    field: K,
    value: string | number
  ) {
    const current = this.manwhaForm();
    if (!current) return;

    let nextValue: EditManwhaForm[K] = value as EditManwhaForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditManwhaForm[K];
    }

    this.manwhaForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'owned' | 'wantToReadAgain', checked: boolean) {
    const current = this.manwhaForm();
    if (!current) return;
    this.manwhaForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditManwhaEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.manwhaEntityForm();
    if (!current) return;
    let nextValue: EditManwhaEntityForm[K] = value as EditManwhaEntityForm[K];
    if (field !== 'genre' && field !== 'coverUrl') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as EditManwhaEntityForm[K];
    }
    this.manwhaEntityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityCheckbox(field: 'isFinished', checked: boolean) {
    const current = this.manwhaEntityForm();
    if (!current) return;
    this.manwhaEntityForm.set({
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
    const form = this.manwhaForm();
    const manwha = this.manwha();
    if (!form || !manwha) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/manwhas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: manwha.title,
          author: manwha.author,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
          owned: form.owned,
          wantToReadAgain: form.wantToReadAgain,
          ratingComment: form.ratingComment ?? '',
          entity: this.isAdminView()
            ? this.toEntityPayload(this.manwhaEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manwha:error', payload);
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
      console.error('edit-manwha:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const manwha = this.manwha();
    if (!manwha) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce manwha de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/manwhas/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: manwha.title,
          author: manwha.author,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manwha:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToManwhas();
    } catch (error) {
      console.error('edit-manwha:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const manwha = this.manwha();
    const entityForm = this.manwhaEntityForm();
    if (!manwha || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        "Merci de modifier soit le titre, soit l'auteur, pas les deux en même temps."
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/manwhas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getAdminUserId(),
          title: this.adminTitle().trim(),
          author: this.adminSecondary().trim(),
          entityOnly: true,
          originalTitle: this.originalTitle(),
          originalAuthor: this.originalSecondary(),
          entity: this.toEntityPayload(entityForm),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manwha:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-manwha:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const manwha = this.manwha();
    if (!manwha) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: manwha.title,
        entityType: EntityType.MANWHA,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToManwhas() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'manwhas']);
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

  private async loadManwhaFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const manwhas = await getManwhasByUser(userId);
    const matched = manwhas.find((manwha) => {
      return this.toSlug(`${manwha.title} ${manwha.author}`) === slug;
    });

    if (!matched) {
      this.manwha.set(null);
      this.manwhaForm.set(null);
      this.manwhaNotFound.set(true);
      return;
    }

    this.manwha.set(matched);
    this.manwhaForm.set(this.toForm(matched));
    this.manwhaEntityForm.set(this.toEntityForm(matched));
    this.manwhaNotFound.set(false);
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

  private toForm(manwha: Manwha): EditManwhaForm {
    return {
      rating: manwha.rating,
      readTimes: manwha.readTimes || 0,
      readDate: manwha.readDate,
      owned: manwha.owned,
      wantToReadAgain: manwha.wantToReadAgain ?? false,
      ratingComment: manwha.ratingComment ?? '',
    };
  }

  private toEntityForm(manwha: Manwha): EditManwhaEntityForm {
    return {
      genre: manwha.genre || '',
      nbChapters: manwha.nbChapters || 0,
      isFinished: manwha.isFinished !== false,
      coverUrl: manwha.coverUrl || '',
      description: manwha.description ?? '',
    };
  }

  private toEntityPayload(form: EditManwhaEntityForm | null) {
    if (!form) return undefined;
    return {
      genre: form.genre,
      nbChapters: form.nbChapters,
      isFinished: form.isFinished,
      coverUrl: form.coverUrl,
      description: form.description ?? '',
    };
  }

  private canEditCurrentUser(): boolean {
    return (
      this.isAdminView() || this.authService.canEdit(this.getCurrentUserId())
    );
  }

  private getAdminUserId(): string {
    return this.authService.getAuthenticatedUserId() || this.getCurrentUserId();
  }

  private setupDialogNavigation(data: EditManwhaDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.manwha];
    const index = this.resolveDialogIndex(list, data.index, data.manwha);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setManwha(list[index] ?? data.manwha);
  }

  private resolveDialogIndex(
    list: Manwha[],
    index: number | undefined,
    manwha: Manwha
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === manwha.title && item.author === manwha.author
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setManwha(list[nextIndex]);
  }

  private setManwha(manwha: Manwha): void {
    this.manwha.set(manwha);
    this.manwhaForm.set(this.toForm(manwha));
    this.manwhaEntityForm.set(this.toEntityForm(manwha));
    this.adminTitle.set(manwha.title);
    this.adminSecondary.set(manwha.author);
    this.originalTitle.set(manwha.title);
    this.originalSecondary.set(manwha.author);
    this.manwhaNotFound.set(false);
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
