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
import { SortOption } from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import {
  getTotalWatchingTime,
  getTotalDuration,
  capitalizeFirstLetter,
} from '../../../utils/stats.utils';
import { Movie } from '../../../models/movie-model';
import { Quizz } from '../../../models/quizz-model';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseMovies,
  getAllMovies,
  getAllWatchlistMovies,
  getOtherUsersMoviesRated,
} from '../../../facades/movies/movies.facade';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';
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
} from './movies.utils';
import { getApiBaseUrl } from '../../../core/config';
import { MoviesHeaderComponent } from './movies-header/movies-header.component';

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
    QuizzModalComponent,
    MoviesHeaderComponent,
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private isInitializing = false;
  private isLoadingViewConfig = false;
  private isLoadingPreferences = false;
  private readonly viewConfigStorageKey = 'movies_view_config';
  private readonly viewPreferencesStorageKey = 'movies_view_preferences';

  selectedSort = signal<string>('lastViewedDate');
  selectedView = signal<MovieView>('watched');
  selectedYearFilter = signal<string>('all');
  searchTerm = signal<string>('');
  isViewConfigOpen = signal<boolean>(false);
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);
  optionalViewConfig = signal<Record<OptionalMovieView, boolean>>({
    cinema: true,
    owned: true,
    toReWatch: true,
    sagas: true,
    actors: false,
    directors: false,
    recommendations: false,
  });

  constructor() {
    // Synchroniser les changements de filtres/tri avec l'URL
    effect(() => {
      if (this.isInitializing || this.isAdminView()) return;

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
      if (this.isLoadingViewConfig || this.isAdminView()) return;
      this.localStorageService.setItem(this.viewConfigStorageKey, config);
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
      };
      this.localStorageService.setItem(
        this.viewPreferencesStorageKey,
        preferences
      );
    });

    effect(() => {
      const view = this.selectedView();
      if (this.isAdminView()) return;
      if (!this.isViewOptionVisible(view)) {
        this.selectedView.set('watched');
      }
    });

    effect(() => {
      if (this.isAdminView()) return;
      if (this.selectedView() === 'recommendations') {
        void this.loadRecommendations();
      }
    });
  }

  ngOnInit() {
    if (this.isAdminView()) {
      this.selectedView.set('watched');
    }
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
    void this.refreshQuizzs();
  }

  sortOptions = computed(() => {
    if (this.selectedView() === 'watchlist') {
      return [];
    }
    return moviesSortOptions;
  });

  movieViewOptions: { value: MovieView; label: string }[] = movieViewOptions;

  visibleMovieViewOptions = computed(() =>
    this.isAdminView()
      ? this.movieViewOptions.filter(
          (option) =>
            option.value === 'watched' ||
            option.value === 'sagas' ||
            option.value === 'actors' ||
            option.value === 'directors'
        )
      : this.movieViewOptions.filter((option) =>
          this.isViewOptionVisible(option.value)
        )
  );

  yearFilterOptions = yearFilterOptions;

  moviesList = signal<{ [key: string]: Movie[] }>({});
  adminMoviesList = signal<Movie[]>([]);
  baseMoviesList = signal<Movie[]>([]);

  watchingMoviesList = signal<{ [key: string]: Movie[] }>({});

  allWatchlistMovies = computed<Movie[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.watchingMoviesList()[params['id']] || []
      : this.watchingMoviesList()['guillaume'];
  });

  allMovies = computed<Movie[]>(() => {
    if (this.isAdminView()) {
      return this.adminMoviesList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.moviesList()[params['id']] || []
      : this.moviesList()['guillaume'];
  });

  filteredMovies = computed<Movie[]>(() => {
    let movies: Movie[] = [];
    if (this.isAdminView()) {
      movies = this.allMovies();
    } else if (this.selectedView() === 'watchlist') {
      movies = this.allWatchlistMovies();
    } else if (this.selectedView() === 'cinema') {
      movies = this.allMovies().filter((movie) => movie.seenAtCinema === true);
    } else if (this.selectedView() === 'owned') {
      movies = this.allMovies().filter((movie) => movie.owned);
    } else if (this.selectedView() === 'toReWatch') {
      movies = this.allMovies().filter(
        (movie) => movie.wantToSeeAgain === true
      );
    } else if (
      this.selectedView() === 'sagas' ||
      this.selectedView() === 'actors' ||
      this.selectedView() === 'directors' ||
      this.selectedView() === 'recommendations'
    ) {
      movies = this.allMovies();
    } else {
      movies = this.allMovies();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return movies;
    }

    return movies.filter((movie) => this.matchesSearch(movie, term));
  });

  filteredMoviesByYear = computed<Movie[]>(() => {
    let filteredMovies = [...this.filteredMovies()];

    if (this.isAdminView()) {
      return filteredMovies;
    }

    // Filtrage par année (seulement pour les films vus et vus au cinéma, basé sur firstViewedDate)
    if (this.selectedView() === 'watched' || this.selectedView() === 'cinema') {
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

    const sagaMap = new Map<string, Movie[]>();
    for (const movie of this.sortedMovies()) {
      const sagaName = movie.saga?.trim();
      if (!sagaName && !this.isAdminView()) {
        continue;
      }
      const sagaKey = sagaName || 'Sans saga';
      const list = sagaMap.get(sagaKey) ?? [];
      list.push(movie);
      sagaMap.set(sagaKey, list);
    }

    const seenKeys = new Set(
      this.allMovies().map((movie) => this.getMovieIdentityKey(movie))
    );
    const baseBySaga = new Map<string, Movie[]>();
    for (const movie of this.baseMoviesList()) {
      const sagaName = movie.saga?.trim();
      if (!sagaName) continue;
      if (seenKeys.has(this.getMovieIdentityKey(movie))) continue;
      const list = baseBySaga.get(sagaName) ?? [];
      list.push(movie);
      baseBySaga.set(sagaName, list);
    }

    const sagaGroups = Array.from(sagaMap.entries()).map(
      ([saga, seenMovies]) => {
        const missing =
          this.isAdminView() || saga === 'Sans saga'
            ? []
            : getSortedMovies(
                [...(baseBySaga.get(saga) ?? [])],
                'releaseDate-asc'
              );
        return {
          saga,
          seenMovies: getSortedMovies(seenMovies, 'releaseDate-asc'),
          missingMovies: missing,
        };
      }
    );

    sagaGroups.sort((a, b) => {
      const countA = a.seenMovies.length + a.missingMovies.length;
      const countB = b.seenMovies.length + b.missingMovies.length;
      if (countB !== countA) {
        return countB - countA;
      }
      return a.saga.localeCompare(b.saga);
    });

    return sagaGroups;
  });

  collapsedSagas = signal<Record<string, boolean>>({});
  collapsedActors = signal<Record<string, boolean>>({});
  collapsedDirectors = signal<Record<string, boolean>>({});
  recommendations = signal<RecommendedMovie[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

  recommendedMovies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((movie) => this.matchesSearch(movie, term));
  });

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
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
  });

  private loadParamsFromUrl(queryParams: Params) {
    if (
      queryParams['view'] === 'watchlist' ||
      queryParams['view'] === 'watched' ||
      queryParams['view'] === 'cinema' ||
      queryParams['view'] === 'owned' ||
      queryParams['view'] === 'toReWatch' ||
      queryParams['view'] === 'sagas' ||
      queryParams['view'] === 'actors' ||
      queryParams['view'] === 'directors' ||
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

    if (queryParams['year']) {
      const validYear = this.yearFilterOptions.find(
        (opt) => opt.value === queryParams['year']
      );
      if (validYear) {
        this.selectedYearFilter.set(queryParams['year']);
      }
    }
  }

  async refreshMovies() {
    if (this.isAdminView()) {
      const baseMovies = await getAllBaseMovies();
      const movies = baseMovies.map((movie) => ({
        title: movie.title,
        director: movie.director,
        coverUrl: movie.coverUrl,
        releaseDate: movie.releaseDate,
        length: movie.length,
        genre: movie.genre,
        saga: movie.saga,
        actors: movie.actors,
        rating: 0,
        timesWatched: 0,
        firstViewedDate: '',
        lastViewedDate: '',
        seenAtCinema: false,
        owned: false,
        wantToSeeAgain: false,
        watchPriority: 0,
      }));
      this.adminMoviesList.set(movies);
      this.baseMoviesList.set(movies);
      return;
    }

    const userId = this.getActiveUserId();
    const [movies, watchlist, baseMovies] = await Promise.all([
      getAllMovies(userId),
      getAllWatchlistMovies(userId),
      getAllBaseMovies(),
    ]);
    this.moviesList.set(movies);
    this.watchingMoviesList.set(watchlist);
    this.baseMoviesList.set(
      baseMovies.map((movie) => ({
        title: movie.title,
        director: movie.director,
        coverUrl: movie.coverUrl,
        releaseDate: movie.releaseDate,
        length: movie.length,
        genre: movie.genre,
        saga: movie.saga,
        actors: movie.actors,
        rating: 0,
        timesWatched: 0,
        firstViewedDate: '',
        lastViewedDate: '',
        seenAtCinema: false,
        owned: false,
        wantToSeeAgain: false,
        watchPriority: 0,
      }))
    );
  }

  async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: MovieView) {
    this.selectedView.set(view);
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
    const userId = hasNameParam ? params['id'] : 'guillaume';
    return hasNameParam ? [`/${userId}`, 'select-movies'] : ['/select-movies'];
  }

  onYearFilterChange(year: string) {
    this.selectedYearFilter.set(year);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
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

    this.isLoadingRecommendations.set(true);
    try {
      const othersRated = await getOtherUsersMoviesRated(userId, 4);

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

  openQuizzModal(quizzs: Quizz[]) {
    if (!quizzs || quizzs.length === 0) return;
    this.activeQuizzs.set(quizzs);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal() {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
  }

  private matchesSearch(movie: Movie, term: string): boolean {
    const actors = movie.actors?.map((actor) => actor.name).join(' ') || '';
    const haystack = [
      movie.title,
      movie.director,
      actors,
      movie.genre,
      movie.saga,
    ]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = this.normalizeSearchText(haystack);
    const normalizedTerm = this.normalizeSearchText(term);
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
      isAdminView: this.isAdminView(),
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
      isAdminView: this.isAdminView(),
    });
  });

  private getMovieIdentityKey(movie: Movie): string {
    return `${movie.title}|${movie.director}`;
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
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
    if (
      parsed.year &&
      this.yearFilterOptions.some(
        (opt: { value: string; label: string }) => opt.value === parsed.year
      )
    ) {
      this.selectedYearFilter.set(parsed.year);
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
      sagas: parsed.sagas ?? true,
      actors: parsed.actors ?? false,
      directors: parsed.directors ?? false,
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

  async addMovieToWatchlist(movie: Movie): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/movies/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          movies: [movie],
          watchlist: true,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des films :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.getActiveUserId()}/movies`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des films.", error);
    }
  }

  async markMovieAsWantToReWatch(movie: Movie): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: movie.title,
          director: movie.director,
          rating: movie.rating,
          timesWatched: movie.timesWatched,
          firstViewedDate: movie.firstViewedDate,
          lastViewedDate: movie.lastViewedDate,
          seenAtCinema: movie.seenAtCinema,
          owned: movie.owned,
          wantToSeeAgain: true,
          watchPriority: movie.watchPriority ?? 0,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec de la mise à jour du film :',
          payload?.error || response.statusText
        );
        return;
      }

      await this.refreshMovies();
    } catch (error) {
      console.warn('Erreur réseau lors de la mise à jour du film.', error);
    }
  }

  async markMovieAsReWatched(movie: Movie): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${getApiBaseUrl()}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: movie.title,
          director: movie.director,
          rating: movie.rating,
          timesWatched: (movie.timesWatched || 0) + 1,
          firstViewedDate: movie.firstViewedDate,
          lastViewedDate: today,
          seenAtCinema: movie.seenAtCinema,
          owned: movie.owned,
          wantToSeeAgain: false,
          watchPriority: movie.watchPriority ?? 0,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec de la mise à jour du film :',
          payload?.error || response.statusText
        );
        return;
      }

      await this.refreshMovies();
    } catch (error) {
      console.warn('Erreur réseau lors de la mise à jour du film.', error);
    }
  }

  async updateWatchPriority(data: {
    movie: Movie;
    priority: number;
  }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: data.movie.title,
          director: data.movie.director,
          rating: data.movie.rating,
          timesWatched: data.movie.timesWatched,
          firstViewedDate: data.movie.firstViewedDate,
          lastViewedDate: data.movie.lastViewedDate,
          seenAtCinema: data.movie.seenAtCinema,
          owned: data.movie.owned,
          wantToSeeAgain: data.movie.wantToSeeAgain,
          watchPriority: data.priority,
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

      await this.refreshMovies();
    } catch (error) {
      console.warn(
        'Erreur réseau lors de la mise à jour de la priorité.',
        error
      );
    }
  }
}
