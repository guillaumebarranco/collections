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
}

export interface UserBook extends MandatoryBookData {
  readDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
  readPriority: number;
}

export type UserBooks = UserBook[];

export interface Book extends BaseBook, UserBook {}
