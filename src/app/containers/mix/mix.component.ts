import {
  Component,
  OnInit,
  computed,
  signal,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
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
import { getLocalMoviesByUser } from '../../facades/movies/local-movies.facade';
import {
  getLocalBooksByUser,
  getLocalReadlistByUser as getLocalBooksReadlistByUser,
} from '../../facades/books/local-books.facade';
import {
  getLocalBdsByUser,
  getLocalReadlistByUser as getLocalBdsReadlistByUser,
} from '../../facades/bds/local-bds.facade';
import {
  getLocalComicsByUser,
  getLocalReadlistByUser as getLocalComicsReadlistByUser,
} from '../../facades/comics/local-comics.facade';
import {
  getLocalMangasByUser,
  getLocalReadlistByUser as getLocalMangasReadlistByUser,
} from '../../facades/mangas/local-mangas.facade';
import {
  getLocalManwhasByUser,
  getLocalReadlistByUser as getLocalManwhasReadlistByUser,
} from '../../facades/manwhas/local-manwhas.facade';
import {
  getLocalGamesByUser,
  getLocalGamelistByUser,
} from '../../facades/games/local-games.facade';
import { getLocalSeriesByUser } from '../../facades/series/local-series.facade';
import { AuthService } from '../../core/auth.service';
import { ImpersonateService } from '../../services/impersonate.service';
import { DEFAULT_USER_ID } from '../../utils/constants';
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
import { BaseGame, UserGame } from '../../models/game-model';
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

/** Bloc affiché : saga livres + BD + films catalogue / saga de jeux / œuvre isolée. */
export type MixBaseWorksViewBlock =
  | {
      blockKind: 'bookSaga';
      sagaKey: string;
      sagaDisplayName: string;
      galaxies: BaseWorkGalaxy[];
    }
  | {
      blockKind: 'gameSaga';
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
  blockKind: 'bookSaga' | 'gameSaga' | 'standalone';
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

/** Normalise pour recherche insensible aux accents et à la casse. */
function normalizeForMixBaseSearch(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function buildMixBaseWorkPanelSearchHaystack(panel: MixBaseWorkOrbitPanel): string {
  const parts: string[] = [
    panel.headerPrimaryLabel,
    panel.orbitKey,
    panel.sagaDisplayName ?? '',
    panel.standaloneFromEntityType ?? '',
    panel.blockKind,
  ];
  const c = panel.central;
  if (c.placeholderTitle) parts.push(c.placeholderTitle);
  if (c.placeholderSecond) parts.push(c.placeholderSecond);
  if (c.placeholderEntityType) parts.push(c.placeholderEntityType);
  if (c.book) {
    parts.push(c.book.title, c.book.author, c.book.saga ?? '');
  }
  if (c.bd) {
    parts.push(c.bd.title, c.bd.writer, c.bd.saga ?? '');
  }
  if (c.comic) {
    parts.push(c.comic.title, c.comic.writer, c.comic.saga ?? '');
  }
  if (c.manga) {
    parts.push(c.manga.title, c.manga.author);
  }
  if (c.manwha) {
    parts.push(c.manwha.title, c.manwha.author);
  }
  if (c.game) {
    parts.push(c.game.title, c.game.editor, c.game.saga ?? '');
  }
  if (c.serie) {
    parts.push(c.serie.title, c.serie.director, c.serie.saga ?? '');
  }
  if (c.movie) {
    parts.push(c.movie.title, c.movie.director, c.movie.saga ?? '');
  }
  for (const sat of panel.satellites) {
    switch (sat.kind) {
      case 'book':
        parts.push(sat.data.title, sat.data.author, sat.data.saga ?? '');
        break;
      case 'movie':
        parts.push(sat.data.title, sat.data.director, sat.data.saga ?? '');
        break;
      case 'serie':
        parts.push(sat.data.title, sat.data.director, sat.data.saga ?? '');
        break;
      case 'game':
        parts.push(sat.data.title, sat.data.editor, sat.data.saga ?? '');
        break;
      case 'bd':
        parts.push(sat.data.title, sat.data.writer, sat.data.saga ?? '');
        break;
      case 'comic':
        parts.push(sat.data.title, sat.data.writer, sat.data.saga ?? '');
        break;
      case 'manga':
        parts.push(sat.data.title, sat.data.author);
        break;
      case 'manwha':
        parts.push(sat.data.title, sat.data.author);
        break;
    }
  }
  return normalizeForMixBaseSearch(parts.filter(Boolean).join(' '));
}

/** Couverture + texte d’infobulle pour les vignettes orbite. */
export type MixOrbitCoverInfo = {
  coverUrl: string | null;
  tooltip: string;
};

/** Libellés FR des types d’entité (orbite + Mix). */
const MIX_ORBIT_ENTITY_LABELS: Record<string, string> = {
  book: 'Livre',
  bd: 'BD franco',
  comic: 'Comic US',
  manga: 'Manga',
  manwha: 'Manhwa',
  game: 'Jeu vidéo',
  serie: 'Série TV',
  movie: 'Film',
};

function mixOrbitEntityKindLabel(kind: string): string {
  return MIX_ORBIT_ENTITY_LABELS[kind] ?? kind;
}

function mixOrbitTrimCoverUrl(url: string | undefined | null): string | null {
  const t = url?.trim();
  return t ? t : null;
}

function mixOrbitCover(
  coverUrl: string | undefined | null,
  title: string,
  secondLine?: string,
  entityKindKey?: string
): MixOrbitCoverInfo {
  const main = secondLine?.trim()
    ? `${title.trim()} — ${secondLine.trim()}`
    : title.trim();
  const base = main || 'Sans titre';
  const kindLabel =
    entityKindKey && entityKindKey.trim()
      ? mixOrbitEntityKindLabel(entityKindKey.trim())
      : '';
  const tooltip = kindLabel ? `${base} · ${kindLabel}` : base;
  return {
    coverUrl: mixOrbitTrimCoverUrl(coverUrl),
    tooltip,
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

function bdEntityKey(b: Bd): string {
  return `${b.title}|${b.writer}`;
}

function comicEntityKey(c: Comic): string {
  return `${c.title}|${c.writer}`;
}

function mangaEntityKey(m: Manga): string {
  return `${m.title}|${m.author}`;
}

function manwhaEntityKey(m: Manwha): string {
  return `${m.title}|${m.author}`;
}

/** Clés des œuvres effectivement vues / lues / jouées (hors wishlists seules). */
type UserBaseGalaxyConsumption = {
  movies: Set<string>;
  series: Set<string>;
  games: Set<string>;
  books: Set<string>;
  bds: Set<string>;
  comics: Set<string>;
  mangas: Set<string>;
  manwhas: Set<string>;
};

type WithReadTimes = { readTimes?: number };

function mergeConsumedKeysByReadTimes<T extends WithReadTimes>(
  primary: T[],
  readlist: T[],
  keyFn: (row: T) => string
): Set<string> {
  const map = new Map<string, T>();
  const ingest = (arr: T[]) => {
    for (const row of arr) {
      const k = keyFn(row);
      const prev = map.get(k);
      const rt = row.readTimes ?? 0;
      const pr = prev?.readTimes ?? 0;
      if (!prev || rt > pr) {
        map.set(k, row);
      }
    }
  };
  ingest(primary);
  ingest(readlist);
  const out = new Set<string>();
  for (const [k, row] of map) {
    if ((row.readTimes ?? 0) > 0) {
      out.add(k);
    }
  }
  return out;
}

function buildUserBaseGalaxyConsumption(uid: string): UserBaseGalaxyConsumption {
  const movies = new Set(
    getLocalMoviesByUser(uid).map((m) => `${m.title}|${m.director}`)
  );
  const series = new Set<string>();
  for (const s of getLocalSeriesByUser(uid)) {
    if (s.seasons?.some((se) => (se.seasonTimesWatched ?? 0) > 0)) {
      series.add(`${s.title}|${s.director}`);
    }
  }
  const gameMap = new Map<string, UserGame>();
  const ingestGames = (arr: UserGame[]) => {
    for (const g of arr) {
      const k = `${g.title}|${g.editor}`;
      const prev = gameMap.get(k);
      const sc = g.sessions?.length ?? 0;
      const psc = prev?.sessions?.length ?? 0;
      if (!prev || sc > psc) {
        gameMap.set(k, g);
      }
    }
  };
  ingestGames(getLocalGamesByUser(uid));
  ingestGames(getLocalGamelistByUser(uid));
  const games = new Set<string>();
  for (const [k, g] of gameMap) {
    if (g.sessions && g.sessions.length > 0) {
      games.add(k);
    }
  }
  return {
    movies,
    series,
    games,
    books: mergeConsumedKeysByReadTimes(
      getLocalBooksByUser(uid),
      getLocalBooksReadlistByUser(uid),
      (b) => `${b.title}|${b.author}`
    ),
    bds: mergeConsumedKeysByReadTimes(
      getLocalBdsByUser(uid),
      getLocalBdsReadlistByUser(uid),
      (b) => `${b.title}|${b.writer}`
    ),
    comics: mergeConsumedKeysByReadTimes(
      getLocalComicsByUser(uid),
      getLocalComicsReadlistByUser(uid),
      (c) => `${c.title}|${c.writer}`
    ),
    mangas: mergeConsumedKeysByReadTimes(
      getLocalMangasByUser(uid),
      getLocalMangasReadlistByUser(uid),
      (m) => `${m.title}|${m.author}`
    ),
    manwhas: mergeConsumedKeysByReadTimes(
      getLocalManwhasByUser(uid),
      getLocalManwhasReadlistByUser(uid),
      (m) => `${m.title}|${m.author}`
    ),
  };
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

/**
 * Tome 1 de la franchise : sagaOrder === 1 (livre ou BD), sinon plus petit sagaOrder.
 * Sans livre ni BD : film le plus ancien (saga ciné partagée).
 */
function pickCentralGalaxyForFranchiseSaga(
  galaxies: BaseWorkGalaxy[]
): BaseWorkGalaxy {
  type Scored = { g: BaseWorkGalaxy; order: number };
  const scored: Scored[] = [];
  for (const g of galaxies) {
    if (g.book) {
      scored.push({ g, order: g.book.sagaOrder ?? 9999 });
    } else if (g.bd) {
      scored.push({ g, order: g.bd.sagaOrder ?? 9999 });
    }
  }
  if (scored.length > 0) {
    const order1 = scored.find((s) => s.order === 1);
    if (order1) {
      return order1.g;
    }
    return [...scored].sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.g.sourceTitle.localeCompare(b.g.sourceTitle, 'fr');
    })[0].g;
  }
  const withMovie = galaxies.filter((g) => g.movie);
  if (withMovie.length > 0) {
    return [...withMovie].sort((a, b) => {
      const da = movieReleaseDateMs(a.movie!);
      const db = movieReleaseDateMs(b.movie!);
      if (da !== db) return da - db;
      return a.sourceTitle.localeCompare(b.sourceTitle, 'fr');
    })[0];
  }
  return galaxies[0];
}

/** Livres + BD d’une même saga, triés par sagaOrder puis titre. */
function mergeVolumeSatellitesSorted(
  otherBooks: Book[],
  otherBds: Bd[]
): BaseWorkOrbitSatellite[] {
  type Tagged =
    | { kind: 'book'; data: Book; order: number; title: string }
    | { kind: 'bd'; data: Bd; order: number; title: string };
  const tagged: Tagged[] = [
    ...otherBooks.map((data) => ({
      kind: 'book' as const,
      data,
      order: data.sagaOrder ?? 9999,
      title: data.title,
    })),
    ...otherBds.map((data) => ({
      kind: 'bd' as const,
      data,
      order: data.sagaOrder ?? 9999,
      title: data.title,
    })),
  ];
  tagged.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.title.localeCompare(b.title, 'fr');
  });
  return tagged.map((t) =>
    t.kind === 'book'
      ? { kind: 'book' as const, data: t.data }
      : { kind: 'bd' as const, data: t.data }
  );
}

/** Clé de regroupement saga jeu (tolère chaînes mal copiées du type `saga: "Nom",`). */
function normalizedGameSagaKey(raw: string | undefined | null): string | null {
  let t = raw?.trim();
  if (!t) return null;
  const m = t.match(/"([^"]+)"/);
  if (m) t = m[1];
  t = t.trim();
  return t ? t.toLowerCase() : null;
}

function displayGameSagaName(raw: string | undefined | null): string {
  let t = raw?.trim() ?? '';
  const m = t.match(/"([^"]+)"/);
  if (m) t = m[1];
  return t.trim();
}

function gameReleaseDateMs(game: Game): number {
  const d = game.releaseDate?.trim();
  if (!d) return Number.MAX_SAFE_INTEGER;
  const ms = Date.parse(d);
  return Number.isNaN(ms) ? Number.MAX_SAFE_INTEGER : ms;
}

function movieReleaseDateMs(movie: Movie): number {
  const d = movie.releaseDate?.trim();
  if (!d) return Number.MAX_SAFE_INTEGER;
  const ms = Date.parse(d);
  return Number.isNaN(ms) ? Number.MAX_SAFE_INTEGER : ms;
}

/** Jeu le plus ancien de la franchise au centre (même éditeur / catalogue). */
function pickCentralGalaxyForGameSaga(
  galaxies: BaseWorkGalaxy[]
): BaseWorkGalaxy {
  const withGame = galaxies.filter((g) => g.game);
  if (withGame.length === 0) {
    return galaxies[0];
  }
  return [...withGame].sort((a, b) => {
    const da = gameReleaseDateMs(a.game!);
    const db = gameReleaseDateMs(b.game!);
    if (da !== db) return da - db;
    return a.game!.title.localeCompare(b.game!.title, 'fr');
  })[0];
}

/**
 * Saga de l’œuvre affichée au centre (même priorité que la vignette centrale).
 * Manga / manwha : pas de champ saga dans le modèle.
 */
function baseWorkSagaFromGalaxy(g: BaseWorkGalaxy): string | null {
  const raw =
    g.book?.saga ??
    g.bd?.saga ??
    g.comic?.saga ??
    g.game?.saga ??
    g.serie?.saga ??
    g.movie?.saga;
  const t = raw?.trim();
  return t ? t : null;
}

/** Titre de carte « Œuvres de base » : saga si renseignée, sinon titre + second identifiant. */
function baseWorkOrbitHeaderPrimaryLabel(g: BaseWorkGalaxy): string {
  const saga = baseWorkSagaFromGalaxy(g);
  if (saga) {
    return saga;
  }
  if (
    g.fromEntityType === 'manga' ||
    g.fromEntityType === 'manwha' ||
    g.fromEntityType === 'comic'
  ) {
    return g.sourceTitle?.trim() || `${g.sourceTitle} — ${g.sourceSecondKey}`;
  }
  return `${g.sourceTitle} — ${g.sourceSecondKey}`;
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
  allBaseBooks: BaseBook[],
  allBaseGames: BaseGame[]
): MixBaseWorkOrbitPanel {
  if (block.blockKind === 'standalone') {
    const g = block.galaxies[0];
    const movies = mergeDedupeMovies([g.derivedMovies]);
    const series = mergeDedupeSeries([g.derivedSeries]);
    let games = mergeDedupeGames([g.derivedGames]);

    const centralGame = g.game;
    const sagaNorm = normalizedGameSagaKey(centralGame?.saga);
    if (sagaNorm) {
      const centralGk = centralGame ? gameEntityKey(centralGame) : '';
      const sagaSiblings = allBaseGames
        .filter((bg) => {
          const sk = normalizedGameSagaKey(bg.saga);
          return (
            sk === sagaNorm &&
            (!centralGk || gameEntityKey(getFullGame(bg)) !== centralGk)
          );
        })
        .map((bg) => getFullGame(bg));
      games = mergeDedupeGames([games, sagaSiblings]);
    }

    const satellites: BaseWorkOrbitSatellite[] = [
      ...movies.map((data) => ({ kind: 'movie' as const, data })),
      ...series.map((data) => ({ kind: 'serie' as const, data })),
      ...games.map((data) => ({ kind: 'game' as const, data })),
    ];
    return {
      orbitKey: `bbwg-st:${g.uniqueKey}`,
      blockKind: 'standalone',
      headerPrimaryLabel: baseWorkOrbitHeaderPrimaryLabel(g),
      standaloneFromEntityType: g.fromEntityType,
      satelliteCount: satellites.length,
      central: centralFromGalaxy(g),
      satellites,
    };
  }

  if (block.blockKind === 'gameSaga') {
    const galaxies = block.galaxies;
    const centralGalaxy = pickCentralGalaxyForGameSaga(galaxies);
    const centralGame = centralGalaxy.game;
    const centralKey = centralGame ? gameEntityKey(centralGame) : '';

    const sagaKeyNorm = block.sagaKey;
    const movieLists = galaxies.map((gal) => gal.derivedMovies);
    const serieLists = galaxies.map((gal) => gal.derivedSeries);
    const gameLists = galaxies.map((gal) => gal.derivedGames);
    const movies = mergeDedupeMovies(movieLists);
    const series = mergeDedupeSeries(serieLists);
    let games = mergeDedupeGames(gameLists);

    const sagaGamesFromCatalog = allBaseGames
      .filter((bg) => normalizedGameSagaKey(bg.saga) === sagaKeyNorm)
      .map((bg) => getFullGame(bg));
    games = mergeDedupeGames([games, sagaGamesFromCatalog]);
    if (centralKey) {
      games = games.filter((gm) => gameEntityKey(gm) !== centralKey);
    }

    const satellites: BaseWorkOrbitSatellite[] = [
      ...movies.map((data) => ({ kind: 'movie' as const, data })),
      ...series.map((data) => ({ kind: 'serie' as const, data })),
      ...games.map((data) => ({ kind: 'game' as const, data })),
    ];

    return {
      orbitKey: `bbwg-game-saga:${block.sagaKey}`,
      blockKind: 'gameSaga',
      sagaDisplayName: block.sagaDisplayName,
      headerPrimaryLabel: block.sagaDisplayName,
      satelliteCount: satellites.length,
      central: centralFromGalaxy(centralGalaxy),
      satellites,
    };
  }

  const galaxies = block.galaxies;
  const centralGalaxy = pickCentralGalaxyForFranchiseSaga(galaxies);
  const centralBook = centralGalaxy.book;
  const centralKeyBook = centralBook ? bookEntityKey(centralBook) : '';

  /** Tous les tomes livre du catalogue dans cette saga (y compris sans adaptation). */
  const sagaKeyNorm = block.sagaKey;
  const booksInSagaCatalog = allBaseBooks.filter(
    (bb) => bb.saga?.trim().toLowerCase() === sagaKeyNorm
  );

  const otherBooks: Book[] = [];
  const bookSeen = new Set<string>();
  const pushBookIfNew = (b: Book): void => {
    const k = bookEntityKey(b);
    if (centralKeyBook && k === centralKeyBook) return;
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
  let games = mergeDedupeGames(gameLists);

  const sagaGamesFromCatalog = allBaseGames
    .filter((bg) => normalizedGameSagaKey(bg.saga) === sagaKeyNorm)
    .map((bg) => getFullGame(bg));
  games = mergeDedupeGames([games, sagaGamesFromCatalog]);

  /** Pas d’autres tomes BD sur l’anneau (évite des sagas énormes type Lucky Luke) : seul le tome 1 reste au centre. */
  const volumeSatellites = mergeVolumeSatellitesSorted(otherBooks, []);

  const satellites: BaseWorkOrbitSatellite[] = [
    ...volumeSatellites,
    ...movies.map((data) => ({ kind: 'movie' as const, data })),
    ...series.map((data) => ({ kind: 'serie' as const, data })),
    ...games.map((data) => ({ kind: 'game' as const, data })),
  ];

  return {
    orbitKey: `bbwg-saga:${block.sagaKey}`,
    blockKind: 'bookSaga',
    sagaDisplayName: block.sagaDisplayName,
    headerPrimaryLabel: block.sagaDisplayName,
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
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly impersonateService = inject(ImpersonateService);

  /** Incrémenté à chaque navigation pour recalculer l’utilisateur depuis l’URL (`/:id/...`). */
  private readonly routeUserRefreshNonce = signal(0);

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

  /**
   * Désactivé par défaut. Activé : atténue les vignettes que l’utilisateur effectif
   * n’a pas vue / lue / jouée (collections locales, mêmes règles que les fiches).
   */
  readonly emphasizeMyConsumedWorks = signal(false);

  readonly primaryViewOptions = mixPrimaryOptions;
  readonly adaptationSourceOptions = mixAdaptationSourceOptions;

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.routeUserRefreshNonce.update((n) => n + 1));
  }

  /** Utilisateur dont on applique les collections (impersonation, route, auth, défaut). */
  readonly effectiveUserIdLower = computed(() => {
    this.routeUserRefreshNonce();
    this.impersonateService.impersonatedUserId();
    this.authService.userId();
    const imp = this.impersonateService.impersonatedUserId();
    if (imp) {
      return imp;
    }
    const routeId = this.getRouteUserIdFromRouter();
    if (routeId) {
      return routeId.toLowerCase();
    }
    const auth = this.authService.getAuthenticatedUserId();
    return auth ? auth.toLowerCase() : DEFAULT_USER_ID;
  });

  readonly userBaseGalaxyConsumption = computed(() =>
    buildUserBaseGalaxyConsumption(this.effectiveUserIdLower())
  );

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

  private groupMoviesBySourceFromMovies(
    list: Movie[],
    options?: { titleOnlyLabel?: boolean }
  ): MoviesBySource[] {
    const titleOnly = options?.titleOnlyLabel === true;
    const map = new Map<string, Movie[]>();
    for (const m of list) {
      if (!m.fromEntity) continue;
      const key = `${m.fromEntity.title}|${m.fromEntity.secondEntityKey}`;
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([sourceKey, movies]) => {
      const fe = movies[0]?.fromEntity;
      const title = fe?.title?.trim() ?? '';
      const second = fe?.secondEntityKey?.trim() ?? '';
      const sourceLabel =
        titleOnly || !second ? title : `${title} — ${second}`;
      return { sourceKey, sourceLabel, movies };
    });
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
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('manga'), {
      titleOnlyLabel: true,
    })
  );

  readonly moviesFromManwhaBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('manwha'), {
      titleOnlyLabel: true,
    })
  );

  readonly moviesFromSeriesBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('serie'))
  );

  readonly moviesFromBdsBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFromBdCatalogFull())
  );

  readonly moviesFromComicBooksBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFromComicBooksFull(), {
      titleOnlyLabel: true,
    })
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
   * Les livres, les BD et les films catalogue partageant une même saga non vide sont regroupés ;
   * les hubs « jeu → film » dont le film catalogue a la même saga (ex. Star Wars) fusionnent
   * dans ce bloc au lieu de rester isolés.
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

    /** Franchise partagée : livres (saga) + films catalogue (movie.saga), même clé normalisée. */
    const franchiseSagaMap = new Map<
      string,
      { sagaDisplayName: string; galaxies: BaseWorkGalaxy[] }
    >();
    const sagaGameMap = new Map<
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

      const bookSagaTrim = galaxy.book?.saga?.trim();
      const bdSagaTrim = galaxy.bd?.saga?.trim();
      const movieSagaTrim = galaxy.movie?.saga?.trim();
      const gameSagaKey = normalizedGameSagaKey(galaxy.game?.saga);

      const addToFranchiseSaga = (
        sagaDisplay: string,
        gal: BaseWorkGalaxy
      ): void => {
        const sk = sagaDisplay.trim().toLowerCase();
        let entry = franchiseSagaMap.get(sk);
        if (!entry) {
          entry = { sagaDisplayName: sagaDisplay.trim(), galaxies: [] };
          franchiseSagaMap.set(sk, entry);
        }
        entry.galaxies.push(gal);
      };

      if (galaxy.fromEntityType === 'book' && bookSagaTrim) {
        addToFranchiseSaga(bookSagaTrim, galaxy);
      } else if (
        galaxy.fromEntityType === 'movie' &&
        movieSagaTrim
      ) {
        addToFranchiseSaga(movieSagaTrim, galaxy);
      } else if (galaxy.fromEntityType === 'bd' && bdSagaTrim) {
        addToFranchiseSaga(bdSagaTrim, galaxy);
      } else if (
        galaxy.fromEntityType === 'game' &&
        galaxy.game &&
        gameSagaKey
      ) {
        let entry = sagaGameMap.get(gameSagaKey);
        if (!entry) {
          entry = {
            sagaDisplayName: displayGameSagaName(galaxy.game.saga),
            galaxies: [],
          };
          sagaGameMap.set(gameSagaKey, entry);
        }
        entry.galaxies.push(galaxy);
      } else {
        standaloneGalaxies.push(galaxy);
      }
    }

    const sagaBlocks: MixBaseWorksViewBlock[] = Array.from(
      franchiseSagaMap.entries()
    ).map(([sagaKey, entry]) => {
      entry.galaxies.sort((a, b) => {
        const aBook = a.book != null ? 1 : 0;
        const bBook = b.book != null ? 1 : 0;
        if (aBook !== bBook) {
          return bBook - aBook;
        }
        if (a.book && b.book) {
          const ao = a.book.sagaOrder ?? 9999;
          const bo = b.book.sagaOrder ?? 9999;
          if (ao !== bo) return ao - bo;
        }
        const aBd = a.bd != null ? 1 : 0;
        const bBd = b.bd != null ? 1 : 0;
        if (aBd !== bBd) {
          return bBd - aBd;
        }
        if (a.bd && b.bd) {
          const ao = a.bd.sagaOrder ?? 9999;
          const bo = b.bd.sagaOrder ?? 9999;
          if (ao !== bo) return ao - bo;
        }
        const ar = a.movie ? movieReleaseDateMs(a.movie) : Number.MAX_SAFE_INTEGER;
        const br = b.movie ? movieReleaseDateMs(b.movie) : Number.MAX_SAFE_INTEGER;
        if (ar !== br) return ar - br;
        return a.sourceTitle.localeCompare(b.sourceTitle, 'fr');
      });
      return {
        blockKind: 'bookSaga' as const,
        sagaKey,
        sagaDisplayName: entry.sagaDisplayName,
        galaxies: entry.galaxies,
      };
    });

    const gameSagaBlocks: MixBaseWorksViewBlock[] = Array.from(
      sagaGameMap.entries()
    ).map(([sagaKey, entry]) => {
      entry.galaxies.sort((a, b) => {
        const ga = a.game;
        const gb = b.game;
        if (ga && gb) {
          const d = gameReleaseDateMs(ga) - gameReleaseDateMs(gb);
          if (d !== 0) return d;
        }
        return a.sourceTitle.localeCompare(b.sourceTitle, 'fr');
      });
      return {
        blockKind: 'gameSaga' as const,
        sagaKey,
        sagaDisplayName: entry.sagaDisplayName,
        galaxies: entry.galaxies,
      };
    });

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
      block.blockKind === 'bookSaga' || block.blockKind === 'gameSaga'
        ? block.sagaDisplayName
        : (block.galaxies[0]?.sourceTitle ?? '');

    return [...sagaBlocks, ...gameSagaBlocks, ...standaloneBlocks].sort((a, b) => {
      const diff = blockAdaptationTotal(b) - blockAdaptationTotal(a);
      if (diff !== 0) return diff;
      return blockSortLabel(a).localeCompare(blockSortLabel(b), 'fr');
    });
  });

  /** Panneaux « orbite » dérivés des blocs (centre = tome 1 ou œuvre isolée). */
  readonly mixBaseWorkOrbitPanels = computed<MixBaseWorkOrbitPanel[]>(() => {
    const books = this.baseBooks();
    const games = this.baseGames();
    const panels = this.mixBaseWorksBlocks().map((b) =>
      baseWorksBlockToOrbitPanel(b, books, games)
    );
    return panels.sort((a, b) => {
      const diff = b.satelliteCount - a.satelliteCount;
      if (diff !== 0) return diff;
      return a.headerPrimaryLabel.localeCompare(b.headerPrimaryLabel, 'fr');
    });
  });

  /** Texte de recherche sur les blocs Œuvres de base (titres, sagas, orbite). */
  readonly baseWorksSearchQuery = signal('');

  readonly mixBaseWorkOrbitPanelsFiltered = computed<MixBaseWorkOrbitPanel[]>(
    () => {
      const panels = this.mixBaseWorkOrbitPanels();
      const needle = normalizeForMixBaseSearch(this.baseWorksSearchQuery());
      if (!needle) {
        return panels;
      }
      return panels.filter((p) =>
        buildMixBaseWorkPanelSearchHaystack(p).includes(needle)
      );
    }
  );

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
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'book'
        );
      case 'movie':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.director,
          'movie'
        );
      case 'serie':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.director,
          'serie'
        );
      case 'game':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.editor,
          'game'
        );
      case 'bd':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.writer,
          'bd'
        );
      case 'comic':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.writer,
          'comic'
        );
      case 'manga':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'manga'
        );
      case 'manwha':
        return mixOrbitCover(
          sat.data.coverUrl,
          sat.data.title,
          sat.data.author,
          'manwha'
        );
    }
  }

  orbitCentralCover(central: MixBaseWorkOrbitPanel['central']): MixOrbitCoverInfo {
    if (central.book) {
      return mixOrbitCover(
        central.book.coverUrl,
        central.book.title,
        central.book.author,
        'book'
      );
    }
    if (central.bd) {
      return mixOrbitCover(
        central.bd.coverUrl,
        central.bd.title,
        central.bd.writer,
        'bd'
      );
    }
    if (central.comic) {
      return mixOrbitCover(
        central.comic.coverUrl,
        central.comic.title,
        central.comic.writer,
        'comic'
      );
    }
    if (central.manga) {
      return mixOrbitCover(
        central.manga.coverUrl,
        central.manga.title,
        central.manga.author,
        'manga'
      );
    }
    if (central.manwha) {
      return mixOrbitCover(
        central.manwha.coverUrl,
        central.manwha.title,
        central.manwha.author,
        'manwha'
      );
    }
    if (central.game) {
      return mixOrbitCover(
        central.game.coverUrl,
        central.game.title,
        central.game.editor,
        'game'
      );
    }
    if (central.serie) {
      return mixOrbitCover(
        central.serie.coverUrl,
        central.serie.title,
        central.serie.director,
        'serie'
      );
    }
    if (central.movie) {
      return mixOrbitCover(
        central.movie.coverUrl,
        central.movie.title,
        central.movie.director,
        'movie'
      );
    }
    const base = [central.placeholderTitle, central.placeholderSecond]
      .filter((s): s is string => Boolean(s?.trim()))
      .join(' — ');
    const kindLabel = central.placeholderEntityType
      ? mixOrbitEntityKindLabel(central.placeholderEntityType)
      : '';
    const suffix = kindLabel
      ? ` (${kindLabel}, absent du catalogue local)`
      : '';
    return {
      coverUrl: null,
      tooltip: (base + suffix).trim() || 'Œuvre de base',
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
    return mixOrbitEntityKindLabel(entityType);
  }

  onEmphasizeConsumedToggle(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }
    this.emphasizeMyConsumedWorks.set(input.checked);
  }

  onBaseWorksSearchInput(event: Event): void {
    const el = event.target as HTMLInputElement | null;
    this.baseWorksSearchQuery.set(el?.value ?? '');
  }

  /** Vignette centrale atténuée (toggle actif + œuvre absente des collections « consommées »). */
  orbitCentralIsDimmed(central: MixBaseWorkOrbitPanel['central']): boolean {
    if (!this.emphasizeMyConsumedWorks()) {
      return false;
    }
    return !this.isCentralConsumed(
      central,
      this.userBaseGalaxyConsumption()
    );
  }

  orbitSatelliteIsDimmed(sat: BaseWorkOrbitSatellite): boolean {
    if (!this.emphasizeMyConsumedWorks()) {
      return false;
    }
    return !this.isSatelliteConsumed(sat, this.userBaseGalaxyConsumption());
  }

  private getRouteUserIdFromRouter(): string | null {
    let route: ActivatedRoute | null = this.router.routerState.root;
    while (route) {
      const id = route.snapshot.params['id'];
      if (id) {
        return String(id);
      }
      route = route.firstChild;
    }
    return null;
  }

  private isCentralConsumed(
    central: MixBaseWorkOrbitPanel['central'],
    c: UserBaseGalaxyConsumption
  ): boolean {
    if (central.book) {
      return c.books.has(bookEntityKey(central.book));
    }
    if (central.bd) {
      return c.bds.has(bdEntityKey(central.bd));
    }
    if (central.comic) {
      return c.comics.has(comicEntityKey(central.comic));
    }
    if (central.manga) {
      return c.mangas.has(mangaEntityKey(central.manga));
    }
    if (central.manwha) {
      return c.manwhas.has(manwhaEntityKey(central.manwha));
    }
    if (central.game) {
      return c.games.has(gameEntityKey(central.game));
    }
    if (central.serie) {
      return c.series.has(serieEntityKey(central.serie));
    }
    if (central.movie) {
      return c.movies.has(movieEntityKey(central.movie));
    }
    return false;
  }

  private isSatelliteConsumed(
    sat: BaseWorkOrbitSatellite,
    c: UserBaseGalaxyConsumption
  ): boolean {
    switch (sat.kind) {
      case 'book':
        return c.books.has(bookEntityKey(sat.data));
      case 'bd':
        return c.bds.has(bdEntityKey(sat.data));
      case 'comic':
        return c.comics.has(comicEntityKey(sat.data));
      case 'manga':
        return c.mangas.has(mangaEntityKey(sat.data));
      case 'manwha':
        return c.manwhas.has(manwhaEntityKey(sat.data));
      case 'game':
        return c.games.has(gameEntityKey(sat.data));
      case 'serie':
        return c.series.has(serieEntityKey(sat.data));
      case 'movie':
        return c.movies.has(movieEntityKey(sat.data));
    }
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
