import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Book } from '../../../models/book-model';
import { getBooksByUser } from '../../../facades/books/books.facade';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';
import { QuizzCreateModalComponent } from '../../../components/quizz-create-modal/quizz-create-modal.component';
import { EntityType } from '../../../models/quizz-model';
import { EditEntityHeaderComponent } from '../../../components/edit-entity-header/edit-entity-header.component';

type EditBookForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
  readPriority: number;
};

type EditBookEntityForm = {
  pages: number;
  genre: string;
  saga: string;
  sagaOrder: number;
  nbTomes: number;
  isFinished: boolean;
  coverUrl: string;
};

type EditBookDialogData = {
  book: Book;
  userId?: string;
  list?: Book[];
  index?: number;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    EditEntityHeaderComponent,
  ],
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditBookComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditBookDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  public EntityType = EntityType;

  readonly book = signal<Book | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly bookForm = signal<EditBookForm | null>(null);
  readonly bookEntityForm = signal<EditBookEntityForm | null>(null);
  readonly bookNotFound = signal<boolean>(false);
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
  readonly dialogList = signal<Book[]>([]);
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

  readonly bookSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.book) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadBookFromSlug(params);
    });
  }

  updateField<K extends keyof EditBookForm>(field: K, value: string | number) {
    const current = this.bookForm();
    if (!current) return;

    let nextValue: EditBookForm[K] = value as EditBookForm[K];
    if (field === 'rating' || field === 'readTimes' || field === 'readPriority') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditBookForm[K];
    }

    this.bookForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'owned', checked: boolean) {
    const current = this.bookForm();
    if (!current) return;
    this.bookForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditBookEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.bookEntityForm();
    if (!current) return;
    let nextValue: EditBookEntityForm[K] = value as EditBookEntityForm[K];
    if (field !== 'genre' && field !== 'saga' && field !== 'coverUrl') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as EditBookEntityForm[K];
    }
    this.bookEntityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityCheckbox(field: 'isFinished', checked: boolean) {
    const current = this.bookEntityForm();
    if (!current) return;
    this.bookEntityForm.set({
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
    const form = this.bookForm();
    const book = this.book();
    if (!form || !book) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: book.title,
          author: book.author,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
          owned: form.owned,
          readPriority: form.readPriority,
          entity: this.isAdminView()
            ? this.toEntityPayload(this.bookEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-book:error', payload);
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
      console.error('edit-book:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const book = this.book();
    if (!book) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce livre de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/books/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: book.title,
          author: book.author,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-book:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToBooks();
    } catch (error) {
      console.error('edit-book:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const book = this.book();
    const entityForm = this.bookEntityForm();
    if (!book || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        "Merci de modifier soit le titre, soit l'auteur, pas les deux en même temps."
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/books`, {
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
        console.error('edit-book:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-book:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const book = this.book();
    if (!book) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: book.title,
        entityType: EntityType.BOOK,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToBooks() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'books']);
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

  private async loadBookFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const books = await getBooksByUser(userId);
    const matched = books.find((book) => {
      return this.toSlug(`${book.title} ${book.author}`) === slug;
    });

    if (!matched) {
      this.book.set(null);
      this.bookForm.set(null);
      this.bookNotFound.set(true);
      return;
    }

    this.book.set(matched);
    this.bookForm.set(this.toForm(matched));
    this.bookEntityForm.set(this.toEntityForm(matched));
    this.bookNotFound.set(false);
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

  private toForm(book: Book): EditBookForm {
    return {
      rating: book.rating,
      readTimes: book.readTimes || 0,
      readDate: book.readDate,
      owned: book.owned,
      readPriority: book.readPriority ?? 0,
    };
  }

  private toEntityForm(book: Book): EditBookEntityForm {
    return {
      pages: book.pages || 0,
      genre: book.genre || '',
      saga: book.saga || '',
      sagaOrder: book.sagaOrder || 0,
      nbTomes: book.nbTomes || 0,
      isFinished: book.isFinished !== false,
      coverUrl: book.coverUrl || '',
    };
  }

  private toEntityPayload(form: EditBookEntityForm | null) {
    if (!form) return undefined;
    return {
      pages: form.pages,
      genre: form.genre,
      saga: form.saga,
      sagaOrder: form.sagaOrder,
      nbTomes: form.nbTomes,
      isFinished: form.isFinished,
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

  private setupDialogNavigation(data: EditBookDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.book];
    const index = this.resolveDialogIndex(list, data.index, data.book);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setBook(list[index] ?? data.book);
  }

  private resolveDialogIndex(
    list: Book[],
    index: number | undefined,
    book: Book
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === book.title && item.author === book.author
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setBook(list[nextIndex]);
  }

  private setBook(book: Book): void {
    this.book.set(book);
    this.bookForm.set(this.toForm(book));
    this.bookEntityForm.set(this.toEntityForm(book));
    this.adminTitle.set(book.title);
    this.adminSecondary.set(book.author);
    this.originalTitle.set(book.title);
    this.originalSecondary.set(book.author);
    this.bookNotFound.set(false);
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
