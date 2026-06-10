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
import { ChildrenBookComponent } from '../../../components/collections/children-book/children-book.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { ChildrenBooksHeaderComponent } from './children-books-header/children-books-header.component';

import { ChildrenBook } from '../../../models/children-book-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import { isReading } from '../../../utils/in-progress.utils';

import {
  ChildrenBookView,
  childrenBookViewOptions,
  OptionalChildrenBookView,
  getChildrenBooksByAuthor,
  getChildrenBooksByCountry,
  getChildrenBooksBySaga,
  getChildrenBooksSortOptions,
  getDefaultChildrenBooksSortForView,
  getSortedChildrenBooks,
  yearFilterOptions,
} from './children-books.utils';

import {
  getTotalPages,
  getTotalPagesRead,
  getEstimatedReadingTime,
  formatTimeStats,
  MINUTES_PER_PAGE,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllChildrenBooks,
  getAllBaseChildrenBooks,
  getAllReadlistChildrenBooks,
  getOtherUsersChildrenBooksRated,
} from '../../../facades/children-books/children-books.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditChildrenBookComponent } from '../../edit/edit-children-book/edit-children-book.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { AuthService } from '../../../core/auth.service';
import { getEntityKey } from '../../../utils/top-five.utils';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullChildrenBook } from '../../../helpers/full-entities-helper';
import {
  addChildrenBookToReadlist as addChildrenBookToReadlistApi,
  addChildrenBookAsRead as addChildrenBookAsReadApi,
  markChildrenBookAsWantToReRead as markChildrenBookAsWantToReReadApi,
  markChildrenBookAsReRead as markChildrenBookAsReReadApi,
  updateReadPriority as updateReadPriorityApi,
  markReadlistChildrenBookAsStarted as markReadlistChildrenBookAsStartedApi,
  markReadChildrenBookAsReadingInProgress as markReadChildrenBookAsReadingInProgressApi,
} from './children-books.controller';
import { ChildrenBookUpdateFollowUpModalComponent } from '../../../components/modals/children-book-update-follow-up-modal/children-book-update-follow-up-modal.component';
import { buildChildrenBookReadFollowUpProgress } from '../../../utils/children-book-read-follow-up.utils';
import { BadgesService } from '../../../services/badges.service';
import { isOfflineModeBlockingOtherUsers } from '../../../core/offline/offline-mode.utils';
import { OfflineRestrictedMessageComponent } from '../../../components/shared/offline-restricted-message/offline-restricted-message.component';
import { LoaderComponent } from '../../../components/shared/loader/loader.component';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedChildrenBook = ChildrenBook & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-children-books',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ChildrenBookComponent,
    MenuComponent,
    MatDialogModule,

    ChildrenBooksHeaderComponent,
    OfflineRestrictedMessageComponent,
    LoaderComponent,
  ],
  templateUrl: './children-books.component.html',
  styleUrls: ['./children-books.component.scss'],
})
export class ChildrenBooksComponent implements OnInit {
  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
  selectedView = signal<ChildrenBookView>('read');
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
  private readonly viewConfigStorageKey = 'children-books_view_config';
  private readonly viewPreferencesStorageKey = 'children-books_view_preferences';

  isViewConfigOpen = signal<boolean>(false);
  optionalViewConfig = signal<Record<OptionalChildrenBookView, boolean>>({
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
    getChildrenBooksSortOptions(this.selectedView())
  );

  collapsedCountries = signal<Record<string, boolean>>({});
  collapsedAuthors = signal<Record<string, boolean>>({});
  collapsedSagas = signal<Record<string, boolean>>({});

  yearFilterOptions = yearFilterOptions;

  viewOptions = childrenBookViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) => this.isViewOptionVisible(option.value))
  );

  childrenBooksList = signal<{ [key: string]: ChildrenBook[] }>({});
  readlistChildrenBooksList = signal<{ [key: string]: ChildrenBook[] }>({});
  /** Livres pour enfants lus par l'utilisateur connecté (rempli uniquement en consultation d'un autre profil). */
  connectedUserChildrenBooks = signal<ChildrenBook[]>([]);
  /** Readlist de l'utilisateur connecté (rempli uniquement en consultation d'un autre profil). */
  connectedUserReadlist = signal<ChildrenBook[]>([]);
  baseChildrenBooksList = signal<ChildrenBook[]>([]);
  recommendations = signal<RecommendedChildrenBook[]>([]);
  /** True tant que les livres n'ont pas été chargés une première fois. */
  isLoadingChildrenBooks = signal<boolean>(true);

  isLoadingRecommendations = signal<boolean>(false);
  recommendationsOfflineBlocked = signal(false);
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

      const defaultSort = getDefaultChildrenBooksSortForView(this.selectedView());
      if (this.selectedSort() !== defaultSort) {
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
      const view = this.selectedView();
      const preferences: {
        view: ChildrenBookView;
        year: string;
        sort?: string;
      } = {
        view,
        year: this.selectedYearFilter(),
      };
      // « À lire » / « En cours » : ne pas persister le tri (retour sur la vue = priorité par défaut).
      if (view !== 'readlist' && view !== 'readingInProgress') {
        preferences.sort = this.selectedSort();
      }
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

    this.refreshChildrenBooks();
  }

  async refreshChildrenBooks() {
    this.isLoadingChildrenBooks.set(true);
    try {
      const displayedUserId = this.getActiveUserId();
      const connectedUserId = this.authService.userId() ?? undefined;
      const isViewingOther = Boolean(
        connectedUserId &&
          displayedUserId &&
          displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
      );

      const [childrenBooks, readlist, baseChildrenBooks] = await Promise.all([
        getAllChildrenBooks(displayedUserId),
        getAllReadlistChildrenBooks(displayedUserId),
        getAllBaseChildrenBooks(),
      ]);
      this.childrenBooksList.set(childrenBooks);
      this.readlistChildrenBooksList.set(readlist);
      this.baseChildrenBooksList.set(baseChildrenBooks.map(getFullChildrenBook));

      if (isViewingOther && connectedUserId) {
        const [connectedChildrenBooks, connectedReadlist] = await Promise.all([
          getAllChildrenBooks(connectedUserId),
          getAllReadlistChildrenBooks(connectedUserId),
        ]);
        const connectedChildrenBooksList = connectedChildrenBooks[connectedUserId] ?? [];
        const connectedReadlistList = connectedReadlist[connectedUserId] ?? [];
        this.connectedUserChildrenBooks.set(connectedChildrenBooksList);
        this.connectedUserReadlist.set(connectedReadlistList);
      } else {
        this.connectedUserChildrenBooks.set([]);
        this.connectedUserReadlist.set([]);
      }

      // Forcer la détection des changements pour que le header (OnPush) affiche le bloc stats
      this.cdr.detectChanges();
    } finally {
      this.isLoadingChildrenBooks.set(false);
    }
  }

  /** Après readlist → lu : rafraîchit les listes puis modale félicitations / badges (profil affiché = le vôtre). */
  async onReadlistStartedReading(childrenBook: ChildrenBook): Promise<void> {
    const userId = this.getActiveUserId();
    const ok =
      this.selectedView() === 'toReRead'
        ? await markReadChildrenBookAsReadingInProgressApi(childrenBook, userId)
        : await markReadlistChildrenBookAsStartedApi(childrenBook, userId);
    if (ok) {
      await this.refreshChildrenBooks();
    }
  }

  async onReadlistMarkedAsRead(childrenBook: ChildrenBook): Promise<void> {
    await this.refreshChildrenBooks();
    if (this.isViewingOtherProfile()) return;
    const progressRows = buildChildrenBookReadFollowUpProgress(childrenBook, this.allChildrenBooks());
    void this.badgesService.loadFromApi(this.getActiveUserId());
    this.dialog.open(ChildrenBookUpdateFollowUpModalComponent, {
      data: {
        childrenBookTitle: childrenBook.title,
        coverUrl: childrenBook.coverUrl ?? '',
        progressRows,
      },
      width: 'min(440px, 95vw)',
      maxHeight: '90vh',
      panelClass: 'childrenBook-update-follow-up-dialog',
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
      this.selectedView.set(queryParams['view'] as ChildrenBookView);
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

    const allowedSorts = new Set(this.sortOptions().map((o) => o.value));
    if (!allowedSorts.has(this.selectedSort())) {
      this.selectedSort.set(
        getDefaultChildrenBooksSortForView(this.selectedView())
      );
    }
  }

  openViewConfig(): void {
    this.isViewConfigOpen.set(true);
  }

  closeViewConfig(): void {
    this.isViewConfigOpen.set(false);
  }

  onOptionalViewChange(view: OptionalChildrenBookView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: ChildrenBookView): boolean {
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
      Partial<Record<OptionalChildrenBookView, boolean>>
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
        view: ChildrenBookView;
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
      parsed.view === 'readlist' ||
      parsed.view === 'readingInProgress'
    ) {
      this.selectedSort.set('readPriority');
    } else if (
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

  allChildrenBooks = computed<ChildrenBook[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.childrenBooksList()[params['id']] || []
      : this.childrenBooksList()[DEFAULT_USER_ID];
  });

  allReadlistChildrenBooks = computed<ChildrenBook[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.readlistChildrenBooksList()[params['id']] || []
      : this.readlistChildrenBooksList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des livres lus (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() => this.allChildrenBooks().length > 0);

  filteredChildrenBooks = computed<ChildrenBook[]>(() => {
    let childrenBooks: ChildrenBook[] = this.allChildrenBooks();
    if (this.selectedView() === 'readlist') {
      childrenBooks = this.allReadlistChildrenBooks().filter((b) => !isReading(b));
    } else if (this.selectedView() === 'readingInProgress') {
      const fromReadlist = this.allReadlistChildrenBooks().filter((b) => isReading(b));
      const fromRead = this.allChildrenBooks().filter((b) => isReading(b));
      const seen = new Set<string>();
      childrenBooks = [...fromReadlist, ...fromRead].filter((childrenBook) => {
        const key = `${childrenBook.title}|${childrenBook.author}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (this.selectedView() === 'owned') {
      const ownedRead = this.allChildrenBooks().filter((childrenBook) => childrenBook.owned);
      const ownedReadlist = this.allReadlistChildrenBooks().filter((childrenBook) => childrenBook.owned);
      const seen = new Set<string>();
      childrenBooks = [...ownedRead, ...ownedReadlist].filter((childrenBook) => {
        const key = `${childrenBook.title}|${childrenBook.author}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (this.selectedView() === 'borrowed') {
      const readBorrowed = this.allChildrenBooks().filter((childrenBook) =>
        Boolean(childrenBook.borrowed && childrenBook.borrowed.trim().length > 0)
      );
      const readlistBorrowed = this.allReadlistChildrenBooks().filter((childrenBook) =>
        Boolean(childrenBook.borrowed && childrenBook.borrowed.trim().length > 0)
      );
      const seen = new Set<string>();
      childrenBooks = [...readBorrowed, ...readlistBorrowed].filter((childrenBook) => {
        const key = `${childrenBook.title}|${childrenBook.author}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const readLoaned = this.allChildrenBooks().filter((childrenBook) =>
        Boolean(childrenBook.loaned && childrenBook.loaned.trim().length > 0)
      );
      const readlistLoaned = this.allReadlistChildrenBooks().filter((childrenBook) =>
        Boolean(childrenBook.loaned && childrenBook.loaned.trim().length > 0)
      );
      const seen = new Set<string>();
      childrenBooks = [...readLoaned, ...readlistLoaned].filter((childrenBook) => {
        const key = `${childrenBook.title}|${childrenBook.author}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (this.selectedView() === 'toReRead') {
      childrenBooks = this.allChildrenBooks().filter(
        (childrenBook) => childrenBook.wantToReadAgain === true && !isReading(childrenBook)
      );
    } else if (this.selectedView() === 'authors') {
      childrenBooks = this.allChildrenBooks();
    } else if (this.selectedView() === 'sagas') {
      childrenBooks = this.allChildrenBooks();
    } else if (this.selectedView() === 'countries') {
      childrenBooks = this.allChildrenBooks();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return childrenBooks;
    }

    return childrenBooks.filter((childrenBook) => this.matchesSearch(childrenBook, term));
  });

  currentUser = computed(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? this.capitalizeFirstLetter(params['id']) : '';
  });

  filteredChildrenBooksByYear = computed(() => {
    let filteredChildrenBooks = [...this.filteredChildrenBooks()];

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
        filteredChildrenBooks = filteredChildrenBooks.filter((b) => dateInYear(b, '2026'));
      } else if (this.selectedYearFilter() === '2025') {
        filteredChildrenBooks = filteredChildrenBooks.filter((b) => dateInYear(b, '2025'));
      } else if (this.selectedYearFilter() === '2024') {
        filteredChildrenBooks = filteredChildrenBooks.filter((b) => dateInYear(b, '2024'));
      } else if (this.selectedYearFilter() === 'before2024') {
        filteredChildrenBooks = filteredChildrenBooks.filter((b) => dateBefore2024(b));
      }

      // Vue « Livres pour enfants empruntés » : garder aussi les empruntés de la readlist (sans date de lecture)
      if (
        this.selectedView() === 'borrowed' &&
        this.selectedYearFilter() !== 'all'
      ) {
        const readlistBorrowed = this.allReadlistChildrenBooks().filter((b) =>
          Boolean(b.borrowed && b.borrowed.trim().length > 0)
        );
        const seen = new Set(
          filteredChildrenBooks.map((b) => `${b.title}|${b.author}`)
        );
        for (const b of readlistBorrowed) {
          const key = `${b.title}|${b.author}`;
          if (!seen.has(key)) {
            seen.add(key);
            filteredChildrenBooks = [...filteredChildrenBooks, b];
          }
        }
      }

      // Vue « Livres pour enfants prêtés » : garder aussi les prêtés de la readlist (sans date de lecture)
      if (
        this.selectedView() === 'loaned' &&
        this.selectedYearFilter() !== 'all'
      ) {
        const readlistLoaned = this.allReadlistChildrenBooks().filter((b) =>
          Boolean(b.loaned && b.loaned.trim().length > 0)
        );
        const seen = new Set(
          filteredChildrenBooks.map((b) => `${b.title}|${b.author}`)
        );
        for (const b of readlistLoaned) {
          const key = `${b.title}|${b.author}`;
          if (!seen.has(key)) {
            seen.add(key);
            filteredChildrenBooks = [...filteredChildrenBooks, b];
          }
        }
      }
    }

    return filteredChildrenBooks;
  });

  sortedChildrenBooks = computed(() =>
    getSortedChildrenBooks([...this.filteredChildrenBooksByYear()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    // Utiliser les livres filtrés pour les stats
    const childrenBooksToUse = this.filteredChildrenBooksByYear();
    const totalPages = getTotalPages(childrenBooksToUse);
    const totalPagesRead = getTotalPagesRead(childrenBooksToUse);

    const estimatedReadingTime =
      this.selectedView() === 'readlist' ||
      this.selectedView() === 'readingInProgress'
        ? formatTimeStats(totalPages * MINUTES_PER_PAGE)
        : getEstimatedReadingTime(childrenBooksToUse);

    const stats = [
      {
        label: 'Pages totales de tous les livres',
        value: `${totalPages.toLocaleString()} pages`,
        icon: '🧒',
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

  onViewChange(view: ChildrenBookView) {
    this.selectedView.set(view);
    if (view === 'readlist' || view === 'readingInProgress') {
      this.selectedSort.set('readPriority');
    }
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  childrenBooksByAuthor = computed(() => {
    if (this.selectedView() !== 'authors') {
      return [];
    }
    return getChildrenBooksByAuthor({
      sortedChildrenBooks: this.allChildrenBooks(),
      allChildrenBooks: this.allChildrenBooks(),
      baseChildrenBooks: this.baseChildrenBooksList(),
      selectedSort: 'readDate',
    });
  });

  childrenBooksBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') {
      return [];
    }
    return getChildrenBooksBySaga({
      sortedChildrenBooks: this.allChildrenBooks(),
      allChildrenBooks: this.allChildrenBooks(),
      baseChildrenBooks: this.baseChildrenBooksList(),
      selectedSort: 'readDate',
    });
  });

  childrenBooksByCountry = computed(() => {
    if (this.selectedView() !== 'countries') {
      return [];
    }
    return getChildrenBooksByCountry({
      sortedChildrenBooks: this.sortedChildrenBooks(),
      allChildrenBooks: this.allChildrenBooks(),
      baseChildrenBooks: this.baseChildrenBooksList(),
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

  openEditChildrenBookDialog(childrenBook: ChildrenBook): void {
    const childrenBooks = this.sortedChildrenBooks();
    const index = childrenBooks.findIndex(
      (item) => item.title === childrenBook.title && item.author === childrenBook.author
    );
    const dialogRef = this.dialog.open(EditChildrenBookComponent, {
      data: {
        childrenBook,
        userId: this.getActiveUserId(),
        list: childrenBooks,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        void this.refreshChildrenBooks();
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

  getTopFiveRank(childrenBook: ChildrenBook): number | null {
    const tf = this.topFive();
    const key = getEntityKey('children-books', childrenBook);
    const idx = (tf['children-books'] ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(childrenBook: ChildrenBook, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'children-books',
      getEntityKey('children-books', childrenBook),
      rank
    );
  }

  private matchesSearch(childrenBook: ChildrenBook, term: string): boolean {
    const haystack = [childrenBook.title, childrenBook.author, ...childrenBook.genre, childrenBook.saga]
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

    if (isOfflineModeBlockingOtherUsers()) {
      this.recommendationsOfflineBlocked.set(true);
      this.recommendations.set([]);
      return;
    }
    this.recommendationsOfflineBlocked.set(false);

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

      // S'assurer que baseChildrenBooksList est chargé
      if (this.baseChildrenBooksList().length === 0) {
        await this.refreshChildrenBooks();
      }

      const othersRated = await getOtherUsersChildrenBooksRated(userId, 4, followedIds);

      const detailsMap = new Map<string, Map<string, number>>();
      for (const childrenBook of othersRated) {
        const key = `${childrenBook.title}|${childrenBook.author}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(childrenBook.userId) ?? 0;
        if (childrenBook.rating > prev) {
          userMap.set(childrenBook.userId, childrenBook.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allChildrenBooks().map((childrenBook) => this.getChildrenBookIdentityKey(childrenBook))
      );

      const baseChildrenBooks = this.baseChildrenBooksList();

      const recommended = baseChildrenBooks
        .filter((childrenBook) => {
          const key = this.getChildrenBookIdentityKey(childrenBook);
          const isNotSeen = !seenKeys.has(key);
          const isInDetailsMap = detailsMap.has(key);

          return isNotSeen && isInDetailsMap;
        })
        .map((childrenBook) => {
          const details = detailsMap.get(this.getChildrenBookIdentityKey(childrenBook));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...childrenBook,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getChildrenBookIdentityKey(a));
          const detailsB = detailsMap.get(this.getChildrenBookIdentityKey(b));
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
      console.warn('children-books:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedChildrenBooks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((childrenBook) => this.matchesSearch(childrenBook, term));
  });

  getChildrenBookIdentityKey(childrenBook: ChildrenBook): string {
    return `${childrenBook.title}|${childrenBook.author}`;
  }

  getChildrenBookRecommendationText(childrenBook: ChildrenBook): string {
    const recommendationDetails =
      (childrenBook as RecommendedChildrenBook).recommendationDetails || [];
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

  isSagaFinished(childrenBook: ChildrenBook): boolean | null {
    if (!childrenBook.saga || !childrenBook.saga.trim()) {
      return null; // Pas de saga
    }
    const sagaName = childrenBook.saga.trim();
    const sagaChildrenBooks = this.baseChildrenBooksList().filter(
      (b) => b.saga?.trim() === sagaName
    );
    if (sagaChildrenBooks.length === 0) {
      return null; // Saga non trouvée
    }
    // Une saga est terminée si tous les livres de la saga ont sagaFinished: true
    return sagaChildrenBooks.every((b) => b.sagaFinished === true);
  }

  getSagaBadge(childrenBook: ChildrenBook): 'Saga terminée' | 'Saga en cours' | null {
    const sagaStatus = this.isSagaFinished(childrenBook);
    if (sagaStatus === null) {
      return null; // Pas de saga ou saga non trouvée
    }
    return sagaStatus ? 'Saga terminée' : 'Saga en cours';
  }

  childrenBookAlreadyInUserReadlist(childrenBook: ChildrenBook): boolean {
    const readlist = this.allReadlistChildrenBooks();
    return readlist.some(
      (b) => b.title === childrenBook.title && b.author === childrenBook.author
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
  canAddChildrenBookToMyReadlist(childrenBook: ChildrenBook): boolean {
    const key = this.getChildrenBookIdentityKey(childrenBook);
    const inReadlist = this.connectedUserReadlist().some(
      (b) => this.getChildrenBookIdentityKey(b) === key
    );
    const alreadyRead = this.connectedUserChildrenBooks().some(
      (b) => this.getChildrenBookIdentityKey(b) === key && (b.readTimes ?? 0) >= 1
    );
    return !inReadlist && !alreadyRead;
  }

  /** True si l'utilisateur connecté peut ajouter ce livre à ses livres lus (ne l'a pas déjà lu). */
  canAddChildrenBookToMyRead(childrenBook: ChildrenBook): boolean {
    const key = this.getChildrenBookIdentityKey(childrenBook);
    const alreadyRead = this.connectedUserChildrenBooks().some(
      (b) => this.getChildrenBookIdentityKey(b) === key && (b.readTimes ?? 0) >= 1
    );
    return !alreadyRead;
  }

  /** Ajoute le livre à la readlist de l'utilisateur connecté (depuis la vue du profil d'un autre). */
  async addChildrenBookToConnectedUserReadlist(childrenBook: ChildrenBook) {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addChildrenBookToReadlistApi(childrenBook, connectedUserId);
    if (success) {
      await this.refreshChildrenBooks();
    }
  }

  /** Ajoute le livre aux livres lus de l'utilisateur connecté (depuis la vue du profil d'un autre). */
  async addChildrenBookToConnectedUserAsRead(childrenBook: ChildrenBook) {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addChildrenBookAsReadApi(childrenBook, connectedUserId);
    if (success) {
      await this.refreshChildrenBooks();
    }
  }

  async addChildrenBookToReadlist(childrenBook: ChildrenBook) {
    const success = await addChildrenBookToReadlistApi(childrenBook, this.getActiveUserId());
    if (success) {
      this.router.navigate([`${this.getActiveUserId()}/children-books`]);
    }
  }

  async markChildrenBookAsWantToReRead(childrenBook: ChildrenBook): Promise<void> {
    const success = await markChildrenBookAsWantToReReadApi(
      childrenBook,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshChildrenBooks();
    }
  }

  async markChildrenBookAsReRead(childrenBook: ChildrenBook): Promise<void> {
    const success = await markChildrenBookAsReReadApi(childrenBook, this.getActiveUserId());
    if (success) {
      await this.refreshChildrenBooks();
    }
  }

  async updateReadPriority(data: {
    childrenBook: ChildrenBook;
    priority: number;
  }): Promise<void> {
    const success = await updateReadPriorityApi(data, this.getActiveUserId());
    if (success) {
      await this.refreshChildrenBooks();
    }
  }

  toggleTopFiveRankDisplay(): void {
    this.showTopFiveRank.set(!this.showTopFiveRank());
  }
}
