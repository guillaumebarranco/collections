import {
  Component,
  inject,
  signal,
  computed,
  effect,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieComponent } from '../../../components/movie/movie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { ViewToggleComponent } from '../../../components/view-toggle/view-toggle.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import {
  getTotalWatchingTime,
  getTotalDuration,
} from '../../../utils/stats.utils';
import { Movie } from '../../../models/movie-model';
import { Quizz } from '../../../models/quizz-model';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseMovies,
  getAllMovies,
  getAllWatchlistMovies,
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
} from './movies.utils';

@Component({
  selector: 'app-movies',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MovieComponent,
    MenuComponent,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    QuizzModalComponent,
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
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
    sagas: true,
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
      if (this.isLoadingPreferences || this.isInitializing || this.isAdminView()) return;
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

  private loadParamsFromUrl(queryParams: Params) {
    if (
      queryParams['view'] === 'watchlist' ||
      queryParams['view'] === 'watched' ||
      queryParams['view'] === 'cinema' ||
      queryParams['view'] === 'owned' ||
      queryParams['view'] === 'sagas'
    ) {
      this.selectedView.set(queryParams['view'] as MovieView);
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
  }

  sortOptions: SortOption[] = moviesSortOptions;

  movieViewOptions: { value: MovieView; label: string }[] = movieViewOptions;

  visibleMovieViewOptions = computed(() =>
    this.movieViewOptions.filter((option) =>
      this.isViewOptionVisible(option.value)
    )
  );

  yearFilterOptions = yearFilterOptions;

  moviesList = signal<{ [key: string]: Movie[] }>({});
  adminMoviesList = signal<Movie[]>([]);

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
    } else if (this.selectedView() === 'sagas') {
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
    getSortedMovies([...this.filteredMoviesByYear()], this.selectedSort())
  );

  moviesBySaga = computed<{ saga: string; movies: Movie[] }[]>(() => {
    if (this.selectedView() !== 'sagas') {
      return [];
    }

    const sagaMap = new Map<string, Movie[]>();
    for (const movie of this.sortedMovies()) {
      const sagaName = movie.saga?.trim();
      if (!sagaName) {
        continue;
      }
      const list = sagaMap.get(sagaName) ?? [];
      list.push(movie);
      sagaMap.set(sagaName, list);
    }

    const sagaGroups = Array.from(sagaMap.entries()).map(([saga, movies]) => ({
      saga,
      movies,
    }));

    sagaGroups.sort((a, b) => {
      if (b.movies.length !== a.movies.length) {
        return b.movies.length - a.movies.length;
      }
      return a.saga.localeCompare(b.saga);
    });

    return sagaGroups;
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

  getSelectMoviesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-movies` : '/select-movies';
  }

  getSelectWatchlistRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    const userId = hasNameParam ? params['id'] : 'guillaume';
    return hasNameParam ? [`/${userId}`, 'select-movies'] : ['/select-movies'];
  }

  getSelectCinemaRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? [`/${params['id']}`, 'select-movies']
      : ['/select-movies'];
  }

  getSelectMoviesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-rating`
      : '/select-movies-rating';
  }

  getSelectMoviesTimesWatchedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-times-watched`
      : '/select-movies-times-watched';
  }

  getSelectMoviesOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-owned`
      : '/select-movies-owned';
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
      }));
      this.adminMoviesList.set(movies);
      return;
    }

    const userId = this.getActiveUserId();
    const [movies, watchlist] = await Promise.all([
      getAllMovies(userId),
      getAllWatchlistMovies(userId),
    ]);
    this.moviesList.set(movies);
    this.watchingMoviesList.set(watchlist);
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

  onYearFilterChange(year: string) {
    this.selectedYearFilter.set(year);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
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
      this.sortOptions.some(
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
    });
    this.isLoadingViewConfig = false;
  }
}
