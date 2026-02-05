import { BaseBook, Book } from '../models/book-model';
import { BaseGame, Game } from '../models/game-model';
import { BaseMovie, Movie } from '../models/movie-model';

export const getEmptyMovie = (movie: BaseMovie): Movie => ({
  ...movie,
  rating: 0,
  timesWatched: 0,
  firstViewedDate: '',
  lastViewedDate: '',
  seenAtCinema: false,
  owned: false,
  wantToSeeAgain: false,
  watchPriority: 0,
});

export const getEmptyBook = (book: BaseBook): Book => ({
  title: book.title,
  author: book.author,
  coverUrl: book.coverUrl,
  genre: book.genre,
  saga: book.saga,
  sagaOrder: book.sagaOrder,
  owned: false,
  readDate: '',
  rating: 0,
  readPriority: 0,
});

export const getEmptyGame = (game: BaseGame): Game => ({
  ...game,
  rating: 0,
  timesFinished: 0,
  additionnalEstimatedTime: 0,
  platined: false,
  timesFinishedHundredPercent: 0,
  owned: false,
  gamelistPriority: 0,
});
