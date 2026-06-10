import { Country } from './countries.enum';

export interface MandatoryChildrenBookData {
  title: string;
  author: string;
}

export type ChildrenBookGenre =
  | 'Science Fiction'
  | 'Fantasy'
  | 'Romance'
  | 'Policier'
  | 'Nonfiction'
  | 'Thriller'
  | 'Jeunesse'
  | 'Aventure'
  | 'Fantastique'
  | 'Classiques'
  | 'Dark Romance'
  | 'Horreur'
  | 'Dystopie'
  | 'Théâtre'
  | 'Fiction'
  | 'Fiction historique'
  | 'Poésie'
  | 'Conte'
  | 'Biographie'
  | 'Littérature';

/** Liste ordonnée des genres (alignée sur {@link ChildrenBookGenre}) pour les formulaires. */
export const CHILDREN_BOOK_GENRE_OPTIONS: readonly ChildrenBookGenre[] = [
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Policier',
  'Nonfiction',
  'Thriller',
  'Jeunesse',
  'Aventure',
  'Fantastique',
  'Classiques',
  'Dark Romance',
  'Horreur',
  'Dystopie',
  'Théâtre',
  'Fiction',
  'Fiction historique',
  'Poésie',
  'Conte',
  'Biographie',
  'Littérature',
];

const CHILDREN_BOOK_GENRE_OPTION_SET = new Set<string>(CHILDREN_BOOK_GENRE_OPTIONS);

/** Ne conserve que les libellés présents dans {@link CHILDREN_BOOK_GENRE_OPTIONS} (données héritées). */
export function filterToChildrenBookGenres(genres: readonly string[]): ChildrenBookGenre[] {
  return genres.filter((g): g is ChildrenBookGenre => CHILDREN_BOOK_GENRE_OPTION_SET.has(g));
}

export interface BaseChildrenBook extends MandatoryChildrenBookData {
  coverUrl: string;
  pages: number;
  genre: ChildrenBookGenre[];
  saga: string;
  sagaOrder: number;
  sagaFinished: boolean;
  releaseDate: string;
  description: string;
  countryOrigin: Country;
  /** Ordre d’affichage dans les sélecteurs (0 = ordre par défaut). */
  selectDisplayOrder: number;
}

export interface UserChildrenBook extends MandatoryChildrenBookData {
  firstReadDate: string;
  lastReadDate: string;
  /** Dates de lectures supplémentaires (hors première / dernière lecture). */
  otherReadDates: string[];
  rating: number;
  /** Readlist : en cours de lecture (reste dans la readlist jusqu'au passage en « lu »). */
  reading: boolean;
  /** Nombre de lectures complètes (0 = pas encore lu, ≥1 = lu). */
  readTimes?: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
  borrowed: string;
  loaned: string;
}

export type UserChildrenBooks = UserChildrenBook[];

export interface ChildrenBook extends BaseChildrenBook, UserChildrenBook {}
