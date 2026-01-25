export interface MandatoryComicData {
  title: string;
  designer: string;
}

export interface BaseComic extends MandatoryComicData {
  coverUrl: string;
  pages: number;
  genre: string;
  writer: string;
}

export interface UserComic extends MandatoryComicData {
  readDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
}

export interface Comic extends BaseComic, UserComic {}
