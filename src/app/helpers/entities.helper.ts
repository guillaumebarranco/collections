import { BaseBd, Bd, UserBd } from '../models/bd-model';
import { BaseBook, Book, UserBook } from '../models/book-model';
import { BaseComic, Comic, UserComic } from '../models/comic-model';
import {
  BaseGame,
  Game,
  UserGame,
  UserGameSession,
} from '../models/game-model';
import { BaseManga, Manga, UserManga } from '../models/manga-model';
import { BaseManwha, UserManwha } from '../models/manwha-model';
import { BaseMovie, Movie, UserMovie } from '../models/movie-model';
import {
  BaseSerie,
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
  pages: baseBd?.pages || 0,
  genre: baseBd?.genre || '',
  nbTomes: baseBd?.nbTomes || 0,
  isFinished: baseBd?.isFinished || false,
  designer: baseBd?.designer || '',
  owned: userBd.owned,
  readPriority: userBd.readPriority,
  wantToReadAgain: userBd.wantToReadAgain,
  description: baseBd?.description ?? '',
  ratingComment: userBd.ratingComment ?? '',
});

export const getBookDataFromUserBookAndBaseBook = (
  userBook: UserBook,
  baseBook: BaseBook
): Book => ({
  title: userBook.title,
  author: userBook.author,
  rating: userBook.rating,
  readDate: userBook.readDate,
  readTimes: userBook.readTimes,
  coverUrl: baseBook?.coverUrl || '',
  pages: baseBook?.pages || 0,
  genre: baseBook?.genre || '',
  saga: baseBook?.saga || '',
  sagaOrder: baseBook?.sagaOrder || 0,
  owned: userBook.owned,
  readPriority: userBook.readPriority,
  sagaFinished: baseBook?.sagaFinished || false,
  releaseDate: baseBook?.releaseDate || '',
  wantToReadAgain: userBook.wantToReadAgain,
  description: baseBook?.description ?? '',
  ratingComment: userBook.ratingComment ?? '',
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
  pages: baseComic?.pages || 0,
  genre: baseComic?.genre || '',
  designer: baseComic?.designer || '',
  owned: userComic.owned,
  readPriority: userComic.readPriority,
  wantToReadAgain: userComic.wantToReadAgain,
  description: baseComic?.description ?? '',
  ratingComment: userComic.ratingComment ?? '',
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
    ratingComment: userGame.ratingComment ?? '',
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
  readTimes: userManga.readTimes,
  coverUrl: baseManga?.coverUrl || '',
  genre: baseManga?.genre || '',
  nbTomes: baseManga?.nbTomes || 0,
  isFinished: baseManga?.isFinished || false,
  owned: userManga.owned,
  readPriority: userManga.readPriority,
  wantToReadAgain: userManga.wantToReadAgain,
  description: baseManga?.description ?? '',
  ratingComment: userManga.ratingComment ?? '',
});

export const getManwhaDataFromUserManwhaAndBaseManwha = (
  userManwha: UserManwha,
  baseManwha: BaseManwha
) => ({
  title: userManwha.title,
  author: userManwha.author,
  rating: userManwha.rating,
  readDate: userManwha.readDate,
  readTimes: userManwha.readTimes,
  coverUrl: baseManwha?.coverUrl || '',
  genre: baseManwha?.genre || '',
  nbChapters: baseManwha?.nbChapters || 0,
  isFinished: baseManwha?.isFinished || false,
  saga: '',
  sagaOrder: 0,
  owned: userManwha.owned,
  readPriority: userManwha.readPriority,
  wantToReadAgain: userManwha.wantToReadAgain,
  description: baseManwha?.description ?? '',
  ratingComment: userManwha.ratingComment ?? '',
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
  actors: baseMovie?.actors || [],
  coverUrl: baseMovie?.coverUrl || '',
  releaseDate: baseMovie?.releaseDate || '',
  length: baseMovie?.length || 0,
  genre: baseMovie?.genre || '',
  seenAtCinema: userMovie.seenAtCinema,
  owned: userMovie.owned,
  saga: baseMovie?.saga || '',
  wantToSeeAgain: userMovie.wantToSeeAgain,
  watchPriority: userMovie.watchPriority,
  description: baseMovie?.description ?? '',
  countryOrigin: baseMovie?.countryOrigin ?? '',
  ratingComment: userMovie.ratingComment ?? '',
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
  genre: baseSerie?.genre || '',
  seasonsData: baseSerie?.seasonsData || [],
  owned: userSerie.owned,
  watchPriority: userSerie.watchPriority,
  wantToWatchAgain: userSerie.wantToWatchAgain,
  description: baseSerie?.description ?? '',
  ratingComment: userSerie.ratingComment ?? '',
});
