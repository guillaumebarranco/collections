import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { ViewToggleComponent } from '../../components/shared/view-toggle/view-toggle.component';
import { BdComponent } from '../../components/collections/bd/bd.component';
import { BookComponent } from '../../components/collections/book/book.component';
import { ComicComponent } from '../../components/collections/comic/comic.component';
import { GameComponent } from '../../components/collections/game/game.component';
import { MovieComponent } from '../../components/collections/movie/movie.component';
import { SerieComponent } from '../../components/collections/serie/serie.component';
import { getAllBaseBds } from '../../facades/bds/bds.facade';
import { getAllBaseBooks } from '../../facades/books/books.facade';
import { getAllBaseComics } from '../../facades/comics/comics.facade';
import { getAllBaseGames } from '../../facades/games/games.facade';
import { getAllBaseMovies } from '../../facades/movies/movies.facade';
import { getAllBaseSeries } from '../../facades/series/series.facade';
import {
  getFullBd,
  getFullBook,
  getFullComic,
  getFullGame,
  getFullMovie,
  getFullSerie,
} from '../../helpers/full-entities-helper';
import { BaseBd } from '../../models/bd-model';
import { BaseBook } from '../../models/book-model';
import { BaseComic } from '../../models/comic-model';
import { BaseGame } from '../../models/game-model';
import { BaseMovie } from '../../models/movie-model';
import { BaseSerie } from '../../models/serie-model';
import { Bd } from '../../models/bd-model';
import { Book } from '../../models/book-model';
import { Comic } from '../../models/comic-model';
import { Game } from '../../models/game-model';
import { Movie } from '../../models/movie-model';
import { Serie } from '../../models/serie-model';

export type MixView =
  | 'sagasFilmsSeries'
  | 'booksAdapted'
  | 'moviesFromBooks'
  | 'moviesFromGames'
  | 'gamesAdapted'
  | 'moviesFromComics'
  | 'comicsAdapted'
  | 'moviesFromComicBooks'
  | 'comicBooksAdapted';

export const mixViewOptions: { value: MixView; label: string }[] = [
  { value: 'sagasFilmsSeries', label: 'Sagas films / séries' },
  { value: 'booksAdapted', label: 'Livres adaptés en films' },
  { value: 'moviesFromBooks', label: 'Films provenant de livres' },
  { value: 'moviesFromGames', label: 'Films adaptés de jeux' },
  { value: 'gamesAdapted', label: 'Jeux adaptés en films' },
  { value: 'moviesFromComics', label: 'Films adaptés de BD' },
  { value: 'comicsAdapted', label: 'BD adaptées en films' },
  { value: 'moviesFromComicBooks', label: 'Films adaptés de comics' },
  { value: 'comicBooksAdapted', label: 'Comics adaptés en films' },
];

export type BookWithAdaptations = {
  book: Book;
  movies: Movie[];
};

export type GameWithAdaptations = {
  game: Game;
  movies: Movie[];
};

export type BdWithAdaptations = {
  bd: Bd;
  movies: Movie[];
};

export type ComicWithAdaptations = {
  comic: Comic;
  movies: Movie[];
};

export type MoviesBySource = {
  sourceKey: string;
  sourceLabel: string;
  movies: Movie[];
};

export type SagaFilmsSeries = {
  sagaName: string;
  sagaKey: string;
  movies: Movie[];
  series: Serie[];
};

@Component({
  selector: 'app-mix',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ViewToggleComponent,
    BdComponent,
    BookComponent,
    ComicComponent,
    MovieComponent,
    GameComponent,
    SerieComponent,
  ],
  templateUrl: './mix.component.html',
  styleUrls: ['./mix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixComponent implements OnInit {
  readonly baseBooks = signal<BaseBook[]>([]);
  readonly baseBds = signal<BaseBd[]>([]);
  readonly baseComics = signal<BaseComic[]>([]);
  readonly baseGames = signal<BaseGame[]>([]);
  readonly baseMovies = signal<BaseMovie[]>([]);
  readonly baseSeries = signal<BaseSerie[]>([]);
  readonly selectedView = signal<MixView>('booksAdapted');
  readonly isLoading = signal<boolean>(true);

  readonly viewOptions = mixViewOptions;

  /** Sagas présentes à la fois dans les films et les séries (ex. Marvel Cinematic Universe). */
  readonly sagasFilmsSeries = computed<SagaFilmsSeries[]>(() => {
    const movies = this.baseMovies().map((m) => getFullMovie(m));
    const series = this.baseSeries().map((s) => getFullSerie(s));
    const movieSagaKeys = new Map<string, string>();
    for (const m of movies) {
      const trimmed = m.saga?.trim() ?? '';
      if (trimmed && !movieSagaKeys.has(trimmed.toLowerCase())) {
        movieSagaKeys.set(trimmed.toLowerCase(), trimmed);
      }
    }
    const seriesSagaKeys = new Set<string>();
    for (const s of series) {
      const trimmed = (s.saga?.trim() ?? '').toLowerCase();
      if (trimmed) seriesSagaKeys.add(trimmed);
    }
    const commonKeys = new Set<string>();
    for (const key of movieSagaKeys.keys()) {
      if (seriesSagaKeys.has(key)) commonKeys.add(key);
    }
    const result: SagaFilmsSeries[] = [];
    for (const key of commonKeys) {
      const displayName = movieSagaKeys.get(key) ?? key;
      const sagaMovies = movies.filter(
        (m) => (m.saga?.trim() ?? '').toLowerCase() === key
      );
      const sagaSeries = series.filter(
        (s) => (s.saga?.trim() ?? '').toLowerCase() === key
      );
      result.push({
        sagaName: displayName,
        sagaKey: key,
        movies: sagaMovies,
        series: sagaSeries,
      });
    }
    return result.sort((a, b) => {
      const totalA = a.movies.length + a.series.length;
      const totalB = b.movies.length + b.series.length;
      return totalB - totalA; // ordre décroissant : plus d'éléments en premier
    });
  });

  /** Livres ayant au moins une adaptation film : livre + liste de films. */
  readonly booksAdapted = computed<BookWithAdaptations[]>(() => {
    const books = this.baseBooks();
    const movies = this.baseMovies();
    const withFromEntityBook = movies.filter(
      (m) => m.fromEntity != null && m.fromEntity.entityType === 'book'
    );
    const result: BookWithAdaptations[] = [];
    for (const baseBook of books) {
      const adaptations = withFromEntityBook.filter(
        (m) =>
          m.fromEntity!.title === baseBook.title &&
          m.fromEntity!.secondEntityKey === baseBook.author
      );
      if (adaptations.length > 0) {
        result.push({
          book: getFullBook(baseBook),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  /** Films ayant un livre source. */
  readonly moviesFromBooks = computed<Movie[]>(() => {
    const movies = this.baseMovies();
    return movies
      .filter((m) => m.fromEntity != null && m.fromEntity.entityType === 'book')
      .map((m) => getFullMovie(m));
  });

  /** Films provenant de livres, groupés par œuvre source (titre — auteur). */
  readonly moviesFromBooksBySource = computed<MoviesBySource[]>(() => {
    const list = this.moviesFromBooks();
    const map = new Map<string, Movie[]>();
    for (const m of list) {
      if (!m.fromEntity) continue;
      const key = m.fromEntity.title + '|' + m.fromEntity.secondEntityKey;
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([sourceKey, movies]) => ({
      sourceKey,
      sourceLabel:
        (movies[0]?.fromEntity?.title ?? '') +
        ' — ' +
        (movies[0]?.fromEntity?.secondEntityKey ?? ''),
      movies,
    }));
  });

  /** Films ayant un jeu source. */
  readonly moviesFromGames = computed<Movie[]>(() => {
    const movies = this.baseMovies();
    return movies
      .filter((m) => m.fromEntity != null && m.fromEntity.entityType === 'game')
      .map((m) => getFullMovie(m));
  });

  /** Films adaptés de jeux, groupés par jeu source (titre — éditeur). */
  readonly moviesFromGamesBySource = computed<MoviesBySource[]>(() => {
    const list = this.moviesFromGames();
    const map = new Map<string, Movie[]>();
    for (const m of list) {
      if (!m.fromEntity) continue;
      const key = m.fromEntity.title + '|' + m.fromEntity.secondEntityKey;
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([sourceKey, movies]) => ({
      sourceKey,
      sourceLabel:
        (movies[0]?.fromEntity?.title ?? '') +
        ' — ' +
        (movies[0]?.fromEntity?.secondEntityKey ?? ''),
      movies,
    }));
  });

  /** Jeux ayant au moins une adaptation film : jeu + liste de films. */
  readonly gamesAdapted = computed<GameWithAdaptations[]>(() => {
    const games = this.baseGames();
    const movies = this.baseMovies();
    const withFromEntityGame = movies.filter(
      (m) => m.fromEntity != null && m.fromEntity.entityType === 'game'
    );
    const result: GameWithAdaptations[] = [];
    for (const baseGame of games) {
      const adaptations = withFromEntityGame.filter(
        (m) =>
          m.fromEntity!.title === baseGame.title &&
          m.fromEntity!.secondEntityKey === baseGame.editor
      );
      if (adaptations.length > 0) {
        result.push({
          game: getFullGame(baseGame),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  /** Films ayant une BD source. */
  readonly moviesFromComics = computed<Movie[]>(() => {
    const movies = this.baseMovies();
    return movies
      .filter(
        (m) => m.fromEntity != null && m.fromEntity.entityType === 'comic'
      )
      .map((m) => getFullMovie(m));
  });

  /** Films adaptés de BD, groupés par BD source (titre — scénariste). */
  readonly moviesFromComicsBySource = computed<MoviesBySource[]>(() => {
    const list = this.moviesFromComics();
    const map = new Map<string, Movie[]>();
    for (const m of list) {
      if (!m.fromEntity) continue;
      const key = m.fromEntity.title + '|' + m.fromEntity.secondEntityKey;
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([sourceKey, movies]) => ({
      sourceKey,
      sourceLabel:
        (movies[0]?.fromEntity?.title ?? '') +
        ' — ' +
        (movies[0]?.fromEntity?.secondEntityKey ?? ''),
      movies,
    }));
  });

  /** BD ayant au moins une adaptation film : BD + liste de films. */
  readonly bdsAdapted = computed<BdWithAdaptations[]>(() => {
    const bds = this.baseBds();
    const movies = this.baseMovies();
    const withFromEntityComic = movies.filter(
      (m) => m.fromEntity != null && m.fromEntity.entityType === 'comic'
    );
    const result: BdWithAdaptations[] = [];
    for (const baseBd of bds) {
      const adaptations = withFromEntityComic.filter(
        (m) =>
          m.fromEntity!.title === baseBd.title &&
          m.fromEntity!.secondEntityKey === baseBd.writer
      );
      if (adaptations.length > 0) {
        result.push({
          bd: getFullBd(baseBd),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  /** Films adaptés de comics (base_comics), groupés par source. */
  readonly moviesFromComicBooksBySource = computed<MoviesBySource[]>(() => {
    const groups = this.moviesFromComicsBySource();
    const comicKeys = new Set(
      this.baseComics().map((c) => c.title + '|' + c.writer)
    );
    return groups.filter((g) => comicKeys.has(g.sourceKey));
  });

  /** Comics (base_comics) ayant au moins une adaptation film. */
  readonly comicBooksAdapted = computed<ComicWithAdaptations[]>(() => {
    const comics = this.baseComics();
    const movies = this.baseMovies();
    const withFromEntityComic = movies.filter(
      (m) => m.fromEntity != null && m.fromEntity.entityType === 'comic'
    );
    const result: ComicWithAdaptations[] = [];
    for (const baseComic of comics) {
      const adaptations = withFromEntityComic.filter(
        (m) =>
          m.fromEntity!.title === baseComic.title &&
          m.fromEntity!.secondEntityKey === baseComic.writer
      );
      if (adaptations.length > 0) {
        result.push({
          comic: getFullComic(baseComic),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly collapsedSections = signal<Record<string, boolean>>({});

  toggleSection(key: string): void {
    this.collapsedSections.update((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  isSectionCollapsed(key: string): boolean {
    return Boolean(this.collapsedSections()[key]);
  }

  ngOnInit(): void {
    void this.loadData();
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [books, bds, comics, games, movies, series] = await Promise.all([
        getAllBaseBooks(),
        getAllBaseBds(),
        getAllBaseComics(),
        getAllBaseGames(),
        getAllBaseMovies(),
        getAllBaseSeries(),
      ]);
      this.baseBooks.set(books);
      this.baseBds.set(bds);
      this.baseComics.set(comics);
      this.baseGames.set(games);
      this.baseMovies.set(movies);
      this.baseSeries.set(series);
    } finally {
      this.isLoading.set(false);
    }
  }

  onViewChange(view: MixView): void {
    this.selectedView.set(view);
  }
}
