import type {
  MangaFromEntityAdaptation,
  MangaFromEntityType,
} from './from-entity.model';

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
  /** Œuvre source (livre, film, jeu, autre manga, etc.) si adaptation. */
  fromEntity: MangaFromEntityAdaptation | null;
}

export type { MangaFromEntityAdaptation, MangaFromEntityType };

export interface UserManga extends MandatoryMangaData {
  readDate: string;
  rating: number;
  readTimes: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
  borrowed: string;
  loaned: string;
}

export type UserMangas = UserManga[];

export interface Manga extends BaseManga, UserManga {}
