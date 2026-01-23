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
  nbTomes?: number;
  isFinished?: boolean;
}

export interface UserBook extends MandatoryBookData {
  readDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
}

export interface Book extends BaseBook, UserBook {}
