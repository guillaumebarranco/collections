import { BaseBd, Bd } from '../models/bd-model';
import { BaseBook, Book } from '../models/book-model';
import { BaseComic, Comic } from '../models/comic-model';
import { BaseGame, Game } from '../models/game-model';
import { BaseManga, Manga } from '../models/manga-model';
import { BaseManwha, Manwha } from '../models/manwha-model';
import { BaseMovie, Movie } from '../models/movie-model';
import { BaseSerie, Serie } from '../models/serie-model';

export const getFullBd = (bd: BaseBd): Bd => ({
  title: bd.title,
  writer: bd.writer,
  coverUrl: bd.coverUrl,
  pages: bd.pages,
  genre: bd.genre,
  nbTomes: bd.nbTomes,
  isFinished: bd.isFinished,
  designer: bd.designer,
  rating: 0,
  readDate: '',
  readTimes: 0,
  owned: false,
  readPriority: 1,
  wantToReadAgain: false,
});

export const getFullComic = (comic: BaseComic): Comic => ({
  title: comic.title,
  writer: comic.writer,
  coverUrl: comic.coverUrl,
  pages: comic.pages,
  genre: comic.genre,
  designer: comic.designer,
  rating: 0,
  readDate: '',
  readTimes: 0,
  owned: false,
  readPriority: 1,
  wantToReadAgain: false,
});

export const getFullBook = (book: BaseBook): Book => ({
  title: book.title,
  author: book.author,
  coverUrl: book.coverUrl,
  pages: book.pages,
  genre: book.genre,
  saga: book.saga,
  sagaOrder: book.sagaOrder,
  rating: 0,
  readDate: '',
  readTimes: 0,
  owned: false,
  readPriority: 1,
  sagaFinished: book.sagaFinished,
  releaseDate: book.releaseDate,
  wantToReadAgain: false,
});

export const getFullGame = (game: BaseGame): Game => ({
  title: game.title,
  editor: game.editor,
  hero: game.hero,
  coverUrl: game.coverUrl,
  releaseDate: game.releaseDate,
  averageTimeToFinish: game.averageTimeToFinish,
  averageTimeToHundredPercent: game.averageTimeToHundredPercent,
  platform: game.platform,
  saga: game.saga,
  platineTime: game.platineTime,
  rating: 0,
  timesFinished: 0,
  timesFinishedHundredPercent: 0,
  additionnalEstimatedTime: 0,
  platined: false,
  owned: false,
  gamelistPriority: 1,
  wantToPlayAgain: false,
});

export const getFullManga = (manga: BaseManga): Manga => ({
  title: manga.title,
  author: manga.author,
  coverUrl: manga.coverUrl,
  genre: manga.genre,
  nbTomes: manga.nbTomes,
  isFinished: manga.isFinished,
  rating: 0,
  readDate: '',
  readTimes: 0,
  owned: false,
  readPriority: 1,
  wantToReadAgain: false,
});

export const getFullManwha = (manwha: BaseManwha): Manwha => ({
  title: manwha.title,
  author: manwha.author,
  coverUrl: manwha.coverUrl,
  genre: manwha.genre,
  nbChapters: manwha.nbChapters,
  isFinished: manwha.isFinished,
  rating: 0,
  readDate: '',
  readTimes: 0,
  owned: false,
  readPriority: 1,
  wantToReadAgain: false,
});

export const getFullMovie = (movie: BaseMovie): Movie => ({
  title: movie.title,
  director: movie.director,
  coverUrl: movie.coverUrl,
  releaseDate: movie.releaseDate,
  length: movie.length,
  genre: movie.genre,
  saga: movie.saga,
  actors: movie.actors,
  rating: 0,
  timesWatched: 0,
  firstViewedDate: '',
  lastViewedDate: '',
  seenAtCinema: false,
  owned: false,
  wantToSeeAgain: false,
  watchPriority: 1,
});

export const getFullSerie = (serie: BaseSerie): Serie => ({
  title: serie.title,
  director: serie.director,
  actors: serie.actors,
  coverUrl: serie.coverUrl,
  releaseDate: serie.releaseDate,
  endDate: serie.endDate,
  genre: serie.genre,
  seasonsData: serie.seasonsData,
  seasons: [],
  owned: false,
  watchPriority: 1,
  wantToWatchAgain: false,
});
