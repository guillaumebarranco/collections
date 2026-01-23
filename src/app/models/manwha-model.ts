export interface MandatoryManwhaData {
  title: string;
  author: string;
}

export interface BaseManwha extends MandatoryManwhaData {
  coverUrl: string;
  pages?: number;
  genre: string;
  nbChapters?: number;
  isFinished?: boolean;
}

export interface UserManwha extends MandatoryManwhaData {
  readDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
}

export interface Manwha extends BaseManwha, UserManwha {}
