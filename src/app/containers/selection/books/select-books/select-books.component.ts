import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Book } from '../../../../models/book-model';
import type { LightBook } from '../../../../models/entity-light.model';
import {
  getAllBaseBooksLight,
  getUserBooksRaw,
  getReadlistBooksRaw,
} from '../../../../facades/books/books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddBookComponent } from '../../../add/add-book/add-book.component';
import { RequestEntityAddModalComponent } from '../../../../components/modals/request-entity-add-modal/request-entity-add-modal.component';
import { SelectEntityComponent } from '../../../../components/entity/select-entity/select-entity.component';

import { getApiBaseUrl } from '../../../../core/config';
import { getEmptyBook } from '../../../../helpers/empty-entities-helper';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';
import { firstValueFrom } from 'rxjs';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalData,
  MoveEntityReviewModalResult,
} from '../../../../components/modals/move-entity-review-modal/move-entity-review-modal.component';

@Component({
  selector: 'app-select-books',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-books.component.html',
  styleUrls: ['./select-books.component.scss', '../../select-base.scss'],
})
export class SelectBooksComponent
  extends SelectEntitiesComponent
  implements OnInit, OnDestroy
{
  private static readonly pageSize = 500;

  private readonly dialog = inject(MatDialog);
  private readonly loadMoreSentinel = viewChild<ElementRef<HTMLElement>>('loadMore');
  private loadMoreObserver: IntersectionObserver | null = null;

  readonly visibleCount = signal(SelectBooksComponent.pageSize);
  readonly descriptionExpanded = signal(false);

  baseBooks = signal<LightBook[]>([]);
  userBooks = signal<Book[]>([]);
  readlistBooks = signal<Book[]>([]);
  allBooksMergedList = signal<Book[]>([]);
  searchTerm = signal('');

  // Livres déjà lus par l'utilisateur (pour les exclure en mode readlist)
  readBooks = computed<Set<string>>(() => {
    const userBooks = this.userBooks();
    return new Set(userBooks.map((book) => this.getBookKey(book)));
  });

  /** Au moins un livre lu issu du catalogue (entités existantes) — pour afficher l’ajout manuel. */
  hasReadBooksFromExistingCatalog = computed(() => {
    const baseKeys = new Set(
      this.baseBooks().map((b) => `${b.title}-${b.author}`)
    );
    return this.userBooks().some((book) => baseKeys.has(this.getBookKey(book)));
  });

  // Livres déjà en readlist (exclus du parcours, mais retrouvés par la recherche « livres lus »).
  alreadyInReadlistBooks = computed<Set<string>>(() => {
    const readlistBooks = this.readlistBooks();
    return new Set(readlistBooks.map((book) => this.getBookKey(book)));
  });

  /** Livres du catalogue déjà dans « à lire », pas encore lus. */
  readlistBooksInCatalog = computed<Book[]>(() => {
    const readlistKeys = this.alreadyInReadlistBooks();
    const readKeys = this.readBooks();
    return this.allBooksMergedList().filter((book) => {
      const key = this.getBookKey(book);
      return readlistKeys.has(key) && !readKeys.has(key);
    });
  });

  // Tous les livres proposés : ni déjà lus, ni déjà en readlist.
  // Tri par selectDisplayOrder décroissant ; à égalité, ordre inchangé (sort stable).
  allBooks = computed<Book[]>(() => {
    const allBooksList = this.baseBooks().map(getEmptyBook);
    const filtered = allBooksList.filter(
      (book) =>
        !this.readBooks().has(this.getBookKey(book)) &&
        !this.alreadyInReadlistBooks().has(this.getBookKey(book))
    );
    return [...filtered].sort(
      (a, b) =>
        (b.selectDisplayOrder ?? 0) - (a.selectDisplayOrder ?? 0)
    );
  });

  filteredBooks = computed<Book[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allBooks();
    if (!normalizedTerm) return list;

    const matches = list.filter((book) =>
      this.matchesSearch(book, normalizedTerm)
    );
    if (this.isWatchOrReadlistMode()) {
      return matches;
    }

    const readlistMatches = this.sortByDisplayOrder(
      this.readlistBooksInCatalog().filter((book) =>
        this.matchesSearch(book, normalizedTerm)
      )
    );
    if (readlistMatches.length === 0) return matches;

    const alreadyListed = new Set(matches.map((book) => this.getBookKey(book)));
    const surfaced = readlistMatches.filter(
      (book) => !alreadyListed.has(this.getBookKey(book))
    );
    return [...surfaced, ...matches];
  });

  displayedBooks = computed(() =>
    this.filteredBooks().slice(0, this.visibleCount())
  );

  hasMoreBooks = computed(
    () => this.filteredBooks().length > this.visibleCount()
  );

  constructor() {
    super();
    effect((onCleanup) => {
      const sentinel = this.loadMoreSentinel()?.nativeElement;
      this.loadMoreObserver?.disconnect();
      this.loadMoreObserver = null;
      if (!sentinel || !this.hasMoreBooks()) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.showMoreBooks();
          }
        },
        { rootMargin: '400px' }
      );
      observer.observe(sentinel);
      this.loadMoreObserver = observer;
      onCleanup(() => observer.disconnect());
    });
  }

  selectedBooks = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedBooks().size);

  ngOnDestroy(): void {
    this.loadMoreObserver?.disconnect();
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
    this.visibleCount.set(SelectBooksComponent.pageSize);
  }

  showMoreBooks(): void {
    if (!this.hasMoreBooks()) return;
    this.visibleCount.update((count) => count + SelectBooksComponent.pageSize);
  }

  async ngOnInit() {
    const userId = this.userId();
    const [baseBooks, books, readlist] = await Promise.all([
      getAllBaseBooksLight(),
      getUserBooksRaw(userId),
      getReadlistBooksRaw(userId),
    ]);

    this.baseBooks.set(baseBooks);
    const allBooks = await this.getAllBooksForSelection(userId);
    this.userBooks.set(books as Book[]);
    this.readlistBooks.set(readlist as Book[]);
    this.allBooksMergedList.set(allBooks);
  }

  isSelected(book: Book): boolean {
    return this.selectedBooks().has(this.getBookKey(book));
  }

  isOnReadlist(book: Book): boolean {
    return (
      !this.isWatchOrReadlistMode() &&
      this.alreadyInReadlistBooks().has(this.getBookKey(book))
    );
  }

  private matchesSearch(book: Book, normalizedTerm: string): boolean {
    const title = normalizeSearchText(book.title ?? '');
    const author = normalizeSearchText(book.author ?? '');
    const saga = normalizeSearchText(book.saga ?? '');
    return (
      title.includes(normalizedTerm) ||
      author.includes(normalizedTerm) ||
      saga.includes(normalizedTerm)
    );
  }

  private sortByDisplayOrder(books: Book[]): Book[] {
    return [...books].sort(
      (a, b) => (b.selectDisplayOrder ?? 0) - (a.selectDisplayOrder ?? 0)
    );
  }

  private booksEligibleForSubmit(): Book[] {
    if (this.isWatchOrReadlistMode()) {
      return this.allBooks();
    }
    const byKey = new Map<string, Book>();
    for (const book of [
      ...this.readlistBooksInCatalog(),
      ...this.allBooks(),
    ]) {
      byKey.set(this.getBookKey(book), book);
    }
    return [...byKey.values()];
  }

  private getBookKey(book: Book): string {
    return `${book.title}-${book.author}`;
  }

  toggleSelection(book: Book): void {
    const key = this.getBookKey(book);
    const selected = new Set(this.selectedBooks());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedBooks.set(selected);
  }

  openRequestEntityAddDialog(): void {
    this.dialog.open(RequestEntityAddModalComponent, {
      data: { entityType: 'book', userId: this.userId() },
      width: '480px',
      maxWidth: '95vw',
    });
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(AddBookComponent, {
      data: { userId: this.userId(), listMode: this.listModeFlag() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/books`]);
      }
    });
  }

  private async getAllBooksForSelection(_userId: string): Promise<Book[]> {
    return (await getAllBaseBooksLight()).map(getEmptyBook);
  }

  protected async addSelectedBooks(): Promise<void> {
    const selectedBooksList = this.booksEligibleForSubmit()
      .filter((book) => this.isSelected(book))
      .map((book) => {
        return {
          ...book,
          readTimes: 1,
          rating: 0,
          firstReadDate: '',
          lastReadDate: '',
        };
      });

    const books = selectedBooksList.map((book) => ({
      title: book.title,
      author: book.author,
    }));

    if (books.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/books/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          books,
          readlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des livres :",
          payload?.error || response.statusText
        );
        return;
      }

      if (!this.isWatchOrReadlistMode() && selectedBooksList.length === 1) {
        await this.askRatingForJustReadBook(selectedBooksList[0]);
      }

      this.router.navigate([`${this.userId()}/books`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des livres.", error);
    }
  }

  goBackToBooks(): void {
    this.navigateToEntityList('books');
  }

  /** Même fenêtre de note que le passage d'un livre « à lire » vers « lu ». */
  private async askRatingForJustReadBook(book: Book): Promise<void> {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      MoveEntityReviewModalData,
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: {
        entityTitle: book.title,
        showViewedDateToday: !this.alreadyInReadlistBooks().has(
          this.getBookKey(book)
        ),
        viewedDateTodayLabel: "Mettre la date de lecture à aujourd'hui",
      },
      width: 'auto',
      maxWidth: '95vw',
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (!result) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/books/batch-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          books: [
            {
              title: book.title,
              author: book.author,
              rating: result.rating,
              ratingComment: result.ratingComment,
              ...(result.setViewedDateToToday
                ? {
                    firstReadDate: this.todayIsoDate(),
                    lastReadDate: this.todayIsoDate(),
                  }
                : {}),
            },
          ],
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'books:batch-rating:error',
          payload?.error || response.statusText
        );
      }
    } catch (error) {
      console.warn('books:batch-rating:error', error);
    }
  }

  private todayIsoDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleDescription(): void {
    this.descriptionExpanded.update((expanded) => !expanded);
  }
}
