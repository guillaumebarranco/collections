import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from '../../../components/collections/movie/movie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Movie } from '../../../models/movie-model';
import { Quizz } from '../../../models/quizz-model';
import { getAllBaseMovies } from '../../../facades/movies/movies.facade';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import {
  getSortedMovies,
  MovieView,
  movieViewOptions,
  getMoviesByActor,
  getMoviesByDirector,
  getMoviesBySaga,
  getMoviesByCountry,
} from '../../collections/movies/movies.utils';
import { getFullMovie } from '../../../helpers/full-entities-helper';
import { AdminMoviesHeaderComponent } from './movies-header/movies-header.component';
import { LoaderComponent } from '../../../components/loader/loader.component';

const ADMIN_VIEWS: MovieView[] = [
  'watched',
  'sagas',
  'actors',
  'directors',
  'countries',
];

@Component({
  selector: 'app-admin-movies',
  imports: [
    CommonModule,
    MovieComponent,
    MenuComponent,
    QuizzModalComponent,
    AdminMoviesHeaderComponent,
    LoaderComponent,
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMoviesComponent implements OnInit {
  selectedSort = signal<string>('title');
  selectedView = signal<MovieView>('watched');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  /** True until base movies have been loaded once. */
  isLoadingMovies = signal<boolean>(true);

  adminMoviesList = signal<Movie[]>([]);
  baseMoviesList = signal<Movie[]>([]);

  allMovies = computed<Movie[]>(() => this.adminMoviesList());

  filteredMovies = computed<Movie[]>(() => {
    const movies = this.allMovies();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return movies;
    return movies.filter((movie) => this.matchesSearch(movie, term));
  });

  filteredMoviesByYear = computed<Movie[]>(() => this.filteredMovies());

  sortedMovies = computed<Movie[]>(() =>
    getSortedMovies([...this.filteredMoviesByYear()], this.selectedSort())
  );

  movieViewOptions: { value: MovieView; label: string }[] = movieViewOptions;

  visibleMovieViewOptions = computed(() => {
    const adminOptions = this.movieViewOptions.filter((option) =>
      ADMIN_VIEWS.includes(option.value)
    );
    return adminOptions.map((opt, i) =>
      i === 0 ? { ...opt, label: 'Voir tout' } : opt
    );
  });

  moviesBySaga = computed<
    { saga: string; seenMovies: Movie[]; missingMovies: Movie[] }[]
  >(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getMoviesBySaga({
      sortedMovies: this.sortedMovies(),
      allMovies: this.allMovies(),
      baseMovies: this.baseMoviesList(),
      selectedSort: this.selectedSort(),
    });
  });

  moviesByActor = computed(() => {
    if (this.selectedView() !== 'actors') return [];
    return getMoviesByActor({
      sortedMovies: this.sortedMovies(),
      allMovies: this.allMovies(),
      baseMovies: this.baseMoviesList(),
      selectedSort: this.selectedSort(),
    });
  });

  moviesByDirector = computed(() => {
    if (this.selectedView() !== 'directors') return [];
    return getMoviesByDirector({
      sortedMovies: this.sortedMovies(),
      allMovies: this.allMovies(),
      baseMovies: this.baseMoviesList(),
      selectedSort: this.selectedSort(),
    });
  });

  moviesByCountry = computed(() => {
    if (this.selectedView() !== 'countries') return [];
    return getMoviesByCountry({
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

  ngOnInit() {
    this.selectedView.set('watched');
    void this.refreshMovies();
    void this.refreshQuizzs();
  }

  async refreshMovies() {
    this.isLoadingMovies.set(true);
    try {
      const baseMovies = await getAllBaseMovies();
      const movies = baseMovies.map(getFullMovie);
      this.adminMoviesList.set(movies);
      this.baseMoviesList.set(movies);
    } finally {
      this.isLoadingMovies.set(false);
    }
  }

  async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
  }

  onViewChange(view: MovieView) {
    this.selectedView.set(view);
    this.searchTerm.set('');
    if (view === 'actors') this.selectedSort.set('actor-count');
    else if (view === 'directors') this.selectedSort.set('director-count');
    else if (view === 'sagas') this.selectedSort.set('saga-count');
    else if (view === 'countries') this.selectedSort.set('country-count');
    else this.selectedSort.set('title'); // "Voir tout" and default
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  toggleSaga(saga: string) {
    this.collapsedSagas.update((c) => ({ ...c, [saga]: !c[saga] }));
  }

  isSagaCollapsed(saga: string): boolean {
    return Boolean(this.collapsedSagas()[saga]);
  }

  toggleActor(actor: string) {
    this.collapsedActors.update((c) => ({ ...c, [actor]: !c[actor] }));
  }

  isActorCollapsed(actor: string): boolean {
    return Boolean(this.collapsedActors()[actor]);
  }

  toggleDirector(director: string) {
    this.collapsedDirectors.update((c) => ({
      ...c,
      [director]: !c[director],
    }));
  }

  isDirectorCollapsed(director: string): boolean {
    return Boolean(this.collapsedDirectors()[director]);
  }

  toggleCountry(country: string) {
    this.collapsedCountries.update((c) => ({
      ...c,
      [country]: !c[country],
    }));
  }

  isCountryCollapsed(country: string): boolean {
    return Boolean(this.collapsedCountries()[country]);
  }

  openQuizzModal(quizzs: Quizz[]) {
    if (!quizzs?.length) return;
    this.activeQuizzs.set(quizzs);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal() {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
  }

  private matchesSearch(movie: Movie, term: string): boolean {
    const actors = movie.actors?.map((a) => a.name).join(' ') || '';
    const haystack = [
      movie.title,
      movie.director,
      actors,
      movie.genre,
      movie.saga,
      movie.countryOrigin ?? '',
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
}
