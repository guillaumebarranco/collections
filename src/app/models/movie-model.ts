import { Country, COUNTRY_SELECT_OPTIONS } from './countries.enum';
import type {
  MovieFromEntityAdaptation,
  MovieFromEntityType,
} from './from-entity.model';

const MOVIE_COUNTRY_LABEL_SET = new Set(
  COUNTRY_SELECT_OPTIONS.filter((c): c is Exclude<Country, ''> => c !== '')
);

/** Filtre les libellés vers des pays connus du select (hors entrée vide). */
export function filterToMovieCountries(
  labels: readonly string[]
): Exclude<Country, ''>[] {
  return labels.filter((l): l is Exclude<Country, ''> =>
    MOVIE_COUNTRY_LABEL_SET.has(l as Exclude<Country, ''>)
  );
}

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
  | 'Animation'
  | 'Peplum'
  | 'Catastrophe';

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
  'Peplum',
  'Catastrophe',
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
  /** Pays de production (plusieurs possibles). */
  countryOrigin: string[];
  fromEntity: MovieFromEntityAdaptation | null;
}

export type { MovieFromEntityAdaptation, MovieFromEntityType };

/** Œuvre source d’une adaptation (films et séries) — alias de {@link MovieFromEntityAdaptation}. */
export type FromEntityAdaptation = MovieFromEntityAdaptation;
export type FromEntityType = MovieFromEntityType;

/**
 * Libellés pays pour affichage / recherche (supporte encore une chaîne unique en runtime).
 */
export function getMovieCountryOriginLabels(movie: {
  countryOrigin: unknown;
}): string[] {
  const raw = movie.countryOrigin;
  if (Array.isArray(raw)) {
    return raw.map((c) => String(c).trim()).filter(Boolean);
  }
  if (typeof raw === 'string' && raw.trim()) {
    return [raw.trim()];
  }
  return [];
}

/** Normalise les données héritées (chaîne ou tableau) pour les formulaires. */
export function normalizeMovieCountryOriginsForForm(
  raw: unknown
): Exclude<Country, ''>[] {
  if (Array.isArray(raw)) {
    return filterToMovieCountries(raw as string[]);
  }
  if (typeof raw === 'string' && raw.trim()) {
    return filterToMovieCountries(
      raw
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)
    );
  }
  return [];
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
