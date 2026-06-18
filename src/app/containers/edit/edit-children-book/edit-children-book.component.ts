import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import {
  CHILDREN_BOOK_GENRE_OPTIONS,
  ChildrenBook,
  filterToChildrenBookGenres,
  type ChildrenBookGenre,
} from '../../../models/children-book-model';
import { getChildrenBooksByUser } from '../../../facades/children-books/children-books.facade';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/entity/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';
import { QuizzCreateModalComponent } from '../../../components/modals/quizz-create-modal/quizz-create-modal.component';
import { EntityType } from '../../../models/quizz-model';
import { EditEntityHeaderComponent } from '../../../components/entity/edit-entity-header/edit-entity-header.component';
import { CountrySelectComponent } from '../../../components/shared/country-select/country-select.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { ExtraDatesListComponent } from '../../../components/shared/extra-dates-list/extra-dates-list.component';
import { normalizeActivityExtraDates } from '../../../utils/activity-extra-dates.utils';

type EditChildrenBookForm = {
  rating: number;
  readTimes: number;
  firstReadDate: string;
  lastReadDate: string;
  otherReadDates: string[];
  owned: boolean;
  borrowed: string;
  loaned: string;
  readPriority: number;
  sagaFinished: boolean;
  wantToReadAgain: boolean;
  ratingComment: string;
};

type EditChildrenBookEntityForm = {
  pages: number;
  genre: ChildrenBookGenre[];
  saga: string;
  sagaOrder: number;
  sagaFinished: boolean;
  coverUrl: string;
  releaseDate: string;
  description: string;
  countryOrigin: string;
};

type EditChildrenBookDialogData = {
  childrenBook: ChildrenBook;
  userId?: string;
  list?: ChildrenBook[];
  index?: number;
};

@Component({
  selector: 'app-edit-children-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    EditEntityHeaderComponent,
    CountrySelectComponent,
    MatFormFieldModule,
    MatSelectModule,
    ExtraDatesListComponent,
  ],
  templateUrl: './edit-children-book.component.html',
  styleUrls: ['./edit-children-book.component.scss'],
})
export class EditChildrenBookComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditChildrenBookComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditChildrenBookDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  public EntityType = EntityType;

  readonly childrenBook = signal<ChildrenBook | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly childrenBookForm = signal<EditChildrenBookForm | null>(null);
  readonly childrenBookEntityForm = signal<EditChildrenBookEntityForm | null>(null);
  readonly childrenBookNotFound = signal<boolean>(false);
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
  readonly dialogList = signal<ChildrenBook[]>([]);
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

  readonly childrenBookGenreOptions = CHILDREN_BOOK_GENRE_OPTIONS;

  readonly childrenBookSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.childrenBook) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadChildrenBookFromSlug(params);
    });
  }

  updateOtherReadDates(dates: string[]): void {
    const form = this.childrenBookForm();
    if (!form) {
      return;
    }
    this.childrenBookForm.set({
      ...form,
      otherReadDates: dates,
    });
  }

  updateField<K extends keyof EditChildrenBookForm>(field: K, value: string | number) {
    const current = this.childrenBookForm();
    if (!current) return;

    let nextValue: EditChildrenBookForm[K] = value as EditChildrenBookForm[K];
    if (
      field === 'rating' ||
      field === 'readTimes' ||
      field === 'readPriority'
    ) {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditChildrenBookForm[K];
    }

    this.childrenBookForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(
    field: 'owned' | 'wantToReadAgain',
    checked: boolean
  ) {
    const current = this.childrenBookForm();
    if (!current) return;
    this.childrenBookForm.set({
      ...current,
      [field]: checked,
    });
  }

  setEntityGenres(genres: ChildrenBookGenre[]) {
    const current = this.childrenBookEntityForm();
    if (!current) return;
    this.childrenBookEntityForm.set({ ...current, genre: genres });
  }

  updateEntityField<K extends keyof EditChildrenBookEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.childrenBookEntityForm();
    if (!current) return;
    let nextValue: EditChildrenBookEntityForm[K] = value as EditChildrenBookEntityForm[K];
    if (
      field !== 'genre' &&
      field !== 'saga' &&
      field !== 'coverUrl' &&
      field !== 'releaseDate' &&
      field !== 'description' &&
      field !== 'countryOrigin'
    ) {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as EditChildrenBookEntityForm[K];
    }
    this.childrenBookEntityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityCheckbox(field: 'sagaFinished', checked: boolean) {
    const current = this.childrenBookEntityForm();
    if (!current) return;
    this.childrenBookEntityForm.set({
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
    const form = this.childrenBookForm();
    const childrenBook = this.childrenBook();
    if (!form || !childrenBook) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/children-books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: childrenBook.title,
          author: childrenBook.author,
          rating: form.rating,
          readTimes: form.readTimes,
          firstReadDate: form.firstReadDate,
          lastReadDate: form.lastReadDate,
          otherReadDates: normalizeActivityExtraDates(form.otherReadDates),
          owned: form.owned,
          borrowed: form.borrowed,
          loaned: form.loaned,
          readPriority: Math.min(3, Math.max(1, form.readPriority ?? 1)),
          wantToReadAgain: form.wantToReadAgain,
          ratingComment: form.ratingComment ?? '',
          entity: this.isAdminView()
            ? this.toEntityPayload(this.childrenBookEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-children-book:error', payload);
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
      console.error('edit-children-book:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const childrenBook = this.childrenBook();
    if (!childrenBook) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce livre de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/children-books/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: childrenBook.title,
          author: childrenBook.author,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-children-book:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToChildrenBooks();
    } catch (error) {
      console.error('edit-children-book:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const childrenBook = this.childrenBook();
    const entityForm = this.childrenBookEntityForm();
    if (!childrenBook || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        "Merci de modifier soit le titre, soit l'auteur, pas les deux en même temps."
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/children-books`, {
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
        console.error('edit-children-book:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-children-book:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const childrenBook = this.childrenBook();
    if (!childrenBook) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: childrenBook.title,
        entityType: EntityType.BOOK,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToChildrenBooks() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'children-books']);
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

  private async loadChildrenBookFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const childrenBooks = await getChildrenBooksByUser(userId);
    const matched = childrenBooks.find((childrenBook) => {
      return this.toSlug(`${childrenBook.title} ${childrenBook.author}`) === slug;
    });

    if (!matched) {
      this.childrenBook.set(null);
      this.childrenBookForm.set(null);
      this.childrenBookNotFound.set(true);
      return;
    }

    this.childrenBook.set(matched);
    this.childrenBookForm.set(this.toForm(matched));
    this.childrenBookEntityForm.set(this.toEntityForm(matched));
    this.childrenBookNotFound.set(false);
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

  private toForm(childrenBook: ChildrenBook): EditChildrenBookForm {
    return {
      rating: childrenBook.rating,
      readTimes: childrenBook.readTimes || 0,
      firstReadDate: childrenBook.firstReadDate,
      lastReadDate: childrenBook.lastReadDate,
      otherReadDates: [...(childrenBook.otherReadDates ?? [])],
      owned: childrenBook.owned,
      borrowed: childrenBook.borrowed ?? '',
      loaned: childrenBook.loaned ?? '',
      readPriority: Math.min(3, Math.max(1, childrenBook.readPriority ?? 1)),
      sagaFinished: childrenBook.sagaFinished,
      wantToReadAgain: childrenBook.wantToReadAgain ?? false,
      ratingComment: childrenBook.ratingComment ?? '',
    };
  }

  private toEntityForm(childrenBook: ChildrenBook): EditChildrenBookEntityForm {
    return {
      pages: childrenBook.pages || 0,
      genre: filterToChildrenBookGenres(childrenBook.genre ?? []),
      saga: childrenBook.saga || '',
      sagaOrder: childrenBook.sagaOrder || 0,
      coverUrl: childrenBook.coverUrl || '',
      sagaFinished: childrenBook.sagaFinished,
      releaseDate: childrenBook.releaseDate || '',
      description: childrenBook.description ?? '',
      countryOrigin: childrenBook.countryOrigin ?? '',
    };
  }

  private toEntityPayload(form: EditChildrenBookEntityForm | null) {
    if (!form) return undefined;
    return {
      pages: form.pages,
      genre: form.genre,
      saga: form.saga,
      sagaOrder: form.sagaOrder,
      sagaFinished: form.sagaFinished,
      coverUrl: form.coverUrl,
      releaseDate: form.releaseDate,
      description: form.description ?? '',
      countryOrigin: form.countryOrigin ?? '',
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

  private setupDialogNavigation(data: EditChildrenBookDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.childrenBook];
    const index = this.resolveDialogIndex(list, data.index, data.childrenBook);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setChildrenBook(list[index] ?? data.childrenBook);
  }

  private resolveDialogIndex(
    list: ChildrenBook[],
    index: number | undefined,
    childrenBook: ChildrenBook
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === childrenBook.title && item.author === childrenBook.author
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setChildrenBook(list[nextIndex]);
  }

  private setChildrenBook(childrenBook: ChildrenBook): void {
    this.childrenBook.set(childrenBook);
    this.childrenBookForm.set(this.toForm(childrenBook));
    this.childrenBookEntityForm.set(this.toEntityForm(childrenBook));
    this.adminTitle.set(childrenBook.title);
    this.adminSecondary.set(childrenBook.author);
    this.originalTitle.set(childrenBook.title);
    this.originalSecondary.set(childrenBook.author);
    this.childrenBookNotFound.set(false);
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
