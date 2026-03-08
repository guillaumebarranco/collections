import {
  Component,
  computed,
  inject,
  signal,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
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
  imports: [CommonModule],
  templateUrl: './dashboard-entity-charts.component.html',
  styleUrls: ['./dashboard-entity-charts.component.scss'],
})
export class DashboardEntityChartsComponent implements OnInit, AfterViewInit {
  activatedRoute = inject(ActivatedRoute);

  selectedEntity = signal<EntityType>('books');
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

  moviesList = signal<{ [key: string]: Movie[] }>({});
  booksList = signal<{ [key: string]: Book[] }>({});
  seriesList = signal<{ [key: string]: Serie[] }>({});

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

    const uniqueMovies = this.getUniqueMovies(this.allMovies());
    uniqueMovies.forEach((movie) => {
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

  moviesWatchedTotal = computed(() => {
    return this.moviesWatchedByYear().reduce(
      (sum, item) => sum + item.count,
      0
    );
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

    const uniqueBooks = this.getUniqueBooks(this.allBooks());
    uniqueBooks.forEach((book) => {
      const year = this.getBookReadYear(book);
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

  booksReadTotal = computed(() => {
    return this.booksReadByYear().reduce((sum, item) => sum + item.count, 0);
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

  selectEntity(entity: EntityType): void {
    this.selectedEntity.set(entity);
    if (entity === 'movies') {
      requestAnimationFrame(() => {
        this.renderMoviesWatchedChart();
        this.renderMoviesCinemaChart();
      });
    }
    if (entity === 'books') {
      requestAnimationFrame(() => this.renderBooksReadChart());
    }
    if (entity === 'series') {
      requestAnimationFrame(() => this.renderSeriesSeasonsViewedChart());
    }
  }

  ngOnInit() {
    void this.loadMoviesData();
    void this.loadBooksData();
    void this.loadSeriesData();
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.renderMoviesWatchedChart();
      this.renderMoviesCinemaChart();
    });
    requestAnimationFrame(() => this.renderBooksReadChart());
    requestAnimationFrame(() => this.renderSeriesSeasonsViewedChart());
  }

  private async loadMoviesData() {
    const uid = this.userId();
    const movies = await getAllMovies(uid);
    this.moviesList.set(movies);
    if (this.selectedEntity() === 'movies') {
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
    if (this.selectedEntity() === 'books') {
      requestAnimationFrame(() => this.renderBooksReadChart());
    }
  }

  private async loadSeriesData() {
    const uid = this.userId();
    const series = await getAllSeries(uid);
    this.seriesList.set(series);
    if (this.selectedEntity() === 'series') {
      requestAnimationFrame(() => this.renderSeriesSeasonsViewedChart());
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

  private getBookReadYear(book: Book): number | null {
    const dateStr = book.lastReadDate || book.firstReadDate;
    if (!dateStr) {
      return null;
    }
    const year = new Date(dateStr).getFullYear();
    if (Number.isNaN(year)) {
      return null;
    }
    return year;
  }

  private renderMoviesWatchedChart(): void {
    if (this.selectedEntity() !== 'movies') {
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
    if (this.selectedEntity() !== 'movies') {
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
    if (this.selectedEntity() !== 'books') {
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
    if (this.selectedEntity() !== 'series') {
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
