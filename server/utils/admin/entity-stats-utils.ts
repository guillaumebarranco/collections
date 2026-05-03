const fs = require('fs');
const { loadUsers } = require('../users/users-utils');
const {
  getUserBooksFiles,
  parseBooksFromFile,
} = require('../books/books-utils');
const {
  getUserMoviesFiles,
  parseMoviesFromFile,
} = require('../movies/movies-utils');
const {
  getUserSeriesFiles,
  parseSeriesFromFile,
} = require('../series/series-utils');
const {
  getUserAllGamesFiles,
  parseGamesFromFile,
} = require('../games/games-utils');
const {
  getUserMangasFiles,
  parseMangasFromFile,
} = require('../mangas/mangas-utils');
const {
  getUserManwhasFiles,
  parseManwhasFromFile,
} = require('../manwhas/manwhas-utils');
const {
  getUserComicsFiles,
  parseComicsFromFile,
} = require('../comics/comics-utils');
const {
  getUserBdsFiles,
  parseBdsFromFile,
} = require('../bds/bds-utils');
const {
  getUserMusicsFiles,
  parseUserMusicsFromFile,
} = require('../musics/musics-utils');

import type { UserBook } from '../../../src/app/models/book-model';
import type { UserComic } from '../../../src/app/models/comic-model';
import type { UserBd } from '../../../src/app/models/bd-model';
import type { UserGame } from '../../../src/app/models/game-model';
import type { UserManga } from '../../../src/app/models/manga-model';
import type { UserManwha } from '../../../src/app/models/manwha-model';
import type { UserMovie } from '../../../src/app/models/movie-model';
import type { UserMusic } from '../../../src/app/models/music-model';
import type { UserSerieFileRow } from '../../../src/app/models/serie-model';

function normalizeKey(s: string): string {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export type EntityPlatformCategoryKey =
  | 'books'
  | 'movies'
  | 'series'
  | 'games'
  | 'mangas'
  | 'manwhas'
  | 'comics'
  | 'bds'
  | 'musics';

export type PlatformStatRow = {
  title: string;
  secondaryLabel: string;
  userCount: number;
  averageRating: number | null;
};

export type PlatformCategoryStats = {
  topByUserReach: PlatformStatRow[];
  topByAverageRating: PlatformStatRow[];
};

export type PlatformEntityStatsResponse = Record<
  EntityPlatformCategoryKey,
  PlatformCategoryStats
>;

type AggBucket = {
  title: string;
  secondaryLabel: string;
  /** Utilisateurs distincts ayant « consommé » l’œuvre (vu/lu/etc.). */
  usersConsumed: Set<string>;
  /**
   * Au plus une note par utilisateur pour cette œuvre (évite les doublons de lignes
   * dans les fichiers TS utilisateur). En cas de lignes multiples : dernière note lue.
   */
  userRatings: Map<string, number>;
};

const CATEGORY_KEYS: EntityPlatformCategoryKey[] = [
  'books',
  'movies',
  'series',
  'games',
  'mangas',
  'manwhas',
  'comics',
  'bds',
  'musics',
];

/** Seuils pour le top « notes moyennes » : popularité + nombre de notations non nulles. */
const MIN_USERS_CONSUMED_FOR_AVG_TOP = 3;
const MIN_USERS_RATED_FOR_AVG_TOP = 3;

function emptyCategory(): PlatformCategoryStats {
  return { topByUserReach: [], topByAverageRating: [] };
}

function emptyResponse(): PlatformEntityStatsResponse {
  const o = {} as PlatformEntityStatsResponse;
  for (const k of CATEGORY_KEYS) {
    o[k] = emptyCategory();
  }
  return o;
}

function safeGetUserItems<T>(
  userId: string,
  getFiles: (uid: string) => string[],
  parseFile: (content: string) => T[]
): T[] {
  try {
    const files = getFiles(userId);
    const out: T[] = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      out.push(...parseFile(content));
    }
    return out as T[];
  } catch {
    return [];
  }
}

function makeKey(title: string, secondary: string): string {
  return `${normalizeKey(title)}|${normalizeKey(secondary)}`;
}

type RowAgg = PlatformStatRow & { ratingCount: number };

function finalizeBuckets(map: Map<string, AggBucket>): PlatformCategoryStats {
  const rows: RowAgg[] = [];
  for (const [, b] of map) {
    const userCount = b.usersConsumed.size;
    const ratingCount = b.userRatings.size;
    let ratingSum = 0;
    for (const v of b.userRatings.values()) {
      ratingSum += v;
    }
    const averageRating =
      ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 100) / 100 : null;
    rows.push({
      title: b.title,
      secondaryLabel: b.secondaryLabel,
      userCount,
      averageRating,
      ratingCount,
    });
  }

  const topByUserReach = [...rows]
    .filter((r) => r.userCount > 0)
    .sort((a, b) => b.userCount - a.userCount || (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .slice(0, 10)
    .map(({ ratingCount: _rc, ...rest }) => rest);

  const topByAverageRating = [...rows]
    .filter(
      (r) =>
        r.userCount >= MIN_USERS_CONSUMED_FOR_AVG_TOP &&
        r.ratingCount >= MIN_USERS_RATED_FOR_AVG_TOP &&
        r.averageRating != null
    )
    .sort(
      (a, b) =>
        (b.averageRating ?? 0) - (a.averageRating ?? 0) ||
        b.ratingCount - a.ratingCount
    )
    .slice(0, 10)
    .map(({ ratingCount: _rc, ...rest }) => rest);

  return { topByUserReach, topByAverageRating };
}

/** Enregistre la note d’un utilisateur pour l’œuvre (une entrée par utilisateur). */
function recordUserRating(
  b: AggBucket,
  username: string,
  rating: number
): void {
  const r = Number(rating);
  if (r > 0) {
    b.userRatings.set(username, r);
  }
}

function ensureBucket(
  map: Map<string, AggBucket>,
  key: string,
  title: string,
  secondary: string
): AggBucket {
  let b = map.get(key);
  if (!b) {
    b = {
      title,
      secondaryLabel: secondary,
      usersConsumed: new Set(),
      userRatings: new Map(),
    };
    map.set(key, b);
  }
  return b;
}

function serieWasWatched(row: UserSerieFileRow): boolean {
  const seasons = row.seasons || [];
  return seasons.some((s) => Number(s.seasonTimesWatched) >= 1);
}

function serieEffectiveRating(row: UserSerieFileRow): number {
  const r = Number((row as { rating?: number }).rating);
  if (r > 0) return r;
  const seasons = row.seasons || [];
  const rated = seasons.filter((s) => Number(s.seasonRating) > 0);
  if (rated.length === 0) return 0;
  return (
    rated.reduce((acc, s) => acc + Number(s.seasonRating), 0) / rated.length
  );
}

function gameWasPlayed(g: UserGame): boolean {
  const sessions = g.sessions || [];
  return sessions.some(
    (s) =>
      s.finishedGame || s.finishedGameWithHundredPercent || s.platinedGame
  );
}

function buildPlatformEntityStats(): PlatformEntityStatsResponse {
  const users = loadUsers();
  const out = emptyResponse();
  if (users.length === 0) return out;

  const maps: Record<EntityPlatformCategoryKey, Map<string, AggBucket>> = {
    books: new Map(),
    movies: new Map(),
    series: new Map(),
    games: new Map(),
    mangas: new Map(),
    manwhas: new Map(),
    comics: new Map(),
    bds: new Map(),
    musics: new Map(),
  };

  for (const u of users) {
    const uid = String(u.username || '').toLowerCase();
    if (!uid) continue;

    const books = safeGetUserItems<UserBook>(
      uid,
      getUserBooksFiles,
      parseBooksFromFile
    );
    for (const book of books) {
      const title = book.title || '';
      const author = book.author || '';
      const k = makeKey(title, author);
      const b = ensureBucket(maps.books, k, title, author);
      if (Number(book.readTimes) >= 1) {
        b.usersConsumed.add(uid);
      }
      recordUserRating(b, uid, Number(book.rating) || 0);
    }

    const movies = safeGetUserItems<UserMovie>(
      uid,
      getUserMoviesFiles,
      parseMoviesFromFile
    );
    for (const m of movies) {
      const title = m.title || '';
      const director = m.director || '';
      const k = makeKey(title, director);
      const b = ensureBucket(maps.movies, k, title, director);
      if (Number(m.timesWatched) >= 1) {
        b.usersConsumed.add(uid);
      }
      recordUserRating(b, uid, Number(m.rating) || 0);
    }

    const series = safeGetUserItems<UserSerieFileRow>(
      uid,
      getUserSeriesFiles,
      parseSeriesFromFile
    );
    for (const s of series) {
      const title = s.title || '';
      const director = s.director || '';
      const k = makeKey(title, director);
      const b = ensureBucket(maps.series, k, title, director);
      if (serieWasWatched(s)) {
        b.usersConsumed.add(uid);
      }
      const sr = serieEffectiveRating(s);
      if (sr > 0) {
        recordUserRating(b, uid, sr);
      }
    }

    const games = safeGetUserItems<UserGame>(
      uid,
      getUserAllGamesFiles,
      parseGamesFromFile
    );
    for (const g of games) {
      const title = g.title || '';
      const editor = g.editor || '';
      const k = makeKey(title, editor);
      const b = ensureBucket(maps.games, k, title, editor);
      if (gameWasPlayed(g)) {
        b.usersConsumed.add(uid);
      }
      recordUserRating(b, uid, Number(g.rating) || 0);
    }

    const mangas = safeGetUserItems<UserManga>(
      uid,
      getUserMangasFiles,
      parseMangasFromFile
    );
    for (const m of mangas) {
      const title = m.title || '';
      const author = m.author || '';
      const k = makeKey(title, author);
      const b = ensureBucket(maps.mangas, k, title, author);
      if (Number(m.readTimes) >= 1) {
        b.usersConsumed.add(uid);
      }
      recordUserRating(b, uid, Number(m.rating) || 0);
    }

    const manwhas = safeGetUserItems<UserManwha>(
      uid,
      getUserManwhasFiles,
      parseManwhasFromFile
    );
    for (const m of manwhas) {
      const title = m.title || '';
      const author = m.author || '';
      const k = makeKey(title, author);
      const b = ensureBucket(maps.manwhas, k, title, author);
      if (Number(m.readTimes) >= 1) {
        b.usersConsumed.add(uid);
      }
      recordUserRating(b, uid, Number(m.rating) || 0);
    }

    const comics = safeGetUserItems<UserComic>(
      uid,
      getUserComicsFiles,
      parseComicsFromFile
    );
    for (const c of comics) {
      const title = c.title || '';
      const writer = c.writer || '';
      const k = makeKey(title, writer);
      const b = ensureBucket(maps.comics, k, title, writer);
      if (Number(c.readTimes) >= 1) {
        b.usersConsumed.add(uid);
      }
      recordUserRating(b, uid, Number(c.rating) || 0);
    }

    const bds = safeGetUserItems<UserBd>(
      uid,
      getUserBdsFiles,
      parseBdsFromFile
    );
    for (const bd of bds) {
      const title = bd.title || '';
      const writer = bd.writer || '';
      const k = makeKey(title, writer);
      const b = ensureBucket(maps.bds, k, title, writer);
      if (Number(bd.readTimes) >= 1) {
        b.usersConsumed.add(uid);
      }
      recordUserRating(b, uid, Number(bd.rating) || 0);
    }

    const musics = safeGetUserItems<UserMusic>(
      uid,
      getUserMusicsFiles,
      parseUserMusicsFromFile
    );
    for (const m of musics) {
      const title = m.title || '';
      const artist = m.artist || '';
      const k = makeKey(title, artist);
      const b = ensureBucket(maps.musics, k, title, artist);
      if (Number(m.timesListened) >= 1) {
        b.usersConsumed.add(uid);
      }
      recordUserRating(b, uid, Number(m.rating) || 0);
    }
  }

  for (const key of CATEGORY_KEYS) {
    out[key] = finalizeBuckets(maps[key]);
  }

  return out;
}

module.exports = {
  buildPlatformEntityStats,
};

export {};
