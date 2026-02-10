import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Comic } from '../../../models/comic-model';
import { getComicsByUser } from '../../../facades/comics/comics.facade';
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

type EditComicForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
  wantToReadAgain: boolean;
};

type EditComicEntityForm = {
  pages: number;
  genre: string;
  writer: string;
  coverUrl: string;
};

type EditComicDialogData = {
  comic: Comic;
  userId?: string;
  list?: Comic[];
  index?: number;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-comic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    EditEntityHeaderComponent,
  ],
  templateUrl: './edit-comic.component.html',
  styleUrls: ['./edit-comic.component.scss'],
})
export class EditComicComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditComicComponent>, {
    optional: true,
  });
  public EntityType = EntityType;
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditComicDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly comic = signal<Comic | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly comicForm = signal<EditComicForm | null>(null);
  readonly comicEntityForm = signal<EditComicEntityForm | null>(null);
  readonly comicNotFound = signal<boolean>(false);
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
  readonly dialogList = signal<Comic[]>([]);
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

  readonly comicSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.comic) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadComicFromSlug(params);
    });
  }

  updateField<K extends keyof EditComicForm>(field: K, value: string | number) {
    const current = this.comicForm();
    if (!current) return;

    let nextValue: EditComicForm[K] = value as EditComicForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditComicForm[K];
    }

    this.comicForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'owned' | 'wantToReadAgain', checked: boolean) {
    const current = this.comicForm();
    if (!current) return;
    this.comicForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditComicEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.comicEntityForm();
    if (!current) return;
    let nextValue: EditComicEntityForm[K] = value as EditComicEntityForm[K];
    if (field !== 'genre' && field !== 'writer' && field !== 'coverUrl') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as EditComicEntityForm[K];
    }
    this.comicEntityForm.set({
      ...current,
      [field]: nextValue,
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
    const form = this.comicForm();
    const comic = this.comic();
    if (!form || !comic) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/comics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: comic.title,
          writer: comic.writer,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
          owned: form.owned,
          wantToReadAgain: form.wantToReadAgain,
          entity: this.isAdminView()
            ? this.toEntityPayload(this.comicEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-comic:error', payload);
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
      console.error('edit-comic:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const comic = this.comic();
    if (!comic) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce comic de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/comics/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: comic.title,
          writer: comic.writer,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-comic:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToComics();
    } catch (error) {
      console.error('edit-comic:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const comic = this.comic();
    const entityForm = this.comicEntityForm();
    if (!comic || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        'Merci de modifier soit le titre, soit le scénariste, pas les deux en même temps.'
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/comics`, {
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
        console.error('edit-comic:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-comic:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const comic = this.comic();
    if (!comic) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: comic.title,
        entityType: EntityType.COMIC,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToComics() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'comics']);
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

  private async loadComicFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const comics = await getComicsByUser(userId);
    const matched = comics.find((comic) => {
      return this.toSlug(`${comic.title} ${comic.writer}`) === slug;
    });

    if (!matched) {
      this.comic.set(null);
      this.comicForm.set(null);
      this.comicNotFound.set(true);
      return;
    }

    this.comic.set(matched);
    this.comicForm.set(this.toForm(matched));
    this.comicEntityForm.set(this.toEntityForm(matched));
    this.comicNotFound.set(false);
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

  private toForm(comic: Comic): EditComicForm {
    return {
      rating: comic.rating,
      readTimes: comic.readTimes || 0,
      readDate: comic.readDate,
      owned: comic.owned,
      wantToReadAgain: comic.wantToReadAgain ?? false,
    };
  }

  private toEntityForm(comic: Comic): EditComicEntityForm {
    return {
      pages: comic.pages || 0,
      genre: comic.genre || '',
      writer: comic.writer || '',
      coverUrl: comic.coverUrl || '',
    };
  }

  private toEntityPayload(form: EditComicEntityForm | null) {
    if (!form) return undefined;
    return {
      pages: form.pages,
      genre: form.genre,
      writer: form.writer,
      coverUrl: form.coverUrl,
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

  private setupDialogNavigation(data: EditComicDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.comic];
    const index = this.resolveDialogIndex(list, data.index, data.comic);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setComic(list[index] ?? data.comic);
  }

  private resolveDialogIndex(
    list: Comic[],
    index: number | undefined,
    comic: Comic
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === comic.title && item.writer === comic.writer
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setComic(list[nextIndex]);
  }

  private setComic(comic: Comic): void {
    this.comic.set(comic);
    this.comicForm.set(this.toForm(comic));
    this.comicEntityForm.set(this.toEntityForm(comic));
    this.adminTitle.set(comic.title);
    this.adminSecondary.set(comic.writer);
    this.originalTitle.set(comic.title);
    this.originalSecondary.set(comic.writer);
    this.comicNotFound.set(false);
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
