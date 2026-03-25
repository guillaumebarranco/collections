import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Manga } from '../../../models/manga-model';
import { getMangasByUser } from '../../../facades/mangas/mangas.facade';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/entity/edit-entity/edit-entity.component';
import { EditEntityHeaderComponent } from '../../../components/entity/edit-entity-header/edit-entity-header.component';
import { AuthService } from '../../../core/auth.service';
import { QuizzCreateModalComponent } from '../../../components/modals/quizz-create-modal/quizz-create-modal.component';
import { EntityType } from '../../../models/quizz-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';

type EditMangaForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
  borrowed: string;
  loaned: string;
  wantToReadAgain: boolean;
  ratingComment: string;
};

type EditMangaEntityForm = {
  genre: string;
  nbTomes: number;
  isFinished: boolean;
  coverUrl: string;
  description: string;
};

type EditMangaDialogData = {
  manga: Manga;
  userId?: string;
  list?: Manga[];
  index?: number;
};

@Component({
  selector: 'app-edit-manga',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    EditEntityHeaderComponent,
  ],
  templateUrl: './edit-manga.component.html',
  styleUrls: ['./edit-manga.component.scss'],
})
export class EditMangaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditMangaComponent>, {
    optional: true,
  });
  public EntityType = EntityType;
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditMangaDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly manga = signal<Manga | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly mangaForm = signal<EditMangaForm | null>(null);
  readonly mangaEntityForm = signal<EditMangaEntityForm | null>(null);
  readonly mangaNotFound = signal<boolean>(false);
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
  readonly dialogList = signal<Manga[]>([]);
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

  readonly mangaSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.manga) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadMangaFromSlug(params);
    });
  }

  updateField<K extends keyof EditMangaForm>(field: K, value: string | number) {
    const current = this.mangaForm();
    if (!current) return;

    let nextValue: EditMangaForm[K] = value as EditMangaForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditMangaForm[K];
    }

    this.mangaForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'owned' | 'wantToReadAgain', checked: boolean) {
    const current = this.mangaForm();
    if (!current) return;
    this.mangaForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditMangaEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.mangaEntityForm();
    if (!current) return;
    let nextValue: EditMangaEntityForm[K] = value as EditMangaEntityForm[K];
    if (field !== 'genre' && field !== 'coverUrl') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as EditMangaEntityForm[K];
    }
    this.mangaEntityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityCheckbox(field: 'isFinished', checked: boolean) {
    const current = this.mangaEntityForm();
    if (!current) return;
    this.mangaEntityForm.set({
      ...current,
      [field]: checked,
    });
  }

  setRatingFromClick(star: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    const width = target.clientWidth;
    const x = event.offsetX;
    const ratio = x / width;
    const offset = ratio < 0.25 ? 0.75 : ratio < 0.5 ? 0.5 : ratio < 0.75 ? 0.25 : 0;
    const nextValue = Math.round((star - offset) * 4) / 4;
    this.updateField('rating', Math.max(0, Math.min(5, nextValue)));
  }

  getStarType(rating: number, star: number): 'full' | 'threeQuarter' | 'half' | 'quarter' | 'empty' {
    if (rating >= star) return 'full';
    if (rating >= star - 0.25) return 'threeQuarter';
    if (rating >= star - 0.5) return 'half';
    if (rating >= star - 0.75) return 'quarter';
    return 'empty';
  }

  async onSubmit(navigateAfterSave = false) {
    if (this.isAdminView()) {
      await this.onAdminSubmit();
      return;
    }
    const form = this.mangaForm();
    const manga = this.manga();
    if (!form || !manga) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/mangas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: manga.title,
          author: manga.author,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
          owned: form.owned,
          borrowed: form.borrowed,
          loaned: form.loaned,
          wantToReadAgain: form.wantToReadAgain,
          ratingComment: form.ratingComment ?? '',
          entity: this.isAdminView()
            ? this.toEntityPayload(this.mangaEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manga:error', payload);
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
      console.error('edit-manga:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const manga = this.manga();
    if (!manga) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce manga de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/mangas/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: manga.title,
          author: manga.author,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manga:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToMangas();
    } catch (error) {
      console.error('edit-manga:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const manga = this.manga();
    const entityForm = this.mangaEntityForm();
    if (!manga || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        "Merci de modifier soit le titre, soit l'auteur, pas les deux en même temps."
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/mangas`, {
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
        console.error('edit-manga:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-manga:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const manga = this.manga();
    if (!manga) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: manga.title,
        entityType: EntityType.MANGA,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToMangas() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'mangas']);
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

  private async loadMangaFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const mangas = await getMangasByUser(userId);
    const matched = mangas.find((manga) => {
      return this.toSlug(`${manga.title} ${manga.author}`) === slug;
    });

    if (!matched) {
      this.manga.set(null);
      this.mangaForm.set(null);
      this.mangaNotFound.set(true);
      return;
    }

    this.manga.set(matched);
    this.mangaForm.set(this.toForm(matched));
    this.mangaEntityForm.set(this.toEntityForm(matched));
    this.mangaNotFound.set(false);
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

  private toForm(manga: Manga): EditMangaForm {
    return {
      rating: manga.rating,
      readTimes: manga.readTimes || 0,
      readDate: manga.readDate,
      owned: manga.owned,
      borrowed: manga.borrowed ?? '',
      loaned: manga.loaned ?? '',
      wantToReadAgain: manga.wantToReadAgain ?? false,
      ratingComment: manga.ratingComment ?? '',
    };
  }

  private toEntityForm(manga: Manga): EditMangaEntityForm {
    return {
      genre: manga.genre || '',
      nbTomes: manga.nbTomes || 0,
      isFinished: manga.isFinished !== false,
      coverUrl: manga.coverUrl || '',
      description: manga.description ?? '',
    };
  }

  private toEntityPayload(form: EditMangaEntityForm | null) {
    if (!form) return undefined;
    return {
      genre: form.genre,
      nbTomes: form.nbTomes,
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

  private setupDialogNavigation(data: EditMangaDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.manga];
    const index = this.resolveDialogIndex(list, data.index, data.manga);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setManga(list[index] ?? data.manga);
  }

  private resolveDialogIndex(
    list: Manga[],
    index: number | undefined,
    manga: Manga
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === manga.title && item.author === manga.author
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setManga(list[nextIndex]);
  }

  private setManga(manga: Manga): void {
    this.manga.set(manga);
    this.mangaForm.set(this.toForm(manga));
    this.mangaEntityForm.set(this.toEntityForm(manga));
    this.adminTitle.set(manga.title);
    this.adminSecondary.set(manga.author);
    this.originalTitle.set(manga.title);
    this.originalSecondary.set(manga.author);
    this.mangaNotFound.set(false);
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
