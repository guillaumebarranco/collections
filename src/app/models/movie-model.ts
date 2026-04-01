import { Country } from './countries.enum';

export interface MandatoryMovieData {
  title: string;
  director: string;
}

export type MovieGenre =
  | 'Action'
  | 'Comédie'
  | 'Science Fiction'
  | 'Fantastique'
  | 'Romance'
  | 'Policier'
  | 'Thriller'
  | 'Jeunesse'
  | 'Aventure'
  | 'Horreur'
  | 'Dystopie'
  | 'Drame'
  | 'Documentaire'
  | 'Historique'
  | 'Guerre'
  | 'Biographie'
  | 'Mystère'
  | 'Comédie musicale'
  | 'Western'
  | 'Animation';

/** Liste ordonnée des genres (alignée sur {@link MovieGenre}) pour les formulaires. */
export const MOVIE_GENRE_OPTIONS: readonly MovieGenre[] = [
  'Action',
  'Comédie',
  'Science Fiction',
  'Fantastique',
  'Romance',
  'Policier',
  'Thriller',
  'Jeunesse',
  'Aventure',
  'Horreur',
  'Dystopie',
  'Drame',
  'Documentaire',
  'Historique',
  'Guerre',
  'Biographie',
  'Mystère',
  'Comédie musicale',
  'Western',
  'Animation',
];

const MOVIE_GENRE_OPTION_SET = new Set<string>(MOVIE_GENRE_OPTIONS);

/** Ne conserve que les libellés présents dans {@link BOOK_GENRE_OPTIONS} (données héritées). */
export function filterToMovieGenres(genres: readonly string[]): MovieGenre[] {
  return genres.filter((g): g is MovieGenre => MOVIE_GENRE_OPTION_SET.has(g));
}

export interface BaseMovie extends MandatoryMovieData {
  actors: {
    name: string;
  }[];
  coverUrl: string;
  releaseDate: string;
  length: number;
  genre: MovieGenre[];
  saga: string;
  description: string;
  countryOrigin: Country;
  fromEntity: {
    entityType: 'book' | 'game' | 'comic' | 'manga' | 'manwha' | 'serie';
    title: string;
    secondEntityKey: string;
  } | null;
}

export interface UserMovie extends MandatoryMovieData {
  rating: number;
  timesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  seenAtCinema: boolean;
  owned: boolean;
  wantToSeeAgain: boolean;
  watchPriority: 1 | 2 | 3;
  ratingComment: string;
  inList: string[];
  borrowed: string;
  loaned: string;
}

export type UserMovies = UserMovie[];

export interface Movie extends BaseMovie, UserMovie {}
