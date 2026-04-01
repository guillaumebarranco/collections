import {
  Component,
  inject,
  signal,
  computed,
  effect,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from '../../../components/collections/movie/movie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortDropdownComponent } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
  StatsDisplayComponent,
} from '../../../components/shared/stats-display/stats-display.component';

import {
  getTotalWatchingTime,
  getTotalDuration,
  capitalizeFirstLetter,
} from '../../../utils/stats.utils';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import { Movie } from '../../../models/movie-model';
import type { UserMovieListItem } from '../../../models/movie-list.model';
import { DEFAULT_USER_ID } from '../../../utils/constants';

import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseMovies,
  getAllMovies,
  getAllWatchlistMovies,
  getOtherUsersMoviesRated,
} from '../../../facades/movies/movies.facade';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { getEntityKey } from '../../../utils/top-five.utils';

import {
  getSortedMovies,
  allYearsSince2000,
  moviesSortOptions,
  MovieView,
  OptionalMovieView,
  movieViewOptions,
  yearFilterOptions,
  getMoviesByActor,
  getMoviesByDirector,
  getMoviesBySaga,
  getMoviesByCountry,
} from './movies.utils';
import { getApiBaseUrl, isLocalhost } from '../../../core/config';
import { MoviesHeaderComponent } from './movies-header/movies-header.component';
import { LoaderComponent } from '../../../components/shared/loader/loader.component';
import { getFullMovie } from '../../../helpers/full-entities-helper';
import {
  updateWatchPriority,
  markMovieAsReWatched,
  markMovieAsWantToReWatch,
  addMovieToWatchlist as addMovieToWatchlistApi,
  addMovieAsWatched,
  getUserMoviesLists,
  createUserMovieList,
  addMovieToList,
} from './movies.controller';
import { AuthService } from '../../../core/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieUpdateFollowUpModalComponent } from '../../../components/modals/movie-update-follow-up-modal/movie-update-follow-up-modal.component';
import { buildMovieWatchFollowUpProgress } from '../../../utils/movie-watch-follow-up.utils';
import { BadgesService } from '../../../services/badges.service';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedMovie = Movie & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-movies',
  imports: [
    RouterLink,
    CommonModule,
    MovieComponent,
    MenuComponent,

    MoviesHeaderComponent,
    LoaderComponent,
    StatsDisplayComponent,
    SortDropdownComponent,
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly badgesService = inject(BadgesService);
  private isInitializing = false;
  private isLoadingViewConfig = false;
  private isLoadingPreferences = false;
  private readonly viewConfigStorageKey = 'movies_view_config';
  private readonly viewPreferencesStorageKey = 'movies_view_preferences';

  selectedSort = signal<string>('lastViewedDate');
  selectedView = signal<MovieView>('watched');
  selectedYearFilter = signal<string>('all');
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);

  optionalViewConfig = signal<Record<OptionalMovieView, boolean>>({
    cinema: true,
    owned: true,
    borrowed: true,
    loaned: true,
    toReWatch: true,
    sagas: true,
    actors: false,
    directors: false,
    countries: false,
    recommendations: false,
  });

  constructor() {
    // Synchroniser les changements de filtres/tri avec l'URL
    effect(() => {
      if (this.isInitializing) return;

      const queryParams: any = {};

      if (this.selectedView() !== 'watched') {
        queryParams.view = this.selectedView();
      } else {
        queryParams.view = null;
      }

      if (this.selectedSort() !== 'lastViewedDate') {
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
      const config = this.optionalViewConfig();
      if (this.isLoadingViewConfig) return;
      this.localStorageService.setItem(this.viewConfigStorageKey, config);
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
      const view = this.selectedView();
      if (!this.isViewOptionVisible(view)) {
        this.selectedView.set('watched');
      }
    });

    effect(() => {
      if (this.selectedView() === 'recommendations') {
        void this.loadRecommendations();
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

    void this.refreshMovies();
  }

  sortOptions = computed(() => {
    return moviesSortOptions(this.selectedView());
  });

  movieViewOptions: { value: MovieView; label: string }[] = movieViewOptions;

  visibleMovieViewOptions = computed(() =>
    this.movieViewOptions.filter((option) =>
      this.isViewOptionVisible(option.value)
    )
  );

  yearFilterOptions = yearFilterOptions;

  /** True tant que les films n'ont pas été chargés une première fois. */
  isLoadingMovies = signal<boolean>(true);

  moviesList = signal<{ [key: string]: Movie[] }>({});
  baseMoviesList = signal<Movie[]>([]);

  watchingMoviesList = signal<{ [key: string]: Movie[] }>({});
  /** Films vus par l'utilisateur connecté (rempli uniquement en consultation d'un autre profil). */
  connectedUserMovies = signal<Movie[]>([]);
  /** Watchlist de l'utilisateur connecté (rempli uniquement en consultation d'un autre profil). */
  connectedUserWatchlist = signal<Movie[]>([]);

  allWatchlistMovies = computed<Movie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.watchingMoviesList()[params['id']] || []
      : this.watchingMoviesList()[DEFAULT_USER_ID];
  });

  allMovies = computed<Movie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.moviesList()[params['id']] || []
      : this.moviesList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des films dans la vue courante (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() =>
    this.selectedView() === 'watchlist'
      ? this.allWatchlistMovies().length > 0
      : this.allMovies().length > 0
  );

  /** Liste sélectionnée pour filtrer les films vus (null = toutes les listes). */
  selectedListFilter = signal<string | null>(null);

  filteredMovies = computed<Movie[]>(() => {
    let movies: Movie[] = [];
    if (this.selectedView() === 'watchlist') {
      movies = this.allWatchlistMovies();
    } else if (this.selectedView() === 'cinema') {
      movies = this.allMovies().filter((movie) => movie.seenAtCinema === true);
    } else if (this.selectedView() === 'owned') {
      movies = this.allMovies().filter((movie) => movie.owned);
    } else if (this.selectedView() === 'toReWatch') {
      movies = this.allMovies().filter(
        (movie) => movie.wantToSeeAgain === true
      );
    } else if (this.selectedView() === 'borrowed') {
      const key = (m: Movie) => `${m.title}|${m.director}`;
      const readB = this.allMovies().filter((m) => Boolean(m.borrowed.trim()));
      const listB = this.allWatchlistMovies().filter((m) =>
        Boolean(m.borrowed.trim())
      );
      const seen = new Set<string>();
      movies = [...readB, ...listB].filter((m) => {
        const k = key(m);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const key = (m: Movie) => `${m.title}|${m.director}`;
      const readL = this.allMovies().filter((m) => Boolean(m.loaned.trim()));
      const listL = this.allWatchlistMovies().filter((m) =>
        Boolean(m.loaned.trim())
      );
      const seen = new Set<string>();
      movies = [...readL, ...listL].filter((m) => {
        const k = key(m);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (
      this.selectedView() === 'sagas' ||
      this.selectedView() === 'actors' ||
      this.selectedView() === 'directors' ||
      this.selectedView() === 'countries' ||
      this.selectedView() === 'recommendations'
    ) {
      movies = this.allMovies();
    } else {
      movies = this.allMovies();
    }

    if (this.selectedView() === 'watched' && this.selectedListFilter()) {
      const listName = this.selectedListFilter()!;
      movies = movies.filter((m) => (m.inList ?? []).includes(listName));
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return movies;
    }

    return movies.filter((movie) => this.matchesSearch(movie, term));
  });

  filteredMoviesByYear = computed<Movie[]>(() => {
    let filteredMovies = [...this.filteredMovies()];

    // Filtrage par année : date de visionnage pour vus/cinéma, date de sortie pour sagas/acteurs/réalisateurs
    if (
      this.selectedView() === 'watched' ||
      this.selectedView() === 'cinema' ||
      this.selectedView() === 'borrowed' ||
      this.selectedView() === 'loaned'
    ) {
      if (allYearsSince2000.includes(Number(this.selectedYearFilter()))) {
        filteredMovies = filteredMovies.filter((m) =>
          m.firstViewedDate?.startsWith(this.selectedYearFilter())
        );
      } else if (this.selectedYearFilter() === 'before2002') {
        filteredMovies = filteredMovies.filter((m) => {
          if (!m.firstViewedDate) return true;
          const year = parseInt(m.firstViewedDate.substring(0, 4));
          return year < 2002;
        });
      }
    } else if (
      this.selectedView() === 'sagas' ||
      this.selectedView() === 'actors' ||
      this.selectedView() === 'directors' ||
      this.selectedView() === 'countries'
    ) {
      if (this.selectedYearFilter() !== 'all') {
        if (allYearsSince2000.includes(Number(this.selectedYearFilter()))) {
          filteredMovies = filteredMovies.filter((m) =>
            m.releaseDate?.startsWith(this.selectedYearFilter())
          );
        } else if (this.selectedYearFilter() === 'before2002') {
          filteredMovies = filteredMovies.filter((m) => {
            if (!m.releaseDate) return true;
            const year = parseInt(m.releaseDate.substring(0, 4));
            return year < 2002;
          });
        }
      }
    }

    return filteredMovies;
  });

  sortedMovies = computed<Movie[]>(() =>
    this.selectedView() === 'watchlist'
      ? getSortedMovies([...this.filteredMoviesByYear()], 'watchPriority')
      : getSortedMovies([...this.filteredMoviesByYear()], this.selectedSort())
  );

  moviesBySaga = computed<
    { saga: string; seenMovies: Movie[]; missingMovies: Movie[] }[]
  >(() => {
    if (this.selectedView() !== 'sagas') {
      return [];
    }

    return getMoviesBySaga({
      sortedMovies: this.sortedMovies(),
      allMovies: this.allMovies(),
      baseMovies: this.baseMoviesList(),
      selectedSort: this.selectedSort(),
    });
  });

  collapsedSagas = signal<Record<string, boolean>>({});
  collapsedActors = signal<Record<string, boolean>>({});
  collapsedDirectors = signal<Record<string, boolean>>({});
  collapsedCountries = signal<Record<string, boolean>>({});
  recommendations = signal<RecommendedMovie[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

  /** Listes de films de l'utilisateur courant (pour "Ajouter à une liste" sur la card). */
  userMoviesLists = signal<UserMovieListItem[]>([]);

  recommendedMovies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((movie) => this.matchesSearch(movie, term));
  });

  stats = computed<StatItem[]>(() => {
    if (
      this.selectedView() === 'watched' ||
      this.selectedView() === 'watchlist' ||
      this.selectedView() === 'toReWatch' ||
      this.selectedView() === 'cinema'
    ) {
      // Utiliser les films filtrés pour les stats
      const moviesToUse = this.filteredMoviesByYear();
      const totalDuration = getTotalDuration(moviesToUse);
      const totalWatchingTime = getTotalWatchingTime(moviesToUse);

      return [
        {
          label: 'Durée totale de tous les films',
          value: totalDuration.formatted,
          icon: '🎬',
          color: StatItemColor.SUCCESS,
        },
        {
          label: 'Temps total passé devant des films',
          value: totalWatchingTime.formatted,
          icon: '⏱️',
          color: StatItemColor.PRIMARY,
        },
      ];
    }

    return [];
  });

  private loadParamsFromUrl(queryParams: Params) {
    if (
      queryParams['view'] === 'watchlist' ||
      queryParams['view'] === 'watched' ||
      queryParams['view'] === 'cinema' ||
      queryParams['view'] === 'owned' ||
      queryParams['view'] === 'toReWatch' ||
      queryParams['view'] === 'borrowed' ||
      queryParams['view'] === 'loaned' ||
      queryParams['view'] === 'sagas' ||
      queryParams['view'] === 'actors' ||
      queryParams['view'] === 'directors' ||
      queryParams['view'] === 'countries' ||
      queryParams['view'] === 'recommendations'
    ) {
      this.selectedView.set(queryParams['view'] as MovieView);
    }

    if (queryParams['sort']) {
      const validSort = this.sortOptions().find(
        (opt) => opt.value === queryParams['sort']
      );
      if (validSort) {
        this.selectedSort.set(queryParams['sort']);
      }
    }
  }

  async refreshMovies() {
    this.isLoadingMovies.set(true);
    try {
      const displayedUserId = this.getActiveUserId();
      const connectedUserId = this.authService.userId() ?? undefined;
      const isViewingOther = Boolean(
        connectedUserId &&
          displayedUserId &&
          displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
      );

      const [movies, watchlist, baseMovies, lists] = await Promise.all([
        getAllMovies(displayedUserId),
        getAllWatchlistMovies(displayedUserId),
        getAllBaseMovies(),
        getUserMoviesLists(displayedUserId),
      ]);
      this.moviesList.set(movies);
      this.watchingMoviesList.set(watchlist);
      this.baseMoviesList.set(baseMovies.map(getFullMovie));
      this.userMoviesLists.set(lists);

      if (isViewingOther && connectedUserId) {
        const [connectedMovies, connectedWatchlist] = await Promise.all([
          getAllMovies(connectedUserId),
          getAllWatchlistMovies(connectedUserId),
        ]);
        const connectedMoviesList = connectedMovies[connectedUserId] ?? [];
        const connectedWatchlistList =
          connectedWatchlist[connectedUserId] ?? [];
        this.connectedUserMovies.set(connectedMoviesList);
        this.connectedUserWatchlist.set(connectedWatchlistList);
      } else {
        this.connectedUserMovies.set([]);
        this.connectedUserWatchlist.set([]);
      }
    } finally {
      this.isLoadingMovies.set(false);
    }
  }

  /** Après watchlist → vu : rafraîchit les listes puis modale félicitations / badges (profil affiché = le vôtre). */
  async onWatchlistMarkedAsWatched(movie: Movie): Promise<void> {
    await this.refreshMovies();
    if (this.isViewingOtherProfile()) return;
    const progressRows = buildMovieWatchFollowUpProgress(movie, this.allMovies());
    if (!isLocalhost()) {
      void this.badgesService.loadFromApi(this.getActiveUserId());
    }
    this.dialog.open(MovieUpdateFollowUpModalComponent, {
      data: {
        movieTitle: movie.title,
        coverUrl: movie.coverUrl ?? '',
        progressRows,
      },
      width: 'min(440px, 95vw)',
      maxHeight: '90vh',
      panelClass: 'movie-update-follow-up-dialog',
      autoFocus: '.entity-follow-up__footer .makya-btn',
    });
  }

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  topFive = computed(() => {
    this.topFiveService.cache();
    return this.topFiveService.getTopFive(this.getActiveUserId());
  });

  getTopFiveRank(movie: Movie): number | null {
    const tf = this.topFive();
    const key = getEntityKey('movies', movie);
    const idx = (tf.movies ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(movie: Movie, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'movies',
      getEntityKey('movies', movie),
      rank
    );
  }

  toggleTopFiveRankDisplay(): void {
    this.showTopFiveRank.set(!this.showTopFiveRank());
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: MovieView) {
    this.selectedView.set(view);

    // Réinitialiser les filtres et tris lors du changement de vue
    this.selectedYearFilter.set('all');
    this.searchTerm.set('');
    this.selectedListFilter.set(null);

    // Réinitialiser le tri selon la vue
    if (
      view === 'watched' ||
      view === 'cinema' ||
      view === 'toReWatch' ||
      view === 'owned'
    ) {
      this.selectedSort.set('lastViewedDate');
    } else if (view === 'actors') {
      this.selectedSort.set('actor-count');
    } else if (view === 'directors') {
      this.selectedSort.set('director-count');
    } else if (view === 'sagas') {
      this.selectedSort.set('saga-count');
    } else if (view === 'countries') {
      this.selectedSort.set('country-count');
    } else {
      // Pour watchlist, recommendations : pas de tri ou tri par défaut
      this.selectedSort.set('title');
    }

    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  openViewConfig() {
    this.isViewConfigOpen.set(true);
  }

  closeViewConfig() {
    this.isViewConfigOpen.set(false);
  }

  onOptionalViewChange(view: OptionalMovieView, enabled: boolean) {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  getSelectWatchlistRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    const userId = hasNameParam ? params['id'] : DEFAULT_USER_ID;
    return hasNameParam ? [`/${userId}`, 'select-movies'] : ['/select-movies'];
  }

  onYearFilterChange(year: string) {
    this.selectedYearFilter.set(year);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  onListFilterChange(listName: string | null): void {
    this.selectedListFilter.set(listName);
  }

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

      const othersRated = await getOtherUsersMoviesRated(
        userId,
        4,
        followedIds
      );

      const detailsMap = new Map<string, Map<string, number>>();
      for (const movie of othersRated) {
        const key = `${movie.title}|${movie.director}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(movie.userId) ?? 0;
        if (movie.rating > prev) {
          userMap.set(movie.userId, movie.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allMovies().map((movie) => this.getMovieIdentityKey(movie))
      );

      const recommended = this.baseMoviesList()
        .filter((movie) => {
          const key = this.getMovieIdentityKey(movie);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((movie) => {
          const details = detailsMap.get(this.getMovieIdentityKey(movie));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...movie,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getMovieIdentityKey(a));
          const detailsB = detailsMap.get(this.getMovieIdentityKey(b));
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
      console.warn('movies:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  toggleSaga(saga: string) {
    this.collapsedSagas.update((current) => ({
      ...current,
      [saga]: !current[saga],
    }));
  }

  isSagaCollapsed(saga: string): boolean {
    return Boolean(this.collapsedSagas()[saga]);
  }

  toggleActor(actor: string) {
    this.collapsedActors.update((current) => ({
      ...current,
      [actor]: !current[actor],
    }));
  }

  isActorCollapsed(actor: string): boolean {
    return Boolean(this.collapsedActors()[actor]);
  }

  toggleDirector(director: string) {
    this.collapsedDirectors.update((current) => ({
      ...current,
      [director]: !current[director],
    }));
  }

  isDirectorCollapsed(director: string): boolean {
    return Boolean(this.collapsedDirectors()[director]);
  }

  toggleCountry(country: string) {
    this.collapsedCountries.update((current) => ({
      ...current,
      [country]: !current[country],
    }));
  }

  isCountryCollapsed(country: string): boolean {
    return Boolean(this.collapsedCountries()[country]);
  }

  private matchesSearch(movie: Movie, term: string): boolean {
    const actors = movie.actors?.map((actor) => actor.name).join(' ') || '';
    const genreParts = Array.isArray(movie.genre)
      ? movie.genre
      : movie.genre
        ? [movie.genre]
        : [];
    const haystack = [
      movie.title,
      movie.director,
      actors,
      ...genreParts,
      movie.saga,
      movie.countryOrigin ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  moviesByActor = computed(() => {
    if (this.selectedView() !== 'actors') {
      return [];
    }
    return getMoviesByActor({
      sortedMovies: this.sortedMovies(),
      allMovies: this.allMovies(),
      baseMovies: this.baseMoviesList(),
      selectedSort: this.selectedSort(),
    });
  });

  moviesByDirector = computed(() => {
    if (this.selectedView() !== 'directors') {
      return [];
    }
    return getMoviesByDirector({
      sortedMovies: this.sortedMovies(),
      allMovies: this.allMovies(),
      baseMovies: this.baseMoviesList(),
      selectedSort: this.selectedSort(),
    });
  });

  moviesByCountry = computed(() => {
    if (this.selectedView() !== 'countries') {
      return [];
    }
    return getMoviesByCountry({
      sortedMovies: this.sortedMovies(),
      allMovies: this.allMovies(),
      baseMovies: this.baseMoviesList(),
      selectedSort: this.selectedSort(),
    });
  });

  private getMovieIdentityKey(movie: Movie): string {
    return `${movie.title}|${movie.director}`;
  }

  private isViewOptionVisible(view: MovieView): boolean {
    if (view === 'watched' || view === 'watchlist') {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: MovieView;
        sort: string;
        year: string;
      }>
    >(this.viewPreferencesStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingPreferences = true;
    if (
      parsed.view &&
      this.movieViewOptions.some(
        (opt: { value: MovieView; label: string }) => opt.value === parsed.view
      )
    ) {
      this.selectedView.set(parsed.view);
    }
    if (
      parsed.sort &&
      this.sortOptions().some(
        (opt: { value: string; label: string }) => opt.value === parsed.sort
      )
    ) {
      this.selectedSort.set(parsed.sort);
    }

    this.isLoadingPreferences = false;
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalMovieView, boolean>>
    >(this.viewConfigStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingViewConfig = true;
    this.optionalViewConfig.set({
      cinema: parsed.cinema ?? true,
      owned: parsed.owned ?? true,
      borrowed: parsed.borrowed ?? true,
      loaned: parsed.loaned ?? true,
      sagas: parsed.sagas ?? true,
      actors: parsed.actors ?? false,
      directors: parsed.directors ?? false,
      countries: parsed.countries ?? false,
      recommendations: parsed.recommendations ?? false,
      toReWatch: parsed.toReWatch ?? true,
    });
    this.isLoadingViewConfig = false;
  }

  getMovieRecommendationText(movie: Movie): string {
    const recommendationDetails =
      (movie as RecommendedMovie).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à ce film`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à ce film`;
  }

  movieAlreadyInUserWatchlist(movie: Movie): boolean {
    return this.allWatchlistMovies().some(
      (m) => m.title === movie.title && m.director === movie.director
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

  /** True si le bouton "Je veux voir ce film" doit s'afficher (consultation autre profil). */
  canShowAddToMyWatchlist(): boolean {
    return this.isViewingOtherProfile();
  }

  /** True si l'utilisateur connecté peut ajouter ce film à sa watchlist (ne l'a pas vu et ne l'a pas déjà en watchlist). */
  canAddMovieToMyWatchlist(movie: Movie): boolean {
    const key = this.getMovieIdentityKey(movie);
    const inWatchlist = this.connectedUserWatchlist().some(
      (m) => this.getMovieIdentityKey(m) === key
    );
    const alreadyWatched = this.connectedUserMovies().some(
      (m) =>
        this.getMovieIdentityKey(m) === key &&
        Boolean(m.timesWatched && m.timesWatched > 0)
    );
    return !inWatchlist && !alreadyWatched;
  }

  /** True si l'utilisateur connecté peut ajouter ce film à ses films vus (ne l'a pas déjà vu). */
  canAddMovieToMyWatched(movie: Movie): boolean {
    const key = this.getMovieIdentityKey(movie);
    const alreadyWatched = this.connectedUserMovies().some(
      (m) =>
        this.getMovieIdentityKey(m) === key &&
        Boolean(m.timesWatched && m.timesWatched > 0)
    );
    return !alreadyWatched;
  }

  /** Ajoute le film à la watchlist de l'utilisateur connecté (depuis la vue du profil d'un autre). */
  async addMovieToConnectedUserWatchlist(movie: Movie): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addMovieToWatchlistApi(movie, connectedUserId);
    if (success) await this.refreshMovies();
  }

  /** Ajoute le film aux films vus de l'utilisateur connecté (depuis la vue du profil d'un autre). */
  async addMovieToConnectedUserAsWatched(movie: Movie): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addMovieAsWatched(movie, connectedUserId);
    if (success) await this.refreshMovies();
  }

  async addMovieToWatchlist(movie: Movie): Promise<void> {
    const addSuccess = await addMovieToWatchlistApi(
      movie,
      this.getActiveUserId()
    );

    if (addSuccess) {
      await this.refreshMovies();
    }
  }

  async markMovieAsWantToReWatch(movie: Movie): Promise<void> {
    const markSuccess = await markMovieAsWantToReWatch(
      movie,
      this.getActiveUserId()
    );

    if (markSuccess) {
      await this.refreshMovies();
    }
  }

  async markMovieAsReWatched(movie: Movie): Promise<void> {
    const markSuccess = await markMovieAsReWatched(
      movie,
      this.getActiveUserId()
    );

    if (markSuccess) {
      await this.refreshMovies();
    }
  }

  async updateWatchPriority(data: {
    movie: Movie;
    priority: number;
  }): Promise<void> {
    const updateSuccess = await updateWatchPriority(
      data,
      this.getActiveUserId()
    );

    if (updateSuccess) {
      await this.refreshMovies();
    }
  }

  async onAddMovieToList(movie: Movie, listName: string): Promise<void> {
    const ok = await addMovieToList(movie, listName, this.getActiveUserId());
    if (ok) await this.refreshMovies();
  }

  async onCreateListAndAddMovie(movie: Movie): Promise<void> {
    const name = window.prompt('Nom de la nouvelle liste :');
    if (!name?.trim()) return;
    const userId = this.getActiveUserId();
    const updatedLists = await createUserMovieList(
      userId,
      name.trim(),
      '📋',
      '#6b7280'
    );
    if (updatedLists) {
      this.userMoviesLists.set(updatedLists);
      const ok = await addMovieToList(movie, name.trim(), userId);
      if (ok) await this.refreshMovies();
    }
  }
}
