import { BaseBd, Bd } from '../models/bd-model';
import { BaseBook, Book } from '../models/book-model';
import { BaseComic, Comic } from '../models/comic-model';
import { BaseGame, Game } from '../models/game-model';
import { BaseManga, Manga } from '../models/manga-model';
import { BaseManwha, Manwha } from '../models/manwha-model';
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
  watchPriority: 1,
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
  readPriority: 1,
});

export const getEmptyComic = (comic: BaseComic): Comic => ({
  title: comic.title,
  designer: comic.designer,
  writer: comic.writer,
  coverUrl: comic.coverUrl,
  genre: comic.genre,
  pages: comic.pages,
  owned: false,
  readDate: '',
  rating: 0,
  readPriority: 1,
});

export const getEmptyBd = (bd: BaseBd): Bd => ({
  title: bd.title,
  designer: bd.designer,
  writer: bd.writer,
  coverUrl: bd.coverUrl,
  genre: bd.genre,
  pages: bd.pages,
  owned: false,
  readDate: '',
  rating: 0,
  readPriority: 1,
});

export const getEmptyManga = (manga: BaseManga): Manga => ({
  title: manga.title,
  author: manga.author,
  coverUrl: manga.coverUrl,
  genre: manga.genre,
  owned: false,
  readDate: '',
  rating: 0,
  readPriority: 1,
});

export const getEmptyManwha = (manwha: BaseManwha): Manwha => ({
  title: manwha.title,
  author: manwha.author,
  coverUrl: manwha.coverUrl,
  genre: manwha.genre,
  owned: false,
  readDate: '',
  rating: 0,
  readPriority: 1,
});

export const getEmptyGame = (game: BaseGame): Game => ({
  ...game,
  rating: 0,
  timesFinished: 0,
  additionnalEstimatedTime: 0,
  platined: false,
  timesFinishedHundredPercent: 0,
  owned: false,
  gamelistPriority: 1,
});
