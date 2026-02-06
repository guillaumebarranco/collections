import { BaseBd, Bd, UserBd } from '../models/bd-model';
import { BaseBook, Book, UserBook } from '../models/book-model';
import { BaseComic, Comic, UserComic } from '../models/comic-model';
import { BaseGame, Game, UserGame } from '../models/game-model';
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
});

export const getGameDataFromUserGameAndBaseGame = (
  userGame: UserGame,
  baseGame: BaseGame
): Game => ({
  title: userGame.title,
  editor: userGame.editor,
  rating: userGame.rating,
  timesFinished: userGame.timesFinished,
  additionnalEstimatedTime: userGame.additionnalEstimatedTime,
  hero: baseGame?.hero || '',
  coverUrl: baseGame?.coverUrl || '',
  releaseDate: baseGame?.releaseDate || '',
  averageTimeToFinish: baseGame?.averageTimeToFinish || 0,
  platform: baseGame?.platform || '',
  saga: baseGame?.saga || '',
  platineTime: baseGame?.platineTime || 0,
  platined: userGame.platined,
  timesFinishedHundredPercent: userGame.timesFinishedHundredPercent,
  averageTimeToHundredPercent: baseGame?.averageTimeToHundredPercent || 0,
  owned: userGame.owned,
  gamelistPriority: userGame.gamelistPriority,
});

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
  pages: baseManga?.pages || 0,
  genre: baseManga?.genre || '',
  nbTomes: baseManga?.nbTomes || 0,
  isFinished: baseManga?.isFinished || false,
  owned: userManga.owned,
  readPriority: userManga.readPriority,
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
  pages: baseManwha?.pages || 0,
  genre: baseManwha?.genre || '',
  nbChapters: baseManwha?.nbChapters || 0,
  isFinished: baseManwha?.isFinished || false,
  saga: '',
  sagaOrder: 0,
  owned: userManwha.owned,
  readPriority: userManwha.readPriority,
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
});
