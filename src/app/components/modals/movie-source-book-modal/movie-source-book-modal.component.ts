import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BaseBook, Book } from '../../../models/book-model';
import type { MovieFromEntityAdaptation } from '../../../models/from-entity.model';
import {
  getAllBaseBooks,
  getBooksByUser,
  getCurrentReadlistBooksByUser,
} from '../../../facades/books/books.facade';
import {
  addBookAsRead,
  addBookToReadlist,
} from '../../../containers/collections/books/books.controller';
import { getEmptyBook } from '../../../helpers/empty-entities-helper';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

export interface MovieSourceBookModalData {
  fromEntity: MovieFromEntityAdaptation;
  userId: string | null;
}

export type MovieSourceBookStatus = 'loading' | 'missing' | 'none' | 'readlist' | 'read';

function findBaseBook(
  books: BaseBook[],
  title: string,
  author: string
): BaseBook | undefined {
  const titleKey = normalizeSearchText(title);
  const authorKey = normalizeSearchText(author);
  const byTitle = books.filter(
    (b) => normalizeSearchText(b.title) === titleKey
  );
  if (byTitle.length === 0) return undefined;
  if (authorKey) {
    const byAuthor = byTitle.find(
      (b) => normalizeSearchText(b.author) === authorKey
    );
    if (byAuthor) return byAuthor;
  }
  return byTitle.length === 1 ? byTitle[0] : byTitle[0];
}

function findUserBook(
  books: Book[],
  title: string,
  author: string
): Book | undefined {
  const titleKey = normalizeSearchText(title);
  const authorKey = normalizeSearchText(author);
  return books.find((b) => {
    if (normalizeSearchText(b.title) !== titleKey) return false;
    if (!authorKey) return true;
    return normalizeSearchText(b.author) === authorKey;
  });
}

@Component({
  selector: 'app-movie-source-book-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './movie-source-book-modal.component.html',
  styleUrls: ['./movie-source-book-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieSourceBookModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<MovieSourceBookModalComponent>);
  readonly data = inject<MovieSourceBookModalData>(MAT_DIALOG_DATA);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly baseBook = signal<BaseBook | null>(null);
  readonly status = signal<MovieSourceBookStatus>('loading');

  readonly sourceTitle = computed(
    () => this.baseBook()?.title || this.data.fromEntity.title || ''
  );
  readonly sourceAuthor = computed(
    () => this.baseBook()?.author || this.data.fromEntity.secondEntityKey || ''
  );

  ngOnInit(): void {
    void this.load();
  }

  close(): void {
    this.dialogRef.close();
  }

  async addToReadlist(): Promise<void> {
    await this.addBook(true);
  }

  async addAsRead(): Promise<void> {
    await this.addBook(false);
  }

  private async addBook(readlist: boolean): Promise<void> {
    const userId = this.data.userId;
    const book = this.baseBook();
    if (!userId || !book || this.saving()) return;
    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    const payload = getEmptyBook(book);
    const ok = readlist
      ? await addBookToReadlist(payload, userId)
      : await addBookAsRead(payload, userId);
    this.saving.set(false);
    if (!ok) {
      this.errorMessage.set("Impossible d'ajouter le livre pour le moment.");
      return;
    }
    this.status.set(readlist ? 'readlist' : 'read');
    this.successMessage.set(
      readlist
        ? 'Livre ajouté à votre liste de lecture.'
        : 'Livre ajouté à vos livres lus.'
    );
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    const title = this.data.fromEntity.title ?? '';
    const author = this.data.fromEntity.secondEntityKey ?? '';
    try {
      const baseBooks = await getAllBaseBooks();
      const found = findBaseBook(baseBooks, title, author) ?? null;
      this.baseBook.set(found);
      if (!found) {
        this.status.set('missing');
        return;
      }
      const userId = this.data.userId;
      if (!userId) {
        this.status.set('none');
        return;
      }
      const [userBooks, readlist] = await Promise.all([
        getBooksByUser(userId),
        getCurrentReadlistBooksByUser(userId),
      ]);
      const readBook = findUserBook(userBooks, found.title, found.author);
      if (readBook) {
        this.status.set('read');
        return;
      }
      const inReadlist = findUserBook(readlist, found.title, found.author);
      this.status.set(inReadlist ? 'readlist' : 'none');
    } catch {
      this.status.set('missing');
      this.errorMessage.set('Impossible de charger les informations du livre.');
    } finally {
      this.loading.set(false);
    }
  }
}
