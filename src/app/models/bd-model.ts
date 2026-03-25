export interface MandatoryBdData {
  title: string;
  writer: string;
}

export interface BaseBd extends MandatoryBdData {
  coverUrl: string;
  pages: number;
  genre: string;
  designer: string;
  description: string;
  saga: string;
  sagaOrder: number;
}

export interface UserBd extends MandatoryBdData {
  readDate: string;
  rating: number;
  readTimes: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
  borrowed: string;
  loaned: string;
}

export type UserBds = UserBd[];

export interface Bd extends BaseBd, UserBd {}
