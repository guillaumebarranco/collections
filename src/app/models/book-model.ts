import { Country } from './countries.enum';

export interface MandatoryBookData {
  title: string;
  author: string;
}

export interface BaseBook extends MandatoryBookData {
  coverUrl: string;
  pages?: number;
  genre: string;
  saga: string;
  sagaOrder: number;
  sagaFinished: boolean;
  releaseDate: string;
  description: string;
  countryOrigin: Country;
}

export interface UserBook extends MandatoryBookData {
  firstReadDate: string;
  lastReadDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
  borrowed: boolean;
}

export type UserBooks = UserBook[];

export interface Book extends BaseBook, UserBook {}
