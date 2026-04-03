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

// Constantes alignées avec src/app/utils/stats.utils.ts et series.utils.ts
const MINUTES_PER_PAGE = 1.5;
const SECONDS_PER_COMIC_PAGE = 20;
const MINUTES_PER_MANGA_TOME = 30;
const MINUTES_PER_MANWHA_CHAPTER = 5;
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
  parseFile: (content: string) => any[]
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
        const key = `${normalizeKey(b.title || '')}|${normalizeKey(b.author || '')}`;
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
        const key = `${normalizeKey(m.title || '')}|${normalizeKey(m.director || '')}`;
        map.set(key, Number(m.length) || 0);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function loadBaseSeriesSeasonsDataMap(): Map<string, { seasonNumber: number; totalLength: number }[]> {
  const map = new Map<string, { seasonNumber: number; totalLength: number }[]>();
  try {
    const files = getBaseSeriesFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const series = parseBaseSeriesFullFromFile(content);
      for (const s of series) {
        const key = `${normalizeKey(s.title || '')}|${normalizeKey(s.director || '')}`;
        const seasonsData = Array.isArray(s.seasonsData)
          ? (s.seasonsData as any[]).map((se: any) => ({
              seasonNumber: Number(se.seasonNumber) ?? 0,
              totalLength: Number(se.totalLength) ?? 0,
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

function loadBaseGamesEntityMap(): Map<string, { averageTimeToFinish: number; platineTime: number; averageTimeToHundredPercent: number }> {
  const map = new Map();
  try {
    const files = getBaseGamesFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const games = parseBaseGamesFullFromFile(content);
      for (const g of games) {
        const key = `${normalizeKey(g.title || '')}|${normalizeKey(g.editor || '')}`;
        map.set(key, {
          averageTimeToFinish: finiteOr0(Number(g.averageTimeToFinish)),
          platineTime: finiteOr0(Number(g.platineTime)),
          averageTimeToHundredPercent: finiteOr0(
            Number((g as { averageTimeToHundredPercent?: number }).averageTimeToHundredPercent)
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
        const key = `${normalizeKey(m.title || '')}|${normalizeKey(m.author || '')}`;
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
        const key = `${normalizeKey(m.title || '')}|${normalizeKey(m.author || '')}`;
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
        const key = `${normalizeKey(c.title || '')}|${normalizeKey(c.writer || '')}`;
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
        const key = `${normalizeKey(b.title || '')}|${normalizeKey(b.writer || '')}`;
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
        const key = `${normalizeKey(m.title || '')}|${normalizeKey(m.artist || '')}`;
        map.set(key, Number(m.duration) ?? 0);
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function getBookReadingMinutes(userBooks: any[], basePagesMap: Map<string, number>): number {
  let total = 0;
  for (const b of userBooks) {
    const key = `${normalizeKey(b.title || '')}|${normalizeKey(b.author || '')}`;
    const pages = basePagesMap.get(key) ?? 0;
    const readTimes = Number(b.readTimes) || 1;
    total += pages * readTimes * MINUTES_PER_PAGE;
  }
  return total;
}

function getMovieWatchingMinutes(userMovies: any[], baseLengthMap: Map<string, number>): number {
  let total = 0;
  for (const m of userMovies) {
    const key = `${normalizeKey(m.title || '')}|${normalizeKey(m.director || '')}`;
    const length = baseLengthMap.get(key) ?? 0;
    const timesWatched = Number(m.timesWatched) || 0;
    total += length * timesWatched;
  }
  return total;
}

function getSerieWatchedMinutes(
  userSerie: { seasons?: any[] },
  seasonsData: { seasonNumber: number; totalLength: number }[]
): number {
  const seasons = userSerie.seasons || [];
  if (seasonsData.length === 0 || seasons.length === 0) return 0;
  const byNumber = new Map<number, number>();
  for (const se of seasons) {
    const num = Number(se.seasonNumber) ?? 0;
    const times = Number(se.seasonTimesWatched) ?? 0;
    byNumber.set(num, times);
  }
  let total = 0;
  for (const sd of seasonsData) {
    const timesWatched = byNumber.get(sd.seasonNumber) ?? 0;
    total += (sd.totalLength || 0) * timesWatched;
  }
  return total;
}

function getGamePlayedHours(
  userGame: { sessions?: any[] },
  entity: { averageTimeToFinish: number; platineTime: number; averageTimeToHundredPercent: number }
): number {
  const sessions = userGame.sessions || [];
  if (sessions.length === 0) return 0;
  let total = 0;
  const platineTime = entity.platineTime > 0 ? entity.platineTime : entity.averageTimeToHundredPercent;
  for (const s of sessions) {
    if (s.platinedGame) {
      total += platineTime;
    } else if (s.finishedGameWithHundredPercent) {
      total += entity.averageTimeToHundredPercent;
    } else if (s.finishedGame) {
      total += entity.averageTimeToFinish;
    }
    total += Number(s.additionnalEstimatedTime) || 0;
  }
  return total;
}

function getMangaReadingMinutes(items: any[], baseNbTomesMap: Map<string, number>): number {
  let total = 0;
  for (const item of items) {
    const key = `${normalizeKey(item.title || '')}|${normalizeKey(item.author || '')}`;
    const nbTomes = baseNbTomesMap.get(key) ?? Number(item.nbTomes) ?? 0;
    const readTimes = Number(item.readTimes) || 1;
    total += nbTomes * MINUTES_PER_MANGA_TOME * readTimes;
  }
  return total;
}

function getManwhaReadingMinutes(items: any[], baseNbChaptersMap: Map<string, number>): number {
  let total = 0;
  for (const item of items) {
    const key = `${normalizeKey(item.title || '')}|${normalizeKey(item.author || '')}`;
    const nbChapters = baseNbChaptersMap.get(key) ?? Number(item.nbChapters) ?? 0;
    const readTimes = Number(item.readTimes) || 1;
    total += nbChapters * MINUTES_PER_MANWHA_CHAPTER * readTimes;
  }
  return total;
}

function getComicsOrBdReadingMinutes(items: any[], basePagesMap: Map<string, number>): number {
  let total = 0;
  for (const item of items) {
    const key = `${normalizeKey(item.title || '')}|${normalizeKey(item.writer || '')}`;
    const pages = basePagesMap.get(key) ?? Number(item.pages) ?? 0;
    const readTimes = Number(item.readTimes) || 1;
    total += (pages * SECONDS_PER_COMIC_PAGE) / 60 * readTimes;
  }
  return total;
}

function getMusicListeningHours(items: any[], baseDurationMap: Map<string, number>): number {
  let total = 0;
  for (const m of items) {
    const key = `${normalizeKey(m.title || '')}|${normalizeKey(m.artist || '')}`;
    const durationSec = baseDurationMap.get(key) ?? Number(m.duration) ?? 0;
    const times = Number(m.timesListened) || 0;
    total += (durationSec / 3600) * times;
  }
  return total;
}

function safeGetUserItems<T>(
  userId: string,
  getFiles: (uid: string) => string[],
  parseFile: (content: string) => any[]
): T[] {
  try {
    const files = getFiles(userId);
    const out: any[] = [];
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
    const uidList = users.map((u: { username: string }) => u.username.toLowerCase());

    type DurationEntry = { username: string; value: number };
    const byDuration = (a: DurationEntry, b: DurationEntry) => b.value - a.value;

    if (key === 'books') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const userBooks = safeGetUserItems(uid, getUserBooksFiles, parseBooksFromFile);
          const minutes = getBookReadingMinutes(userBooks, baseBooksPages);
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(minutesToDays(minutes) * 10) / 10 };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'movies') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const userMovies = safeGetUserItems(uid, getUserMoviesFiles, parseMoviesFromFile);
          const minutes = getMovieWatchingMinutes(userMovies, baseMoviesLength);
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(minutesToDays(minutes) * 10) / 10 };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'series') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const userSeries = safeGetUserItems<{ title?: string; director?: string; seasons?: any[] }>(uid, getUserSeriesFiles, parseSeriesFromFile);
          let totalMinutes = 0;
          for (const s of userSeries) {
            const keySerie = `${normalizeKey(s.title || '')}|${normalizeKey(s.director || '')}`;
            const seasonsData = baseSeriesSeasonsData.get(keySerie) ?? [];
            totalMinutes += getSerieWatchedMinutes(s, seasonsData);
          }
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(minutesToDays(totalMinutes) * 10) / 10 };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'games') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const userGames = safeGetUserItems<{ title?: string; editor?: string; sessions?: any[] }>(uid, getUserAllGamesFiles, parseGamesFromFile);
          let totalHours = 0;
          for (const g of userGames) {
            const keyGame = `${normalizeKey(g.title || '')}|${normalizeKey(g.editor || '')}`;
            const entity = baseGamesEntity.get(keyGame) ?? { averageTimeToFinish: 0, platineTime: 0, averageTimeToHundredPercent: 0 };
            totalHours += getGamePlayedHours(g, entity);
          }
          const days = totalHours / 24;
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(days * 10) / 10 };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'mangas') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems(uid, getUserMangasFiles, parseMangasFromFile);
          const minutes = getMangaReadingMinutes(items, baseMangasNbTomes);
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(minutesToDays(minutes) * 10) / 10 };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'manwhas') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems(uid, getUserManwhasFiles, parseManwhasFromFile);
          const minutes = getManwhaReadingMinutes(items, baseManwhasNbChapters);
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(minutesToDays(minutes) * 10) / 10 };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'comics') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems(uid, getUserComicsFiles, parseComicsFromFile);
          const minutes = getComicsOrBdReadingMinutes(items, baseComicsPages);
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(minutesToDays(minutes) * 10) / 10 };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'bds') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems(uid, getUserBdsFiles, parseBdsFromFile);
          const minutes = getComicsOrBdReadingMinutes(items, baseBdsPages);
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(minutesToDays(minutes) * 10) / 10 };
        })
        .filter((x: DurationEntry) => x.value > 0)
        .sort(byDuration)
        .slice(0, 3);
    } else if (key === 'musics') {
      mostTimeReadWatched = uidList
        .map((uid: string) => {
          const items = safeGetUserItems(uid, getUserMusicsFiles, parseUserMusicsFromFile);
          const hours = getMusicListeningHours(items, baseMusicsDuration);
          const days = hours / 24;
          return { username: users.find((u: any) => u.username.toLowerCase() === uid)?.username ?? uid, value: Math.round(days * 10) / 10 };
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
