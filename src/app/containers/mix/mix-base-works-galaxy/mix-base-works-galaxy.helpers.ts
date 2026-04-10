import { getLocalMoviesByUser } from '../../../facades/movies/local-movies.facade';
import {
  getLocalBooksByUser,
  getLocalReadlistByUser as getLocalBooksReadlistByUser,
} from '../../../facades/books/local-books.facade';
import {
  getLocalBdsByUser,
  getLocalReadlistByUser as getLocalBdsReadlistByUser,
} from '../../../facades/bds/local-bds.facade';
import {
  getLocalComicsByUser,
  getLocalReadlistByUser as getLocalComicsReadlistByUser,
} from '../../../facades/comics/local-comics.facade';
import {
  getLocalMangasByUser,
  getLocalReadlistByUser as getLocalMangasReadlistByUser,
} from '../../../facades/mangas/local-mangas.facade';
import {
  getLocalManwhasByUser,
  getLocalReadlistByUser as getLocalManwhasReadlistByUser,
} from '../../../facades/manwhas/local-manwhas.facade';
import {
  getLocalGamesByUser,
  getLocalGamelistByUser,
} from '../../../facades/games/local-games.facade';
import { getLocalSeriesByUser } from '../../../facades/series/local-series.facade';
import {
  getFullBd,
  getFullBook,
  getFullComic,
  getFullGame,
  getFullManwha,
  getFullManga,
  getFullMovie,
  getFullSerie,
} from '../../../helpers/full-entities-helper';
import { BaseBd } from '../../../models/bd-model';
import { BaseBook } from '../../../models/book-model';
import { BaseComic } from '../../../models/comic-model';
import { BaseGame, UserGame } from '../../../models/game-model';
import { BaseManwha } from '../../../models/manwha-model';
import { BaseManga } from '../../../models/manga-model';
import { BaseMovie } from '../../../models/movie-model';
import { BaseSerie } from '../../../models/serie-model';
import type {
  GameFromEntityType,
  MovieFromEntityType,
} from '../../../models/from-entity.model';
import { Bd } from '../../../models/bd-model';
import { Book } from '../../../models/book-model';
import { Comic } from '../../../models/comic-model';
import { Game } from '../../../models/game-model';
import { Manwha } from '../../../models/manwha-model';
import { Manga } from '../../../models/manga-model';
import { Movie } from '../../../models/movie-model';
import { Serie } from '../../../models/serie-model';

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
  /** Œuvres catalogue déclarant ce hub comme source (livre, manga, etc.). */
  derivedBooks: Book[];
  derivedBds: Bd[];
  derivedComics: Comic[];
  derivedMangas: Manga[];
  derivedManwhas: Manwha[];
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
  standaloneFromEntityType?: string;
  satelliteCount: number;
  /** Score d’export transmédia (pondération 1 / 5), pour le tri des cartes. */
  crossMediaExportScore?: number;
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

/** Films, séries et jeux : adaptations « transmedia » (hors lectures seules). */
export function isAdaptationOrbitSatellite(
  sat: BaseWorkOrbitSatellite
): boolean {
  return (
    sat.kind === 'movie' ||
    sat.kind === 'serie' ||
    sat.kind === 'game'
  );
}

/**
 * Orbite double : ~⅓ des satellites sur l’anneau intérieur, ~⅔ sur l’extérieur
 * (arrondi au satellite près).
 */
export function dualRingInnerSlotCount(total: number): number {
  return Math.max(1, Math.min(total - 1, Math.round(total / 3)));
}

/**
 * Répartit les satellites sur deux anneaux (~1/3 intérieur, ~2/3 extérieur) en
 * gardant la proportion d’adaptations (film / série / jeu) sur chaque anneau.
 */
export function partitionOrbitSatellitesForDualRing(
  sats: BaseWorkOrbitSatellite[]
): { inner: BaseWorkOrbitSatellite[]; outer: BaseWorkOrbitSatellite[] } {
  const total = sats.length;
  const innerCount = dualRingInnerSlotCount(total);
  const adaptPositions: number[] = [];
  const staticPositions: number[] = [];
  for (let i = 0; i < sats.length; i++) {
    if (isAdaptationOrbitSatellite(sats[i])) {
      adaptPositions.push(i);
    } else {
      staticPositions.push(i);
    }
  }
  const adaptCount = adaptPositions.length;
  const targetAdaptInner = Math.min(
    adaptCount,
    Math.round((adaptCount * innerCount) / total)
  );
  const staticInnerCount = innerCount - targetAdaptInner;
  const innerAdaptSet = new Set(
    adaptPositions.slice(0, targetAdaptInner)
  );
  const innerStaticSet = new Set(
    staticPositions.slice(0, staticInnerCount)
  );
  const inner: BaseWorkOrbitSatellite[] = [];
  for (let i = 0; i < sats.length; i++) {
    if (innerAdaptSet.has(i) || innerStaticSet.has(i)) {
      inner.push(sats[i]);
    }
  }
  const innerIndexSet = new Set([...innerAdaptSet, ...innerStaticSet]);
  const outer = sats.filter((_, i) => !innerIndexSet.has(i));
  return { inner, outer };
}

/** Normalise pour recherche insensible aux accents et à la casse. */
export function normalizeForMixBaseSearch(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function buildMixBaseWorkPanelSearchHaystack(
  panel: MixBaseWorkOrbitPanel
): string {
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

/**
 * Sagas « franchise » exclues du regroupement « Œuvres de base » (hub orbite).
 */
const BASE_WORKS_EXCLUDED_FRANCHISE_SAGA_KEYS = new Set<string>([
  'disney classique',
]);

export function mixOrbitEntityKindLabel(kind: string): string {
  return MIX_ORBIT_ENTITY_LABELS[kind] ?? kind;
}

function mixOrbitTrimCoverUrl(url: string | undefined | null): string | null {
  const t = url?.trim();
  return t ? t : null;
}

export function mixOrbitCover(
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

export function movieEntityKey(m: Movie): string {
  return `${m.title}|${m.director}`;
}

export function serieEntityKey(s: Serie): string {
  return `${s.title}|${s.director}`;
}

export function gameEntityKey(g: Game): string {
  return `${g.title}|${g.editor}`;
}

export function bookEntityKey(b: Book): string {
  return `${b.title}|${b.author}`;
}

export function bdEntityKey(b: Bd): string {
  return `${b.title}|${b.writer}`;
}

export function comicEntityKey(c: Comic): string {
  return `${c.title}|${c.writer}`;
}

export function mangaEntityKey(m: Manga): string {
  return `${m.title}|${m.author}`;
}

export function manwhaEntityKey(m: Manwha): string {
  return `${m.title}|${m.author}`;
}

/**
 * Type de média catalogue pour la pondération transmédia : même type que l’œuvre
 * d’origine du bloc = 1 pt, tout autre type = 5 pts.
 */
type MixBaseScoreKind =
  | 'book'
  | 'bd'
  | 'comic'
  | 'manga'
  | 'manwha'
  | 'game'
  | 'movie'
  | 'serie';

const MIX_BASE_WORK_SAME_MEDIUM_WEIGHT = 1;
const MIX_BASE_WORK_CROSS_MEDIUM_WEIGHT = 5;

/** Tranches catalogue alignées sur le merge de l’orbite (sagas jeux / livres). */
export type MixBaseWorksScoreCatalog = {
  baseBooks: BaseBook[];
  baseMovies: BaseMovie[];
  baseSeries: BaseSerie[];
  baseGames: BaseGame[];
};

/**
 * Type pivot déduit de la galaxie centrale (entité résolue, sinon fromEntityType).
 */
function mixBasePrimaryScoreKindFromGalaxy(
  g: BaseWorkGalaxy | undefined | null
): MixBaseScoreKind {
  if (!g) {
    return 'book';
  }
  if (g.game) return 'game';
  if (g.movie) return 'movie';
  if (g.serie) return 'serie';
  if (g.book) return 'book';
  if (g.bd) return 'bd';
  if (g.comic) return 'comic';
  if (g.manga) return 'manga';
  if (g.manwha) return 'manwha';

  const t = g.fromEntityType;
  if (t === 'game') return 'game';
  if (t === 'movie') return 'movie';
  if (t === 'serie') return 'serie';
  if (t === 'book') return 'book';
  if (t === 'bd') return 'bd';
  if (t === 'comic') return 'comic';
  if (t === 'manga') return 'manga';
  if (t === 'manwha') return 'manwha';

  return 'book';
}

/**
 * Type de l’œuvre d’origine du bloc : même logique de pivot que l’orbite
 * (saga franchise : {@link pickCentralGalaxyForFranchiseSaga} ; saga jeux : jeu).
 */
function mixBaseBlockPrimaryScoreKind(block: MixBaseWorksViewBlock): MixBaseScoreKind {
  if (block.blockKind === 'gameSaga') {
    return 'game';
  }
  if (block.blockKind === 'bookSaga') {
    const central = pickCentralGalaxyForFranchiseSaga(block.galaxies);
    return mixBasePrimaryScoreKindFromGalaxy(central);
  }
  return mixBasePrimaryScoreKindFromGalaxy(block.galaxies[0]);
}

function mixBaseWeightForKinds(
  workKind: MixBaseScoreKind,
  primary: MixBaseScoreKind
): number {
  return workKind === primary
    ? MIX_BASE_WORK_SAME_MEDIUM_WEIGHT
    : MIX_BASE_WORK_CROSS_MEDIUM_WEIGHT;
}

/**
 * Texte d’infobulle pour le score affiché sur le titre de bloc (pondération 1 / 5).
 */
export function mixBaseWorksCrossMediaScoreTooltip(score: number): string {
  return `Score d'export transmédia : ${score} points (même type que l'œuvre d'origine ×${MIX_BASE_WORK_SAME_MEDIUM_WEIGHT}, adaptation autre type ×${MIX_BASE_WORK_CROSS_MEDIUM_WEIGHT})`;
}

/**
 * Ajoute au score les entrées catalogue fusionnées comme dans l’orbite (ex. tous
 * les jeux d’une saga jeu, pas seulement les hubs touchés par un fromEntity).
 */
function addCatalogWorksToBlockCrossMediaScore(
  block: MixBaseWorksViewBlock,
  catalog: MixBaseWorksScoreCatalog,
  add: (
    kind:
      | 'book'
      | 'bd'
      | 'comic'
      | 'manga'
      | 'manwha'
      | 'game'
      | 'movie'
      | 'serie',
    entityKey: string
  ) => void
): void {
  if (block.blockKind === 'gameSaga') {
    const key = block.sagaKey;
    for (const bg of catalog.baseGames) {
      if (normalizedGameSagaKey(bg.saga) === key) {
        add('game', gameEntityKey(getFullGame(bg)));
      }
    }
    return;
  }

  if (block.blockKind === 'bookSaga') {
    const sagaKeyNorm = block.sagaKey;
    for (const bb of catalog.baseBooks) {
      if (bb.saga?.trim().toLowerCase() === sagaKeyNorm) {
        add('book', bookEntityKey(getFullBook(bb)));
      }
    }
    for (const bm of catalog.baseMovies) {
      if (bm.saga?.trim().toLowerCase() === sagaKeyNorm) {
        add('movie', movieEntityKey(getFullMovie(bm)));
      }
    }
    for (const bs of catalog.baseSeries) {
      if (bs.saga?.trim().toLowerCase() === sagaKeyNorm) {
        add('serie', serieEntityKey(getFullSerie(bs)));
      }
    }
    for (const bg of catalog.baseGames) {
      if (normalizedGameSagaKey(bg.saga) === sagaKeyNorm) {
        add('game', gameEntityKey(getFullGame(bg)));
      }
    }
    return;
  }

  const g = block.galaxies[0];
  if (!g?.game) {
    return;
  }
  const sagaNorm = normalizedGameSagaKey(g.game.saga);
  if (!sagaNorm) {
    return;
  }
  for (const bg of catalog.baseGames) {
    if (normalizedGameSagaKey(bg.saga) === sagaNorm) {
      add('game', gameEntityKey(getFullGame(bg)));
    }
  }
}

/**
 * Score pour classer les blocs « œuvres de base » : favorise les franchises
 * exportées sur plusieurs supports (film, jeu, etc.), pas seulement le volume
 * d’œuvres dans un seul média.
 *
 * - **1 point** : œuvre du **même type** que l’œuvre d’origine du bloc (film, jeu,
 *   livre, BD, manga, etc.), déduite du pivot de saga / hub standalone.
 * - **5 points** : œuvre d’un **autre type** (adaptation transmédia).
 *
 * Déduplication par clé catalogue (type + identité) sur tout le bloc.
 * Les œuvres catalogue rattachées à la même saga que l’orbite (jeux, livres, films…)
 * sont incluses même si elles ne sont pas centre d’un hub « fromEntity ».
 */
export function blockCrossMediaExportScore(
  block: MixBaseWorksViewBlock,
  catalog: MixBaseWorksScoreCatalog
): number {
  const primary = mixBaseBlockPrimaryScoreKind(block);
  const seen = new Set<string>();
  let total = 0;

  const add = (
    kind: MixBaseScoreKind,
    entityKey: string
  ): void => {
    const id = `${kind}:${entityKey}`;
    if (seen.has(id)) return;
    seen.add(id);
    total += mixBaseWeightForKinds(kind, primary);
  };

  for (const gal of block.galaxies) {
    if (gal.book) add('book', bookEntityKey(gal.book));
    if (gal.bd) add('bd', bdEntityKey(gal.bd));
    if (gal.comic) add('comic', comicEntityKey(gal.comic));
    if (gal.manga) add('manga', mangaEntityKey(gal.manga));
    if (gal.manwha) add('manwha', manwhaEntityKey(gal.manwha));
    if (gal.game) add('game', gameEntityKey(gal.game));
    if (gal.movie) add('movie', movieEntityKey(gal.movie));
    if (gal.serie) add('serie', serieEntityKey(gal.serie));

    for (const m of gal.derivedMovies) add('movie', movieEntityKey(m));
    for (const s of gal.derivedSeries) add('serie', serieEntityKey(s));
    for (const g of gal.derivedGames) add('game', gameEntityKey(g));
    for (const b of gal.derivedBooks) add('book', bookEntityKey(b));
    for (const b of gal.derivedBds) add('bd', bdEntityKey(b));
    for (const c of gal.derivedComics) add('comic', comicEntityKey(c));
    for (const m of gal.derivedMangas) add('manga', mangaEntityKey(m));
    for (const m of gal.derivedManwhas) add('manwha', manwhaEntityKey(m));
  }

  addCatalogWorksToBlockCrossMediaScore(block, catalog, add);

  return total;
}

/** Clés des œuvres effectivement vues / lues / jouées (hors wishlists seules). */
export type UserBaseGalaxyConsumption = {
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

export function buildUserBaseGalaxyConsumption(
  uid: string
): UserBaseGalaxyConsumption {
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

function mergeDedupeBooks(lists: Book[][]): Book[] {
  const map = new Map<string, Book>();
  for (const arr of lists) {
    for (const b of arr) {
      map.set(bookEntityKey(b), b);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

function mergeDedupeBds(lists: Bd[][]): Bd[] {
  const map = new Map<string, Bd>();
  for (const arr of lists) {
    for (const b of arr) {
      map.set(bdEntityKey(b), b);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

function mergeDedupeComics(lists: Comic[][]): Comic[] {
  const map = new Map<string, Comic>();
  for (const arr of lists) {
    for (const c of arr) {
      map.set(comicEntityKey(c), c);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

function mergeDedupeMangas(lists: Manga[][]): Manga[] {
  const map = new Map<string, Manga>();
  for (const arr of lists) {
    for (const m of arr) {
      map.set(mangaEntityKey(m), m);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

function mergeDedupeManwhas(lists: Manwha[][]): Manwha[] {
  const map = new Map<string, Manwha>();
  for (const arr of lists) {
    for (const m of arr) {
      map.set(manwhaEntityKey(m), m);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

/**
 * Mangas, manhwas, livres, BD, comics « dérivés » (catalogue avec fromEntity vers le hub),
 * hors entité déjà au centre de l’orbite.
 */
function orbitStaticMediaSatellitesForGalaxies(
  galaxies: BaseWorkGalaxy[],
  central: BaseWorkGalaxy
): BaseWorkOrbitSatellite[] {
  const ckBook = central.book ? bookEntityKey(central.book) : '';
  const ckBd = central.bd ? bdEntityKey(central.bd) : '';
  const ckComic = central.comic ? comicEntityKey(central.comic) : '';
  const ckManga = central.manga ? mangaEntityKey(central.manga) : '';
  const ckManwha = central.manwha ? manwhaEntityKey(central.manwha) : '';

  let books = mergeDedupeBooks(galaxies.map((g) => g.derivedBooks));
  if (ckBook) {
    books = books.filter((b) => bookEntityKey(b) !== ckBook);
  }
  let bds = mergeDedupeBds(galaxies.map((g) => g.derivedBds));
  if (ckBd) {
    bds = bds.filter((b) => bdEntityKey(b) !== ckBd);
  }
  let comics = mergeDedupeComics(galaxies.map((g) => g.derivedComics));
  if (ckComic) {
    comics = comics.filter((c) => comicEntityKey(c) !== ckComic);
  }
  let mangas = mergeDedupeMangas(galaxies.map((g) => g.derivedMangas));
  if (ckManga) {
    mangas = mangas.filter((m) => mangaEntityKey(m) !== ckManga);
  }
  let manwhas = mergeDedupeManwhas(galaxies.map((g) => g.derivedManwhas));
  if (ckManwha) {
    manwhas = manwhas.filter((m) => manwhaEntityKey(m) !== ckManwha);
  }

  return [
    ...books.map((data) => ({ kind: 'book' as const, data })),
    ...bds.map((data) => ({ kind: 'bd' as const, data })),
    ...comics.map((data) => ({ kind: 'comic' as const, data })),
    ...mangas.map((data) => ({ kind: 'manga' as const, data })),
    ...manwhas.map((data) => ({ kind: 'manwha' as const, data })),
  ];
}

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

function serieReleaseDateMs(serie: Serie): number {
  const d = serie.releaseDate?.trim();
  if (!d) return Number.MAX_SAFE_INTEGER;
  const ms = Date.parse(d);
  return Number.isNaN(ms) ? Number.MAX_SAFE_INTEGER : ms;
}

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
  allBaseMovies: BaseMovie[],
  allBaseSeries: BaseSerie[],
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

    const staticSats = orbitStaticMediaSatellitesForGalaxies([g], g);
    const satellites: BaseWorkOrbitSatellite[] = [
      ...staticSats,
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

    const staticSats = orbitStaticMediaSatellitesForGalaxies(
      galaxies,
      centralGalaxy
    );
    const satellites: BaseWorkOrbitSatellite[] = [
      ...staticSats,
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
  const centralMovie = centralGalaxy.movie;
  const centralSerie = centralGalaxy.serie;
  const centralKeyBook = centralBook ? bookEntityKey(centralBook) : '';
  const centralKeyMovie = centralMovie ? movieEntityKey(centralMovie) : '';
  const centralKeySerie = centralSerie ? serieEntityKey(centralSerie) : '';

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
  const moviesFromGalaxies = mergeDedupeMovies(movieLists);
  const moviesInSagaCatalog = allBaseMovies
    .filter((bm) => bm.saga?.trim().toLowerCase() === sagaKeyNorm)
    .map((bm) => getFullMovie(bm));
  let orbitMovies = mergeDedupeMovies([
    moviesFromGalaxies,
    moviesInSagaCatalog,
  ]);
  if (centralKeyMovie) {
    orbitMovies = orbitMovies.filter(
      (m) => movieEntityKey(m) !== centralKeyMovie
    );
  }
  orbitMovies.sort((a, b) => {
    const d = movieReleaseDateMs(a) - movieReleaseDateMs(b);
    if (d !== 0) return d;
    return a.title.localeCompare(b.title, 'fr');
  });

  const seriesFromGalaxies = mergeDedupeSeries(serieLists);
  const seriesInSagaCatalog = allBaseSeries
    .filter((bs) => bs.saga?.trim().toLowerCase() === sagaKeyNorm)
    .map((bs) => getFullSerie(bs));
  let orbitSeries = mergeDedupeSeries([
    seriesFromGalaxies,
    seriesInSagaCatalog,
  ]);
  if (centralKeySerie) {
    orbitSeries = orbitSeries.filter(
      (s) => serieEntityKey(s) !== centralKeySerie
    );
  }
  orbitSeries.sort((a, b) => {
    const d = serieReleaseDateMs(a) - serieReleaseDateMs(b);
    if (d !== 0) return d;
    return a.title.localeCompare(b.title, 'fr');
  });

  let games = mergeDedupeGames(gameLists);

  const sagaGamesFromCatalog = allBaseGames
    .filter((bg) => normalizedGameSagaKey(bg.saga) === sagaKeyNorm)
    .map((bg) => getFullGame(bg));
  games = mergeDedupeGames([games, sagaGamesFromCatalog]);

  const volumeSatellites = mergeVolumeSatellitesSorted(otherBooks, []);

  const staticSats = orbitStaticMediaSatellitesForGalaxies(
    galaxies,
    centralGalaxy
  );

  const satellites: BaseWorkOrbitSatellite[] = [
    ...volumeSatellites,
    ...staticSats,
    ...orbitMovies.map((data) => ({ kind: 'movie' as const, data })),
    ...orbitSeries.map((data) => ({ kind: 'serie' as const, data })),
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

export function buildMixBaseWorksBlocks(
  baseBooks: BaseBook[],
  baseBds: BaseBd[],
  baseComics: BaseComic[],
  baseMangas: BaseManga[],
  baseManwhas: BaseManwha[],
  baseGames: BaseGame[],
  baseSeries: BaseSerie[],
  baseMovies: BaseMovie[]
): MixBaseWorksViewBlock[] {
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
    derivedBooks: Book[];
    derivedBds: Bd[];
    derivedComics: Comic[];
    derivedMangas: Manga[];
    derivedManwhas: Manwha[];
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
        derivedBooks: [],
        derivedBds: [],
        derivedComics: [],
        derivedMangas: [],
        derivedManwhas: [],
      };
      map.set(uniqueKey, g);
    }
    fn(g);
  };

  for (const bm of baseMovies) {
    const fe = bm.fromEntity;
    if (!fe) continue;
    touchGalaxy(fe, (g) => g.derivedMovies.push(getFullMovie(bm)));
  }

  for (const bs of baseSeries) {
    const fe = bs.fromEntity;
    if (!fe) continue;
    touchGalaxy(fe, (g) => g.derivedSeries.push(getFullSerie(bs)));
  }

  for (const bg of baseGames) {
    const fe = bg.fromEntity;
    if (!fe) continue;
    touchGalaxy(fe, (g) => g.derivedGames.push(getFullGame(bg)));
  }

  // Livres / BD / comics / manhwas : pas de `fromEntity` sur les types catalogue pour l’instant.
  // Les `derived*` correspondants restent pour l’UI (satellites) si on les alimente plus tard.

  for (const bm of baseMangas) {
    const fe = bm.fromEntity;
    if (!fe) continue;
    touchGalaxy(fe, (g) => g.derivedMangas.push(getFullManga(bm)));
  }

  const books = baseBooks;
  const bds = baseBds;
  const comics = baseComics;
  const mangas = baseMangas;
  const manwhas = baseManwhas;
  const games = baseGames;
  const series = baseSeries;
  const movies = baseMovies;

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
      derivedBooks: g.derivedBooks,
      derivedBds: g.derivedBds,
      derivedComics: g.derivedComics,
      derivedMangas: g.derivedMangas,
      derivedManwhas: g.derivedManwhas,
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
      if (BASE_WORKS_EXCLUDED_FRANCHISE_SAGA_KEYS.has(sk)) {
        standaloneGalaxies.push(gal);
        return;
      }
      let entry = franchiseSagaMap.get(sk);
      if (!entry) {
        entry = { sagaDisplayName: sagaDisplay.trim(), galaxies: [] };
        franchiseSagaMap.set(sk, entry);
      }
      entry.galaxies.push(gal);
    };

    if (galaxy.fromEntityType === 'book' && bookSagaTrim) {
      addToFranchiseSaga(bookSagaTrim, galaxy);
    } else if (galaxy.fromEntityType === 'movie' && movieSagaTrim) {
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

  const blockSortLabel = (block: MixBaseWorksViewBlock): string =>
    block.blockKind === 'bookSaga' || block.blockKind === 'gameSaga'
      ? block.sagaDisplayName
      : (block.galaxies[0]?.sourceTitle ?? '');

  const scoreCatalog: MixBaseWorksScoreCatalog = {
    baseBooks,
    baseMovies,
    baseSeries,
    baseGames,
  };

  return [...sagaBlocks, ...gameSagaBlocks, ...standaloneBlocks].sort((a, b) => {
    const diff =
      blockCrossMediaExportScore(b, scoreCatalog) -
      blockCrossMediaExportScore(a, scoreCatalog);
    if (diff !== 0) return diff;
    return blockSortLabel(a).localeCompare(blockSortLabel(b), 'fr');
  });
}

export function buildMixBaseWorkOrbitPanelsSorted(
  blocks: MixBaseWorksViewBlock[],
  baseBooks: BaseBook[],
  baseMovies: BaseMovie[],
  baseSeries: BaseSerie[],
  baseGames: BaseGame[]
): MixBaseWorkOrbitPanel[] {
  const scoreCatalog: MixBaseWorksScoreCatalog = {
    baseBooks,
    baseMovies,
    baseSeries,
    baseGames,
  };
  const panels = blocks.map((b) => {
    const panel = baseWorksBlockToOrbitPanel(
      b,
      baseBooks,
      baseMovies,
      baseSeries,
      baseGames
    );
    return {
      ...panel,
      crossMediaExportScore: blockCrossMediaExportScore(b, scoreCatalog),
    };
  });
  return panels.sort((a, b) => {
    const scoreA = a.crossMediaExportScore ?? 0;
    const scoreB = b.crossMediaExportScore ?? 0;
    const diff = scoreB - scoreA;
    if (diff !== 0) return diff;
    const sat = b.satelliteCount - a.satelliteCount;
    if (sat !== 0) return sat;
    return a.headerPrimaryLabel.localeCompare(b.headerPrimaryLabel, 'fr');
  });
}

export function isCentralConsumed(
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

export function isSatelliteConsumed(
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
