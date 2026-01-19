export interface MandatoryBdData {
  title: string;
  author: string;
}

export interface BaseBd extends MandatoryBdData {
  coverUrl: string;
  pages?: number;
  genre: string;
  nbTomes?: number;
  isFinished?: boolean;
}

export interface UserBd extends MandatoryBdData {
  readDate: string;
  rating: number;
  readTimes?: number;
}

export interface Bd extends BaseBd, UserBd {}
