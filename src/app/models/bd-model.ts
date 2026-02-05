export interface MandatoryBdData {
  title: string;
  writer: string;
}

export interface BaseBd extends MandatoryBdData {
  coverUrl: string;
  pages?: number;
  genre: string;
  nbTomes?: number;
  isFinished?: boolean;
  designer: string;
}

export interface UserBd extends MandatoryBdData {
  readDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
  readPriority: number;
}

export type UserBds = UserBd[];

export interface Bd extends BaseBd, UserBd {}
