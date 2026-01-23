export interface MandatoryBdData {
  title: string;
  designer: string;
}

export interface BaseBd extends MandatoryBdData {
  coverUrl: string;
  pages?: number;
  genre: string;
  nbTomes?: number;
  isFinished?: boolean;
  writer: string;
}

export interface UserBd extends MandatoryBdData {
  readDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
}

export interface Bd extends BaseBd, UserBd {}
