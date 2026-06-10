import { BaseBd, Bd, UserBd } from '../models/bd-model';
import { BaseBook, Book, UserBook } from '../models/book-model';
import {
  BaseChildrenBook,
  ChildrenBook,
  UserChildrenBook,
} from '../models/children-book-model';
import { BaseComic, Comic, UserComic } from '../models/comic-model';
import {
  BaseGame,
  Game,
  UserGame,
  UserGameSession,
} from '../models/game-model';
import { isGameInProgress } from '../utils/games.utils';
import { BaseManga, Manga, UserManga } from '../models/manga-model';
import { BaseManwha, UserManwha } from '../models/manwha-model';
import { BaseMovie, Movie, UserMovie } from '../models/movie-model';
import {
  BaseSerie,
  normalizeSerieGenres,
  Serie,
  UserSerie,
  UserSerieSeason,
} from '../models/serie-model';

export const getBdDataFromUserBdAndBaseBd = (
  userBd: UserBd,
  baseBd: BaseBd
): Bd => ({
  title: userBd.title,
  writer: userBd.writer,
  rating: userBd.rating,
  readDate: userBd.readDate,
  readTimes: userBd.readTimes,
  coverUrl: baseBd?.coverUrl || '',
  releaseDate: baseBd?.releaseDate || '',
  pages: baseBd?.pages || 0,
  genre: baseBd?.genre || '',
  designer: baseBd?.designer || '',
  owned: userBd.owned,
  readPriority: userBd.readPriority,
  wantToReadAgain: userBd.wantToReadAgain,
  description: baseBd?.description ?? '',
  ratingComment: userBd.ratingComment ?? '',
  saga: baseBd?.saga ?? '',
  sagaOrder: baseBd?.sagaOrder ?? 0,
  borrowed: userBd.borrowed ?? '',
  loaned: userBd.loaned ?? '',
});

export const getChildrenBookDataFromUserChildrenBookAndBaseChildrenBook = (
  userChildrenBook: UserChildrenBook,
  baseChildrenBook: BaseChildrenBook
): ChildrenBook => ({
  title: userChildrenBook.title,
  author: userChildrenBook.author,
  rating: userChildrenBook.rating,
  firstReadDate: userChildrenBook.firstReadDate,
  lastReadDate: userChildrenBook.lastReadDate,
  otherReadDates: userChildrenBook.otherReadDates ?? [],
  reading: userChildrenBook.reading,
  readTimes: userChildrenBook.readTimes,
  coverUrl: baseChildrenBook?.coverUrl || '',
  pages: baseChildrenBook?.pages || 0,
  genre: baseChildrenBook?.genre ?? [],
  saga: baseChildrenBook?.saga || '',
  sagaOrder: baseChildrenBook?.sagaOrder || 0,
  owned: userChildrenBook.owned,
  borrowed: userChildrenBook.borrowed ?? '',
  loaned: userChildrenBook.loaned ?? '',
  readPriority: userChildrenBook.readPriority,
  sagaFinished: baseChildrenBook?.sagaFinished || false,
  releaseDate: baseChildrenBook?.releaseDate || '',
  wantToReadAgain: userChildrenBook.wantToReadAgain,
  description: baseChildrenBook?.description ?? '',
  ratingComment: userChildrenBook.ratingComment ?? '',
  countryOrigin: baseChildrenBook?.countryOrigin ?? '',
  selectDisplayOrder: baseChildrenBook?.selectDisplayOrder ?? 0,
});

export const getBookDataFromUserBookAndBaseBook = (
  userBook: UserBook,
  baseBook: BaseBook
): Book => ({
  title: userBook.title,
  author: userBook.author,
  rating: userBook.rating,
  firstReadDate: userBook.firstReadDate,
  lastReadDate: userBook.lastReadDate,
  otherReadDates: userBook.otherReadDates ?? [],
  reading: userBook.reading,
  readTimes: userBook.readTimes,
  coverUrl: baseBook?.coverUrl || '',
  pages: baseBook?.pages || 0,
  genre: baseBook?.genre ?? [],
  saga: baseBook?.saga || '',
  sagaOrder: baseBook?.sagaOrder || 0,
  owned: userBook.owned,
  borrowed: userBook.borrowed ?? '',
  loaned: userBook.loaned ?? '',
  readPriority: userBook.readPriority,
  sagaFinished: baseBook?.sagaFinished || false,
  releaseDate: baseBook?.releaseDate || '',
  wantToReadAgain: userBook.wantToReadAgain,
  description: baseBook?.description ?? '',
  ratingComment: userBook.ratingComment ?? '',
  countryOrigin: baseBook?.countryOrigin ?? '',
  selectDisplayOrder: baseBook?.selectDisplayOrder ?? 0,
});

export const getComicDataFromUserComicAndBaseComic = (
  userComic: UserComic,
  baseComic: BaseComic
): Comic => ({
  title: userComic.title,
  writer: userComic.writer,
  rating: userComic.rating,
  readDate: userComic.readDate,
  readTimes: userComic.readTimes,
  coverUrl: baseComic?.coverUrl || '',
  releaseDate: baseComic?.releaseDate || '',
  pages: baseComic?.pages || 0,
  genre: baseComic?.genre || '',
  designer: baseComic?.designer || '',
  owned: userComic.owned,
  readPriority: userComic.readPriority,
  wantToReadAgain: userComic.wantToReadAgain,
  description: baseComic?.description ?? '',
  ratingComment: userComic.ratingComment ?? '',
  saga: baseComic?.saga ?? '',
  sagaOrder: baseComic?.sagaOrder ?? 0,
  borrowed: userComic.borrowed ?? '',
  loaned: userComic.loaned ?? '',
});

/**
 * Dérive les totaux legacy (timesFinished, platined, etc.) à partir des sessions.
 * Utilisé pour l'affichage et les stats quand l'utilisateur utilise le nouveau système de sessions.
 */
export function getGameTotalsFromSessions(sessions: UserGameSession[]): {
  timesFinished: number;
  timesFinishedHundredPercent: number;
  platined: boolean;
  additionnalEstimatedTime: number;
} {
  let timesFinished = 0;
  let timesFinishedHundredPercent = 0;
  let platined = false;
  let additionnalEstimatedTime = 0;
  for (const s of sessions) {
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
      additionnalEstimatedTime += s.additionnalEstimatedTime ?? 0;
    }
  }
  return {
    timesFinished,
    timesFinishedHundredPercent,
    platined,
    additionnalEstimatedTime,
  };
}

function getGameUserTotals(userGame: UserGame): {
  timesFinished: number;
  timesFinishedHundredPercent: number;
  platined: boolean;
  additionnalEstimatedTime: number;
} {
  return getGameTotalsFromSessions(userGame.sessions ?? []);
}

/** True si la dernière session du jeu est en cours (flag ou session ouverte). */
export function isGameCurrentlyPlaying(game: Pick<UserGame, 'sessions'>): boolean {
  return isGameInProgress(game);
}

/** Une seule session « en cours » : uniquement la dernière peut être à true. */
export function normalizeUserGameSessions(
  sessions: UserGameSession[]
): UserGameSession[] {
  if (!sessions.length) return [];
  const last = sessions.length - 1;
  return sessions.map((s, i) => {
    const legacy = s as UserGameSession & { finishedSessionDate?: string };
    return {
      ...s,
      sessionStartDate:
        typeof s.sessionStartDate === 'string' ? s.sessionStartDate : '',
      sessionEndDate:
        typeof s.sessionEndDate === 'string'
          ? s.sessionEndDate
          : typeof legacy.finishedSessionDate === 'string'
            ? legacy.finishedSessionDate
            : '',
      currentlyPlaying: i === last && Boolean(s.currentlyPlaying),
    };
  });
}

export const getGameDataFromUserGameAndBaseGame = (
  userGame: UserGame,
  baseGame: BaseGame
): Game => {
  const totals = getGameUserTotals(userGame);
  return {
    title: userGame.title,
    editor: userGame.editor,
    rating: userGame.rating,
    timesFinished: totals.timesFinished,
    additionnalEstimatedTime: totals.additionnalEstimatedTime,
    hero: baseGame?.hero || '',
    coverUrl: baseGame?.coverUrl || '',
    releaseDate: baseGame?.releaseDate || '',
    averageTimeToFinish: baseGame?.averageTimeToFinish || 0,
    platform: baseGame?.platform || '',
    saga: baseGame?.saga || '',
    platineTime: baseGame?.platineTime || 0,
    platined: totals.platined,
    timesFinishedHundredPercent: totals.timesFinishedHundredPercent,
    averageTimeToHundredPercent: baseGame?.averageTimeToHundredPercent || 0,
    owned: userGame.owned,
    gamelistPriority: userGame.gamelistPriority,
    wantToPlayAgain: userGame.wantToPlayAgain,
    sessions: userGame.sessions ?? [],
    description: baseGame?.description ?? '',
    fromEntity: baseGame?.fromEntity ?? null,
    ratingComment: userGame.ratingComment ?? '',
    borrowed: userGame.borrowed ?? '',
    loaned: userGame.loaned ?? '',
  };
};

export const getMangaDataFromUserMangaAndBaseManga = (
  userManga: UserManga,
  baseManga: BaseManga
): Manga => ({
  title: userManga.title,
  author: userManga.author,
  rating: userManga.rating,
  readDate: userManga.readDate,
  readingScanStartDate: userManga.readingScanStartDate,
  readingScanStopDate: userManga.readingScanStopDate,
  reading: userManga.reading,
  readTimes: userManga.readTimes,
  coverUrl: baseManga?.coverUrl || '',
  genre: baseManga?.genre || '',
  saga: baseManga?.saga ?? '',
  fromEntity: baseManga?.fromEntity ?? null,
  nbTomes: baseManga?.nbTomes || 0,
  startDate: baseManga?.startDate ?? '',
  endDate: baseManga?.endDate ?? '',
  owned: userManga.owned,
  readPriority: userManga.readPriority,
  wantToReadAgain: userManga.wantToReadAgain,
  description: baseManga?.description ?? '',
  ratingComment: userManga.ratingComment ?? '',
  borrowed: userManga.borrowed ?? '',
  loaned: userManga.loaned ?? '',
});

export const getManwhaDataFromUserManwhaAndBaseManwha = (
  userManwha: UserManwha,
  baseManwha: BaseManwha
) => ({
  title: userManwha.title,
  author: userManwha.author,
  rating: userManwha.rating,
  readDate: userManwha.readDate,
  readingScanStartDate: userManwha.readingScanStartDate,
  readingScanStopDate: userManwha.readingScanStopDate,
  reading: userManwha.reading,
  readTimes: userManwha.readTimes,
  coverUrl: baseManwha?.coverUrl || '',
  genre: baseManwha?.genre || '',
  nbChapters: baseManwha?.nbChapters || 0,
  startDate: baseManwha?.startDate ?? '',
  endDate: baseManwha?.endDate ?? '',
  saga: '',
  sagaOrder: 0,
  owned: userManwha.owned,
  readPriority: userManwha.readPriority,
  wantToReadAgain: userManwha.wantToReadAgain,
  description: baseManwha?.description ?? '',
  ratingComment: userManwha.ratingComment ?? '',
  borrowed: userManwha.borrowed ?? '',
  loaned: userManwha.loaned ?? '',
});

export const getMovieDataFromUserMovieAndBaseMovie = (
  userMovie: UserMovie,
  baseMovie: BaseMovie
): Movie => ({
  title: userMovie.title,
  director: userMovie.director,
  rating: userMovie.rating,
  timesWatched: userMovie.timesWatched,
  firstViewedDate: userMovie.firstViewedDate,
  lastViewedDate: userMovie.lastViewedDate,
  otherSeenDates: userMovie.otherSeenDates ?? [],
  actors: baseMovie?.actors || [],
  coverUrl: baseMovie?.coverUrl || '',
  releaseDate: baseMovie?.releaseDate || '',
  length: baseMovie?.length || 0,
  genre: baseMovie?.genre ?? [],
  seenAtCinema: userMovie.seenAtCinema,
  owned: userMovie.owned,
  saga: baseMovie?.saga || '',
  wantToSeeAgain: userMovie.wantToSeeAgain,
  watchPriority: userMovie.watchPriority,
  description: baseMovie?.description ?? '',
  countryOrigin: baseMovie?.countryOrigin ?? [],
  selectDisplayOrder: baseMovie?.selectDisplayOrder ?? 0,
  fromEntity: baseMovie?.fromEntity ?? null,
  ratingComment: userMovie.ratingComment ?? '',
  inList: userMovie.inList ?? [],
  borrowed: userMovie.borrowed ?? '',
  loaned: userMovie.loaned ?? '',
});

export const getSerieDataFromUserSerieAndBaseSerie = (
  userSerie: UserSerie,
  baseSerie: BaseSerie,
  seasons: UserSerieSeason[]
): Serie => ({
  title: userSerie.title,
  director: userSerie.director,
  seasons,
  actors: baseSerie?.actors || [],
  coverUrl: baseSerie?.coverUrl || '',
  releaseDate: baseSerie?.releaseDate || '',
  endDate: baseSerie?.endDate || '',
  genre: normalizeSerieGenres(baseSerie?.genre),
  seasonsData: baseSerie?.seasonsData || [],
  countryOrigin: (baseSerie?.countryOrigin ?? '') as Serie['countryOrigin'],
  owned: userSerie.owned,
  watchPriority: userSerie.watchPriority,
  wantToWatchAgain: userSerie.wantToWatchAgain,
  description: baseSerie?.description ?? '',
  ratingComment: userSerie.ratingComment ?? '',
  saga: baseSerie?.saga ?? '',
  borrowed: userSerie.borrowed ?? '',
  loaned: userSerie.loaned ?? '',
  fromEntity: baseSerie?.fromEntity ?? null,
});
