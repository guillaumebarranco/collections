/**
 * Construit les collections dashboard « light » (fusion user + base)
 * pour la vue d'ensemble : métriques de temps, counts, todos.
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
  getUserSeriesFiles,
  getUserWatchlistSeriesFiles,
  parseSeriesFromFile,
  getBaseSeriesFiles,
  parseBaseSeriesFullFromFile,
} = require('../series/series-utils');
const {
  getUserGamesFiles,
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

function countFromFiles(files: string[], parseFn: (content: string) => any[]): number {
  return loadFromFiles(files, parseFn).length;
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

function lightSessions(sessions: any[]) {
  return (sessions ?? []).map((s) => ({
    finishedGame: Boolean(s.finishedGame),
    finishedGameWithHundredPercent: Boolean(s.finishedGameWithHundredPercent),
    platinedGame: Boolean(s.platinedGame),
    additionnalEstimatedTime: Number(s.additionnalEstimatedTime) || 0,
    currentlyPlaying: Boolean(s.currentlyPlaying),
    sessionStartDate: s.sessionStartDate ?? '',
    sessionEndDate: s.sessionEndDate ?? '',
  }));
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
        seasonTimesWatched: 0,
      })
    );
    return [...existing, ...missing];
  }
  return Array.from({ length: safeNbSeasons }, (_, index) => ({
    seasonNumber: index + 1,
    seasonRating: 0,
    seasonTimesWatched: 0,
  }));
}

function lightSeasons(seasons: any[]) {
  return (seasons ?? []).map((s) => ({
    seasonNumber: Number(s.seasonNumber) || 0,
    seasonRating: Number(s.seasonRating) || 0,
    seasonTimesWatched: Number(s.seasonTimesWatched) || 0,
  }));
}

function lightSeasonsData(seasonsData: any[]) {
  return (seasonsData ?? []).map((s) => ({
    seasonNumber: Number(s.seasonNumber) || 0,
    totalLength: Number(s.totalLength) || 0,
  }));
}

function buildDashboardOverview(userId: string) {
  const baseMovies = loadFromFiles(
    getBaseMoviesFiles(),
    parseBaseMoviesFullFromFile
  );
  const baseBooks = loadFromFiles(getBaseBooksFiles(), parseBaseBooksFullFromFile);
  const baseSeries = loadFromFiles(
    getBaseSeriesFiles(),
    parseBaseSeriesFullFromFile
  );
  const baseGames = loadFromFiles(getBaseGamesFiles(), parseBaseGamesFullFromFile);
  const baseMangas = loadFromFiles(
    getBaseMangasFiles(),
    parseBaseMangasFullFromFile
  );
  const baseManwhas = loadFromFiles(
    getBaseManwhasFiles(),
    parseBaseManwhasFullFromFile
  );
  const baseComics = loadFromFiles(
    getBaseComicsFiles(),
    parseBaseComicsFullFromFile
  );
  const baseBds = loadFromFiles(getBaseBdsFiles(), parseBaseBdsFullFromFile);
  const baseMusics = loadFromFiles(
    getBaseMusicsFiles(),
    parseBaseMusicsFullFromFile
  );

  const userMovies = loadFromFiles(getUserMoviesFiles(userId), parseMoviesFromFile);
  const userBooks = loadFromFiles(getUserBooksFiles(userId), parseBooksFromFile);
  const userSeries = loadFromFiles(getUserSeriesFiles(userId), parseSeriesFromFile);
  const userGames = loadFromFiles(getUserGamesFiles(userId), parseGamesFromFile);
  const userMangas = loadFromFiles(getUserMangasFiles(userId), parseMangasFromFile);
  const userManwhas = loadFromFiles(
    getUserManwhasFiles(userId),
    parseManwhasFromFile
  );
  const userComics = loadFromFiles(getUserComicsFiles(userId), parseComicsFromFile);
  const userBds = loadFromFiles(getUserBdsFiles(userId), parseBdsFromFile);
  const userMusics = loadFromFiles(
    getUserMusicsFiles(userId),
    parseUserMusicsFromFile
  );

  const movies = userMovies.map((movie: any) => {
    const base = findMatchingBase(movie, baseMovies, 'title', 'director');
    return {
      title: movie.title ?? '',
      director: movie.director ?? '',
      rating: Number(movie.rating) || 0,
      timesWatched: Number(movie.timesWatched) || 0,
      length: Number(base?.length) || 0,
    };
  });

  const books = userBooks.map((book: any) => {
    const base = findMatchingBase(book, baseBooks, 'title', 'author');
    return {
      title: book.title ?? '',
      author: book.author ?? '',
      rating: Number(book.rating) || 0,
      readTimes: Number(book.readTimes) || 0,
      pages: Number(base?.pages) || 0,
    };
  });

  const series = userSeries.map((serie: any) => {
    const base = findMatchingBase(serie, baseSeries, 'title', 'director');
    const seasonsCount =
      base?.seasonsData?.length ?? serie.seasons?.length ?? 0;
    const seasons = buildSeasons(seasonsCount, serie.seasons);
    return {
      title: serie.title ?? '',
      director: serie.director ?? '',
      rating: Number(serie.rating) || 0,
      seasons: lightSeasons(seasons),
      seasonsData: lightSeasonsData(base?.seasonsData ?? []),
    };
  });

  const games = userGames.map((game: any) => {
    const base = findMatchingBase(game, baseGames, 'title', 'editor');
    const sessions = lightSessions(game.sessions);
    const totals = gameTotalsFromSessions(sessions);
    return {
      title: game.title ?? '',
      editor: game.editor ?? '',
      rating: Number(game.rating) || 0,
      sessions,
      averageTimeToFinish: Number(base?.averageTimeToFinish) || 0,
      platineTime: Number(base?.platineTime) || 0,
      averageTimeToHundredPercent:
        Number(base?.averageTimeToHundredPercent) || 0,
      timesFinished: totals.timesFinished,
      timesFinishedHundredPercent: totals.timesFinishedHundredPercent,
      platined: totals.platined,
      additionnalEstimatedTime: totals.additionnalEstimatedTime,
    };
  });

  const mangas = userMangas.map((manga: any) => {
    const base = findMatchingBase(manga, baseMangas, 'title', 'author');
    return {
      title: manga.title ?? '',
      author: manga.author ?? '',
      rating: Number(manga.rating) || 0,
      readTimes: Number(manga.readTimes) || 0,
      nbTomes: Number(base?.nbTomes) || 0,
    };
  });

  const manwhas = userManwhas.map((manwha: any) => {
    const base = findMatchingBase(manwha, baseManwhas, 'title', 'author');
    return {
      title: manwha.title ?? '',
      author: manwha.author ?? '',
      rating: Number(manwha.rating) || 0,
      readTimes: Number(manwha.readTimes) || 0,
      nbChapters: Number(base?.nbChapters) || 0,
    };
  });

  const comics = userComics.map((comic: any) => {
    const base = findMatchingBase(comic, baseComics, 'title', 'writer');
    return {
      title: comic.title ?? '',
      writer: comic.writer ?? '',
      designer: comic.designer ?? base?.designer ?? '',
      rating: Number(comic.rating) || 0,
      readTimes: Number(comic.readTimes) || 0,
      pages: Number(base?.pages) || 0,
    };
  });

  const bds = userBds.map((bd: any) => {
    const base = findMatchingBase(bd, baseBds, 'title', 'writer');
    return {
      title: bd.title ?? '',
      writer: bd.writer ?? '',
      designer: bd.designer ?? base?.designer ?? '',
      rating: Number(bd.rating) || 0,
      readTimes: Number(bd.readTimes) || 0,
      pages: Number(base?.pages) || 0,
    };
  });

  const musics = userMusics.map((music: any) => {
    const base = findMatchingBase(music, baseMusics, 'title', 'artist');
    return {
      title: music.title ?? '',
      artist: music.artist ?? '',
      rating: Number(music.rating) || 0,
      timesListened: Number(music.timesListened) || 0,
      duration: Number(base?.duration) || 0,
    };
  });

  return {
    movies,
    books,
    series,
    games,
    mangas,
    manwhas,
    comics,
    bds,
    musics,
    watchlistMoviesCount: countFromFiles(
      getUserWatchlistMoviesFiles(userId),
      parseMoviesFromFile
    ),
    watchlistSeriesCount: countFromFiles(
      getUserWatchlistSeriesFiles(userId),
      parseSeriesFromFile
    ),
    readlistBooksCount: countFromFiles(
      getUserReadlistBooksFiles(userId),
      parseBooksFromFile
    ),
    readlistMangasCount: countFromFiles(
      getUserReadlistMangasFiles(userId),
      parseMangasFromFile
    ),
    readlistComicsCount: countFromFiles(
      getUserReadlistComicsFiles(userId),
      parseComicsFromFile
    ),
    readlistBdsCount: countFromFiles(
      getUserReadlistBdsFiles(userId),
      parseBdsFromFile
    ),
    readlistManwhasCount: countFromFiles(
      getUserReadlistManwhasFiles(userId),
      parseManwhasFromFile
    ),
  };
}

module.exports = {
  buildDashboardOverview,
};

export {};
