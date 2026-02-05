import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookComponent } from '../../../components/collections/book/book.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { BooksHeaderComponent } from './books-header/books-header.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Book } from '../../../models/book-model';
import { Quizz } from '../../../models/quizz-model';
import {
  BookView,
  bookViewOptions,
  booksSortOptions,
  getBooksByAuthor,
  getSortedBooks,
  groupByOptions,
  yearFilterOptions,
} from './books.utils';

import {
  getTotalPages,
  getTotalPagesRead,
  getEstimatedReadingTime,
  formatTimeStats,
  MINUTES_PER_PAGE,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBooks,
  getAllBaseBooks,
  getAllReadlistBooks,
  getOtherUsersBooksRated,
} from '../../../facades/books/books.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditBookComponent } from '../../edit/edit-book/edit-book.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';
import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getApiBaseUrl } from '../../../core/config';
import { getFullBook } from '../../../helpers/full-entities-helper';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedBook = Book & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-books',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    BookComponent,
    MenuComponent,
    MatDialogModule,
    QuizzModalComponent,
    BooksHeaderComponent,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
  selectedGroupBy = signal<string>('none');
  selectedView = signal<BookView>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly dialog = inject(MatDialog);
  private isInitializing = false;
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'books_view_preferences';

  sortOptions: SortOption[] = booksSortOptions;

  yearFilterOptions = yearFilterOptions;

  groupByOptions = groupByOptions;

  viewOptions = bookViewOptions;

  booksList = signal<{ [key: string]: Book[] }>({});
  readlistBooksList = signal<{ [key: string]: Book[] }>({});
  adminBooksList = signal<Book[]>([]);
  baseBooksList = signal<Book[]>([]);
  recommendations = signal<RecommendedBook[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

  constructor() {
    // Synchroniser les changements de filtres/tri avec l'URL
    effect(() => {
      if (this.isInitializing || this.isAdminView()) return;

      const queryParams: any = {};

      if (this.selectedView() !== 'read') {
        queryParams.view = this.selectedView();
      } else {
        queryParams.view = null;
      }

      if (this.selectedSort() !== 'readDate') {
        queryParams.sort = this.selectedSort();
      } else {
        queryParams.sort = null;
      }

      if (this.selectedYearFilter() !== 'all') {
        queryParams.year = this.selectedYearFilter();
      } else {
        queryParams.year = null;
      }

      if (this.selectedGroupBy() !== 'none') {
        queryParams.groupBy = this.selectedGroupBy();
      } else {
        queryParams.groupBy = null;
      }

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : {},
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    effect(() => {
      if (
        this.isLoadingPreferences ||
        this.isInitializing ||
        this.isAdminView()
      )
        return;
      const preferences = {
        view: this.selectedView(),
        sort: this.selectedSort(),
        year: this.selectedYearFilter(),
        groupBy: this.selectedGroupBy(),
      };
      this.localStorageService.setItem(
        this.viewPreferencesStorageKey,
        preferences
      );
    });
  }

  ngOnInit() {
    if (this.isAdminView()) {
      this.selectedView.set('read');
      this.selectedGroupBy.set('none');
    }
    void this.refreshQuizzs();
    this.loadViewPreferencesFromStorage();
    // Lire les paramètres de l'URL au démarrage
    this.loadParamsFromUrl(this.activatedRoute.snapshot.queryParams);

    // Écouter les changements de query params (navigation avant/arrière)
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.isInitializing = true;
      this.loadParamsFromUrl(queryParams);
      this.isInitializing = false;
    });

    this.refreshBooks();
  }

  async refreshBooks() {
    if (this.isAdminView()) {
      const baseBooks = await getAllBaseBooks();
      const books = baseBooks.map(getFullBook);
      this.adminBooksList.set(books);
      this.baseBooksList.set(books);
      return;
    }

    const userId = this.getActiveUserId();
    const [books, readlist, baseBooks] = await Promise.all([
      getAllBooks(userId),
      getAllReadlistBooks(userId),
      getAllBaseBooks(),
    ]);
    this.booksList.set(books);
    this.readlistBooksList.set(readlist);
    this.baseBooksList.set(baseBooks.map(getFullBook));
  }

  async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
  }

  private loadParamsFromUrl(queryParams: Params) {
    if (
      queryParams['view'] === 'readlist' ||
      queryParams['view'] === 'read' ||
      queryParams['view'] === 'owned' ||
      queryParams['view'] === 'authors' ||
      queryParams['view'] === 'recommendations'
    ) {
      this.selectedView.set(queryParams['view'] as BookView);
      if (queryParams['view'] === 'recommendations') {
        void this.loadRecommendations();
      }
    }

    if (queryParams['sort']) {
      const validSort = this.sortOptions.find(
        (opt) => opt.value === queryParams['sort']
      );
      if (validSort) {
        this.selectedSort.set(queryParams['sort']);
      }
    }

    if (queryParams['year']) {
      const validYear = this.yearFilterOptions.find(
        (opt) => opt.value === queryParams['year']
      );
      if (validYear) {
        this.selectedYearFilter.set(queryParams['year']);
      }
    }

    if (queryParams['groupBy']) {
      const validGroupBy = this.groupByOptions.find(
        (opt) => opt.value === queryParams['groupBy']
      );
      if (validGroupBy) {
        this.selectedGroupBy.set(queryParams['groupBy']);
      }
    }
  }

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: BookView;
        sort: string;
        year: string;
        groupBy: string;
      }>
    >(this.viewPreferencesStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingPreferences = true;
    if (
      parsed.view &&
      this.viewOptions.some((opt) => opt.value === parsed.view)
    ) {
      this.selectedView.set(parsed.view);
    }
    if (
      parsed.sort &&
      this.sortOptions.some((opt) => opt.value === parsed.sort)
    ) {
      this.selectedSort.set(parsed.sort);
    }
    if (
      parsed.year &&
      this.yearFilterOptions.some((opt) => opt.value === parsed.year)
    ) {
      this.selectedYearFilter.set(parsed.year);
    }
    if (
      parsed.groupBy &&
      this.groupByOptions.some((opt) => opt.value === parsed.groupBy)
    ) {
      this.selectedGroupBy.set(parsed.groupBy);
    }
    this.isLoadingPreferences = false;
  }

  allBooks = computed<Book[]>(() => {
    if (this.isAdminView()) {
      return this.adminBooksList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.booksList()[params['id']] || []
      : this.booksList()['guillaume'];
  });

  allReadlistBooks = computed<Book[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.readlistBooksList()[params['id']] || []
      : this.readlistBooksList()['guillaume'];
  });

  filteredBooks = computed<Book[]>(() => {
    let books = this.allBooks();
    if (this.isAdminView()) {
      books = this.allBooks();
    } else if (this.selectedView() === 'readlist') {
      books = this.allReadlistBooks();
    } else if (this.selectedView() === 'owned') {
      books = this.allBooks().filter((book) => book.owned);
    } else if (this.selectedView() === 'authors') {
      books = this.allBooks();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return books;
    }

    return books.filter((book) => this.matchesSearch(book, term));
  });

  currentUser = computed(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? this.capitalizeFirstLetter(params['id']) : '';
  });

  filteredBooksByYear = computed(() => {
    let filteredBooks = [...this.filteredBooks()];

    if (this.isAdminView()) {
      return filteredBooks;
    }

    // Filtrage par année (seulement pour les livres lus)
    if (this.selectedView() === 'read') {
      if (this.selectedYearFilter() === '2026') {
        filteredBooks = filteredBooks.filter((b) =>
          b.readDate.startsWith('2026')
        );
      } else if (this.selectedYearFilter() === '2025') {
        filteredBooks = filteredBooks.filter((b) =>
          b.readDate.startsWith('2025')
        );
      } else if (this.selectedYearFilter() === '2024') {
        filteredBooks = filteredBooks.filter((b) =>
          b.readDate.startsWith('2024')
        );
      } else if (this.selectedYearFilter() === 'before2024') {
        filteredBooks = filteredBooks.filter((b) => {
          const year = parseInt(b.readDate.substring(0, 4));
          return year < 2024;
        });
      }
    }

    return filteredBooks;
  });

  sortedBooks = computed(() =>
    this.selectedView() === 'readlist'
      ? getSortedBooks([...this.filteredBooksByYear()], 'readPriority')
      : getSortedBooks([...this.filteredBooksByYear()], this.selectedSort())
  );

  groupedBooks = computed(() => {
    if (this.selectedView() === 'authors') {
      return null;
    }
    if (this.selectedGroupBy() === 'none') {
      return null;
    }
    const groups: { key: string; books: Book[] }[] = [];
    const map = new Map<string, Book[]>();
    for (const book of this.filteredBooksByYear()) {
      let key = '';
      if (this.selectedGroupBy() === 'author') key = book.author;
      else if (this.selectedGroupBy() === 'genre') key = book.genre;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(book);
    }
    for (const [key, books] of map.entries()) {
      groups.push({ key, books });
    }
    // Tri des groupes par nombre de livres
    groups.sort((a, b) => b.books.length - a.books.length);
    return groups;
  });

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    // Utiliser les livres filtrés pour les stats
    const booksToUse = this.filteredBooksByYear();
    const totalPages = getTotalPages(booksToUse);
    const totalPagesRead = getTotalPagesRead(booksToUse);

    const estimatedReadingTime =
      this.selectedView() === 'readlist'
        ? formatTimeStats(totalPages * MINUTES_PER_PAGE)
        : getEstimatedReadingTime(booksToUse);

    const stats = [
      {
        label: 'Pages totales de tous les livres',
        value: `${totalPages.toLocaleString()} pages`,
        icon: '📚',
        color: StatItemColor.SUCCESS,
      },
    ];

    if (this.selectedView() !== 'readlist') {
      return [
        ...stats,
        {
          label: 'Pages totales lues (avec relectures)',
          value: `${totalPagesRead.toLocaleString()} pages`,
          icon: '📖',
          color: StatItemColor.INFO,
        },
        {
          label: 'Temps estimé de lecture',
          value: estimatedReadingTime.formatted,
          icon: '⏱️',
          color: StatItemColor.PRIMARY,
        },
      ];
    }

    return [
      ...stats,
      {
        label: 'Temps estimé de lecture',
        value: estimatedReadingTime.formatted,
        icon: '⏱️',
        color: StatItemColor.PRIMARY,
      },
    ];
  });

  capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onYearFilterChange(year: string) {
    this.selectedYearFilter.set(year);
  }

  onGroupByChange(groupBy: string) {
    this.selectedGroupBy.set(groupBy);
  }

  onViewChange(view: BookView) {
    this.selectedView.set(view);
    if (view === 'authors') {
      this.selectedGroupBy.set('none');
    }
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  onGroupByChangeFromHeader(groupBy: string) {
    this.selectedGroupBy.set(groupBy);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  booksByAuthor = computed(() => {
    if (this.selectedView() !== 'authors') {
      return [];
    }
    return getBooksByAuthor({
      sortedBooks: this.allBooks(),
      allBooks: this.allBooks(),
      baseBooks: this.baseBooksList(),
      selectedSort: 'readDate',
      isAdminView: this.isAdminView(),
    });
  });

  openQuizzModal(quizzs: Quizz[]) {
    if (!quizzs || quizzs.length === 0) return;
    this.activeQuizzs.set(quizzs);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal() {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
  }

  openEditBookDialog(book: Book): void {
    const books = this.sortedBooks();
    const index = books.findIndex(
      (item) => item.title === book.title && item.author === book.author
    );
    const dialogRef = this.dialog.open(EditBookComponent, {
      data: {
        book,
        userId: this.getActiveUserId(),
        list: books,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        void this.refreshBooks();
      }
    });
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  private matchesSearch(book: Book, term: string): boolean {
    const haystack = [book.title, book.author, book.genre, book.saga]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = this.normalizeSearchText(haystack);
    const normalizedTerm = this.normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  async loadRecommendations() {
    if (this.isAdminView()) return;
    if (this.isLoadingRecommendations()) return;

    const userId = this.getActiveUserId();
    if (
      this.recommendationsUserId() === userId &&
      this.recommendations().length
    ) {
      return;
    }

    // S'assurer que baseBooksList est chargé
    if (this.baseBooksList().length === 0) {
      await this.refreshBooks();
    }

    this.isLoadingRecommendations.set(true);
    try {
      const othersRated = await getOtherUsersBooksRated(userId, 4);

      console.log('books:recommendations:othersRated', othersRated.length);
      console.log(
        'books:recommendations:baseBooksList',
        this.baseBooksList().length
      );

      const detailsMap = new Map<string, Map<string, number>>();
      for (const book of othersRated) {
        const key = `${book.title}|${book.author}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(book.userId) ?? 0;
        if (book.rating > prev) {
          userMap.set(book.userId, book.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allBooks().map((book) => this.getBookIdentityKey(book))
      );

      const baseBooks = this.baseBooksList();
      console.log('books:recommendations:detailsMap size', detailsMap.size);
      console.log('books:recommendations:seenKeys size', seenKeys.size);

      const recommended = baseBooks
        .filter((book) => {
          const key = this.getBookIdentityKey(book);
          const isNotSeen = !seenKeys.has(key);
          const isInDetailsMap = detailsMap.has(key);
          if (isInDetailsMap && !isNotSeen) {
            console.log('books:recommendations:book already seen', key);
          }
          if (isNotSeen && !isInDetailsMap) {
            console.log('books:recommendations:book not in detailsMap', key);
          }
          return isNotSeen && isInDetailsMap;
        })
        .map((book) => {
          const details = detailsMap.get(this.getBookIdentityKey(book));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...book,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getBookIdentityKey(a));
          const detailsB = detailsMap.get(this.getBookIdentityKey(b));
          const countA = detailsA?.size ?? 0;
          const countB = detailsB?.size ?? 0;
          if (countB !== countA) return countB - countA;
          const maxA = detailsA ? Math.max(...detailsA.values()) : 0;
          const maxB = detailsB ? Math.max(...detailsB.values()) : 0;
          if (maxB !== maxA) return maxB - maxA;
          return a.title.localeCompare(b.title);
        });

      console.log(
        'books:recommendations:recommended count',
        recommended.length
      );
      this.recommendations.set(recommended);
      this.recommendationsUserId.set(userId);
    } catch (error) {
      console.warn('books:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedBooks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((book) => this.matchesSearch(book, term));
  });

  getBookIdentityKey(book: Book): string {
    return `${book.title}|${book.author}`;
  }

  getBookRecommendationText(book: Book): string {
    const recommendationDetails =
      (book as RecommendedBook).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à ce livre`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à ce livre`;
  }

  bookAlreadyInUserReadlist(book: Book): boolean {
    const readlist = this.allReadlistBooks();
    return readlist.some(
      (b) => b.title === book.title && b.author === book.author
    );
  }

  addBookToReadlist(book: Book) {
    this.router.navigate(['/select-books'], {
      queryParams: {
        readlist: 'true',
        title: book.title,
        author: book.author,
      },
    });
  }

  async updateReadPriority(data: {
    book: Book;
    priority: number;
  }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: data.book.title,
          author: data.book.author,
          rating: data.book.rating,
          readTimes: data.book.readTimes,
          readDate: data.book.readDate,
          owned: data.book.owned,
          readPriority: data.priority,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec de la mise à jour de la priorité :',
          payload?.error || response.statusText
        );
        return;
      }

      await this.refreshBooks();
    } catch (error) {
      console.warn(
        'Erreur réseau lors de la mise à jour de la priorité.',
        error
      );
    }
  }
}
