import type { LightBd, LightBook, LightComic, LightGame, LightManga, LightManwha, LightMovie } from '../models/entity-light.model';
import { BaseBd, Bd } from '../models/bd-model';
import { BaseBook, Book } from '../models/book-model';
import { BaseChildrenBook, ChildrenBook } from '../models/children-book-model';
import { BaseComic, Comic } from '../models/comic-model';
import { BaseGame, Game } from '../models/game-model';
import { BaseManga, Manga } from '../models/manga-model';
import { BaseManwha, Manwha } from '../models/manwha-model';
import { BaseMovie, Movie } from '../models/movie-model';

/** Accepte Base complet ou DTO light des pages select. */
export const getEmptyMovie = (movie: BaseMovie | LightMovie): Movie => {
  const full = movie as BaseMovie;
  return {
    title: movie.title,
    director: movie.director,
    coverUrl: movie.coverUrl ?? '',
    releaseDate: movie.releaseDate ?? '',
    selectDisplayOrder: movie.selectDisplayOrder ?? 0,
    actors: full.actors ?? [],
    length: full.length ?? 0,
    genre: full.genre ?? [],
    saga: full.saga ?? '',
    description: full.description ?? '',
    fromEntity: full.fromEntity ?? null,
    oscars: full.oscars ?? [],
    countryOrigin: full.countryOrigin ?? [],
    rating: 0,
    timesWatched: 0,
    firstViewedDate: '',
    lastViewedDate: '',
    otherSeenDates: [],
    seenAtCinema: false,
    owned: false,
    wantToSeeAgain: false,
    watchPriority: 1,
    ratingComment: '',
    inList: [],
    borrowed: '',
    loaned: '',
  };
};

export const getEmptyChildrenBook = (
  book: BaseChildrenBook | LightBook
): ChildrenBook => getEmptyBook(book as BaseBook | LightBook) as ChildrenBook;

export const getEmptyBook = (book: BaseBook | LightBook): Book => {
  const full = book as BaseBook;
  return {
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl ?? '',
    genre: full.genre ?? [],
    saga: book.saga ?? '',
    sagaOrder: full.sagaOrder ?? 0,
    owned: false,
    borrowed: '',
    loaned: '',
    firstReadDate: '',
    lastReadDate: '',
    otherReadDates: [],
    rating: 0,
    reading: false,
    readTimes: 0,
    readPriority: 1,
    sagaFinished: full.sagaFinished ?? false,
    releaseDate: full.releaseDate ?? '',
    wantToReadAgain: false,
    description: full.description ?? '',
    ratingComment: '',
    countryOrigin: full.countryOrigin ?? '',
    selectDisplayOrder: book.selectDisplayOrder ?? 0,
    pages: full.pages ?? 0,
  };
};

export const getEmptyComic = (comic: BaseComic | LightComic): Comic => {
  const full = comic as BaseComic;
  return {
    title: comic.title,
    designer: comic.designer ?? '',
    writer: comic.writer ?? '',
    coverUrl: comic.coverUrl ?? '',
    releaseDate: full.releaseDate ?? '',
    genre: full.genre ?? [],
    pages: full.pages ?? 0,
    owned: false,
    readDate: '',
    rating: 0,
    readTimes: 0,
    readPriority: 1,
    wantToReadAgain: false,
    description: full.description ?? '',
    ratingComment: '',
    saga: full.saga ?? '',
    sagaOrder: full.sagaOrder ?? 0,
    borrowed: '',
    loaned: '',
  };
};

export const getEmptyBd = (bd: BaseBd | LightBd): Bd => {
  const full = bd as BaseBd;
  return {
    title: bd.title,
    designer: bd.designer ?? '',
    writer: bd.writer ?? '',
    coverUrl: bd.coverUrl ?? '',
    releaseDate: full.releaseDate ?? '',
    genre: full.genre ?? [],
    pages: full.pages ?? 0,
    owned: false,
    readDate: '',
    rating: 0,
    readPriority: 1,
    wantToReadAgain: false,
    description: full.description ?? '',
    ratingComment: '',
    readTimes: 0,
    saga: full.saga ?? '',
    sagaOrder: full.sagaOrder ?? 0,
    borrowed: '',
    loaned: '',
  };
};

export const getEmptyManga = (manga: BaseManga | LightManga): Manga => {
  const full = manga as BaseManga;
  return {
    title: manga.title,
    author: manga.author,
    coverUrl: manga.coverUrl ?? '',
    genre: full.genre ?? [],
    saga: full.saga ?? '',
    fromEntity: full.fromEntity ?? null,
    owned: false,
    readDate: '',
    readingScanStartDate: '',
    readingScanStopDate: '',
    rating: 0,
    reading: false,
    readTimes: 0,
    readPriority: 1,
    nbTomes: full.nbTomes ?? 0,
    startDate: full.startDate ?? '',
    endDate: full.endDate ?? '',
    wantToReadAgain: false,
    description: full.description ?? '',
    ratingComment: '',
    borrowed: '',
    loaned: '',
  };
};

export const getEmptyManwha = (manwha: BaseManwha | LightManwha): Manwha => {
  const full = manwha as BaseManwha;
  return {
    title: manwha.title,
    author: manwha.author,
    coverUrl: manwha.coverUrl ?? '',
    genre: full.genre ?? [],
    owned: false,
    readDate: '',
    readingScanStartDate: '',
    readingScanStopDate: '',
    rating: 0,
    reading: false,
    readTimes: 0,
    readPriority: 1,
    nbChapters: full.nbChapters ?? 0,
    startDate: full.startDate ?? '',
    endDate: full.endDate ?? '',
    wantToReadAgain: false,
    description: full.description ?? '',
    ratingComment: '',
    borrowed: '',
    loaned: '',
  };
};

export const getEmptyGame = (game: BaseGame | LightGame): Game => {
  const full = game as BaseGame;
  return {
    title: game.title,
    editor: game.editor,
    coverUrl: game.coverUrl ?? '',
    releaseDate: game.releaseDate ?? '',
    hero: full.hero ?? '',
    averageTimeToFinish: full.averageTimeToFinish ?? 0,
    averageTimeToHundredPercent: full.averageTimeToHundredPercent ?? 0,
    platform: full.platform ?? '',
    saga: full.saga ?? '',
    platineTime: full.platineTime ?? 0,
    description: full.description ?? '',
    fromEntity: full.fromEntity ?? null,
    rating: 0,
    owned: false,
    gamelistPriority: 1,
    wantToPlayAgain: false,
    sessions: [],
    timesFinished: 0,
    timesFinishedHundredPercent: 0,
    additionnalEstimatedTime: 0,
    platined: false,
    ratingComment: '',
    borrowed: '',
    loaned: '',
  };
};
