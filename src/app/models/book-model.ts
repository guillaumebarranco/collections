import { Country } from './countries.enum';

export interface MandatoryBookData {
  title: string;
  author: string;
}

export type BookGenre =
  | 'Jeunesse'
  | 'Aventure'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Romance'
  | 'Thriller'
  | 'Classiques'
  | 'Dark Romance'
  | 'Enquête'
  | 'Horreur'
  | 'Nonfiction'
  | 'Science-fiction'
  | 'Polar'
  | 'Enfant'
  | 'Fiction'
  | 'Roman'
  | 'Policier'
  | 'Dystopie'
  | 'Action'
  | 'Théâtre'
  | 'Fiction historique'
  | 'Poésie'
  | 'Conte'
  | 'Paralittérature'
  | 'Littérature';

/** Liste ordonnée des genres (alignée sur {@link BookGenre}) pour les formulaires. */
export const BOOK_GENRE_OPTIONS: readonly BookGenre[] = [
  'Jeunesse',
  'Aventure',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Thriller',
  'Classiques',
  'Dark Romance',
  'Enquête',
  'Horreur',
  'Nonfiction',
  'Science-fiction',
  'Polar',
  'Enfant',
  'Fiction',
  'Roman',
  'Policier',
  'Dystopie',
  'Action',
  'Théâtre',
  'Fiction historique',
  'Poésie',
  'Conte',
  'Paralittérature',
  'Littérature',
];

const BOOK_GENRE_OPTION_SET = new Set<string>(BOOK_GENRE_OPTIONS);

/** Ne conserve que les libellés présents dans {@link BOOK_GENRE_OPTIONS} (données héritées). */
export function filterToBookGenres(genres: readonly string[]): BookGenre[] {
  return genres.filter((g): g is BookGenre => BOOK_GENRE_OPTION_SET.has(g));
}

export interface BaseBook extends MandatoryBookData {
  coverUrl: string;
  pages?: number;
  genre: BookGenre[];
  saga: string;
  sagaOrder: number;
  sagaFinished: boolean;
  releaseDate: string;
  description: string;
  countryOrigin: Country;
}

export interface UserBook extends MandatoryBookData {
  firstReadDate: string;
  lastReadDate: string;
  rating: number;
  /** Readlist : 0 = à lire, 0.5 = en cours de lecture, ≥1 = lu (nombre de lectures). */
  readTimes?: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
  borrowed: string;
  loaned: string;
}

export type UserBooks = UserBook[];

export interface Book extends BaseBook, UserBook {}
