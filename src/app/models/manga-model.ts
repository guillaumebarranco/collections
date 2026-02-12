export interface MandatoryMangaData {
  title: string;
  author: string;
}

export interface BaseManga extends MandatoryMangaData {
  coverUrl: string;
  genre: string;
  nbTomes: number;
  isFinished: boolean;
  description: string;
}

export interface UserManga extends MandatoryMangaData {
  readDate: string;
  rating: number;
  readTimes: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
}

export type UserMangas = UserManga[];

export interface Manga extends BaseManga, UserManga {}
