export interface MandatoryComicData {
  title: string;
  writer: string;
}

export interface BaseComic extends MandatoryComicData {
  coverUrl: string;
  pages: number;
  genre: string;
  designer: string;
}

export interface UserComic extends MandatoryComicData {
  readDate: string;
  rating: number;
  readTimes?: number;
  owned: boolean;
}

export interface Comic extends BaseComic, UserComic {}
