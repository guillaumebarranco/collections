export interface MandatoryComicData {
  title: string;
  writer: string;
}

export interface BaseComic extends MandatoryComicData {
  coverUrl: string;
  pages: number;
  genre: string;
  designer: string;
  description: string;
  saga?: string;
  sagaOrder?: number;
}

export interface UserComic extends MandatoryComicData {
  readDate: string;
  rating: number;
  readTimes: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
}

export type UserComics = UserComic[];

export interface Comic extends BaseComic, UserComic {}
