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
}

export interface UserBook extends MandatoryBookData {
  readDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
}

export type UserBooks = UserBook[];

export interface Book extends BaseBook, UserBook {}
