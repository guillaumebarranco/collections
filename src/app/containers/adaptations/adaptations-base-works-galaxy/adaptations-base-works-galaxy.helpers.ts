import { fetchUserMoviesFromApi } from '../../../facades/movies/api-movies.facade';
import {
  fetchUserBooksFromApi,
  fetchReadlistBooksFromApi,
} from '../../../facades/books/api-books.facade';
import {
  fetchUserBdsFromApi,
  fetchReadlistBdsFromApi,
} from '../../../facades/bds/api-bds.facade';
import {
  fetchUserComicsFromApi,
  fetchReadlistComicsFromApi,
} from '../../../facades/comics/api-comics.facade';
import {
  fetchUserMangasFromApi,
  fetchReadlistMangasFromApi,
} from '../../../facades/mangas/api-mangas.facade';
import {
  fetchUserManwhasFromApi,
  fetchReadlistManwhasFromApi,
} from '../../../facades/manwhas/api-manwhas.facade';
import {
  fetchUserGamesFromApi,
  fetchGamelistGamesFromApi,
} from '../../../facades/games/api-games.facade';
import { fetchUserSeriesFromApi } from '../../../facades/series/api-series.facade';
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
export type AdaptationsBaseWorksViewBlock =
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

/** Nombre minimum d’œuvres (centre + satellites) pour afficher un bloc « licence ». */
export const ADAPTATIONS_BASE_LICENSE_GALAXY_MIN_WORKS = 3;

/** Une carte « galaxie » : un seul centre + anneau fusionné. */
export type AdaptationsBaseWorkOrbitPanel = {
  orbitKey: string;
  blockKind: 'bookSaga' | 'gameSaga' | 'standalone';
  sagaDisplayName?: string;
  headerPrimaryLabel: string;
  standaloneFromEntityType?: string;
  satelliteCount: number;
  /** Année de l’œuvre de base (centre), si une date catalogue est connue. */
  baseWorkYear: number | null;
  /** Nombre d’années depuis l’année de base jusqu’à l’année en cours (min. 1). */
  licenseExistenceYears: number | null;
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
export type AdaptationsOrbitCoverInfo = {
  coverUrl: string | null;
  tooltip: string;
};

/** Films, séries et jeux : adaptations « transmedia » (hors lectures seules). */
export function isAdaptationOrbitSatellite(
  sat: BaseWorkOrbitSatellite
): boolean {
  return sat.kind === 'movie' || sat.kind === 'serie' || sat.kind === 'game';
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
  const innerAdaptSet = new Set(adaptPositions.slice(0, targetAdaptInner));
  const innerStaticSet = new Set(staticPositions.slice(0, staticInnerCount));
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
export function normalizeForAdaptationsBaseSearch(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function buildAdaptationsBaseWorkPanelSearchHaystack(
  panel: AdaptationsBaseWorkOrbitPanel
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
  return normalizeForAdaptationsBaseSearch(parts.filter(Boolean).join(' '));
}

/** Libellés FR des types d’entité (orbite + adaptations). */
const ADAPTATIONS_ORBIT_ENTITY_LABELS: Record<string, string> = {
  book: 'Livre',
  bd: 'BD',
  comic: 'Comics',
  manga: 'Manga',
  manwha: 'Manhwa',
  game: 'Jeu vidéo',
  serie: 'Série TV',
  movie: 'Film',
};

/**
 * Sagas « franchise » exclues du regroupement « Galaxie des licences » (hub orbite).
 */
const BASE_WORKS_EXCLUDED_FRANCHISE_SAGA_KEYS = new Set<string>([
  'disney classique',
]);

/**
 * Sagas catalogue rattachées à une licence « parente » : même bloc galaxie, même
 * orbite et mêmes règles de score (ex. Lupin III dérivé d’Arsène Leblanc).
 * Clés = {@link String.prototype.toLowerCase} sur le libellé saga catalogue.
 */
const FRANCHISE_SAGA_ALIAS_TO_CANONICAL: Record<string, string> = {
  'lupin iii': 'arsène lupin',
};

const FRANCHISE_SAGA_CANONICAL_DISPLAY: Record<string, string> = {
  'arsène lupin': 'Arsène Lupin',
};

function canonicalFranchiseSagaKey(sagaKeyNormalized: string): string {
  return (
    FRANCHISE_SAGA_ALIAS_TO_CANONICAL[sagaKeyNormalized] ?? sagaKeyNormalized
  );
}

function preferredFranchiseSagaDisplayName(
  canonicalKey: string
): string | null {
  return FRANCHISE_SAGA_CANONICAL_DISPLAY[canonicalKey] ?? null;
}

/** Livres, films, séries, mangas… : inclusion orbite / score franchise. */
function catalogFranchiseSagaMatchesBlock(
  sagaRaw: string | undefined | null,
  blockSagaKeyNorm: string
): boolean {
  const n = sagaRaw?.trim().toLowerCase();
  if (!n) return false;
  return canonicalFranchiseSagaKey(n) === blockSagaKeyNorm;
}

/** Jeux : saga jeu normalisée vs clé de bloc franchise (déjà canonique). */
function gameSagaMatchesBookSagaBlock(
  gameSagaRaw: string | undefined | null,
  blockSagaKeyNorm: string
): boolean {
  const gk = normalizedGameSagaKey(gameSagaRaw);
  if (!gk) return false;
  return canonicalFranchiseSagaKey(gk) === blockSagaKeyNorm;
}

export function adaptationsOrbitEntityKindLabel(kind: string): string {
  return ADAPTATIONS_ORBIT_ENTITY_LABELS[kind] ?? kind;
}

function adaptationsOrbitTrimCoverUrl(
  url: string | undefined | null
): string | null {
  const t = url?.trim();
  return t ? t : null;
}

export function adaptationsOrbitCover(
  coverUrl: string | undefined | null,
  title: string,
  secondLine?: string,
  entityKindKey?: string
): AdaptationsOrbitCoverInfo {
  const main = secondLine?.trim()
    ? `${title.trim()} — ${secondLine.trim()}`
    : title.trim();
  const base = main || 'Sans titre';
  const kindLabel =
    entityKindKey && entityKindKey.trim()
      ? adaptationsOrbitEntityKindLabel(entityKindKey.trim())
      : '';
  const tooltip = kindLabel ? `${base} · ${kindLabel}` : base;
  return {
    coverUrl: adaptationsOrbitTrimCoverUrl(coverUrl),
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
 * Type de média catalogue pour la pondération transmédia (voir
 * {@link adaptationsBaseWeightForKinds} et {@link blockCrossMediaExportScore}).
 */
type AdaptationsBaseScoreKind =
  | 'book'
  | 'bd'
  | 'comic'
  | 'manga'
  | 'manwha'
  | 'game'
  | 'movie'
  | 'serie';

const ADAPTATIONS_BASE_WORK_SAME_MEDIUM_WEIGHT = 2;
const ADAPTATIONS_BASE_WORK_CROSS_MEDIUM_WEIGHT = 5;

/** Pivot BD ou comic : chaque album / série graphique de la saga compte 0,5 pt (pas 2). */
const ADAPTATIONS_BASE_GRAPHIC_SERIAL_SAGA_WEIGHT = 0.5;

/** Pivot manga : 0,5 pt par tome catalogue (= 0,5 × nbTomes par série). */
const ADAPTATIONS_BASE_MANGA_TOME_SCORE_WEIGHT = 0.5;

function adaptationsBaseMangaPrimaryScorePoints(
  nbTomes: number | undefined
): number {
  const n = nbTomes ?? 1;
  return ADAPTATIONS_BASE_MANGA_TOME_SCORE_WEIGHT * Math.max(1, n);
}

/** Tranches catalogue alignées sur le merge de l’orbite (sagas jeux / livres). */
export type AdaptationsBaseWorksScoreCatalog = {
  baseBooks: BaseBook[];
  baseBds: BaseBd[];
  baseComics: BaseComic[];
  baseMovies: BaseMovie[];
  baseSeries: BaseSerie[];
  baseGames: BaseGame[];
  baseMangas: BaseManga[];
};

/**
 * Type pivot déduit de la galaxie centrale (entité résolue, sinon fromEntityType).
 */
function adaptationsBasePrimaryScoreKindFromGalaxy(
  g: BaseWorkGalaxy | undefined | null
): AdaptationsBaseScoreKind {
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
function adaptationsBaseBlockPrimaryScoreKind(
  block: AdaptationsBaseWorksViewBlock
): AdaptationsBaseScoreKind {
  if (block.blockKind === 'gameSaga') {
    return 'game';
  }
  if (block.blockKind === 'bookSaga') {
    const central = pickCentralGalaxyForFranchiseSaga(block.galaxies);
    return adaptationsBasePrimaryScoreKindFromGalaxy(central);
  }
  return adaptationsBasePrimaryScoreKindFromGalaxy(block.galaxies[0]);
}

function adaptationsBaseWeightForKinds(
  workKind: AdaptationsBaseScoreKind,
  primary: AdaptationsBaseScoreKind
): number {
  const primaryIsGraphicSerial = primary === 'bd' || primary === 'comic';
  const workIsGraphicSerial = workKind === 'bd' || workKind === 'comic';
  if (primaryIsGraphicSerial && workIsGraphicSerial) {
    return ADAPTATIONS_BASE_GRAPHIC_SERIAL_SAGA_WEIGHT;
  }
  if (workKind === primary) {
    return ADAPTATIONS_BASE_WORK_SAME_MEDIUM_WEIGHT;
  }
  return ADAPTATIONS_BASE_WORK_CROSS_MEDIUM_WEIGHT;
}

/**
 * Texte d’infobulle pour le score affiché sur le titre de bloc (pondération 1 / 5).
 */
export function adaptationsBaseWorksCrossMediaScoreTooltip(
  score: number
): string {
  return `Score d'export transmédia : ${score} points (règles : pivot BD/comic → 0,5 pt par BD ou comic de la saga ; pivot manga → 0,5 pt × nbTomes par série ; sinon même type ×${ADAPTATIONS_BASE_WORK_SAME_MEDIUM_WEIGHT}, autre type ×${ADAPTATIONS_BASE_WORK_CROSS_MEDIUM_WEIGHT})`;
}

/**
 * Ajoute au score les entrées catalogue fusionnées comme dans l’orbite (ex. tous
 * les jeux d’une saga jeu, pas seulement les hubs touchés par un fromEntity).
 */
function addCatalogWorksToBlockCrossMediaScore(
  block: AdaptationsBaseWorksViewBlock,
  catalog: AdaptationsBaseWorksScoreCatalog,
  primary: AdaptationsBaseScoreKind,
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
    entityKey: string,
    weightOverride?: number
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
      if (catalogFranchiseSagaMatchesBlock(bb.saga, sagaKeyNorm)) {
        add('book', bookEntityKey(getFullBook(bb)));
      }
    }
    for (const bbd of catalog.baseBds) {
      if (catalogFranchiseSagaMatchesBlock(bbd.saga, sagaKeyNorm)) {
        add('bd', bdEntityKey(getFullBd(bbd)));
      }
    }
    for (const bcm of catalog.baseComics) {
      if (catalogFranchiseSagaMatchesBlock(bcm.saga, sagaKeyNorm)) {
        add('comic', comicEntityKey(getFullComic(bcm)));
      }
    }
    for (const bm of catalog.baseMovies) {
      if (catalogFranchiseSagaMatchesBlock(bm.saga, sagaKeyNorm)) {
        add('movie', movieEntityKey(getFullMovie(bm)));
      }
    }
    for (const bs of catalog.baseSeries) {
      if (catalogFranchiseSagaMatchesBlock(bs.saga, sagaKeyNorm)) {
        add('serie', serieEntityKey(getFullSerie(bs)));
      }
    }
    for (const bg of catalog.baseGames) {
      if (gameSagaMatchesBookSagaBlock(bg.saga, sagaKeyNorm)) {
        add('game', gameEntityKey(getFullGame(bg)));
      }
    }
    for (const bmg of catalog.baseMangas) {
      if (catalogFranchiseSagaMatchesBlock(bmg.saga, sagaKeyNorm)) {
        const w =
          primary === 'manga'
            ? adaptationsBaseMangaPrimaryScorePoints(bmg.nbTomes)
            : undefined;
        add('manga', mangaEntityKey(getFullManga(bmg)), w);
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
 * Score pour classer les blocs « Galaxie des licences » : favorise les franchises
 * exportées sur plusieurs supports (film, jeu, etc.), pas seulement le volume
 * d’œuvres dans un seul média.
 *
 * - **Pivot BD ou comic** : chaque BD ou comic de la saga **0,5 pt** (séries longues).
 * - **Pivot manga** : par série catalogue, **0,5 × nbTomes** pts.
 * - **Sinon même type** que le pivot : **2 pts** ; **autre type** (transmédia) : **5 pts**.
 *
 * Déduplication par clé catalogue (type + identité) sur tout le bloc.
 * Les œuvres catalogue rattachées à la même saga que l’orbite (jeux, livres, films…)
 * sont incluses même si elles ne sont pas centre d’un hub « fromEntity ».
 */
export function blockCrossMediaExportScore(
  block: AdaptationsBaseWorksViewBlock,
  catalog: AdaptationsBaseWorksScoreCatalog
): number {
  const primary = adaptationsBaseBlockPrimaryScoreKind(block);
  const seen = new Set<string>();
  let total = 0;

  const add = (
    kind: AdaptationsBaseScoreKind,
    entityKey: string,
    weightOverride?: number
  ): void => {
    const id = `${kind}:${entityKey}`;
    if (seen.has(id)) return;
    seen.add(id);
    total += weightOverride ?? adaptationsBaseWeightForKinds(kind, primary);
  };

  for (const gal of block.galaxies) {
    if (gal.book) add('book', bookEntityKey(gal.book));
    if (gal.bd) add('bd', bdEntityKey(gal.bd));
    if (gal.comic) add('comic', comicEntityKey(gal.comic));
    if (gal.manga) {
      const mk = mangaEntityKey(gal.manga);
      const w =
        primary === 'manga'
          ? adaptationsBaseMangaPrimaryScorePoints(gal.manga.nbTomes)
          : undefined;
      add('manga', mk, w);
    }
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
    for (const m of gal.derivedMangas) {
      const mk = mangaEntityKey(m);
      const w =
        primary === 'manga'
          ? adaptationsBaseMangaPrimaryScorePoints(m.nbTomes)
          : undefined;
      add('manga', mk, w);
    }
    for (const m of gal.derivedManwhas) add('manwha', manwhaEntityKey(m));
  }

  addCatalogWorksToBlockCrossMediaScore(block, catalog, primary, add);

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

export function emptyUserBaseGalaxyConsumption(): UserBaseGalaxyConsumption {
  return {
    movies: new Set(),
    series: new Set(),
    games: new Set(),
    books: new Set(),
    bds: new Set(),
    comics: new Set(),
    mangas: new Set(),
    manwhas: new Set(),
  };
}

export async function buildUserBaseGalaxyConsumption(
  uid: string
): Promise<UserBaseGalaxyConsumption> {
  const userId = uid.trim().toLowerCase();
  if (!userId) {
    return emptyUserBaseGalaxyConsumption();
  }

  try {
    const [
      userMovies,
      userSeries,
      userGames,
      gamelistGames,
      userBooks,
      readlistBooks,
      userBds,
      readlistBds,
      userComics,
      readlistComics,
      userMangas,
      readlistMangas,
      userManwhas,
      readlistManwhas,
    ] = await Promise.all([
      fetchUserMoviesFromApi(userId),
      fetchUserSeriesFromApi(userId),
      fetchUserGamesFromApi(userId),
      fetchGamelistGamesFromApi(userId),
      fetchUserBooksFromApi(userId),
      fetchReadlistBooksFromApi(userId),
      fetchUserBdsFromApi(userId),
      fetchReadlistBdsFromApi(userId),
      fetchUserComicsFromApi(userId),
      fetchReadlistComicsFromApi(userId),
      fetchUserMangasFromApi(userId),
      fetchReadlistMangasFromApi(userId),
      fetchUserManwhasFromApi(userId),
      fetchReadlistManwhasFromApi(userId),
    ]);

    const movies = new Set(
      userMovies.map((m) => `${m.title}|${m.director}`)
    );
    const series = new Set<string>();
    for (const s of userSeries) {
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
    ingestGames(userGames);
    ingestGames(gamelistGames);
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
        userBooks,
        readlistBooks,
        (b) => `${b.title}|${b.author}`
      ),
      bds: mergeConsumedKeysByReadTimes(
        userBds,
        readlistBds,
        (b) => `${b.title}|${b.writer}`
      ),
      comics: mergeConsumedKeysByReadTimes(
        userComics,
        readlistComics,
        (c) => `${c.title}|${c.writer}`
      ),
      mangas: mergeConsumedKeysByReadTimes(
        userMangas,
        readlistMangas,
        (m) => `${m.title}|${m.author}`
      ),
      manwhas: mergeConsumedKeysByReadTimes(
        userManwhas,
        readlistManwhas,
        (m) => `${m.title}|${m.author}`
      ),
    };
  } catch {
    return emptyUserBaseGalaxyConsumption();
  }
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

/**
 * Livre ou BD catalogue en tête de saga (`sagaOrder === 1`) pour une franchise.
 * Le livre prime sur la BD si les deux existent avec l’ordre 1.
 */
function franchiseSagaCatalogSagaOrder1Volume(
  sagaKeyNorm: string,
  allBaseBooks: BaseBook[],
  allBaseBds: BaseBd[]
): { book: Book | null; bd: Bd | null } {
  const bookRow = allBaseBooks.find(
    (bb) =>
      catalogFranchiseSagaMatchesBlock(bb.saga, sagaKeyNorm) &&
      (bb.sagaOrder ?? 9999) === 1
  );
  if (bookRow) {
    return { book: getFullBook(bookRow), bd: null };
  }
  const bdRow = allBaseBds.find(
    (bbd) =>
      catalogFranchiseSagaMatchesBlock(bbd.saga, sagaKeyNorm) &&
      (bbd.sagaOrder ?? 9999) === 1
  );
  if (bdRow) {
    return { book: null, bd: getFullBd(bdRow) };
  }
  return { book: null, bd: null };
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
  const withComic = galaxies.filter((g) => g.comic);
  if (withComic.length > 0) {
    return [...withComic].sort((a, b) =>
      a.comic!.title.localeCompare(b.comic!.title, 'fr')
    )[0];
  }
  const withManga = galaxies.filter((g) => g.manga);
  if (withManga.length > 0) {
    return [...withManga].sort((a, b) => {
      const da = mangaStartDateMs(a.manga!);
      const db = mangaStartDateMs(b.manga!);
      if (da !== db) return da - db;
      return a.manga!.title.localeCompare(b.manga!.title, 'fr');
    })[0];
  }
  const withManwha = galaxies.filter((g) => g.manwha);
  if (withManwha.length > 0) {
    return [...withManwha].sort((a, b) =>
      a.manwha!.title.localeCompare(b.manwha!.title, 'fr')
    )[0];
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
  const withGame = galaxies.filter((g) => g.game);
  if (withGame.length > 0) {
    return [...withGame].sort((a, b) => {
      const da = gameReleaseDateMs(a.game!);
      const db = gameReleaseDateMs(b.game!);
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

function isoDateStringToYear(raw: string | undefined | null): number | null {
  const d = raw?.trim();
  if (!d) return null;
  const ms = Date.parse(d);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).getFullYear();
}

/** Année de l’œuvre centrale et « âge » de la licence (année courante − année de base, min. 1). */
export function adaptationsBaseCentralLicenseYearMeta(
  central: AdaptationsBaseWorkOrbitPanel['central']
): { baseYear: number; existenceYears: number } | null {
  let baseYear: number | null = null;
  if (central.book) {
    baseYear = isoDateStringToYear(central.book.releaseDate);
  } else if (central.bd) {
    baseYear = isoDateStringToYear(central.bd.releaseDate);
  } else if (central.comic) {
    baseYear = isoDateStringToYear(central.comic.releaseDate);
  } else if (central.manga) {
    baseYear = isoDateStringToYear(central.manga.startDate);
  } else if (central.manwha) {
    baseYear = null;
  } else if (central.game) {
    baseYear = isoDateStringToYear(central.game.releaseDate);
  } else if (central.serie) {
    baseYear = isoDateStringToYear(central.serie.releaseDate);
  } else if (central.movie) {
    baseYear = isoDateStringToYear(central.movie.releaseDate);
  }
  if (baseYear == null) {
    return null;
  }
  const currentYear = new Date().getFullYear();
  const existenceYears = Math.max(1, currentYear - baseYear);
  return { baseYear, existenceYears };
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

function mangaStartDateMs(manga: Manga): number {
  const d = manga.startDate?.trim();
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
    g.manga?.saga ??
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

function centralFromGalaxy(
  g: BaseWorkGalaxy
): AdaptationsBaseWorkOrbitPanel['central'] {
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
  block: AdaptationsBaseWorksViewBlock,
  allBaseBooks: BaseBook[],
  allBaseBds: BaseBd[],
  allBaseComics: BaseComic[],
  allBaseMovies: BaseMovie[],
  allBaseSeries: BaseSerie[],
  allBaseGames: BaseGame[],
  allBaseMangas: BaseManga[]
): AdaptationsBaseWorkOrbitPanel {
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
    const staticNonManga: BaseWorkOrbitSatellite[] = [];
    const staticMangas: Manga[] = [];
    for (const s of staticSats) {
      if (s.kind === 'manga') {
        staticMangas.push(s.data);
      } else {
        staticNonManga.push(s);
      }
    }
    const mangaSagaNorm = g.manga?.saga?.trim().toLowerCase();
    let catalogMangasStandalone: Manga[] = [];
    if (mangaSagaNorm) {
      const ck = g.manga ? mangaEntityKey(g.manga) : '';
      catalogMangasStandalone = allBaseMangas
        .filter((bm) => bm.saga?.trim().toLowerCase() === mangaSagaNorm)
        .map((bm) => getFullManga(bm))
        .filter((m) => !ck || mangaEntityKey(m) !== ck);
    }
    const orbitMangasStandalone = mergeDedupeMangas([
      staticMangas,
      catalogMangasStandalone,
    ]);
    orbitMangasStandalone.sort((a, b) => a.title.localeCompare(b.title, 'fr'));

    const satellites: BaseWorkOrbitSatellite[] = [
      ...staticNonManga,
      ...orbitMangasStandalone.map((data) => ({
        kind: 'manga' as const,
        data,
      })),
      ...movies.map((data) => ({ kind: 'movie' as const, data })),
      ...series.map((data) => ({ kind: 'serie' as const, data })),
      ...games.map((data) => ({ kind: 'game' as const, data })),
    ];
    const centralStandalone = centralFromGalaxy(g);
    const licSt = adaptationsBaseCentralLicenseYearMeta(centralStandalone);
    return {
      orbitKey: `abwg-st:${g.uniqueKey}`,
      blockKind: 'standalone',
      headerPrimaryLabel: baseWorkOrbitHeaderPrimaryLabel(g),
      standaloneFromEntityType: g.fromEntityType,
      satelliteCount: satellites.length,
      baseWorkYear: licSt?.baseYear ?? null,
      licenseExistenceYears: licSt?.existenceYears ?? null,
      central: centralStandalone,
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

    const centralGameSaga = centralFromGalaxy(centralGalaxy);
    const licGs = adaptationsBaseCentralLicenseYearMeta(centralGameSaga);
    return {
      orbitKey: `abwg-game-saga:${block.sagaKey}`,
      blockKind: 'gameSaga',
      sagaDisplayName: block.sagaDisplayName,
      headerPrimaryLabel: block.sagaDisplayName,
      satelliteCount: satellites.length,
      baseWorkYear: licGs?.baseYear ?? null,
      licenseExistenceYears: licGs?.existenceYears ?? null,
      central: centralGameSaga,
      satellites,
    };
  }

  const galaxies = block.galaxies;
  const sagaKeyNorm = block.sagaKey;
  const catalogVol1 = franchiseSagaCatalogSagaOrder1Volume(
    sagaKeyNorm,
    allBaseBooks,
    allBaseBds
  );
  const centralGalaxy = pickCentralGalaxyForFranchiseSaga(galaxies);
  const effectiveCentralBook =
    catalogVol1.book ?? (catalogVol1.bd ? null : centralGalaxy.book);
  const effectiveCentralBd =
    catalogVol1.bd ?? (catalogVol1.book ? null : centralGalaxy.bd);
  const centralMovie = centralGalaxy.movie;
  const centralSerie = centralGalaxy.serie;
  const centralManga = centralGalaxy.manga;
  const centralKeyBook = effectiveCentralBook
    ? bookEntityKey(effectiveCentralBook)
    : '';
  const centralKeyMovie = centralMovie ? movieEntityKey(centralMovie) : '';
  const centralKeySerie = centralSerie ? serieEntityKey(centralSerie) : '';
  const centralKeyManga = centralManga ? mangaEntityKey(centralManga) : '';
  const centralKeyBd = effectiveCentralBd
    ? bdEntityKey(effectiveCentralBd)
    : '';
  const centralKeyComic = centralGalaxy.comic
    ? comicEntityKey(centralGalaxy.comic)
    : '';

  const centralForOrbitDedupe: BaseWorkGalaxy = {
    ...centralGalaxy,
    book: effectiveCentralBook,
    bd: effectiveCentralBd,
  };
  const booksInSagaCatalog = allBaseBooks.filter((bb) =>
    catalogFranchiseSagaMatchesBlock(bb.saga, sagaKeyNorm)
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

  const mangasInSagaCatalog = allBaseMangas.filter((bmg) =>
    catalogFranchiseSagaMatchesBlock(bmg.saga, sagaKeyNorm)
  );

  const otherMangas: Manga[] = [];
  const mangaSeen = new Set<string>();
  const pushMangaIfNew = (m: Manga): void => {
    const k = mangaEntityKey(m);
    if (centralKeyManga && k === centralKeyManga) return;
    if (mangaSeen.has(k)) return;
    mangaSeen.add(k);
    otherMangas.push(m);
  };

  for (const bmg of mangasInSagaCatalog) {
    pushMangaIfNew(getFullManga(bmg));
  }
  for (const gal of galaxies) {
    if (gal.manga) {
      pushMangaIfNew(gal.manga);
    }
  }
  otherMangas.sort((a, b) => a.title.localeCompare(b.title, 'fr'));

  const movieLists = galaxies.map((g) => g.derivedMovies);
  const serieLists = galaxies.map((g) => g.derivedSeries);
  const gameLists = galaxies.map((g) => g.derivedGames);
  const moviesFromGalaxies = mergeDedupeMovies(movieLists);
  const moviesInSagaCatalog = allBaseMovies
    .filter((bm) => catalogFranchiseSagaMatchesBlock(bm.saga, sagaKeyNorm))
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
    .filter((bs) => catalogFranchiseSagaMatchesBlock(bs.saga, sagaKeyNorm))
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
    .filter((bg) => gameSagaMatchesBookSagaBlock(bg.saga, sagaKeyNorm))
    .map((bg) => getFullGame(bg));
  games = mergeDedupeGames([games, sagaGamesFromCatalog]);

  const volumeSatellites = mergeVolumeSatellitesSorted(otherBooks, []);

  const staticSats = orbitStaticMediaSatellitesForGalaxies(
    galaxies,
    centralForOrbitDedupe
  );

  const bdsInSagaCatalog = allBaseBds
    .filter((bbd) => catalogFranchiseSagaMatchesBlock(bbd.saga, sagaKeyNorm))
    .map((bbd) => getFullBd(bbd));
  let orbitBdsFranchise = mergeDedupeBds([
    mergeDedupeBds(galaxies.map((g) => g.derivedBds)),
    bdsInSagaCatalog,
  ]);
  if (centralKeyBd) {
    orbitBdsFranchise = orbitBdsFranchise.filter(
      (b) => bdEntityKey(b) !== centralKeyBd
    );
  }
  orbitBdsFranchise.sort((a, b) => {
    const d = (a.sagaOrder ?? 9999) - (b.sagaOrder ?? 9999);
    if (d !== 0) return d;
    return a.title.localeCompare(b.title, 'fr');
  });

  const comicsInSagaCatalog = allBaseComics
    .filter((bc) => catalogFranchiseSagaMatchesBlock(bc.saga, sagaKeyNorm))
    .map((bc) => getFullComic(bc));
  let orbitComicsFranchise = mergeDedupeComics([
    mergeDedupeComics(galaxies.map((g) => g.derivedComics)),
    comicsInSagaCatalog,
  ]);
  if (centralKeyComic) {
    orbitComicsFranchise = orbitComicsFranchise.filter(
      (c) => comicEntityKey(c) !== centralKeyComic
    );
  }
  orbitComicsFranchise.sort((a, b) => {
    const d = (a.sagaOrder ?? 9999) - (b.sagaOrder ?? 9999);
    if (d !== 0) return d;
    return a.title.localeCompare(b.title, 'fr');
  });

  const staticNonMangaFranchise: BaseWorkOrbitSatellite[] = [];
  const staticMangasFranchise: Manga[] = [];
  for (const s of staticSats) {
    if (s.kind === 'manga') {
      staticMangasFranchise.push(s.data);
    } else if (s.kind === 'bd') {
      // Fusionnées dans orbitBdsFranchise (catalogue saga + derivedBds).
    } else if (s.kind === 'comic') {
      // Fusionnées dans orbitComicsFranchise (catalogue saga + derivedComics).
    } else {
      staticNonMangaFranchise.push(s);
    }
  }
  let orbitMangasFranchise = mergeDedupeMangas([
    otherMangas,
    staticMangasFranchise,
  ]);
  if (centralKeyManga) {
    orbitMangasFranchise = orbitMangasFranchise.filter(
      (m) => mangaEntityKey(m) !== centralKeyManga
    );
  }
  orbitMangasFranchise.sort((a, b) => a.title.localeCompare(b.title, 'fr'));

  const satellites: BaseWorkOrbitSatellite[] = [
    ...volumeSatellites,
    ...staticNonMangaFranchise,
    ...orbitBdsFranchise.map((data) => ({ kind: 'bd' as const, data })),
    ...orbitComicsFranchise.map((data) => ({ kind: 'comic' as const, data })),
    ...orbitMangasFranchise.map((data) => ({
      kind: 'manga' as const,
      data,
    })),
    ...orbitMovies.map((data) => ({ kind: 'movie' as const, data })),
    ...orbitSeries.map((data) => ({ kind: 'serie' as const, data })),
    ...games.map((data) => ({ kind: 'game' as const, data })),
  ];

  const baseCentralSaga = centralFromGalaxy(centralGalaxy);
  const centralBookSaga: AdaptationsBaseWorkOrbitPanel['central'] =
    catalogVol1.book
      ? { ...baseCentralSaga, book: catalogVol1.book, bd: null }
      : catalogVol1.bd
      ? { ...baseCentralSaga, bd: catalogVol1.bd, book: null }
      : baseCentralSaga;
  const licBs = adaptationsBaseCentralLicenseYearMeta(centralBookSaga);
  return {
    orbitKey: `abwg-saga:${block.sagaKey}`,
    blockKind: 'bookSaga',
    sagaDisplayName: block.sagaDisplayName,
    headerPrimaryLabel: block.sagaDisplayName,
    satelliteCount: satellites.length,
    baseWorkYear: licBs?.baseYear ?? null,
    licenseExistenceYears: licBs?.existenceYears ?? null,
    central: centralBookSaga,
    satellites,
  };
}

/** Référence hub « fromEntity » (clé unique galaxie). */
type AdaptationsBaseFromEntityHub = {
  entityType: string;
  title: string;
  secondEntityKey: string;
};

const ADAPTATIONS_BASE_FROM_ENTITY_MAX_DEPTH = 12;

/**
 * Remonte la chaîne film → … → jeu → … jusqu’à l’œuvre « terminale » (livre, comic,
 * manga, etc.) pour rattacher adaptations et dérivés au même hub que l’UI le ferait
 * « à la main » (ex. jeu du film *Superman Returns* sur l’orbite du comic *Superman*).
 */
function resolveAdaptationsBaseTransmediaHub(
  fe: AdaptationsBaseFromEntityHub,
  baseMovies: BaseMovie[],
  baseSeries: BaseSerie[],
  baseGames: BaseGame[]
): AdaptationsBaseFromEntityHub {
  let cur = fe;
  for (let depth = 0; depth < ADAPTATIONS_BASE_FROM_ENTITY_MAX_DEPTH; depth++) {
    if (cur.entityType === 'movie') {
      const row = baseMovies.find(
        (m) => m.title === cur.title && m.director === cur.secondEntityKey
      );
      if (!row?.fromEntity) {
        return cur;
      }
      cur = {
        entityType: row.fromEntity.entityType,
        title: row.fromEntity.title,
        secondEntityKey: row.fromEntity.secondEntityKey,
      };
      continue;
    }
    if (cur.entityType === 'serie') {
      const row = baseSeries.find(
        (s) => s.title === cur.title && s.director === cur.secondEntityKey
      );
      if (!row?.fromEntity) {
        return cur;
      }
      cur = {
        entityType: row.fromEntity.entityType,
        title: row.fromEntity.title,
        secondEntityKey: row.fromEntity.secondEntityKey,
      };
      continue;
    }
    if (cur.entityType === 'game') {
      const row = baseGames.find(
        (g) => g.title === cur.title && g.editor === cur.secondEntityKey
      );
      if (!row?.fromEntity) {
        return cur;
      }
      cur = {
        entityType: row.fromEntity.entityType,
        title: row.fromEntity.title,
        secondEntityKey: row.fromEntity.secondEntityKey,
      };
      continue;
    }
    return cur;
  }
  return cur;
}

export function buildAdaptationsBaseWorksBlocks(
  baseBooks: BaseBook[],
  baseBds: BaseBd[],
  baseComics: BaseComic[],
  baseMangas: BaseManga[],
  baseManwhas: BaseManwha[],
  baseGames: BaseGame[],
  baseSeries: BaseSerie[],
  baseMovies: BaseMovie[]
): AdaptationsBaseWorksViewBlock[] {
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
    fe: AdaptationsBaseFromEntityHub,
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
    const hub = resolveAdaptationsBaseTransmediaHub(
      {
        entityType: fe.entityType,
        title: fe.title,
        secondEntityKey: fe.secondEntityKey,
      },
      baseMovies,
      baseSeries,
      baseGames
    );
    touchGalaxy(hub, (g) => g.derivedMovies.push(getFullMovie(bm)));
  }

  for (const bs of baseSeries) {
    const fe = bs.fromEntity;
    if (!fe) continue;
    const hub = resolveAdaptationsBaseTransmediaHub(
      {
        entityType: fe.entityType,
        title: fe.title,
        secondEntityKey: fe.secondEntityKey,
      },
      baseMovies,
      baseSeries,
      baseGames
    );
    touchGalaxy(hub, (g) => g.derivedSeries.push(getFullSerie(bs)));
  }

  for (const bg of baseGames) {
    const fe = bg.fromEntity;
    if (!fe) continue;
    const hub = resolveAdaptationsBaseTransmediaHub(
      {
        entityType: fe.entityType,
        title: fe.title,
        secondEntityKey: fe.secondEntityKey,
      },
      baseMovies,
      baseSeries,
      baseGames
    );
    touchGalaxy(hub, (g) => g.derivedGames.push(getFullGame(bg)));
  }

  // Livres / BD / comics / manhwas : pas de `fromEntity` sur les types catalogue pour l’instant.
  // Les `derived*` correspondants restent pour l’UI (satellites) si on les alimente plus tard.

  for (const bm of baseMangas) {
    const fe = bm.fromEntity;
    if (!fe) continue;
    const hub = resolveAdaptationsBaseTransmediaHub(
      {
        entityType: fe.entityType,
        title: fe.title,
        secondEntityKey: fe.secondEntityKey,
      },
      baseMovies,
      baseSeries,
      baseGames
    );
    touchGalaxy(hub, (g) => g.derivedMangas.push(getFullManga(bm)));
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
    const mangaSagaTrim = galaxy.manga?.saga?.trim();
    const movieSagaTrim = galaxy.movie?.saga?.trim();
    const gameSagaKey = normalizedGameSagaKey(galaxy.game?.saga);

    const addToFranchiseSaga = (
      sagaDisplay: string,
      gal: BaseWorkGalaxy
    ): void => {
      const rawSk = sagaDisplay.trim().toLowerCase();
      const sk = canonicalFranchiseSagaKey(rawSk);
      if (BASE_WORKS_EXCLUDED_FRANCHISE_SAGA_KEYS.has(sk)) {
        standaloneGalaxies.push(gal);
        return;
      }
      let entry = franchiseSagaMap.get(sk);
      if (!entry) {
        entry = {
          sagaDisplayName:
            preferredFranchiseSagaDisplayName(sk) ?? sagaDisplay.trim(),
          galaxies: [],
        };
        franchiseSagaMap.set(sk, entry);
      }
      entry.galaxies.push(gal);
      const pref = preferredFranchiseSagaDisplayName(sk);
      if (pref) {
        entry.sagaDisplayName = pref;
      }
    };

    if (galaxy.fromEntityType === 'book' && bookSagaTrim) {
      addToFranchiseSaga(bookSagaTrim, galaxy);
    } else if (galaxy.fromEntityType === 'movie' && movieSagaTrim) {
      addToFranchiseSaga(movieSagaTrim, galaxy);
    } else if (galaxy.fromEntityType === 'bd' && bdSagaTrim) {
      addToFranchiseSaga(bdSagaTrim, galaxy);
    } else if (galaxy.fromEntityType === 'manga' && mangaSagaTrim) {
      addToFranchiseSaga(mangaSagaTrim, galaxy);
    } else if (galaxy.fromEntityType === 'game' && galaxy.game && gameSagaKey) {
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

  // Une même étiquette de saga peut exister côté franchise (films / livres / BD…)
  // et côté « saga jeu » : sans fusion, la galaxie affiche deux blocs (ex. Pokémon).
  for (const [gameKey, gameEntry] of Array.from(sagaGameMap.entries())) {
    const franchiseKey = canonicalFranchiseSagaKey(gameKey);
    const franchiseEntry = franchiseSagaMap.get(franchiseKey);
    if (!franchiseEntry) continue;
    const seen = new Set(franchiseEntry.galaxies.map((g) => g.uniqueKey));
    for (const gal of gameEntry.galaxies) {
      if (!seen.has(gal.uniqueKey)) {
        seen.add(gal.uniqueKey);
        franchiseEntry.galaxies.push(gal);
      }
    }
    const pref = preferredFranchiseSagaDisplayName(franchiseKey);
    if (pref) {
      franchiseEntry.sagaDisplayName = pref;
    }
    sagaGameMap.delete(gameKey);
  }

  const sagaBlocks: AdaptationsBaseWorksViewBlock[] = Array.from(
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
      const aMg = a.manga != null ? 1 : 0;
      const bMg = b.manga != null ? 1 : 0;
      if (aMg !== bMg) {
        return bMg - aMg;
      }
      if (a.manga && b.manga) {
        const mt = a.manga.title.localeCompare(b.manga.title, 'fr');
        if (mt !== 0) return mt;
      }
      const ar = a.movie
        ? movieReleaseDateMs(a.movie)
        : Number.MAX_SAFE_INTEGER;
      const br = b.movie
        ? movieReleaseDateMs(b.movie)
        : Number.MAX_SAFE_INTEGER;
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

  const gameSagaBlocks: AdaptationsBaseWorksViewBlock[] = Array.from(
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
  const standaloneBlocks: AdaptationsBaseWorksViewBlock[] =
    standaloneGalaxies.map((galaxy) => ({
      blockKind: 'standalone' as const,
      galaxies: [galaxy],
    }));

  const blockSortLabel = (block: AdaptationsBaseWorksViewBlock): string =>
    block.blockKind === 'bookSaga' || block.blockKind === 'gameSaga'
      ? block.sagaDisplayName
      : block.galaxies[0]?.sourceTitle ?? '';

  const scoreCatalog: AdaptationsBaseWorksScoreCatalog = {
    baseBooks,
    baseBds,
    baseComics,
    baseMovies,
    baseSeries,
    baseGames,
    baseMangas,
  };

  return [...sagaBlocks, ...gameSagaBlocks, ...standaloneBlocks].sort(
    (a, b) => {
      const diff =
        blockCrossMediaExportScore(b, scoreCatalog) -
        blockCrossMediaExportScore(a, scoreCatalog);
      if (diff !== 0) return diff;
      return blockSortLabel(a).localeCompare(blockSortLabel(b), 'fr');
    }
  );
}

export function buildAdaptationsBaseWorkOrbitPanelsSorted(
  blocks: AdaptationsBaseWorksViewBlock[],
  baseBooks: BaseBook[],
  baseBds: BaseBd[],
  baseComics: BaseComic[],
  baseMovies: BaseMovie[],
  baseSeries: BaseSerie[],
  baseGames: BaseGame[],
  baseMangas: BaseManga[]
): AdaptationsBaseWorkOrbitPanel[] {
  const scoreCatalog: AdaptationsBaseWorksScoreCatalog = {
    baseBooks,
    baseBds,
    baseComics,
    baseMovies,
    baseSeries,
    baseGames,
    baseMangas,
  };
  const panels = blocks
    .map((b) => {
      const panel = baseWorksBlockToOrbitPanel(
        b,
        baseBooks,
        baseBds,
        baseComics,
        baseMovies,
        baseSeries,
        baseGames,
        baseMangas
      );
      return {
        ...panel,
        crossMediaExportScore: blockCrossMediaExportScore(b, scoreCatalog),
      };
    })
    .filter(
      (p) => p.satelliteCount + 1 >= ADAPTATIONS_BASE_LICENSE_GALAXY_MIN_WORKS
    );
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
  central: AdaptationsBaseWorkOrbitPanel['central'],
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
