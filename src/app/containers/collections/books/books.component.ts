import {
  ChangeDetectorRef,
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
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { BooksHeaderComponent } from './books-header/books-header.component';

import { Book } from '../../../models/book-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

import {
  BookView,
  bookViewOptions,
  OptionalBookView,
  getBooksByAuthor,
  getBooksByCountry,
  getBooksBySaga,
  getBooksSortOptions,
  getSortedBooks,
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
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { AuthService } from '../../../core/auth.service';
import { getEntityKey } from '../../../utils/top-five.utils';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullBook } from '../../../helpers/full-entities-helper';
import {
  addBookToReadlist as addBookToReadlistApi,
  addBookAsRead as addBookAsReadApi,
  markBookAsWantToReRead as markBookAsWantToReReadApi,
  markBookAsReRead as markBookAsReReadApi,
  updateReadPriority as updateReadPriorityApi,
  markReadlistBookAsStarted as markReadlistBookAsStartedApi,
} from './books.controller';
import { isLocalhost } from '../../../core/config';
import { BookUpdateFollowUpModalComponent } from '../../../components/modals/book-update-follow-up-modal/book-update-follow-up-modal.component';
import { buildBookReadFollowUpProgress } from '../../../utils/book-read-follow-up.utils';
import { BadgesService } from '../../../services/badges.service';

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

    BooksHeaderComponent,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
  selectedView = signal<BookView>('read');
  searchTerm = signal<string>('');

  showTopFiveRank = signal<boolean>(false);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly badgesService = inject(BadgesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private isInitializing = false;
  private isLoadingViewConfig = false;
  private isLoadingPreferences = false;
  private readonly viewConfigStorageKey = 'books_view_config';
  private readonly viewPreferencesStorageKey = 'books_view_preferences';

  isViewConfigOpen = signal<boolean>(false);
  optionalViewConfig = signal<Record<OptionalBookView, boolean>>({
    owned: true,
    borrowed: true,
    loaned: true,
    toReRead: true,
    authors: false,
    sagas: false,
    countries: false,
    recommendations: false,
  });

  sortOptions = computed<SortOption[]>(() =>
    getBooksSortOptions(this.selectedView())
  );

  collapsedCountries = signal<Record<string, boolean>>({});
  collapsedAuthors = signal<Record<string, boolean>>({});
  collapsedSagas = signal<Record<string, boolean>>({});

  yearFilterOptions = yearFilterOptions;

  viewOptions = bookViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) => this.isViewOptionVisible(option.value))
  );

  booksList = signal<{ [key: string]: Book[] }>({});
  readlistBooksList = signal<{ [key: string]: Book[] }>({});
  /** Livres lus par l'utilisateur connecté (rempli uniquement en consultation d'un autre profil). */
  connectedUserBooks = signal<Book[]>([]);
  /** Readlist de l'utilisateur connecté (rempli uniquement en consultation d'un autre profil). */
  connectedUserReadlist = signal<Book[]>([]);
  baseBooksList = signal<Book[]>([]);
  recommendations = signal<RecommendedBook[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

  constructor() {
    // Synchroniser les changements de filtres/tri avec l'URL
    effect(() => {
      if (this.isInitializing) return;

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

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : {},
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    effect(() => {
      if (this.isLoadingPreferences || this.isInitializing) return;
      const preferences = {
        view: this.selectedView(),
        sort: this.selectedSort(),
        year: this.selectedYearFilter(),
      };
      this.localStorageService.setItem(
        this.viewPreferencesStorageKey,
        preferences
      );
    });

    effect(() => {
      const config = this.optionalViewConfig();
      if (this.isLoadingViewConfig) return;
      this.localStorageService.setItem(this.viewConfigStorageKey, config);
    });

    effect(() => {
      const view = this.selectedView();
      if (!this.isViewOptionVisible(view)) {
        this.selectedView.set('read');
      }
    });
  }

  ngOnInit() {
    this.loadViewConfigFromStorage();
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
    const displayedUserId = this.getActiveUserId();
    const connectedUserId = this.authService.userId() ?? undefined;
    const isViewingOther = Boolean(
      connectedUserId &&
        displayedUserId &&
        displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
    );

    const [books, readlist, baseBooks] = await Promise.all([
      getAllBooks(displayedUserId),
      getAllReadlistBooks(displayedUserId),
      getAllBaseBooks(),
    ]);
    this.booksList.set(books);
    this.readlistBooksList.set(readlist);
    this.baseBooksList.set(baseBooks.map(getFullBook));

    if (isViewingOther && connectedUserId) {
      const [connectedBooks, connectedReadlist] = await Promise.all([
        getAllBooks(connectedUserId),
        getAllReadlistBooks(connectedUserId),
      ]);
      const connectedBooksList = connectedBooks[connectedUserId] ?? [];
      const connectedReadlistList = connectedReadlist[connectedUserId] ?? [];
      this.connectedUserBooks.set(connectedBooksList);
      this.connectedUserReadlist.set(connectedReadlistList);
    } else {
      this.connectedUserBooks.set([]);
      this.connectedUserReadlist.set([]);
    }

    // Forcer la détection des changements pour que le header (OnPush) affiche le bloc stats
    this.cdr.detectChanges();
  }

  /** Après readlist → lu : rafraîchit les listes puis modale félicitations / badges (profil affiché = le vôtre). */
  async onReadlistStartedReading(book: Book): Promise<void> {
    const ok = await markReadlistBookAsStartedApi(book, this.getActiveUserId());
    if (ok) {
      await this.refreshBooks();
    }
  }

  async onReadlistMarkedAsRead(book: Book): Promise<void> {
    await this.refreshBooks();
    if (this.isViewingOtherProfile()) return;
    const progressRows = buildBookReadFollowUpProgress(book, this.allBooks());
    if (!isLocalhost()) {
      void this.badgesService.loadFromApi(this.getActiveUserId());
    }
    this.dialog.open(BookUpdateFollowUpModalComponent, {
      data: {
        bookTitle: book.title,
        coverUrl: book.coverUrl ?? '',
        progressRows,
      },
      width: 'min(440px, 95vw)',
      maxHeight: '90vh',
      panelClass: 'book-update-follow-up-dialog',
      autoFocus: '.entity-follow-up__footer .makya-btn',
    });
  }

  private loadParamsFromUrl(queryParams: Params) {
    if (
      queryParams['view'] === 'readlist' ||
      queryParams['view'] === 'readingInProgress' ||
      queryParams['view'] === 'read' ||
      queryParams['view'] === 'owned' ||
      queryParams['view'] === 'borrowed' ||
      queryParams['view'] === 'loaned' ||
      queryParams['view'] === 'toReRead' ||
      queryParams['view'] === 'authors' ||
      queryParams['view'] === 'sagas' ||
      queryParams['view'] === 'countries' ||
      queryParams['view'] === 'recommendations'
    ) {
      this.selectedView.set(queryParams['view'] as BookView);
      if (queryParams['view'] === 'recommendations') {
        void this.loadRecommendations();
      }
    }

    if (queryParams['sort']) {
      const validSort = this.sortOptions().find(
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
  }

  openViewConfig(): void {
    this.isViewConfigOpen.set(true);
  }

  closeViewConfig(): void {
    this.isViewConfigOpen.set(false);
  }

  onOptionalViewChange(view: OptionalBookView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: BookView): boolean {
    if (
      view === 'read' ||
      view === 'readlist' ||
      view === 'readingInProgress'
    ) {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalBookView, boolean>>
    >(this.viewConfigStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingViewConfig = true;
    this.optionalViewConfig.set({
      owned: parsed.owned ?? true,
      borrowed: parsed.borrowed ?? true,
      loaned: parsed.loaned ?? true,
      toReRead: parsed.toReRead ?? true,
      authors: parsed.authors ?? false,
      sagas: parsed.sagas ?? false,
      countries: parsed.countries ?? false,
      recommendations: parsed.recommendations ?? false,
    });
    this.isLoadingViewConfig = false;
  }

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: BookView;
        sort: string;
        year: string;
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
      this.sortOptions().some((opt) => opt.value === parsed.sort)
    ) {
      this.selectedSort.set(parsed.sort);
    }
    if (
      parsed.year &&
      this.yearFilterOptions.some((opt) => opt.value === parsed.year)
    ) {
      this.selectedYearFilter.set(parsed.year);
    }
    this.isLoadingPreferences = false;
  }

  allBooks = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.booksList()[params['id']] || []
      : this.booksList()[DEFAULT_USER_ID];
  });

  allReadlistBooks = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.readlistBooksList()[params['id']] || []
      : this.readlistBooksList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des livres lus (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() => this.allBooks().length > 0);

  filteredBooks = computed<Book[]>(() => {
    let books: Book[] = this.allBooks();
    if (this.selectedView() === 'readlist') {
      books = this.allReadlistBooks().filter((b) => (b.readTimes ?? 0) !== 0.5);
    } else if (this.selectedView() === 'readingInProgress') {
      books = this.allReadlistBooks().filter((b) => (b.readTimes ?? 0) === 0.5);
    } else if (this.selectedView() === 'owned') {
      const ownedRead = this.allBooks().filter((book) => book.owned);
      const ownedReadlist = this.allReadlistBooks().filter((book) => book.owned);
      const seen = new Set<string>();
      books = [...ownedRead, ...ownedReadlist].filter((book) => {
        const key = `${book.title}|${book.author}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (this.selectedView() === 'borrowed') {
      const readBorrowed = this.allBooks().filter((book) =>
        Boolean(book.borrowed && book.borrowed.trim().length > 0)
      );
      const readlistBorrowed = this.allReadlistBooks().filter((book) =>
        Boolean(book.borrowed && book.borrowed.trim().length > 0)
      );
      const seen = new Set<string>();
      books = [...readBorrowed, ...readlistBorrowed].filter((book) => {
        const key = `${book.title}|${book.author}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const readLoaned = this.allBooks().filter((book) =>
        Boolean(book.loaned && book.loaned.trim().length > 0)
      );
      const readlistLoaned = this.allReadlistBooks().filter((book) =>
        Boolean(book.loaned && book.loaned.trim().length > 0)
      );
      const seen = new Set<string>();
      books = [...readLoaned, ...readlistLoaned].filter((book) => {
        const key = `${book.title}|${book.author}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (this.selectedView() === 'toReRead') {
      books = this.allBooks().filter((book) => book.wantToReadAgain === true);
    } else if (this.selectedView() === 'authors') {
      books = this.allBooks();
    } else if (this.selectedView() === 'sagas') {
      books = this.allBooks();
    } else if (this.selectedView() === 'countries') {
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

    // Filtrage par année (livres lus, empruntés ou à relire) : inclut les livres dont firstReadDate OU lastReadDate correspond à l'année
    if (
      this.selectedView() === 'read' ||
      this.selectedView() === 'borrowed' ||
      this.selectedView() === 'loaned' ||
      this.selectedView() === 'toReRead'
    ) {
      const dateInYear = (
        b: { firstReadDate: string; lastReadDate: string },
        yearStr: string
      ) =>
        (b.firstReadDate && b.firstReadDate.startsWith(yearStr)) ||
        (b.lastReadDate && b.lastReadDate.startsWith(yearStr));
      const dateBefore2024 = (b: {
        firstReadDate: string;
        lastReadDate: string;
      }) => {
        const yearFrom = (s: string) =>
          s && s.length >= 4 ? parseInt(s.substring(0, 4), 10) : NaN;
        const y1 = yearFrom(b.firstReadDate);
        const y2 = yearFrom(b.lastReadDate);
        return (
          (!Number.isNaN(y1) && y1 < 2024) || (!Number.isNaN(y2) && y2 < 2024)
        );
      };
      if (this.selectedYearFilter() === '2026') {
        filteredBooks = filteredBooks.filter((b) => dateInYear(b, '2026'));
      } else if (this.selectedYearFilter() === '2025') {
        filteredBooks = filteredBooks.filter((b) => dateInYear(b, '2025'));
      } else if (this.selectedYearFilter() === '2024') {
        filteredBooks = filteredBooks.filter((b) => dateInYear(b, '2024'));
      } else if (this.selectedYearFilter() === 'before2024') {
        filteredBooks = filteredBooks.filter((b) => dateBefore2024(b));
      }

      // Vue « Livres empruntés » : garder aussi les empruntés de la readlist (sans date de lecture)
      if (
        this.selectedView() === 'borrowed' &&
        this.selectedYearFilter() !== 'all'
      ) {
        const readlistBorrowed = this.allReadlistBooks().filter((b) =>
          Boolean(b.borrowed && b.borrowed.trim().length > 0)
        );
        const seen = new Set(
          filteredBooks.map((b) => `${b.title}|${b.author}`)
        );
        for (const b of readlistBorrowed) {
          const key = `${b.title}|${b.author}`;
          if (!seen.has(key)) {
            seen.add(key);
            filteredBooks = [...filteredBooks, b];
          }
        }
      }

      // Vue « Livres prêtés » : garder aussi les prêtés de la readlist (sans date de lecture)
      if (
        this.selectedView() === 'loaned' &&
        this.selectedYearFilter() !== 'all'
      ) {
        const readlistLoaned = this.allReadlistBooks().filter((b) =>
          Boolean(b.loaned && b.loaned.trim().length > 0)
        );
        const seen = new Set(
          filteredBooks.map((b) => `${b.title}|${b.author}`)
        );
        for (const b of readlistLoaned) {
          const key = `${b.title}|${b.author}`;
          if (!seen.has(key)) {
            seen.add(key);
            filteredBooks = [...filteredBooks, b];
          }
        }
      }
    }

    return filteredBooks;
  });

  sortedBooks = computed(() =>
    this.selectedView() === 'readlist' ||
    this.selectedView() === 'readingInProgress'
      ? getSortedBooks([...this.filteredBooksByYear()], 'readPriority')
      : getSortedBooks([...this.filteredBooksByYear()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    // Utiliser les livres filtrés pour les stats
    const booksToUse = this.filteredBooksByYear();
    const totalPages = getTotalPages(booksToUse);
    const totalPagesRead = getTotalPagesRead(booksToUse);

    const estimatedReadingTime =
      this.selectedView() === 'readlist' ||
      this.selectedView() === 'readingInProgress'
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

    if (
      this.selectedView() !== 'readlist' &&
      this.selectedView() !== 'readingInProgress'
    ) {
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

  onViewChange(view: BookView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
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
    });
  });

  booksBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') {
      return [];
    }
    return getBooksBySaga({
      sortedBooks: this.allBooks(),
      allBooks: this.allBooks(),
      baseBooks: this.baseBooksList(),
      selectedSort: 'readDate',
    });
  });

  booksByCountry = computed(() => {
    if (this.selectedView() !== 'countries') {
      return [];
    }
    return getBooksByCountry({
      sortedBooks: this.sortedBooks(),
      allBooks: this.allBooks(),
      baseBooks: this.baseBooksList(),
      selectedSort: this.selectedSort(),
    });
  });

  toggleCountry(country: string): void {
    this.collapsedCountries.update((prev) => ({
      ...prev,
      [country]: !prev[country],
    }));
  }

  isCountryCollapsed(country: string): boolean {
    return !!this.collapsedCountries()[country];
  }

  toggleAuthor(author: string): void {
    this.collapsedAuthors.update((prev) => ({
      ...prev,
      [author]: !prev[author],
    }));
  }

  isAuthorCollapsed(author: string): boolean {
    return !!this.collapsedAuthors()[author];
  }

  toggleSaga(saga: string): void {
    this.collapsedSagas.update((prev) => ({
      ...prev,
      [saga]: !prev[saga],
    }));
  }

  isSagaCollapsed(saga: string): boolean {
    return !!this.collapsedSagas()[saga];
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

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  /** Réactivité au cache Top 5 (pour mettre à jour le rang affiché) */
  topFive = computed(() => {
    this.topFiveService.cache();
    return this.topFiveService.getTopFive(this.getActiveUserId());
  });

  getTopFiveRank(book: Book): number | null {
    const tf = this.topFive();
    const key = getEntityKey('books', book);
    const idx = (tf.books ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(book: Book, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'books',
      getEntityKey('books', book),
      rank
    );
  }

  private matchesSearch(book: Book, term: string): boolean {
    const haystack = [book.title, book.author, ...book.genre, book.saga]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  /** Liste des comptes suivis utilisée pour les recommandations (pour afficher le message si vide). */
  readonly followedIdsForRecommendations = signal<string[]>([]);

  async loadRecommendations() {
    if (this.isLoadingRecommendations()) return;

    const userId = this.getActiveUserId();
    if (
      this.recommendationsUserId() === userId &&
      this.recommendations().length > 0
    ) {
      return;
    }

    this.isLoadingRecommendations.set(true);
    try {
      await this.followsService.loadFromApi(userId);
      const followedIds = this.followsService.getFollows(userId);
      this.followedIdsForRecommendations.set(followedIds);

      if (followedIds.length === 0) {
        this.recommendations.set([]);
        this.recommendationsUserId.set(userId);
        return;
      }

      // S'assurer que baseBooksList est chargé
      if (this.baseBooksList().length === 0) {
        await this.refreshBooks();
      }

      const othersRated = await getOtherUsersBooksRated(userId, 4, followedIds);

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

      const recommended = baseBooks
        .filter((book) => {
          const key = this.getBookIdentityKey(book);
          const isNotSeen = !seenKeys.has(key);
          const isInDetailsMap = detailsMap.has(key);

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

  isSagaFinished(book: Book): boolean | null {
    if (!book.saga || !book.saga.trim()) {
      return null; // Pas de saga
    }
    const sagaName = book.saga.trim();
    const sagaBooks = this.baseBooksList().filter(
      (b) => b.saga?.trim() === sagaName
    );
    if (sagaBooks.length === 0) {
      return null; // Saga non trouvée
    }
    // Une saga est terminée si tous les livres de la saga ont sagaFinished: true
    return sagaBooks.every((b) => b.sagaFinished === true);
  }

  getSagaBadge(book: Book): 'Saga terminée' | 'Saga en cours' | null {
    const sagaStatus = this.isSagaFinished(book);
    if (sagaStatus === null) {
      return null; // Pas de saga ou saga non trouvée
    }
    return sagaStatus ? 'Saga terminée' : 'Saga en cours';
  }

  bookAlreadyInUserReadlist(book: Book): boolean {
    const readlist = this.allReadlistBooks();
    return readlist.some(
      (b) => b.title === book.title && b.author === book.author
    );
  }

  /** True si on est connecté et qu'on consulte le profil d'un autre utilisateur. */
  isViewingOtherProfile(): boolean {
    const connected = this.authService.userId();
    const displayed = this.getActiveUserId();
    return Boolean(
      connected &&
        displayed &&
        displayed.toLowerCase() !== connected.toLowerCase()
    );
  }

  /** True si le bouton "Je veux lire ce livre" doit s'afficher pour ce livre (consultation autre profil). */
  canShowAddToMyReadlist(): boolean {
    return this.isViewingOtherProfile();
  }

  /** True si l'utilisateur connecté peut ajouter ce livre à sa readlist (ne l'a pas lu et ne l'a pas déjà en readlist). */
  canAddBookToMyReadlist(book: Book): boolean {
    const key = this.getBookIdentityKey(book);
    const inReadlist = this.connectedUserReadlist().some(
      (b) => this.getBookIdentityKey(b) === key
    );
    const alreadyRead = this.connectedUserBooks().some(
      (b) => this.getBookIdentityKey(b) === key && (b.readTimes ?? 0) >= 1
    );
    return !inReadlist && !alreadyRead;
  }

  /** True si l'utilisateur connecté peut ajouter ce livre à ses livres lus (ne l'a pas déjà lu). */
  canAddBookToMyRead(book: Book): boolean {
    const key = this.getBookIdentityKey(book);
    const alreadyRead = this.connectedUserBooks().some(
      (b) => this.getBookIdentityKey(b) === key && (b.readTimes ?? 0) >= 1
    );
    return !alreadyRead;
  }

  /** Ajoute le livre à la readlist de l'utilisateur connecté (depuis la vue du profil d'un autre). */
  async addBookToConnectedUserReadlist(book: Book) {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addBookToReadlistApi(book, connectedUserId);
    if (success) {
      await this.refreshBooks();
    }
  }

  /** Ajoute le livre aux livres lus de l'utilisateur connecté (depuis la vue du profil d'un autre). */
  async addBookToConnectedUserAsRead(book: Book) {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addBookAsReadApi(book, connectedUserId);
    if (success) {
      await this.refreshBooks();
    }
  }

  async addBookToReadlist(book: Book) {
    const success = await addBookToReadlistApi(book, this.getActiveUserId());
    if (success) {
      this.router.navigate([`${this.getActiveUserId()}/books`]);
    }
  }

  async markBookAsWantToReRead(book: Book): Promise<void> {
    const success = await markBookAsWantToReReadApi(
      book,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshBooks();
    }
  }

  async markBookAsReRead(book: Book): Promise<void> {
    const success = await markBookAsReReadApi(book, this.getActiveUserId());
    if (success) {
      await this.refreshBooks();
    }
  }

  async updateReadPriority(data: {
    book: Book;
    priority: number;
  }): Promise<void> {
    const success = await updateReadPriorityApi(data, this.getActiveUserId());
    if (success) {
      await this.refreshBooks();
    }
  }

  toggleTopFiveRankDisplay(): void {
    this.showTopFiveRank.set(!this.showTopFiveRank());
  }
}
