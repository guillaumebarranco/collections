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

import {
  getMovieCountryOriginLabels,
  Movie,
} from '../../../models/movie-model';

import { getAllBaseMovies } from '../../../facades/movies/movies.facade';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

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
import { LoaderComponent } from '../../../components/shared/loader/loader.component';

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

  private matchesSearch(movie: Movie, term: string): boolean {
    const actors = movie.actors?.map((a) => a.name).join(' ') || '';
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
      ...getMovieCountryOriginLabels(movie),
    ]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }
}
