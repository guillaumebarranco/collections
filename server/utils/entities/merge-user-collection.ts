/**
 * Fusion user + base côté serveur pour les collections / getAll* client.
 * Évite d'envoyer le catalogue /entities complet au navigateur.
 */
const fs = require('fs');

const {
  getUserMoviesFiles,
  getUserWatchlistMoviesFiles,
  parseMoviesFromFile,
  getBaseMoviesFiles,
  parseBaseMoviesFullFromFile,
} = require('../movies/movies-utils');
const {
  getUserBooksFiles,
  getUserReadlistBooksFiles,
  parseBooksFromFile,
  getBaseBooksFiles,
  parseBaseBooksFullFromFile,
} = require('../books/books-utils');
const {
  getUserChildrenBooksFiles,
  getUserReadlistChildrenBooksFiles,
  parseChildrenBooksFromFile,
  getBaseChildrenBooksFiles,
  parseBaseChildrenBooksFullFromFile,
} = require('../children-books/children-books-utils');
const {
  getUserSeriesFiles,
  getUserWatchlistSeriesFiles,
  parseSeriesFromFile,
  getBaseSeriesFiles,
  parseBaseSeriesFullFromFile,
} = require('../series/series-utils');
const {
  getUserGamesFiles,
  getUserGamelistFiles,
  parseGamesFromFile,
  getBaseGamesFiles,
  parseBaseGamesFullFromFile,
} = require('../games/games-utils');
const {
  getUserMangasFiles,
  getUserReadlistMangasFiles,
  parseMangasFromFile,
  getBaseMangasFiles,
  parseBaseMangasFullFromFile,
} = require('../mangas/mangas-utils');
const {
  getUserManwhasFiles,
  getUserReadlistManwhasFiles,
  parseManwhasFromFile,
  getBaseManwhasFiles,
  parseBaseManwhasFullFromFile,
} = require('../manwhas/manwhas-utils');
const {
  getUserComicsFiles,
  getUserReadlistComicsFiles,
  parseComicsFromFile,
  getBaseComicsFiles,
  parseBaseComicsFullFromFile,
} = require('../comics/comics-utils');
const {
  getUserBdsFiles,
  getUserReadlistBdsFiles,
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

function loadFromFiles(files: string[], parseFn: (content: string) => any[]): any[] {
  return files.flatMap((filePath: string) => {
    try {
      return parseFn(fs.readFileSync(filePath, 'utf8'));
    } catch {
      return [];
    }
  });
}

function findMatchingBase(
  userItem: any,
  bases: any[],
  titleField: string,
  secondaryField: string
): any | undefined {
  const byTitle = bases.filter(
    (b) => b?.[titleField] === userItem?.[titleField]
  );
  if (byTitle.length === 1) return byTitle[0];
  return byTitle.find((b) => b?.[secondaryField] === userItem?.[secondaryField]);
}

function gameTotalsFromSessions(sessions: any[]) {
  let timesFinished = 0;
  let timesFinishedHundredPercent = 0;
  let platined = false;
  let additionnalEstimatedTime = 0;
  for (const s of sessions ?? []) {
    if (s.platinedGame) {
      platined = true;
      timesFinishedHundredPercent += 1;
      timesFinished += 1;
    } else if (s.finishedGameWithHundredPercent) {
      timesFinishedHundredPercent += 1;
      timesFinished += 1;
    } else if (s.finishedGame) {
      timesFinished += 1;
    } else {
      additionnalEstimatedTime += Number(s.additionnalEstimatedTime) || 0;
    }
  }
  return {
    timesFinished,
    timesFinishedHundredPercent,
    platined,
    additionnalEstimatedTime,
  };
}

function buildSeasons(seasonsCount: number, existing?: any[]) {
  const safeNbSeasons = Math.max(0, Number(seasonsCount) || 0);
  if (existing && existing.length > 0) {
    if (existing.length >= safeNbSeasons) {
      return existing.slice(0, safeNbSeasons);
    }
    const missing = Array.from(
      { length: safeNbSeasons - existing.length },
      (_, index) => ({
        seasonNumber: existing.length + index + 1,
        seasonRating: 0,
        watching: false,
        seasonTimesWatched: 0,
        firstViewedDate: '',
        lastViewedDate: '',
        otherViewedDates: [],
      })
    );
    return [...existing, ...missing];
  }
  return Array.from({ length: safeNbSeasons }, (_, index) => ({
    seasonNumber: index + 1,
    seasonRating: 0,
    watching: false,
    seasonTimesWatched: 0,
    firstViewedDate: '',
    lastViewedDate: '',
    otherViewedDates: [],
  }));
}

function normalizeSerieGenres(genre: unknown): string[] {
  if (Array.isArray(genre)) {
    return genre.map((g) => String(g).trim()).filter(Boolean);
  }
  if (typeof genre === 'string' && genre.trim()) {
    return genre
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);
  }
  return [];
}

type CachedBaseEntry = { stamp: string; data: any[] };
let cachedBase: Record<string, CachedBaseEntry | undefined> = {};

/** Invalide le cache catalogue si les fichiers base changent (mtime/size). */
function filesStamp(files: string[]): string {
  return files
    .map((filePath) => {
      try {
        const st = fs.statSync(filePath);
        return `${filePath}:${st.mtimeMs}:${st.size}`;
      } catch {
        return `${filePath}:missing`;
      }
    })
    .join('|');
}

function getCachedBase(
  key: string,
  getFiles: () => string[],
  parseFn: (content: string) => any[]
): any[] {
  const files = getFiles();
  const stamp = filesStamp(files);
  const existing = cachedBase[key];
  if (!existing || existing.stamp !== stamp) {
    cachedBase[key] = {
      stamp,
      data: loadFromFiles(files, parseFn),
    };
  }
  return cachedBase[key]!.data;
}

function invalidateCachedBase(key?: string) {
  if (key) {
    delete cachedBase[key];
  } else {
    cachedBase = {};
  }
}

function loadBaseMovies() {
  return getCachedBase(
    'movies',
    getBaseMoviesFiles,
    parseBaseMoviesFullFromFile
  );
}
function loadBaseBooks() {
  return getCachedBase('books', getBaseBooksFiles, parseBaseBooksFullFromFile);
}
function loadBaseChildrenBooks() {
  return getCachedBase(
    'childrenBooks',
    getBaseChildrenBooksFiles,
    parseBaseChildrenBooksFullFromFile
  );
}
function loadBaseSeries() {
  return getCachedBase(
    'series',
    getBaseSeriesFiles,
    parseBaseSeriesFullFromFile
  );
}
function loadBaseGames() {
  return getCachedBase('games', getBaseGamesFiles, parseBaseGamesFullFromFile);
}
function loadBaseMangas() {
  return getCachedBase(
    'mangas',
    getBaseMangasFiles,
    parseBaseMangasFullFromFile
  );
}
function loadBaseManwhas() {
  return getCachedBase(
    'manwhas',
    getBaseManwhasFiles,
    parseBaseManwhasFullFromFile
  );
}
function loadBaseComics() {
  return getCachedBase(
    'comics',
    getBaseComicsFiles,
    parseBaseComicsFullFromFile
  );
}
function loadBaseBds() {
  return getCachedBase('bds', getBaseBdsFiles, parseBaseBdsFullFromFile);
}
function loadBaseMusics() {
  return getCachedBase(
    'musics',
    getBaseMusicsFiles,
    parseBaseMusicsFullFromFile
  );
}

function mergeMovies(userMovies: any[]): any[] {
  const baseMovies = loadBaseMovies();
  return userMovies.map((movie) => {
    const base = findMatchingBase(movie, baseMovies, 'title', 'director');
    return {
      title: movie.title,
      director: movie.director,
      rating: movie.rating ?? 0,
      timesWatched: movie.timesWatched ?? 0,
      firstViewedDate: movie.firstViewedDate ?? '',
      lastViewedDate: movie.lastViewedDate ?? '',
      otherSeenDates: movie.otherSeenDates ?? [],
      actors: base?.actors || [],
      coverUrl: base?.coverUrl || '',
      releaseDate: base?.releaseDate || '',
      length: base?.length || 0,
      genre: base?.genre ?? [],
      seenAtCinema: movie.seenAtCinema ?? false,
      owned: movie.owned ?? false,
      saga: base?.saga || '',
      wantToSeeAgain: movie.wantToSeeAgain ?? false,
      watchPriority: movie.watchPriority ?? 1,
      description: base?.description ?? '',
      countryOrigin: base?.countryOrigin ?? [],
      selectDisplayOrder: base?.selectDisplayOrder ?? 0,
      fromEntity: base?.fromEntity ?? null,
      ratingComment: movie.ratingComment ?? '',
      inList: movie.inList ?? [],
      borrowed: movie.borrowed ?? '',
      loaned: movie.loaned ?? '',
    };
  });
}

function mergeBooks(userBooks: any[]): any[] {
  const baseBooks = loadBaseBooks();
  return userBooks.map((book) => {
    const base = findMatchingBase(book, baseBooks, 'title', 'author');
    return {
      title: book.title,
      author: book.author,
      rating: book.rating ?? 0,
      firstReadDate: book.firstReadDate ?? '',
      lastReadDate: book.lastReadDate ?? '',
      otherReadDates: book.otherReadDates ?? [],
      reading: book.reading ?? false,
      readTimes: book.readTimes ?? 0,
      coverUrl: base?.coverUrl || '',
      pages: base?.pages || 0,
      genre: base?.genre ?? [],
      saga: base?.saga || '',
      sagaOrder: base?.sagaOrder || 0,
      owned: book.owned ?? false,
      borrowed: book.borrowed ?? '',
      loaned: book.loaned ?? '',
      readPriority: book.readPriority ?? 1,
      sagaFinished: base?.sagaFinished || false,
      releaseDate: base?.releaseDate || '',
      wantToReadAgain: book.wantToReadAgain ?? false,
      description: base?.description ?? '',
      ratingComment: book.ratingComment ?? '',
      countryOrigin: base?.countryOrigin ?? '',
      selectDisplayOrder: base?.selectDisplayOrder ?? 0,
    };
  });
}

function mergeChildrenBooks(userBooks: any[]): any[] {
  const baseBooks = loadBaseChildrenBooks();
  return userBooks.map((book) => {
    const base = findMatchingBase(book, baseBooks, 'title', 'author');
    return {
      title: book.title,
      author: book.author,
      rating: book.rating ?? 0,
      firstReadDate: book.firstReadDate ?? '',
      lastReadDate: book.lastReadDate ?? '',
      otherReadDates: book.otherReadDates ?? [],
      reading: book.reading ?? false,
      readTimes: book.readTimes ?? 0,
      coverUrl: base?.coverUrl || '',
      pages: base?.pages || 0,
      genre: base?.genre ?? [],
      saga: base?.saga || '',
      sagaOrder: base?.sagaOrder || 0,
      owned: book.owned ?? false,
      borrowed: book.borrowed ?? '',
      loaned: book.loaned ?? '',
      readPriority: book.readPriority ?? 1,
      sagaFinished: base?.sagaFinished || false,
      releaseDate: base?.releaseDate || '',
      wantToReadAgain: book.wantToReadAgain ?? false,
      description: base?.description ?? '',
      ratingComment: book.ratingComment ?? '',
      countryOrigin: base?.countryOrigin ?? '',
      selectDisplayOrder: base?.selectDisplayOrder ?? 0,
    };
  });
}

function mergeSeries(userSeries: any[]): any[] {
  const baseSeries = loadBaseSeries();
  return userSeries.map((serie) => {
    const base = findMatchingBase(serie, baseSeries, 'title', 'director');
    const seasonsCount =
      base?.seasonsData?.length ?? serie.seasons?.length ?? 0;
    const seasons = buildSeasons(seasonsCount, serie.seasons);
    return {
      title: serie.title,
      director: serie.director,
      seasons,
      actors: base?.actors || [],
      coverUrl: base?.coverUrl || '',
      releaseDate: base?.releaseDate || '',
      endDate: base?.endDate || '',
      genre: normalizeSerieGenres(base?.genre),
      seasonsData: base?.seasonsData || [],
      countryOrigin: (base?.countryOrigin ?? '') as string,
      owned: serie.owned ?? false,
      watchPriority: serie.watchPriority ?? 1,
      wantToWatchAgain: serie.wantToWatchAgain ?? false,
      description: base?.description ?? '',
      ratingComment: serie.ratingComment ?? '',
      saga: base?.saga ?? '',
      borrowed: serie.borrowed ?? '',
      loaned: serie.loaned ?? '',
      fromEntity: base?.fromEntity ?? null,
    };
  });
}

function mergeGames(userGames: any[]): any[] {
  const baseGames = loadBaseGames();
  return userGames.map((game) => {
    const base = findMatchingBase(game, baseGames, 'title', 'editor');
    const sessions = game.sessions ?? [];
    const totals = gameTotalsFromSessions(sessions);
    return {
      title: game.title,
      editor: game.editor,
      rating: game.rating ?? 0,
      timesFinished: totals.timesFinished,
      additionnalEstimatedTime: totals.additionnalEstimatedTime,
      hero: base?.hero || '',
      coverUrl: base?.coverUrl || '',
      releaseDate: base?.releaseDate || '',
      averageTimeToFinish: base?.averageTimeToFinish || 0,
      platform: base?.platform || '',
      saga: base?.saga || '',
      platineTime: base?.platineTime || 0,
      platined: totals.platined,
      timesFinishedHundredPercent: totals.timesFinishedHundredPercent,
      averageTimeToHundredPercent: base?.averageTimeToHundredPercent || 0,
      owned: game.owned ?? false,
      gamelistPriority: game.gamelistPriority ?? 1,
      wantToPlayAgain: game.wantToPlayAgain ?? false,
      sessions,
      description: base?.description ?? '',
      fromEntity: base?.fromEntity ?? null,
      ratingComment: game.ratingComment ?? '',
      borrowed: game.borrowed ?? '',
      loaned: game.loaned ?? '',
    };
  });
}

function mergeMangas(userMangas: any[]): any[] {
  const baseMangas = loadBaseMangas();
  return userMangas.map((manga) => {
    const base = findMatchingBase(manga, baseMangas, 'title', 'author');
    return {
      title: manga.title,
      author: manga.author,
      rating: manga.rating ?? 0,
      readDate: manga.readDate ?? '',
      readingScanStartDate: manga.readingScanStartDate ?? '',
      readingScanStopDate: manga.readingScanStopDate ?? '',
      reading: manga.reading ?? false,
      readTimes: manga.readTimes ?? 0,
      coverUrl: base?.coverUrl || '',
      genre: base?.genre || '',
      saga: base?.saga ?? '',
      fromEntity: base?.fromEntity ?? null,
      nbTomes: base?.nbTomes || 0,
      startDate: base?.startDate ?? '',
      endDate: base?.endDate ?? '',
      owned: manga.owned ?? false,
      readPriority: manga.readPriority ?? 1,
      wantToReadAgain: manga.wantToReadAgain ?? false,
      description: base?.description ?? '',
      ratingComment: manga.ratingComment ?? '',
      borrowed: manga.borrowed ?? '',
      loaned: manga.loaned ?? '',
    };
  });
}

function mergeManwhas(userManwhas: any[]): any[] {
  const baseManwhas = loadBaseManwhas();
  return userManwhas.map((manwha) => {
    const base = findMatchingBase(manwha, baseManwhas, 'title', 'author');
    return {
      title: manwha.title,
      author: manwha.author,
      rating: manwha.rating ?? 0,
      readDate: manwha.readDate ?? '',
      readingScanStartDate: manwha.readingScanStartDate ?? '',
      readingScanStopDate: manwha.readingScanStopDate ?? '',
      reading: manwha.reading ?? false,
      readTimes: manwha.readTimes ?? 0,
      coverUrl: base?.coverUrl || '',
      genre: base?.genre || '',
      nbChapters: base?.nbChapters || 0,
      startDate: base?.startDate ?? '',
      endDate: base?.endDate ?? '',
      saga: '',
      sagaOrder: 0,
      owned: manwha.owned ?? false,
      readPriority: manwha.readPriority ?? 1,
      wantToReadAgain: manwha.wantToReadAgain ?? false,
      description: base?.description ?? '',
      ratingComment: manwha.ratingComment ?? '',
      borrowed: manwha.borrowed ?? '',
      loaned: manwha.loaned ?? '',
    };
  });
}

function mergeComics(userComics: any[]): any[] {
  const baseComics = loadBaseComics();
  return userComics.map((comic) => {
    const base = findMatchingBase(comic, baseComics, 'title', 'writer');
    return {
      title: comic.title,
      writer: comic.writer,
      rating: comic.rating ?? 0,
      readDate: comic.readDate ?? '',
      readTimes: comic.readTimes ?? 0,
      coverUrl: base?.coverUrl || '',
      releaseDate: base?.releaseDate || '',
      pages: base?.pages || 0,
      genre: base?.genre || '',
      designer: base?.designer || comic.designer || '',
      owned: comic.owned ?? false,
      readPriority: comic.readPriority ?? 1,
      wantToReadAgain: comic.wantToReadAgain ?? false,
      description: base?.description ?? '',
      ratingComment: comic.ratingComment ?? '',
      saga: base?.saga ?? '',
      sagaOrder: base?.sagaOrder ?? 0,
      borrowed: comic.borrowed ?? '',
      loaned: comic.loaned ?? '',
    };
  });
}

function mergeBds(userBds: any[]): any[] {
  const baseBds = loadBaseBds();
  return userBds.map((bd) => {
    const base = findMatchingBase(bd, baseBds, 'title', 'writer');
    return {
      title: bd.title,
      writer: bd.writer,
      rating: bd.rating ?? 0,
      readDate: bd.readDate ?? '',
      readTimes: bd.readTimes ?? 0,
      coverUrl: base?.coverUrl || '',
      releaseDate: base?.releaseDate || '',
      pages: base?.pages || 0,
      genre: base?.genre || '',
      designer: base?.designer || bd.designer || '',
      owned: bd.owned ?? false,
      readPriority: bd.readPriority ?? 1,
      wantToReadAgain: bd.wantToReadAgain ?? false,
      description: base?.description ?? '',
      ratingComment: bd.ratingComment ?? '',
      saga: base?.saga ?? '',
      sagaOrder: base?.sagaOrder ?? 0,
      borrowed: bd.borrowed ?? '',
      loaned: bd.loaned ?? '',
    };
  });
}

function mergeMusics(userMusics: any[]): any[] {
  const baseMusics = loadBaseMusics();
  return userMusics.map((music) => {
    const base = findMatchingBase(music, baseMusics, 'title', 'artist');
    return {
      title: music.title,
      artist: music.artist,
      rating: music.rating ?? 0,
      timesListened: music.timesListened ?? 0,
      album: base?.album || 'Unknown',
      coverUrl: base?.coverUrl || '',
      releaseDate: base?.releaseDate || '',
      duration: base?.duration || 0,
      genre: base?.genre || '',
    };
  });
}

function getMergedUserMovies(userId: string) {
  return mergeMovies(
    loadFromFiles(getUserMoviesFiles(userId), parseMoviesFromFile)
  );
}
function getMergedWatchlistMovies(userId: string) {
  return mergeMovies(
    loadFromFiles(getUserWatchlistMoviesFiles(userId), parseMoviesFromFile)
  );
}
function getMergedUserBooks(userId: string) {
  return mergeBooks(loadFromFiles(getUserBooksFiles(userId), parseBooksFromFile));
}
function getMergedReadlistBooks(userId: string) {
  return mergeBooks(
    loadFromFiles(getUserReadlistBooksFiles(userId), parseBooksFromFile)
  );
}
function getMergedUserChildrenBooks(userId: string) {
  return mergeChildrenBooks(
    loadFromFiles(getUserChildrenBooksFiles(userId), parseChildrenBooksFromFile)
  );
}
function getMergedReadlistChildrenBooks(userId: string) {
  return mergeChildrenBooks(
    loadFromFiles(
      getUserReadlistChildrenBooksFiles(userId),
      parseChildrenBooksFromFile
    )
  );
}
function getMergedUserSeries(userId: string) {
  return mergeSeries(
    loadFromFiles(getUserSeriesFiles(userId), parseSeriesFromFile)
  );
}
function getMergedWatchlistSeries(userId: string) {
  return mergeSeries(
    loadFromFiles(getUserWatchlistSeriesFiles(userId), parseSeriesFromFile)
  );
}
function getMergedUserGames(userId: string) {
  return mergeGames(loadFromFiles(getUserGamesFiles(userId), parseGamesFromFile));
}
function getMergedGamelistGames(userId: string) {
  return mergeGames(
    loadFromFiles(getUserGamelistFiles(userId), parseGamesFromFile)
  );
}
function getMergedUserMangas(userId: string) {
  return mergeMangas(
    loadFromFiles(getUserMangasFiles(userId), parseMangasFromFile)
  );
}
function getMergedReadlistMangas(userId: string) {
  return mergeMangas(
    loadFromFiles(getUserReadlistMangasFiles(userId), parseMangasFromFile)
  );
}
function getMergedUserManwhas(userId: string) {
  return mergeManwhas(
    loadFromFiles(getUserManwhasFiles(userId), parseManwhasFromFile)
  );
}
function getMergedReadlistManwhas(userId: string) {
  return mergeManwhas(
    loadFromFiles(getUserReadlistManwhasFiles(userId), parseManwhasFromFile)
  );
}
function getMergedUserComics(userId: string) {
  return mergeComics(
    loadFromFiles(getUserComicsFiles(userId), parseComicsFromFile)
  );
}
function getMergedReadlistComics(userId: string) {
  return mergeComics(
    loadFromFiles(getUserReadlistComicsFiles(userId), parseComicsFromFile)
  );
}
function getMergedUserBds(userId: string) {
  return mergeBds(loadFromFiles(getUserBdsFiles(userId), parseBdsFromFile));
}
function getMergedReadlistBds(userId: string) {
  return mergeBds(
    loadFromFiles(getUserReadlistBdsFiles(userId), parseBdsFromFile)
  );
}
function getMergedUserMusics(userId: string) {
  return mergeMusics(
    loadFromFiles(getUserMusicsFiles(userId), parseUserMusicsFromFile)
  );
}

module.exports = {
  getMergedUserMovies,
  getMergedWatchlistMovies,
  getMergedUserBooks,
  getMergedReadlistBooks,
  getMergedUserChildrenBooks,
  getMergedReadlistChildrenBooks,
  getMergedUserSeries,
  getMergedWatchlistSeries,
  getMergedUserGames,
  getMergedGamelistGames,
  getMergedUserMangas,
  getMergedReadlistMangas,
  getMergedUserManwhas,
  getMergedReadlistManwhas,
  getMergedUserComics,
  getMergedReadlistComics,
  getMergedUserBds,
  getMergedReadlistBds,
  getMergedUserMusics,
  invalidateCachedBase,
};

export {};
