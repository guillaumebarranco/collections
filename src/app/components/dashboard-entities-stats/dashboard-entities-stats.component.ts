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
} from '../../utils/graph.utils';
import { Movie } from '../../models/movie-model';
import { Serie } from '../../models/serie-model';
import { Book } from '../../models/book-model';
import { Game } from '../../models/game-model';
import { Music } from '../../models/music-model';
import { Comic } from '../../models/comic-model';
import { Bd } from '../../models/bd-model';
import { Manga } from '../../models/manga-model';
import { Manwha } from '../../models/manwha-model';
import { getAllMovies } from '../../facades/movies/movies.facade';
import { getAllSeries } from '../../facades/series/series.facade';
import { getAllBooks } from '../../facades/books/books.facade';
import { getAllGames } from '../../facades/games/games.facade';
import { getAllMusics } from '../../facades/musics/musics.facade';
import { getAllComics } from '../../facades/comics/comics.facade';
import { getAllBds } from '../../facades/bds/bds.facade';
import { getAllMangas } from '../../facades/mangas/mangas.facade';
import { getAllManwhas } from '../../facades/manwhas/manwhas.facade';

export type EntityType =
  | 'movies'
  | 'series'
  | 'books'
  | 'games'
  | 'musics'
  | 'comics'
  | 'bds'
  | 'mangas'
  | 'manwhas';

interface TopStat {
  name: string;
  count: number;
}

interface EntityStats {
  topActors?: TopStat[];
  topDirectors?: TopStat[];
  topGenres?: TopStat[];
  topAuthors?: TopStat[];
  topSagas?: TopStat[];
  topEditors?: TopStat[];
  topPlatforms?: TopStat[];
  topArtists?: TopStat[];
}

@Component({
  selector: 'app-dashboard-entities-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-entities-stats.component.html',
  styleUrls: ['./dashboard-entities-stats.component.scss'],
})
export class DashboardEntitiesStatsComponent implements OnInit, AfterViewInit {
  activatedRoute = inject(ActivatedRoute);

  selectedEntity = signal<EntityType>('movies');
  entities: EntityType[] = [
    'movies',
    'series',
    'books',
    'games',
    'musics',
    'comics',
    'bds',
    'mangas',
    'manwhas',
  ];

  moviesList = signal<{ [key: string]: Movie[] }>({});
  seriesList = signal<{ [key: string]: Serie[] }>({});
  booksList = signal<{ [key: string]: Book[] }>({});
  gamesList = signal<{ [key: string]: Game[] }>({});
  musicsList = signal<{ [key: string]: Music[] }>({});
  comicsList = signal<{ [key: string]: Comic[] }>({});
  bdsList = signal<{ [key: string]: Bd[] }>({});
  mangasList = signal<{ [key: string]: Manga[] }>({});
  manwhasList = signal<{ [key: string]: Manwha[] }>({});

  @ViewChild('moviesWatchedChart')
  moviesWatchedChart?: ElementRef<HTMLDivElement>;

  @ViewChild('moviesCinemaChart')
  moviesCinemaChart?: ElementRef<HTMLDivElement>;

  @ViewChild('booksReadChart')
  booksReadChart?: ElementRef<HTMLDivElement>;

  currentYear = new Date().getFullYear();

  userId = computed<string>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'];
  });

  allMovies = computed<Movie[]>(() => {
    return this.moviesList()[this.userId()] || [];
  });

  allSeries = computed<Serie[]>(() => {
    return this.seriesList()[this.userId()] || [];
  });

  allBooks = computed<Book[]>(() => {
    return this.booksList()[this.userId()] || [];
  });

  allGames = computed<Game[]>(() => {
    return this.gamesList()[this.userId()] || [];
  });

  allMusics = computed<Music[]>(() => {
    return this.musicsList()[this.userId()] || [];
  });

  allComics = computed<Comic[]>(() => {
    return this.comicsList()[this.userId()] || [];
  });

  allBds = computed<Bd[]>(() => {
    return this.bdsList()[this.userId()] || [];
  });

  allMangas = computed<Manga[]>(() => {
    return this.mangasList()[this.userId()] || [];
  });

  allManwhas = computed<Manwha[]>(() => {
    return this.manwhasList()[this.userId()] || [];
  });

  stats = computed<EntityStats>(() => {
    const entity = this.selectedEntity();

    switch (entity) {
      case 'movies':
        return this.getMoviesStats();
      case 'series':
        return this.getSeriesStats();
      case 'books':
        return this.getBooksStats();
      case 'games':
        return this.getGamesStats();
      case 'musics':
        return this.getMusicsStats();
      case 'comics':
        return this.getComicsStats();
      case 'bds':
        return this.getBdsStats();
      case 'mangas':
        return this.getMangasStats();
      case 'manwhas':
        return this.getManwhasStats();
      default:
        return {};
    }
  });

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
    return this.moviesWatchedByYear().reduce((sum, item) => sum + item.count, 0);
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

  private getMoviesStats(): EntityStats {
    const uniqueMovies = this.getUniqueMovies(this.allMovies());

    // Acteurs les plus représentés
    const actorsCount: { [key: string]: number } = {};
    uniqueMovies.forEach((movie) => {
      movie.actors?.forEach((actor) => {
        if (actor.name && actor.name !== 'Inconnu') {
          actorsCount[actor.name] = (actorsCount[actor.name] || 0) + 1;
        }
      });
    });

    // Réalisateurs les plus représentés
    const directorsCount: { [key: string]: number } = {};
    uniqueMovies.forEach((movie) => {
      if (movie.director) {
        directorsCount[movie.director] =
          (directorsCount[movie.director] || 0) + 1;
      }
    });

    // Genres les plus représentés
    const genresCount: { [key: string]: number } = {};
    uniqueMovies.forEach((movie) => {
      if (movie.genre) {
        const genres = movie.genre.split(',').map((g) => g.trim());
        genres.forEach((genre) => {
          genresCount[genre] = (genresCount[genre] || 0) + 1;
        });
      }
    });

    // Sagas les plus vues
    const sagasCount: { [key: string]: number } = {};
    uniqueMovies.forEach((movie) => {
      if (movie.saga && movie.saga !== '') {
        const timesWatched = Math.max(0, movie.timesWatched ?? 0);
        if (timesWatched > 0) {
          sagasCount[movie.saga] =
            (sagasCount[movie.saga] || 0) + timesWatched;
        }
      }
    });

    return {
      topActors: this.sortAndLimit(actorsCount, 10),
      topDirectors: this.sortAndLimit(directorsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
      topSagas: this.sortAndLimit(sagasCount, 10),
    };
  }

  private getSeriesStats(): EntityStats {
    const series = this.allSeries();
    const uniqueSeries = Array.from(
      new Set(series.map((s) => `${s.title}|${s.director}`))
    ).map((key) => {
      const [title, director] = key.split('|');
      return series.find((s) => s.title === title && s.director === director)!;
    });

    // Acteurs les plus représentés
    const actorsCount: { [key: string]: number } = {};
    uniqueSeries.forEach((serie) => {
      serie.actors?.forEach((actor) => {
        if (actor.name && actor.name !== 'Inconnu') {
          actorsCount[actor.name] = (actorsCount[actor.name] || 0) + 1;
        }
      });
    });

    // Réalisateurs les plus représentés
    const directorsCount: { [key: string]: number } = {};
    uniqueSeries.forEach((serie) => {
      if (serie.director) {
        directorsCount[serie.director] =
          (directorsCount[serie.director] || 0) + 1;
      }
    });

    // Genres les plus représentés
    const genresCount: { [key: string]: number } = {};
    uniqueSeries.forEach((serie) => {
      if (serie.genre) {
        genresCount[serie.genre] = (genresCount[serie.genre] || 0) + 1;
      }
    });

    return {
      topActors: this.sortAndLimit(actorsCount, 10),
      topDirectors: this.sortAndLimit(directorsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private getBooksStats(): EntityStats {
    const books = this.allBooks();
    const uniqueBooks = Array.from(
      new Set(books.map((b) => `${b.title}|${b.author}`))
    ).map((key) => {
      const [title, author] = key.split('|');
      return books.find((b) => b.title === title && b.author === author)!;
    });

    // Auteurs les plus lus
    const authorsCount: { [key: string]: number } = {};
    uniqueBooks.forEach((book) => {
      if (book.author) {
        authorsCount[book.author] = (authorsCount[book.author] || 0) + 1;
      }
    });

    // Genres les plus représentés
    const genresCount: { [key: string]: number } = {};
    uniqueBooks.forEach((book) => {
      if (book.genre) {
        genresCount[book.genre] = (genresCount[book.genre] || 0) + 1;
      }
    });

    // Sagas les plus représentées
    const sagasCount: { [key: string]: number } = {};
    uniqueBooks.forEach((book) => {
      if (book.saga && book.saga !== '') {
        sagasCount[book.saga] = (sagasCount[book.saga] || 0) + 1;
      }
    });

    return {
      topAuthors: this.sortAndLimit(authorsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
      topSagas: this.sortAndLimit(sagasCount, 10),
    };
  }

  private getGamesStats(): EntityStats {
    const games = this.allGames();
    const uniqueGames = Array.from(
      new Set(games.map((g) => `${g.title}|${g.editor}`))
    ).map((key) => {
      const [title, editor] = key.split('|');
      return games.find((g) => g.title === title && g.editor === editor)!;
    });

    // Éditeurs les plus représentés
    const editorsCount: { [key: string]: number } = {};
    uniqueGames.forEach((game) => {
      if (game.editor) {
        editorsCount[game.editor] = (editorsCount[game.editor] || 0) + 1;
      }
    });

    // Plateformes les plus représentées
    const platformsCount: { [key: string]: number } = {};
    uniqueGames.forEach((game) => {
      if (game.platform) {
        platformsCount[game.platform] =
          (platformsCount[game.platform] || 0) + 1;
      }
    });

    // Sagas les plus représentées
    const sagasCount: { [key: string]: number } = {};
    uniqueGames.forEach((game) => {
      if (game.saga && game.saga !== '') {
        sagasCount[game.saga] = (sagasCount[game.saga] || 0) + 1;
      }
    });

    return {
      topEditors: this.sortAndLimit(editorsCount, 10),
      topPlatforms: this.sortAndLimit(platformsCount, 10),
      topSagas: this.sortAndLimit(sagasCount, 10),
    };
  }

  private getMusicsStats(): EntityStats {
    const musics = this.allMusics();
    const uniqueMusics = Array.from(
      new Set(musics.map((m) => `${m.title}|${m.artist}`))
    ).map((key) => {
      const [title, artist] = key.split('|');
      return musics.find((m) => m.title === title && m.artist === artist)!;
    });

    // Artistes les plus écoutés
    const artistsCount: { [key: string]: number } = {};
    uniqueMusics.forEach((music) => {
      if (music.artist) {
        artistsCount[music.artist] = (artistsCount[music.artist] || 0) + 1;
      }
    });

    // Genres les plus représentés
    const genresCount: { [key: string]: number } = {};
    uniqueMusics.forEach((music) => {
      if (music.genre) {
        genresCount[music.genre] = (genresCount[music.genre] || 0) + 1;
      }
    });

    return {
      topArtists: this.sortAndLimit(artistsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private getComicsStats(): EntityStats {
    const comics = this.allComics();
    const uniqueComics = Array.from(
      new Set(comics.map((c) => `${c.title}|${c.writer}`))
    ).map((key) => {
      const [title, writer] = key.split('|');
      return comics.find((c) => c.title === title && c.writer === writer)!;
    });

    const writersCount: { [key: string]: number } = {};
    uniqueComics.forEach((comic) => {
      if (comic.writer) {
        writersCount[comic.writer] = (writersCount[comic.writer] || 0) + 1;
      }
    });

    const genresCount: { [key: string]: number } = {};
    uniqueComics.forEach((comic) => {
      if (comic.genre) {
        genresCount[comic.genre] = (genresCount[comic.genre] || 0) + 1;
      }
    });

    return {
      topAuthors: this.sortAndLimit(writersCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private getBdsStats(): EntityStats {
    const bds = this.allBds();
    const uniqueBds = Array.from(
      new Set(bds.map((b) => `${b.title}|${b.writer}`))
    ).map((key) => {
      const [title, writer] = key.split('|');
      return bds.find((b) => b.title === title && b.writer === writer)!;
    });

    const writersCount: { [key: string]: number } = {};
    uniqueBds.forEach((bd) => {
      if (bd.writer) {
        writersCount[bd.writer] = (writersCount[bd.writer] || 0) + 1;
      }
    });

    const genresCount: { [key: string]: number } = {};
    uniqueBds.forEach((bd) => {
      if (bd.genre) {
        genresCount[bd.genre] = (genresCount[bd.genre] || 0) + 1;
      }
    });

    return {
      topAuthors: this.sortAndLimit(writersCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private getMangasStats(): EntityStats {
    const mangas = this.allMangas();
    const uniqueMangas = Array.from(
      new Set(mangas.map((m) => `${m.title}|${m.author}`))
    ).map((key) => {
      const [title, author] = key.split('|');
      return mangas.find((m) => m.title === title && m.author === author)!;
    });

    const authorsCount: { [key: string]: number } = {};
    uniqueMangas.forEach((manga) => {
      if (manga.author) {
        authorsCount[manga.author] = (authorsCount[manga.author] || 0) + 1;
      }
    });

    const genresCount: { [key: string]: number } = {};
    uniqueMangas.forEach((manga) => {
      if (manga.genre) {
        genresCount[manga.genre] = (genresCount[manga.genre] || 0) + 1;
      }
    });

    return {
      topAuthors: this.sortAndLimit(authorsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private getManwhasStats(): EntityStats {
    const manwhas = this.allManwhas();
    const uniqueManwhas = Array.from(
      new Set(manwhas.map((m) => `${m.title}|${m.author}`))
    ).map((key) => {
      const [title, author] = key.split('|');
      return manwhas.find((m) => m.title === title && m.author === author)!;
    });

    const authorsCount: { [key: string]: number } = {};
    uniqueManwhas.forEach((manwha) => {
      if (manwha.author) {
        authorsCount[manwha.author] = (authorsCount[manwha.author] || 0) + 1;
      }
    });

    const genresCount: { [key: string]: number } = {};
    uniqueManwhas.forEach((manwha) => {
      if (manwha.genre) {
        genresCount[manwha.genre] = (genresCount[manwha.genre] || 0) + 1;
      }
    });

    return {
      topAuthors: this.sortAndLimit(authorsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private sortAndLimit(
    counts: { [key: string]: number },
    limit: number
  ): TopStat[] {
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
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
  }

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

  getStatsLabel(key: keyof EntityStats): string {
    const labels: { [key in keyof EntityStats]: string } = {
      topActors: 'Acteurs les plus représentés',
      topDirectors: 'Réalisateurs les plus représentés',
      topGenres: 'Genres les plus représentés',
      topAuthors: 'Auteurs les plus lus',
      topSagas: 'Sagas les plus représentées',
      topEditors: 'Éditeurs les plus représentés',
      topPlatforms: 'Plateformes les plus représentées',
      topArtists: 'Artistes les plus écoutés',
    };
    if (key === 'topSagas' && this.selectedEntity() === 'movies') {
      return 'Sagas les plus vues';
    }
    return labels[key] || key;
  }

  ngOnInit() {
    void this.loadGamesData();
    void this.loadMoviesData();
    void this.loadBooksData();
    void this.loadSeriesData();
    void this.loadMusicsData();
    void this.loadComicsData();
    void this.loadBdsData();
    void this.loadMangasData();
    void this.loadManwhasData();
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.renderMoviesWatchedChart();
      this.renderMoviesCinemaChart();
    });
    requestAnimationFrame(() => this.renderBooksReadChart());
  }

  private async loadMoviesData() {
    const userId = this.userId() || 'guillaume';
    const movies = await getAllMovies(userId);
    this.moviesList.set(movies);
    if (this.selectedEntity() === 'movies') {
      requestAnimationFrame(() => {
        this.renderMoviesWatchedChart();
        this.renderMoviesCinemaChart();
      });
    }
  }

  private async loadBooksData() {
    const userId = this.userId() || 'guillaume';
    const books = await getAllBooks(userId);
    this.booksList.set(books);
    if (this.selectedEntity() === 'books') {
      requestAnimationFrame(() => this.renderBooksReadChart());
    }
  }

  private async loadSeriesData() {
    const userId = this.userId() || 'guillaume';
    const series = await getAllSeries(userId);
    this.seriesList.set(series);
  }

  private async loadGamesData() {
    const userId = this.userId() || 'guillaume';
    const games = await getAllGames(userId);
    this.gamesList.set(games);
  }

  private async loadMusicsData() {
    const userId = this.userId() || 'guillaume';
    const musics = await getAllMusics(userId);
    this.musicsList.set(musics);
  }

  private async loadComicsData() {
    const userId = this.userId() || 'guillaume';
    const comics = await getAllComics(userId);
    this.comicsList.set(comics);
  }

  private async loadBdsData() {
    const userId = this.userId() || 'guillaume';
    const bds = await getAllBds(userId);
    this.bdsList.set(bds);
  }

  private async loadMangasData() {
    const userId = this.userId() || 'guillaume';
    const mangas = await getAllMangas(userId);
    this.mangasList.set(mangas);
  }

  private async loadManwhasData() {
    const userId = this.userId() || 'guillaume';
    const manwhas = await getAllManwhas(userId);
    this.manwhasList.set(manwhas);
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
    if (!book.readDate) {
      return null;
    }
    const year = new Date(book.readDate).getFullYear();
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
}
