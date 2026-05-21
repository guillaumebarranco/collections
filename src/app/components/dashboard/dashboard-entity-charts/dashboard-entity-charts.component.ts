import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import {
  ViewToggleComponent,
  type ViewToggleOption,
} from '../../shared/view-toggle/view-toggle.component';
import {
  renderBooksReadChart,
  renderMoviesCinemaChart,
  renderMoviesWatchedChart,
  renderSeriesSeasonsViewedChart,
} from '../../../utils/graph.utils';
import { Movie } from '../../../models/movie-model';
import { Book } from '../../../models/book-model';
import { Serie } from '../../../models/serie-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { getAllMovies } from '../../../facades/movies/movies.facade';
import { getAllBooks } from '../../../facades/books/books.facade';
import { getAllSeries } from '../../../facades/series/series.facade';
import {
  getBookReadYearsForChart,
  getBookUndatedReadCountForChart,
} from '../../../utils/book-read-dates.utils';
import {
  getMovieSeenYearsForChart,
  getMovieUndatedSeenCountForChart,
} from '../../../utils/movie-seen-dates.utils';

export type EntityType =
  | 'books'
  | 'movies'
  | 'series'
  | 'games'
  | 'musics'
  | 'comics'
  | 'bds'
  | 'mangas'
  | 'manwhas';

const ENTITIES_WITH_CHARTS: EntityType[] = ['movies', 'books', 'series'];

@Component({
  selector: 'app-dashboard-entity-charts',
  standalone: true,
  imports: [CommonModule, ViewToggleComponent],
  templateUrl: './dashboard-entity-charts.component.html',
  styleUrls: ['./dashboard-entity-charts.component.scss'],
})
export class DashboardEntityChartsComponent implements OnInit, AfterViewInit {
  activatedRoute = inject(ActivatedRoute);

  /** Quand true : pas de titre ni d’onglets ; l’entité vient du parent (ex. vue Statistiques par entité). */
  readonly embedded = input(false);
  readonly parentSelectedEntity = input<EntityType | undefined>(undefined);

  selectedEntity = signal<EntityType>('books');

  /** Entité effective : pilotée par le parent en mode embarqué, sinon signal interne. */
  readonly effectiveEntity = computed<EntityType>(() => {
    if (this.embedded()) {
      return this.parentSelectedEntity() ?? 'movies';
    }
    return this.selectedEntity();
  });
  entities: EntityType[] = [
    'books',
    'movies',
    'series',
    'games',
    'musics',
    'comics',
    'bds',
    'mangas',
    'manwhas',
  ];

  entityTabOptions = computed<ViewToggleOption[]>(() =>
    this.entities.map((e) => ({ value: e, label: this.getEntityLabel(e) })),
  );

  moviesList = signal<{ [key: string]: Movie[] }>({});
  booksList = signal<{ [key: string]: Book[] }>({});
  seriesList = signal<{ [key: string]: Serie[] }>({});

  /** Inclure les relectures (lastReadDate + otherReadDates) dans le graphique livres. */
  showBookRereads = signal(true);

  /** Inclure les revisionnages (lastViewedDate + otherSeenDates) dans le graphique films. */
  showMovieRewatches = signal(true);

  @ViewChild('moviesWatchedChart')
  moviesWatchedChart?: ElementRef<HTMLDivElement>;

  @ViewChild('moviesCinemaChart')
  moviesCinemaChart?: ElementRef<HTMLDivElement>;

  @ViewChild('booksReadChart')
  booksReadChart?: ElementRef<HTMLDivElement>;

  @ViewChild('seriesSeasonsViewedChart')
  seriesSeasonsViewedChart?: ElementRef<HTMLDivElement>;

  currentYear = new Date().getFullYear();

  userId = computed<string>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  });

  allMovies = computed<Movie[]>(() => {
    return this.moviesList()[this.userId()] || [];
  });

  allBooks = computed<Book[]>(() => {
    return this.booksList()[this.userId()] || [];
  });

  allSeries = computed<Serie[]>(() => {
    return this.seriesList()[this.userId()] || [];
  });

  hasChartForEntity = (entity: EntityType): boolean =>
    ENTITIES_WITH_CHARTS.includes(entity);

  /** Films vus par an (tous, pas seulement au cinéma) */
  moviesWatchedByYear = computed(() => {
    const startYear = 2000;
    const endYear = this.currentYear;
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    );
    const counts = new Map<number, number>();
    years.forEach((year) => counts.set(year, 0));

    const includeRewatches = this.showMovieRewatches();
    const uniqueMovies = this.getUniqueMovies(this.allMovies());
    uniqueMovies.forEach((movie) => {
      getMovieSeenYearsForChart(movie, includeRewatches).forEach((year) => {
        if (year < startYear || year > endYear) {
          return;
        }
        counts.set(year, (counts.get(year) || 0) + 1);
      });
    });

    return years.map((year) => ({
      year,
      count: counts.get(year) || 0,
    }));
  });

  moviesWatchedTotal = computed(() => {
    return this.moviesWatchedByYear().reduce(
      (sum, item) => sum + item.count,
      0
    );
  });

  moviesUndatedSeenTotal = computed(() => {
    if (!this.showMovieRewatches()) {
      return 0;
    }
    return this.getUniqueMovies(this.allMovies()).reduce(
      (sum, movie) => sum + getMovieUndatedSeenCountForChart(movie),
      0
    );
  });

  moviesWatchedTotalFootnote = computed(() => {
    if (!this.showMovieRewatches()) {
      return '(sans compter les revisionnages)';
    }
    const undated = this.moviesUndatedSeenTotal();
    if (undated <= 0) {
      return '(avec revisionnages)';
    }
    const label =
      undated === 1 ? 'visionnage non daté' : 'visionnages non datés';
    return `(avec revisionnages) (sans compter les ${undated} ${label})`;
  });

  moviesCinemaByYear = computed(() => {
    const startYear = 2000;
    const endYear = this.currentYear;
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    );
    const counts = new Map<number, number>();
    years.forEach((year) => counts.set(year, 0));

    const uniqueMovies = this.getUniqueMovies(this.allMovies());
    uniqueMovies.forEach((movie) => {
      if (!movie.seenAtCinema) {
        return;
      }
      const year = this.getMovieViewedYear(movie);
      if (year === null || year < startYear || year > endYear) {
        return;
      }
      counts.set(year, (counts.get(year) || 0) + 1);
    });

    return years.map((year) => ({
      year,
      count: counts.get(year) || 0,
    }));
  });

  moviesCinemaTotal = computed(() => {
    return this.moviesCinemaByYear().reduce((sum, item) => sum + item.count, 0);
  });

  booksReadByYear = computed(() => {
    const startYear = 2000;
    const endYear = this.currentYear;
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    );
    const counts = new Map<number, number>();
    years.forEach((year) => counts.set(year, 0));

    const includeRereads = this.showBookRereads();
    const uniqueBooks = this.getUniqueBooks(this.allBooks());
    uniqueBooks.forEach((book) => {
      getBookReadYearsForChart(book, includeRereads).forEach((year) => {
        if (year < startYear || year > endYear) {
          return;
        }
        counts.set(year, (counts.get(year) || 0) + 1);
      });
    });

    return years.map((year) => ({
      year,
      count: counts.get(year) || 0,
    }));
  });

  booksReadTotal = computed(() => {
    return this.booksReadByYear().reduce((sum, item) => sum + item.count, 0);
  });

  booksUndatedReadsTotal = computed(() => {
    if (!this.showBookRereads()) {
      return 0;
    }
    return this.getUniqueBooks(this.allBooks()).reduce(
      (sum, book) => sum + getBookUndatedReadCountForChart(book),
      0
    );
  });

  booksReadTotalFootnote = computed(() => {
    if (!this.showBookRereads()) {
      return '(sans compter les relectures)';
    }
    const undated = this.booksUndatedReadsTotal();
    if (undated <= 0) {
      return '(avec relectures)';
    }
    const label =
      undated === 1 ? 'lecture non datée' : 'lectures non datées';
    return `(avec relectures) (sans compter les ${undated} ${label})`;
  });

  /** Saisons visionnées par an (basé sur lastViewedDate de chaque saison). */
  seriesSeasonsViewedByYear = computed(() => {
    const startYear = 2000;
    const endYear = this.currentYear;
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    );
    const counts = new Map<number, number>();
    years.forEach((year) => counts.set(year, 0));

    this.allSeries().forEach((serie) => {
      (serie.seasons || []).forEach((season) => {
        const dateStr = season.lastViewedDate;
        if (!dateStr) return;
        const year = new Date(dateStr).getFullYear();
        if (Number.isNaN(year) || year < startYear || year > endYear) return;
        counts.set(year, (counts.get(year) || 0) + 1);
      });
    });

    return years.map((year) => ({
      year,
      count: counts.get(year) || 0,
    }));
  });

  seriesSeasonsViewedTotal = computed(() => {
    return this.seriesSeasonsViewedByYear().reduce(
      (sum, item) => sum + item.count,
      0
    );
  });

  getEntityLabel(entity: EntityType): string {
    const labels: { [key in EntityType]: string } = {
      movies: '🎬 Films',
      series: '📺 Séries',
      books: '📖 Livres',
      games: '🎮 Jeux',
      musics: '🎵 Musiques',
      comics: '🦸 Comics',
      bds: '📗 BD',
      mangas: '📚 Mangas',
      manwhas: '📖 Manwhas',
    };
    return labels[entity];
  }

  selectEntity(entity: EntityType | string): void {
    if (this.embedded()) {
      return;
    }
    this.selectedEntity.set(entity as EntityType);
    requestAnimationFrame(() =>
      this.refreshChartsForEntity(this.effectiveEntity())
    );
  }

  onShowBookRereadsChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.showBookRereads.set(checked);
  }

  onShowMovieRewatchesChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.showMovieRewatches.set(checked);
  }

  constructor() {
    effect(() => {
      if (!this.embedded()) {
        return;
      }
      const entity = this.effectiveEntity();
      this.moviesWatchedByYear();
      this.moviesCinemaByYear();
      this.booksReadByYear();
      this.seriesSeasonsViewedByYear();
      untracked(() => {
        requestAnimationFrame(() => this.refreshChartsForEntity(entity));
      });
    });

    effect(() => {
      this.booksReadByYear();
      this.showBookRereads();
      if (this.effectiveEntity() !== 'books') {
        return;
      }
      untracked(() => {
        requestAnimationFrame(() => this.renderBooksReadChart());
      });
    });

    effect(() => {
      this.moviesWatchedByYear();
      this.showMovieRewatches();
      if (this.effectiveEntity() !== 'movies') {
        return;
      }
      untracked(() => {
        requestAnimationFrame(() => this.renderMoviesWatchedChart());
      });
    });
  }

  ngOnInit() {
    void this.loadMoviesData();
    void this.loadBooksData();
    void this.loadSeriesData();
  }

  ngAfterViewInit() {
    requestAnimationFrame(() =>
      this.refreshChartsForEntity(this.effectiveEntity())
    );
  }

  private async loadMoviesData() {
    const uid = this.userId();
    const movies = await getAllMovies(uid);
    this.moviesList.set(movies);
    if (this.effectiveEntity() === 'movies') {
      requestAnimationFrame(() => {
        this.renderMoviesWatchedChart();
        this.renderMoviesCinemaChart();
      });
    }
  }

  private async loadBooksData() {
    const uid = this.userId();
    const books = await getAllBooks(uid);
    this.booksList.set(books);
    if (this.effectiveEntity() === 'books') {
      requestAnimationFrame(() => this.renderBooksReadChart());
    }
  }

  private async loadSeriesData() {
    const uid = this.userId();
    const series = await getAllSeries(uid);
    this.seriesList.set(series);
    if (this.effectiveEntity() === 'series') {
      requestAnimationFrame(() => this.renderSeriesSeasonsViewedChart());
    }
  }

  private refreshChartsForEntity(entity: EntityType): void {
    if (entity === 'movies') {
      this.renderMoviesWatchedChart();
      this.renderMoviesCinemaChart();
    } else if (entity === 'books') {
      this.renderBooksReadChart();
    } else if (entity === 'series') {
      this.renderSeriesSeasonsViewedChart();
    }
  }

  private getUniqueMovies(movies: Movie[]): Movie[] {
    return Array.from(
      new Set(movies.map((m) => `${m.title}|${m.director}`))
    ).map((key) => {
      const [title, director] = key.split('|');
      return movies.find((m) => m.title === title && m.director === director)!;
    });
  }

  private getUniqueBooks(books: Book[]): Book[] {
    return Array.from(new Set(books.map((b) => `${b.title}|${b.author}`))).map(
      (key) => {
        const [title, author] = key.split('|');
        return books.find((b) => b.title === title && b.author === author)!;
      }
    );
  }

  private getMovieViewedYear(movie: Movie): number | null {
    const dateValue = movie.firstViewedDate || movie.lastViewedDate;
    if (!dateValue) {
      return null;
    }
    const year = new Date(dateValue).getFullYear();
    if (Number.isNaN(year)) {
      return null;
    }
    return year;
  }

  private renderMoviesWatchedChart(): void {
    if (this.effectiveEntity() !== 'movies') {
      return;
    }
    const container = this.moviesWatchedChart?.nativeElement;
    renderMoviesWatchedChart(
      container,
      this.moviesWatchedTotal(),
      this.moviesWatchedByYear()
    );
  }

  private renderMoviesCinemaChart(): void {
    if (this.effectiveEntity() !== 'movies') {
      return;
    }
    const container = this.moviesCinemaChart?.nativeElement;
    renderMoviesCinemaChart(
      container,
      this.moviesCinemaTotal(),
      this.moviesCinemaByYear()
    );
  }

  private renderBooksReadChart(): void {
    if (this.effectiveEntity() !== 'books') {
      return;
    }
    const container = this.booksReadChart?.nativeElement;
    renderBooksReadChart(
      container,
      this.booksReadTotal(),
      this.booksReadByYear()
    );
  }

  private renderSeriesSeasonsViewedChart(): void {
    if (this.effectiveEntity() !== 'series') {
      return;
    }
    const container = this.seriesSeasonsViewedChart?.nativeElement;
    renderSeriesSeasonsViewedChart(
      container,
      this.seriesSeasonsViewedTotal(),
      this.seriesSeasonsViewedByYear()
    );
  }
}
