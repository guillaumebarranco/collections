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
} from '../../../facades/books/books.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditBookComponent } from '../../edit/edit-book/edit-book.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';

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
      const books = baseBooks.map((book) => ({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        pages: book.pages,
        genre: book.genre,
        saga: book.saga,
        sagaOrder: book.sagaOrder,
        nbTomes: book.nbTomes,
        isFinished: book.isFinished,
        rating: 0,
        readDate: '',
        readTimes: 0,
        owned: false,
      }));
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
    this.baseBooksList.set(
      baseBooks.map((book) => ({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        pages: book.pages,
        genre: book.genre,
        saga: book.saga,
        sagaOrder: book.sagaOrder,
        nbTomes: book.nbTomes,
        isFinished: book.isFinished,
        rating: 0,
        readDate: '',
        readTimes: 0,
        owned: false,
      }))
    );
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
      queryParams['view'] === 'authors'
    ) {
      this.selectedView.set(queryParams['view'] as BookView);
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
    getSortedBooks([...this.filteredBooksByYear()], this.selectedSort())
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
}
