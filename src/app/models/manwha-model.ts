export interface MandatoryManwhaData {
  title: string;
  author: string;
}

export interface BaseManwha extends MandatoryManwhaData {
  coverUrl: string;
  genre: string;
  nbChapters: number;
  isFinished: boolean;
  description: string;
}

export interface UserManwha extends MandatoryManwhaData {
  readDate: string;
  rating: number;
  readTimes: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
}

export type UserManwhas = UserManwha[];

export interface Manwha extends BaseManwha, UserManwha {}
