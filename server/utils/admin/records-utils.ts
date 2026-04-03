const fs = require('fs');
const { loadUsers } = require('../users/users-utils');
const {
  getUserBooksFiles,
  parseBooksFromFile,
  getBaseBooksFiles,
  parseBaseBooksFullFromFile,
} = require('../books/books-utils');
const {
  getUserMoviesFiles,
  parseMoviesFromFile,
  getBaseMoviesFiles,
  parseBaseMoviesFullFromFile,
} = require('../movies/movies-utils');
const {
  getUserSeriesFiles,
  parseSeriesFromFile,
  getBaseSeriesFiles,
  parseBaseSeriesFullFromFile,
} = require('../series/series-utils');
const {
  getUserGamesFiles,
  getUserAllGamesFiles,
  parseGamesFromFile,
  getBaseGamesFiles,
  parseBaseGamesFullFromFile,
} = require('../games/games-utils');
const {
  getUserMangasFiles,
  parseMangasFromFile,
  getBaseMangasFiles,
  parseBaseMangasFullFromFile,
} = require('../mangas/mangas-utils');
const {
  getUserManwhasFiles,
  parseManwhasFromFile,
  getBaseManwhasFiles,
  parseBaseManwhasFullFromFile,
} = require('../manwhas/manwhas-utils');
const {
  getUserComicsFiles,
  parseComicsFromFile,
  getBaseComicsFiles,
  parseBaseComicsFullFromFile,
} = require('../comics/comics-utils');
const {
  getUserBdsFiles,
  parseBdsFromFile,
  getBaseBdsFiles,
  parseBaseBdsFullFromFile,
} = require('../bds/bds-utils');
const {
  getUserMusicsFiles,
  parseUserMusicsFromFile,
  getBaseMusicsFiles,
  parseBaseMusicsFullFromFile,
} = require('../musics/musics-utils');

import type { UserBook } from '../../../src/app/models/book-model';
import type { UserComic } from '../../../src/app/models/comic-model';
import type { UserBd } from '../../../src/app/models/bd-model';
import type { UserGame } from '../../../src/app/models/game-model';
import type { UserManga } from '../../../src/app/models/manga-model';
import type { UserManwha } from '../../../src/app/models/manwha-model';
import type { UserMovie } from '../../../src/app/models/movie-model';
import type { UserMusic } from '../../../src/app/models/music-model';
import type {
  BaseSerieSeasonData,
  Serie,
  UserSerieFileRow,
} from '../../../src/app/models/serie-model';
const {
  getSerieWatchedLengthMinutes,
} = require('../../../src/app/utils/series.utils');
const {
  getGamePlayedHoursFromSessions,
} = require('../../../src/app/utils/games.utils');
const {
  getTotalBdReadingMinutes,
  getTotalBookReadingMinutes,
  getTotalComicsReadingMinutes,
  getTotalMangaReadingMinutes,
  getTotalManwhaReadingMinutes,
  getTotalMusicListeningMinutes,
  getTotalWatchingMinutes,
} = require('../../../src/app/utils/stats.utils');

type UserListItem = { username: string };

const MINUTES_PER_DAY = 24 * 60;

function minutesToDays(minutes: number): number {
  return minutes / MINUTES_PER_DAY;
}

/** Nombre fini ou 0 (évite NaN : `Number(undefined) ?? 0` reste NaN en JS). */
function finiteOr0(n: number): number {
  return Number.isFinite(n) ? n : 0;
}

/** Normalise une clé (trim, lowercase, espaces multiples → 1) pour le matching base/user. */
function normalizeKey(s: string): string {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

const CATEGORY_KEYS = [
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

function emptyCategoryRecords(): {
  mostReadSeen: { username: string; value: number }[];
  mostTimeReadWatched: { username: string; value: number }[];
} {
  return { mostReadSeen: [], mostTimeReadWatched: [] };
}

function emptyRecords(): Record<
  string,
  {
    mostReadSeen: { username: string; value: number }[];
    mostTimeReadWatched: { username: string; value: number }[];
  }
> {
  const o: Record<string, ReturnType<typeof emptyCategoryRecords>> = {};
  for (const key of CATEGORY_KEYS) {
    o[key] = emptyCategoryRecords();
  }
  return o;
}

function safeGetCount(
  userId: string,
  getFiles: (uid: string) => string[],
  parseFile: (content: string) => unknown[]
): number {
  try {
    const files = getFiles(userId);
    let total = 0;
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      total += parseFile(content).length;
    }
    return total;
  } catch {
    return 0;
  }
}

function loadBaseBooksPagesMap(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const files = getBaseBooksFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const books = parseBaseBooksFullFromFile(content);
      for (const b of books) {
        const key = `${normalizeKey(b.title || '')}|${normalizeKey(
          b.author || ''
        )}`;
        map.set(key, Number(b.pages) || 0);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseMoviesLengthMap(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const files = getBaseMoviesFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const movies = parseBaseMoviesFullFromFile(content);
      for (const m of movies) {
        const key = `${normalizeKey(m.title || '')}|${normalizeKey(
          m.director || ''
        )}`;
        map.set(key, Number(m.length) || 0);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseSeriesSeasonsDataMap(): Map<
  string,
  { seasonNumber: number; totalLength: number }[]
> {
  const map = new Map<
    string,
    { seasonNumber: number; totalLength: number }[]
  >();
  try {
    const files = getBaseSeriesFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const series = parseBaseSeriesFullFromFile(content);
      for (const s of series) {
        const key = `${normalizeKey(s.title || '')}|${normalizeKey(
          s.director || ''
        )}`;
        const seasonsData = Array.isArray(s.seasonsData)
          ? (s.seasonsData as BaseSerieSeasonData[]).map((se) => ({
              seasonNumber: Number(se.seasonNumber) || 0,
              totalLength: Number(se.totalLength) || 0,
            }))
          : [];
        map.set(key, seasonsData);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseGamesEntityMap(): Map<
  string,
  {
    averageTimeToFinish: number;
    platineTime: number;
    averageTimeToHundredPercent: number;
  }
> {
  const map = new Map();
  try {
    const files = getBaseGamesFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const games = parseBaseGamesFullFromFile(content);
      for (const g of games) {
        const key = `${normalizeKey(g.title || '')}|${normalizeKey(
          g.editor || ''
        )}`;
        map.set(key, {
          averageTimeToFinish: finiteOr0(Number(g.averageTimeToFinish)),
          platineTime: finiteOr0(Number(g.platineTime)),
          averageTimeToHundredPercent: finiteOr0(
            Number(
              (g as { averageTimeToHundredPercent?: number })
                .averageTimeToHundredPercent
            )
          ),
        });
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseMangasNbTomesMap(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const files = getBaseMangasFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const list = parseBaseMangasFullFromFile(content);
      for (const m of list) {
        const key = `${normalizeKey(m.title || '')}|${normalizeKey(
          m.author || ''
        )}`;
        map.set(key, Number(m.nbTomes) ?? 0);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseManwhasNbChaptersMap(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const files = getBaseManwhasFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const list = parseBaseManwhasFullFromFile(content);
      for (const m of list) {
        const key = `${normalizeKey(m.title || '')}|${normalizeKey(
          m.author || ''
        )}`;
        map.set(key, Number(m.nbChapters) ?? 0);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseComicsPagesMap(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const files = getBaseComicsFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const list = parseBaseComicsFullFromFile(content);
      for (const c of list) {
        const key = `${normalizeKey(c.title || '')}|${normalizeKey(
          c.writer || ''
        )}`;
        const pages = Number(c.pages) ?? 0;
        if (pages > 0) map.set(key, pages);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseBdsPagesMap(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const files = getBaseBdsFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const list = parseBaseBdsFullFromFile(content);
      for (const b of list) {
        const key = `${normalizeKey(b.title || '')}|${normalizeKey(
          b.writer || ''
        )}`;
        const pages = Number(b.pages) ?? 0;
        if (pages > 0) map.set(key, pages);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseMusicsDurationMap(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const files = getBaseMusicsFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const list = parseBaseMusicsFullFromFile(content);
      for (const m of list) {
        const key = `${normalizeKey(m.title || '')}|${normalizeKey(
          m.artist || ''
        )}`;
        map.set(key, Number(m.duration) ?? 0);
      }
    }
  } catch {
    // ignore
  }
  return map;
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

function buildAdminRecords(): ReturnType<typeof emptyRecords> {
  const users = loadUsers();
  const result = emptyRecords();
  if (users.length === 0) {
    return result;
  }

  const getCountFns = {
    books: (uid: string) =>
      safeGetCount(uid, getUserBooksFiles, parseBooksFromFile),
    movies: (uid: string) => {
      try {
        const files = [...getUserMoviesFiles(uid)];
        let total = 0;
        for (const file of files) {
          const content = fs.readFileSync(file, 'utf8');
          total += parseMoviesFromFile(content).length;
        }
        return total;
      } catch {
        return 0;
      }
    },
    series: (uid: string) => {
      try {
        const files = [...getUserSeriesFiles(uid)];
        let total = 0;
        for (const file of files) {
          const content = fs.readFileSync(file, 'utf8');
          total += parseSeriesFromFile(content).length;
        }
        return total;
      } catch {
        return 0;
      }
    },
    games: (uid: string) =>
      safeGetCount(uid, getUserGamesFiles, parseGamesFromFile),
    mangas: (uid: string) =>
      safeGetCount(uid, getUserMangasFiles, parseMangasFromFile),
    manwhas: (uid: string) => {
      try {
        const files = [...getUserManwhasFiles(uid)];
        let total = 0;
        for (const file of files) {
          const content = fs.readFileSync(file, 'utf8');
          total += parseManwhasFromFile(content).length;
        }
        return total;
      } catch {
        return 0;
      }
    },
    comics: (uid: string) =>
      safeGetCount(uid, getUserComicsFiles, parseComicsFromFile),
    bds: (uid: string) => safeGetCount(uid, getUserBdsFiles, parseBdsFromFile),
    musics: (uid: string) =>
      safeGetCount(uid, getUserMusicsFiles, parseUserMusicsFromFile),
  };

  const baseBooksPages = loadBaseBooksPagesMap();
  const baseMoviesLength = loadBaseMoviesLengthMap();
  const baseSeriesSeasonsData = loadBaseSeriesSeasonsDataMap();
  const baseGamesEntity = loadBaseGamesEntityMap();
  const baseMangasNbTomes = loadBaseMangasNbTomesMap();
  const baseManwhasNbChapters = loadBaseManwhasNbChaptersMap();
  const baseComicsPages = loadBaseComicsPagesMap();
  const baseBdsPages = loadBaseBdsPagesMap();
  const baseMusicsDuration = loadBaseMusicsDurationMap();

  type CategoryKey = keyof typeof getCountFns;
  for (const key of CATEGORY_KEYS as CategoryKey[]) {
    const getCount = getCountFns[key];
    const mostReadSeen = users
      .map((u: { username: string }) => ({
        username: u.username,
        value: getCount(u.username.toLowerCase()),
      }))
      .filter((x: { value: number }) => x.value > 0)
      .sort((a: { value: number }, b: { value: number }) => b.value - a.value)
      .slice(0, 3);

    let mostTimeReadWatched: { username: string; value: number }[] = [];
    const uidList = users.map((u: { username: string }) =>
      u.username.toLowerCase()
    );

    type DurationEntry = { username: string; value: number };
    const byDuration = (a: DurationEntry, b: DurationEntry) =>
      b.value - a.value;

    if (key === 'books') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const userBooks = safeGetUserItems<UserBook>(
            uid,
            getUserBooksFiles,
            parseBooksFromFile
          );
          const bookStatsItems = userBooks.map((b) => ({
            title: b.title,
            pages:
              baseBooksPages.get(
                `${normalizeKey(b.title || '')}|${normalizeKey(b.author || '')}`
              ) ?? 0,
            readTimes: Number(b.readTimes) || 1,
          }));
          const minutes = getTotalBookReadingMinutes(bookStatsItems);
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(minutesToDays(minutes) * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'movies') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const userMovies = safeGetUserItems<UserMovie>(
            uid,
            getUserMoviesFiles,
            parseMoviesFromFile
          );
          const movieStatsItems = userMovies.map((m) => ({
            title: m.title,
            length:
              baseMoviesLength.get(
                `${normalizeKey(m.title || '')}|${normalizeKey(
                  m.director || ''
                )}`
              ) ?? 0,
            timesWatched: Number(m.timesWatched) || 0,
          }));
          const minutes = getTotalWatchingMinutes(movieStatsItems);
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(minutesToDays(minutes) * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'series') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const userSeries = safeGetUserItems<UserSerieFileRow>(
            uid,
            getUserSeriesFiles,
            parseSeriesFromFile
          );
          let totalMinutes = 0;
          for (const row of userSeries) {
            const keySerie = `${normalizeKey(row.title || '')}|${normalizeKey(
              row.director || ''
            )}`;
            const seasonsData = baseSeriesSeasonsData.get(keySerie) ?? [];
            const serie = { ...row, seasonsData } as Serie;
            totalMinutes += getSerieWatchedLengthMinutes(serie);
          }
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(minutesToDays(totalMinutes) * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'games') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const userGames = safeGetUserItems<UserGame>(
            uid,
            getUserAllGamesFiles,
            parseGamesFromFile
          );
          let totalHours = 0;
          for (const g of userGames) {
            const keyGame = `${normalizeKey(g.title || '')}|${normalizeKey(
              g.editor || ''
            )}`;
            const entity = baseGamesEntity.get(keyGame) ?? {
              averageTimeToFinish: 0,
              platineTime: 0,
              averageTimeToHundredPercent: 0,
            };
            totalHours += getGamePlayedHoursFromSessions(g.sessions, entity);
          }
          const days = totalHours / 24;
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(days * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'mangas') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems<UserManga>(
            uid,
            getUserMangasFiles,
            parseMangasFromFile
          );
          const mangaStatsItems = items.map((item) => {
            const k = `${normalizeKey(item.title || '')}|${normalizeKey(
              item.author || ''
            )}`;
            const nbTomes =
              baseMangasNbTomes.get(k) ??
              Number((item as UserManga & { nbTomes?: number }).nbTomes) ??
              0;
            return {
              title: item.title,
              nbTomes,
              readTimes: Number(item.readTimes) || 1,
            };
          });
          const minutes = getTotalMangaReadingMinutes(mangaStatsItems);
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(minutesToDays(minutes) * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'manwhas') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems<UserManwha>(
            uid,
            getUserManwhasFiles,
            parseManwhasFromFile
          );
          const manwhaStatsItems = items.map((item) => {
            const k = `${normalizeKey(item.title || '')}|${normalizeKey(
              item.author || ''
            )}`;
            const nbChapters =
              baseManwhasNbChapters.get(k) ??
              Number(
                (item as UserManwha & { nbChapters?: number }).nbChapters
              ) ??
              0;
            return {
              title: item.title,
              nbChapters,
              readTimes: Number(item.readTimes) || 1,
            };
          });
          const minutes = getTotalManwhaReadingMinutes(manwhaStatsItems);
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(minutesToDays(minutes) * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'comics') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems<UserComic>(
            uid,
            getUserComicsFiles,
            parseComicsFromFile
          );
          const comicStatsItems = items.map((item) => {
            const k = `${normalizeKey(item.title || '')}|${normalizeKey(
              item.writer || ''
            )}`;
            const pages =
              baseComicsPages.get(k) ??
              Number((item as UserComic & { pages?: number }).pages) ??
              0;
            return {
              title: item.title,
              pages,
              readTimes: Number(item.readTimes) || 1,
            };
          });
          const minutes = getTotalComicsReadingMinutes(comicStatsItems);
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(minutesToDays(minutes) * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'bds') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems<UserBd>(
            uid,
            getUserBdsFiles,
            parseBdsFromFile
          );
          const bdStatsItems = items.map((item) => {
            const k = `${normalizeKey(item.title || '')}|${normalizeKey(
              item.writer || ''
            )}`;
            const pages =
              baseBdsPages.get(k) ??
              Number((item as UserBd & { pages?: number }).pages) ??
              0;
            return {
              title: item.title,
              pages,
              readTimes: Number(item.readTimes) || 1,
            };
          });
          const minutes = getTotalBdReadingMinutes(bdStatsItems);
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(minutesToDays(minutes) * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'musics') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems<UserMusic>(
            uid,
            getUserMusicsFiles,
            parseUserMusicsFromFile
          );
          const musicStatsItems = items.map((m) => {
            const k = `${normalizeKey(m.title || '')}|${normalizeKey(
              m.artist || ''
            )}`;
            const durationSec =
              baseMusicsDuration.get(k) ??
              Number((m as UserMusic & { duration?: number }).duration) ??
              0;
            return {
              durationSec,
              timesListened: Number(m.timesListened) || 0,
            };
          });
          const minutes = getTotalMusicListeningMinutes(musicStatsItems);
          const days = minutes / MINUTES_PER_DAY;
          return {
            username:
              users.find((u: UserListItem) => u.username.toLowerCase() === uid)
                ?.username ?? uid,
            value: Math.round(days * 10) / 10,
          };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    }

    result[key] = {
      mostReadSeen,
      mostTimeReadWatched,
    };
  }

  return result;
}

module.exports = {
  buildAdminRecords,
};

export {};
