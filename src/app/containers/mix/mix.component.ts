import {
  Component,
  OnInit,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuComponent } from '../../components/menu/menu.component';
import {
  ViewToggleComponent,
  type ViewToggleOption,
} from '../../components/shared/view-toggle/view-toggle.component';
import { BdComponent } from '../../components/collections/bd/bd.component';
import { BookComponent } from '../../components/collections/book/book.component';
import { ComicComponent } from '../../components/collections/comic/comic.component';
import { GameComponent } from '../../components/collections/game/game.component';
import { MangaComponent } from '../../components/collections/manga/manga.component';
import { ManwhaComponent } from '../../components/collections/manwha/manwha.component';
import { MovieComponent } from '../../components/collections/movie/movie.component';
import { SerieComponent } from '../../components/collections/serie/serie.component';
import { getAllBaseBds } from '../../facades/bds/bds.facade';
import { getAllBaseBooks } from '../../facades/books/books.facade';
import { getAllBaseComics } from '../../facades/comics/comics.facade';
import { getAllBaseGames } from '../../facades/games/games.facade';
import { getAllBaseManwhas } from '../../facades/manwhas/manwhas.facade';
import { getAllBaseMangas } from '../../facades/mangas/mangas.facade';
import { getAllBaseMovies } from '../../facades/movies/movies.facade';
import { getAllBaseSeries } from '../../facades/series/series.facade';
import {
  getFullBd,
  getFullBook,
  getFullComic,
  getFullGame,
  getFullManwha,
  getFullManga,
  getFullMovie,
  getFullSerie,
} from '../../helpers/full-entities-helper';
import { BaseBd } from '../../models/bd-model';
import { BaseBook } from '../../models/book-model';
import { BaseComic } from '../../models/comic-model';
import { BaseGame } from '../../models/game-model';
import { BaseManwha } from '../../models/manwha-model';
import { BaseManga } from '../../models/manga-model';
import { BaseMovie } from '../../models/movie-model';
import { BaseSerie } from '../../models/serie-model';
import type {
  GameFromEntityType,
  MovieFromEntityType,
} from '../../models/from-entity.model';
import { Bd } from '../../models/bd-model';
import { Book } from '../../models/book-model';
import { Comic } from '../../models/comic-model';
import { Game } from '../../models/game-model';
import { Manwha } from '../../models/manwha-model';
import { Manga } from '../../models/manga-model';
import { Movie } from '../../models/movie-model';
import { Serie } from '../../models/serie-model';

/** Premier niveau de navigation (peu d’onglets). */
export type MixPrimary =
  | 'sagasFilmsSeries'
  | 'worksWithMovieAdaptations'
  | 'moviesGroupedBySource'
  | 'gamesFromFilms'
  | 'baseWorksGalaxy';

/** Type d’œuvre source pour les vues « adaptations film » (second niveau). */
export type MixAdaptationSource =
  | 'book'
  | 'bd'
  | 'comic'
  | 'manga'
  | 'manwha'
  | 'game'
  | 'serie';

export const mixPrimaryOptions: ViewToggleOption[] = [
  { value: 'baseWorksGalaxy', label: 'Œuvres de base' },
  { value: 'sagasFilmsSeries', label: 'Sagas films / séries' },
  { value: 'worksWithMovieAdaptations', label: 'Œuvres → leurs films' },
  { value: 'moviesGroupedBySource', label: 'Films par origine' },
  { value: 'gamesFromFilms', label: 'Jeux d’après un film' },
];

export const mixAdaptationSourceOptions: ViewToggleOption[] = [
  { value: 'book', label: 'Livre' },
  { value: 'bd', label: 'BD franco' },
  { value: 'comic', label: 'Comic US' },
  { value: 'manga', label: 'Manga' },
  { value: 'manwha', label: 'Manhwa' },
  { value: 'game', label: 'Jeu vidéo' },
  { value: 'serie', label: 'Série TV' },
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

export type MangaWithAdaptations = {
  manga: Manga;
  movies: Movie[];
};

export type ManwhaWithAdaptations = {
  manwha: Manwha;
  movies: Movie[];
};

export type SerieWithFilmAdaptations = {
  serie: Serie;
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

export type GameFromFilmRow = {
  game: Game;
  sourceMovie: Movie | null;
};

/** Œuvre source (cible des fromEntity) + dérivés (films, séries, jeux). */
export type BaseWorkGalaxy = {
  fromEntityType: MovieFromEntityType | GameFromEntityType;
  sourceTitle: string;
  sourceSecondKey: string;
  uniqueKey: string;
  book: Book | null;
  bd: Bd | null;
  comic: Comic | null;
  manga: Manga | null;
  manwha: Manwha | null;
  game: Game | null;
  serie: Serie | null;
  movie: Movie | null;
  derivedMovies: Movie[];
  derivedSeries: Serie[];
  derivedGames: Game[];
};

/** Bloc affiché : saga de livres regroupée (plusieurs galaxies) ou œuvre isolée (un seul élément). */
export type MixBaseWorksViewBlock =
  | {
      blockKind: 'bookSaga';
      sagaKey: string;
      sagaDisplayName: string;
      galaxies: BaseWorkGalaxy[];
    }
  | { blockKind: 'standalone'; galaxies: BaseWorkGalaxy[] };

/** Satellite autour de l’œuvre centrale (autres tomes, films, séries, jeux…). */
export type BaseWorkOrbitSatellite =
  | { kind: 'book'; data: Book }
  | { kind: 'movie'; data: Movie }
  | { kind: 'serie'; data: Serie }
  | { kind: 'game'; data: Game }
  | { kind: 'bd'; data: Bd }
  | { kind: 'comic'; data: Comic }
  | { kind: 'manga'; data: Manga }
  | { kind: 'manwha'; data: Manwha };

/** Une carte « galaxie » : un seul centre + anneau fusionné. */
export type MixBaseWorkOrbitPanel = {
  orbitKey: string;
  blockKind: 'bookSaga' | 'standalone';
  sagaDisplayName?: string;
  headerPrimaryLabel: string;
  /** Pour les blocs isolés : type fromEntity (libellé dans l’en-tête). */
  standaloneFromEntityType?: string;
  /** Nombre d’éléments sur l’anneau (hors centre). */
  satelliteCount: number;
  central: {
    book?: Book | null;
    bd?: Bd | null;
    comic?: Comic | null;
    manga?: Manga | null;
    manwha?: Manwha | null;
    game?: Game | null;
    serie?: Serie | null;
    movie?: Movie | null;
    placeholderTitle?: string;
    placeholderSecond?: string;
    placeholderEntityType?: string;
  };
  satellites: BaseWorkOrbitSatellite[];
};

/** Couverture + texte d’infobulle pour les vignettes orbite. */
export type MixOrbitCoverInfo = {
  coverUrl: string | null;
  tooltip: string;
};

function mixOrbitTrimCoverUrl(url: string | undefined | null): string | null {
  const t = url?.trim();
  return t ? t : null;
}

function mixOrbitCover(
  coverUrl: string | undefined | null,
  title: string,
  secondLine?: string
): MixOrbitCoverInfo {
  const tooltip = secondLine?.trim()
    ? `${title.trim()} — ${secondLine.trim()}`
    : title.trim();
  return {
    coverUrl: mixOrbitTrimCoverUrl(coverUrl),
    tooltip: tooltip || 'Sans titre',
  };
}

function movieEntityKey(m: Movie): string {
  return `${m.title}|${m.director}`;
}

function serieEntityKey(s: Serie): string {
  return `${s.title}|${s.director}`;
}

function gameEntityKey(g: Game): string {
  return `${g.title}|${g.editor}`;
}

function bookEntityKey(b: Book): string {
  return `${b.title}|${b.author}`;
}

function mergeDedupeMovies(lists: Movie[][]): Movie[] {
  const map = new Map<string, Movie>();
  for (const arr of lists) {
    for (const m of arr) {
      map.set(movieEntityKey(m), m);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

function mergeDedupeSeries(lists: Serie[][]): Serie[] {
  const map = new Map<string, Serie>();
  for (const arr of lists) {
    for (const s of arr) {
      map.set(serieEntityKey(s), s);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

function mergeDedupeGames(lists: Game[][]): Game[] {
  const map = new Map<string, Game>();
  for (const arr of lists) {
    for (const g of arr) {
      map.set(gameEntityKey(g), g);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

/** Tome 1 de la saga : sagaOrder === 1, sinon plus petit sagaOrder, sinon premier livre. */
function pickCentralGalaxyForBookSaga(
  galaxies: BaseWorkGalaxy[]
): BaseWorkGalaxy {
  const withBook = galaxies.filter((g) => g.book);
  if (withBook.length === 0) {
    return galaxies[0];
  }
  const order1 = withBook.find((g) => (g.book!.sagaOrder ?? 0) === 1);
  if (order1) {
    return order1;
  }
  return [...withBook].sort(
    (a, b) =>
      (a.book!.sagaOrder ?? 9999) - (b.book!.sagaOrder ?? 9999)
  )[0];
}

function centralFromGalaxy(g: BaseWorkGalaxy): MixBaseWorkOrbitPanel['central'] {
  return {
    book: g.book,
    bd: g.bd,
    comic: g.comic,
    manga: g.manga,
    manwha: g.manwha,
    game: g.game,
    serie: g.serie,
    movie: g.movie,
    placeholderTitle:
      !g.book &&
      !g.bd &&
      !g.comic &&
      !g.manga &&
      !g.manwha &&
      !g.game &&
      !g.serie &&
      !g.movie
        ? g.sourceTitle
        : undefined,
    placeholderSecond:
      !g.book &&
      !g.bd &&
      !g.comic &&
      !g.manga &&
      !g.manwha &&
      !g.game &&
      !g.serie &&
      !g.movie
        ? g.sourceSecondKey
        : undefined,
    placeholderEntityType:
      !g.book &&
      !g.bd &&
      !g.comic &&
      !g.manga &&
      !g.manwha &&
      !g.game &&
      !g.serie &&
      !g.movie
        ? g.fromEntityType
        : undefined,
  };
}

function baseWorksBlockToOrbitPanel(
  block: MixBaseWorksViewBlock,
  allBaseBooks: BaseBook[]
): MixBaseWorkOrbitPanel {
  if (block.blockKind === 'standalone') {
    const g = block.galaxies[0];
    const movies = mergeDedupeMovies([g.derivedMovies]);
    const series = mergeDedupeSeries([g.derivedSeries]);
    const games = mergeDedupeGames([g.derivedGames]);
    const satellites: BaseWorkOrbitSatellite[] = [
      ...movies.map((data) => ({ kind: 'movie' as const, data })),
      ...series.map((data) => ({ kind: 'serie' as const, data })),
      ...games.map((data) => ({ kind: 'game' as const, data })),
    ];
    return {
      orbitKey: `bbwg-st:${g.uniqueKey}`,
      blockKind: 'standalone',
      headerPrimaryLabel: `${g.sourceTitle} — ${g.sourceSecondKey}`,
      standaloneFromEntityType: g.fromEntityType,
      satelliteCount: satellites.length,
      central: centralFromGalaxy(g),
      satellites,
    };
  }

  const galaxies = block.galaxies;
  const centralGalaxy = pickCentralGalaxyForBookSaga(galaxies);
  const centralBook = centralGalaxy.book;
  const centralKey = centralBook ? bookEntityKey(centralBook) : '';

  /** Tous les tomes du catalogue dans cette saga (y compris sans adaptation). */
  const sagaKeyNorm = block.sagaKey;
  const booksInSagaCatalog = allBaseBooks.filter(
    (bb) => bb.saga?.trim().toLowerCase() === sagaKeyNorm
  );

  const otherBooks: Book[] = [];
  const bookSeen = new Set<string>();
  const pushBookIfNew = (b: Book): void => {
    const k = bookEntityKey(b);
    if (centralKey && k === centralKey) return;
    if (bookSeen.has(k)) return;
    bookSeen.add(k);
    otherBooks.push(b);
  };

  for (const bb of booksInSagaCatalog) {
    pushBookIfNew(getFullBook(bb));
  }
  for (const gal of galaxies) {
    if (gal.book) {
      pushBookIfNew(gal.book);
    }
  }
  otherBooks.sort((a, b) => {
    const d = (a.sagaOrder ?? 9999) - (b.sagaOrder ?? 9999);
    if (d !== 0) return d;
    return a.title.localeCompare(b.title, 'fr');
  });

  const movieLists = galaxies.map((g) => g.derivedMovies);
  const serieLists = galaxies.map((g) => g.derivedSeries);
  const gameLists = galaxies.map((g) => g.derivedGames);
  const movies = mergeDedupeMovies(movieLists);
  const series = mergeDedupeSeries(serieLists);
  const games = mergeDedupeGames(gameLists);

  const satellites: BaseWorkOrbitSatellite[] = [
    ...otherBooks.map((data) => ({ kind: 'book' as const, data })),
    ...movies.map((data) => ({ kind: 'movie' as const, data })),
    ...series.map((data) => ({ kind: 'serie' as const, data })),
    ...games.map((data) => ({ kind: 'game' as const, data })),
  ];

  return {
    orbitKey: `bbwg-saga:${block.sagaKey}`,
    blockKind: 'bookSaga',
    sagaDisplayName: block.sagaDisplayName,
    headerPrimaryLabel: `Saga livres — ${block.sagaDisplayName}`,
    satelliteCount: satellites.length,
    central: centralFromGalaxy(centralGalaxy),
    satellites,
  };
}

@Component({
  selector: 'app-mix',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MenuComponent,
    ViewToggleComponent,
    BdComponent,
    BookComponent,
    ComicComponent,
    GameComponent,
    MangaComponent,
    ManwhaComponent,
    MovieComponent,
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
  readonly baseMangas = signal<BaseManga[]>([]);
  readonly baseManwhas = signal<BaseManwha[]>([]);
  readonly baseMovies = signal<BaseMovie[]>([]);
  readonly baseSeries = signal<BaseSerie[]>([]);

  readonly selectedPrimary = signal<MixPrimary>('baseWorksGalaxy');
  readonly selectedAdaptationSource = signal<MixAdaptationSource>('book');
  readonly isLoading = signal<boolean>(true);

  readonly primaryViewOptions = mixPrimaryOptions;
  readonly adaptationSourceOptions = mixAdaptationSourceOptions;

  readonly showAdaptationSourceTabs = computed(
    () =>
      this.selectedPrimary() === 'worksWithMovieAdaptations' ||
      this.selectedPrimary() === 'moviesGroupedBySource'
  );

  /** Sagas présentes à la fois dans les films et les séries. */
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
      return totalB - totalA;
    });
  });

  private moviesFullByEntityType(t: MovieFromEntityType): Movie[] {
    return this.baseMovies()
      .filter((m) => m.fromEntity?.entityType === t)
      .map((m) => getFullMovie(m));
  }

  /** Films dont la source est une BD du catalogue (entityType bd ou comic assorti au catalogue BD). */
  private moviesFromBdCatalogFull(): Movie[] {
    const bdKeys = new Set(
      this.baseBds().map((b) => `${b.title}|${b.writer}`)
    );
    return this.baseMovies()
      .filter((m) => {
        const fe = m.fromEntity;
        if (!fe) return false;
        if (fe.entityType !== 'comic' && fe.entityType !== 'bd') return false;
        return bdKeys.has(`${fe.title}|${fe.secondEntityKey}`);
      })
      .map((m) => getFullMovie(m));
  }

  /** Films dont la source est un comic US (catalogue comics). */
  private moviesFromComicBooksFull(): Movie[] {
    const comicKeys = new Set(
      this.baseComics().map((c) => `${c.title}|${c.writer}`)
    );
    return this.baseMovies()
      .filter((m) => {
        const fe = m.fromEntity;
        if (!fe || fe.entityType !== 'comic') return false;
        return comicKeys.has(`${fe.title}|${fe.secondEntityKey}`);
      })
      .map((m) => getFullMovie(m));
  }

  private groupMoviesBySourceFromMovies(list: Movie[]): MoviesBySource[] {
    const map = new Map<string, Movie[]>();
    for (const m of list) {
      if (!m.fromEntity) continue;
      const key = `${m.fromEntity.title}|${m.fromEntity.secondEntityKey}`;
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
  }

  readonly booksAdapted = computed<BookWithAdaptations[]>(() => {
    const books = this.baseBooks();
    const withFromEntityBook = this.baseMovies().filter(
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

  readonly moviesFromBooksBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('book'))
  );

  readonly moviesFromGamesBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('game'))
  );

  readonly moviesFromMangaBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('manga'))
  );

  readonly moviesFromManwhaBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('manwha'))
  );

  readonly moviesFromSeriesBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('serie'))
  );

  readonly moviesFromBdsBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFromBdCatalogFull())
  );

  readonly moviesFromComicBooksBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFromComicBooksFull())
  );

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

  readonly bdsAdapted = computed<BdWithAdaptations[]>(() => {
    const bds = this.baseBds();
    const movies = this.baseMovies();
    const result: BdWithAdaptations[] = [];
    for (const baseBd of bds) {
      const adaptations = movies.filter((m) => {
        const fe = m.fromEntity;
        if (!fe) return false;
        if (fe.entityType !== 'comic' && fe.entityType !== 'bd') return false;
        return (
          fe.title === baseBd.title && fe.secondEntityKey === baseBd.writer
        );
      });
      if (adaptations.length > 0) {
        result.push({
          bd: getFullBd(baseBd),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

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

  readonly mangasAdapted = computed<MangaWithAdaptations[]>(() => {
    const mangas = this.baseMangas();
    const movies = this.baseMovies().filter(
      (m) => m.fromEntity?.entityType === 'manga'
    );
    const result: MangaWithAdaptations[] = [];
    for (const base of mangas) {
      const adaptations = movies.filter(
        (m) =>
          m.fromEntity!.title === base.title &&
          m.fromEntity!.secondEntityKey === base.author
      );
      if (adaptations.length > 0) {
        result.push({
          manga: getFullManga(base),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly manwhasAdapted = computed<ManwhaWithAdaptations[]>(() => {
    const manwhas = this.baseManwhas();
    const movies = this.baseMovies().filter(
      (m) => m.fromEntity?.entityType === 'manwha'
    );
    const result: ManwhaWithAdaptations[] = [];
    for (const base of manwhas) {
      const adaptations = movies.filter(
        (m) =>
          m.fromEntity!.title === base.title &&
          m.fromEntity!.secondEntityKey === base.author
      );
      if (adaptations.length > 0) {
        result.push({
          manwha: getFullManwha(base),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly seriesWithFilmAdaptations = computed<SerieWithFilmAdaptations[]>(
    () => {
      const series = this.baseSeries();
      const movies = this.baseMovies().filter(
        (m) => m.fromEntity?.entityType === 'serie'
      );
      const result: SerieWithFilmAdaptations[] = [];
      for (const base of series) {
        const adaptations = movies.filter(
          (m) =>
            m.fromEntity!.title === base.title &&
            m.fromEntity!.secondEntityKey === base.director
        );
        if (adaptations.length > 0) {
          result.push({
            serie: getFullSerie(base),
            movies: adaptations.map((m) => getFullMovie(m)),
          });
        }
      }
      return result;
    }
  );

  /** Jeux dont l’œuvre source déclarée est un film (catalogue). */
  readonly gamesFromFilmsDetail = computed<GameFromFilmRow[]>(() => {
    const games = this.baseGames()
      .map((g) => getFullGame(g))
      .filter((g) => g.fromEntity?.entityType === 'movie');
    const movies = this.baseMovies().map((m) => getFullMovie(m));
    return games.map((game) => {
      const fe = game.fromEntity!;
      const sourceMovie =
        movies.find(
          (m) =>
            m.title === fe.title &&
            m.director === fe.secondEntityKey
        ) ?? null;
      return { game, sourceMovie };
    });
  });

  /**
   * Vue « Œuvres de base » : chaque cible de fromEntity (film/série/jeu) avec ses dérivés.
   * Les livres partageant une saga non vide sont regroupés sous le nom de la saga.
   */
  readonly mixBaseWorksBlocks = computed<MixBaseWorksViewBlock[]>(() => {
    type MutableGalaxy = {
      fromEntityType: string;
      sourceTitle: string;
      sourceSecondKey: string;
      uniqueKey: string;
      book: Book | null;
      bd: Bd | null;
      comic: Comic | null;
      manga: Manga | null;
      manwha: Manwha | null;
      game: Game | null;
      serie: Serie | null;
      movie: Movie | null;
      derivedMovies: Movie[];
      derivedSeries: Serie[];
      derivedGames: Game[];
    };

    const map = new Map<string, MutableGalaxy>();

    const touchGalaxy = (
      fe: {
        entityType: string;
        title: string;
        secondEntityKey: string;
      },
      fn: (g: MutableGalaxy) => void
    ): void => {
      const uniqueKey = `${fe.entityType}|${fe.title}|${fe.secondEntityKey}`;
      let g = map.get(uniqueKey);
      if (!g) {
        g = {
          fromEntityType: fe.entityType,
          sourceTitle: fe.title,
          sourceSecondKey: fe.secondEntityKey,
          uniqueKey,
          book: null,
          bd: null,
          comic: null,
          manga: null,
          manwha: null,
          game: null,
          serie: null,
          movie: null,
          derivedMovies: [],
          derivedSeries: [],
          derivedGames: [],
        };
        map.set(uniqueKey, g);
      }
      fn(g);
    };

    for (const bm of this.baseMovies()) {
      const fe = bm.fromEntity;
      if (!fe) continue;
      touchGalaxy(fe, (g) => g.derivedMovies.push(getFullMovie(bm)));
    }

    for (const bs of this.baseSeries()) {
      const fe = bs.fromEntity;
      if (!fe) continue;
      touchGalaxy(fe, (g) => g.derivedSeries.push(getFullSerie(bs)));
    }

    for (const bg of this.baseGames()) {
      const fe = bg.fromEntity;
      if (!fe) continue;
      touchGalaxy(fe, (g) => g.derivedGames.push(getFullGame(bg)));
    }

    const books = this.baseBooks();
    const bds = this.baseBds();
    const comics = this.baseComics();
    const mangas = this.baseMangas();
    const manwhas = this.baseManwhas();
    const games = this.baseGames();
    const series = this.baseSeries();
    const movies = this.baseMovies();

    for (const g of map.values()) {
      const t = g.fromEntityType;
      const title = g.sourceTitle;
      const key2 = g.sourceSecondKey;
      if (t === 'book') {
        const b = books.find((bb) => bb.title === title && bb.author === key2);
        if (b) g.book = getFullBook(b);
      } else if (t === 'bd') {
        const b = bds.find((bb) => bb.title === title && bb.writer === key2);
        if (b) g.bd = getFullBd(b);
      } else if (t === 'comic') {
        const c = comics.find((bc) => bc.title === title && bc.writer === key2);
        if (c) g.comic = getFullComic(c);
      } else if (t === 'manga') {
        const m = mangas.find((bm) => bm.title === title && bm.author === key2);
        if (m) g.manga = getFullManga(m);
      } else if (t === 'manwha') {
        const m = manwhas.find((bm) => bm.title === title && bm.author === key2);
        if (m) g.manwha = getFullManwha(m);
      } else if (t === 'game') {
        const game = games.find((bg) => bg.title === title && bg.editor === key2);
        if (game) g.game = getFullGame(game);
      } else if (t === 'serie') {
        const s = series.find((bs) => bs.title === title && bs.director === key2);
        if (s) g.serie = getFullSerie(s);
      } else if (t === 'movie') {
        const m = movies.find((bm) => bm.title === title && bm.director === key2);
        if (m) g.movie = getFullMovie(m);
      }
    }

    const sagaBookMap = new Map<
      string,
      { sagaDisplayName: string; galaxies: BaseWorkGalaxy[] }
    >();
    const standaloneGalaxies: BaseWorkGalaxy[] = [];

    for (const g of map.values()) {
      const galaxy: BaseWorkGalaxy = {
        fromEntityType: g.fromEntityType as BaseWorkGalaxy['fromEntityType'],
        sourceTitle: g.sourceTitle,
        sourceSecondKey: g.sourceSecondKey,
        uniqueKey: g.uniqueKey,
        book: g.book,
        bd: g.bd,
        comic: g.comic,
        manga: g.manga,
        manwha: g.manwha,
        game: g.game,
        serie: g.serie,
        movie: g.movie,
        derivedMovies: g.derivedMovies,
        derivedSeries: g.derivedSeries,
        derivedGames: g.derivedGames,
      };

      const sagaTrim = galaxy.book?.saga?.trim();
      if (galaxy.fromEntityType === 'book' && sagaTrim) {
        const sk = sagaTrim.toLowerCase();
        let entry = sagaBookMap.get(sk);
        if (!entry) {
          entry = { sagaDisplayName: sagaTrim, galaxies: [] };
          sagaBookMap.set(sk, entry);
        }
        entry.galaxies.push(galaxy);
      } else {
        standaloneGalaxies.push(galaxy);
      }
    }

    const sagaBlocks: MixBaseWorksViewBlock[] = Array.from(sagaBookMap.entries()).map(
      ([, entry]) => {
        entry.galaxies.sort((a, b) => {
          const ao = a.book?.sagaOrder ?? 0;
          const bo = b.book?.sagaOrder ?? 0;
          if (ao !== bo) return ao - bo;
          return a.sourceTitle.localeCompare(b.sourceTitle, 'fr');
        });
        return {
          blockKind: 'bookSaga' as const,
          sagaKey: entry.sagaDisplayName.toLowerCase(),
          sagaDisplayName: entry.sagaDisplayName,
          galaxies: entry.galaxies,
        };
      }
    );

    standaloneGalaxies.sort((a, b) =>
      a.uniqueKey.localeCompare(b.uniqueKey, 'fr')
    );
    const standaloneBlocks: MixBaseWorksViewBlock[] = standaloneGalaxies.map(
      (galaxy) => ({ blockKind: 'standalone' as const, galaxies: [galaxy] })
    );

    const blockAdaptationTotal = (block: MixBaseWorksViewBlock): number =>
      block.galaxies.reduce(
        (sum, gal) =>
          sum +
          gal.derivedMovies.length +
          gal.derivedSeries.length +
          gal.derivedGames.length,
        0
      );

    const blockSortLabel = (block: MixBaseWorksViewBlock): string =>
      block.blockKind === 'bookSaga'
        ? block.sagaDisplayName
        : (block.galaxies[0]?.sourceTitle ?? '');

    return [...sagaBlocks, ...standaloneBlocks].sort((a, b) => {
      const diff = blockAdaptationTotal(b) - blockAdaptationTotal(a);
      if (diff !== 0) return diff;
      return blockSortLabel(a).localeCompare(blockSortLabel(b), 'fr');
    });
  });

  /** Panneaux « orbite » dérivés des blocs (centre = tome 1 ou œuvre isolée). */
  readonly mixBaseWorkOrbitPanels = computed<MixBaseWorkOrbitPanel[]>(() => {
    const books = this.baseBooks();
    const panels = this.mixBaseWorksBlocks().map((b) =>
      baseWorksBlockToOrbitPanel(b, books)
    );
    return panels.sort((a, b) => {
      const diff = b.satelliteCount - a.satelliteCount;
      if (diff !== 0) return diff;
      return a.headerPrimaryLabel.localeCompare(b.headerPrimaryLabel, 'fr');
    });
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

  trackBaseWorkOrbitPanel(panel: MixBaseWorkOrbitPanel): string {
    return panel.orbitKey;
  }

  /** Clé de repli pour tout le panneau orbite. */
  baseWorkOrbitCollapseKey(panel: MixBaseWorkOrbitPanel): string {
    return panel.orbitKey;
  }

  trackOrbitSatellite(sat: BaseWorkOrbitSatellite, index: number): string {
    switch (sat.kind) {
      case 'book':
        return `b-${bookEntityKey(sat.data)}-${index}`;
      case 'movie':
        return `m-${movieEntityKey(sat.data)}-${index}`;
      case 'serie':
        return `s-${serieEntityKey(sat.data)}-${index}`;
      case 'game':
        return `g-${gameEntityKey(sat.data)}-${index}`;
      case 'bd':
        return `bd-${sat.data.title}|${sat.data.writer}-${index}`;
      case 'comic':
        return `c-${sat.data.title}|${sat.data.writer}-${index}`;
      case 'manga':
        return `mg-${sat.data.title}|${sat.data.author}-${index}`;
      case 'manwha':
        return `mw-${sat.data.title}|${sat.data.author}-${index}`;
    }
  }

  orbitSatelliteCover(sat: BaseWorkOrbitSatellite): MixOrbitCoverInfo {
    switch (sat.kind) {
      case 'book':
        return mixOrbitCover(sat.data.coverUrl, sat.data.title, sat.data.author);
      case 'movie':
        return mixOrbitCover(sat.data.coverUrl, sat.data.title, sat.data.director);
      case 'serie':
        return mixOrbitCover(sat.data.coverUrl, sat.data.title, sat.data.director);
      case 'game':
        return mixOrbitCover(sat.data.coverUrl, sat.data.title, sat.data.editor);
      case 'bd':
        return mixOrbitCover(sat.data.coverUrl, sat.data.title, sat.data.writer);
      case 'comic':
        return mixOrbitCover(sat.data.coverUrl, sat.data.title, sat.data.writer);
      case 'manga':
        return mixOrbitCover(sat.data.coverUrl, sat.data.title, sat.data.author);
      case 'manwha':
        return mixOrbitCover(sat.data.coverUrl, sat.data.title, sat.data.author);
    }
  }

  orbitCentralCover(central: MixBaseWorkOrbitPanel['central']): MixOrbitCoverInfo {
    if (central.book) {
      return mixOrbitCover(
        central.book.coverUrl,
        central.book.title,
        central.book.author
      );
    }
    if (central.bd) {
      return mixOrbitCover(central.bd.coverUrl, central.bd.title, central.bd.writer);
    }
    if (central.comic) {
      return mixOrbitCover(
        central.comic.coverUrl,
        central.comic.title,
        central.comic.writer
      );
    }
    if (central.manga) {
      return mixOrbitCover(
        central.manga.coverUrl,
        central.manga.title,
        central.manga.author
      );
    }
    if (central.manwha) {
      return mixOrbitCover(
        central.manwha.coverUrl,
        central.manwha.title,
        central.manwha.author
      );
    }
    if (central.game) {
      return mixOrbitCover(
        central.game.coverUrl,
        central.game.title,
        central.game.editor
      );
    }
    if (central.serie) {
      return mixOrbitCover(
        central.serie.coverUrl,
        central.serie.title,
        central.serie.director
      );
    }
    if (central.movie) {
      return mixOrbitCover(
        central.movie.coverUrl,
        central.movie.title,
        central.movie.director
      );
    }
    const base = [central.placeholderTitle, central.placeholderSecond]
      .filter((s): s is string => Boolean(s?.trim()))
      .join(' — ');
    const kind = central.placeholderEntityType
      ? ` (${this.baseWorkEntityLabel(central.placeholderEntityType)}, absent du catalogue local)`
      : '';
    return {
      coverUrl: null,
      tooltip: (base + kind).trim() || 'Œuvre de base',
    };
  }

  orbitCoverFallbackLetter(tooltip: string): string {
    const t = tooltip.trim();
    if (!t) {
      return '?';
    }
    return t.charAt(0).toLocaleUpperCase('fr');
  }

  /** Rayon de l’anneau (px) selon le nombre de satellites. */
  orbitRadiusPx(satelliteCount: number): number {
    if (satelliteCount <= 0) return 0;
    return Math.min(300, Math.max(130, 95 + satelliteCount * 26));
  }

  /** Taille du carré contenant le schéma circulaire. */
  orbitContainerSizePx(satelliteCount: number): number {
    const r = this.orbitRadiusPx(satelliteCount);
    return Math.max(280, Math.min(920, 2 * r + 240));
  }

  /** Libellé FR pour le type d’œuvre source (fromEntity.entityType). */
  baseWorkEntityLabel(entityType: string): string {
    if (!entityType) {
      return 'œuvre';
    }
    const labels: Record<string, string> = {
      book: 'Livre',
      bd: 'BD franco',
      comic: 'Comic US',
      manga: 'Manga',
      manwha: 'Manhwa',
      game: 'Jeu vidéo',
      serie: 'Série TV',
      movie: 'Film',
    };
    return labels[entityType] ?? entityType;
  }

  ngOnInit(): void {
    void this.loadData();
  }

  onPrimaryChange(value: string): void {
    this.selectedPrimary.set(value as MixPrimary);
  }

  onAdaptationSourceChange(value: string): void {
    this.selectedAdaptationSource.set(value as MixAdaptationSource);
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [books, bds, comics, games, mangas, manwhas, movies, series] =
        await Promise.all([
          getAllBaseBooks(),
          getAllBaseBds(),
          getAllBaseComics(),
          getAllBaseGames(),
          getAllBaseMangas(),
          getAllBaseManwhas(),
          getAllBaseMovies(),
          getAllBaseSeries(),
        ]);
      this.baseBooks.set(books);
      this.baseBds.set(bds);
      this.baseComics.set(comics);
      this.baseGames.set(games);
      this.baseMangas.set(mangas);
      this.baseManwhas.set(manwhas);
      this.baseMovies.set(movies);
      this.baseSeries.set(series);
    } finally {
      this.isLoading.set(false);
    }
  }
}
