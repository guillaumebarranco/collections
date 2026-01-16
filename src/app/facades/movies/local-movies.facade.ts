import {
  baseMoviesPage1,
  baseMoviesPage2,
  baseMoviesPage3,
  baseMoviesPage4,
  baseMoviesMcu,
  baseMoviesDc,
  baseMoviesOtherSuperheroes,
  baseMoviesLove,
  baseMoviesAnimated,
  baseMoviesSagaPage1,
  baseMoviesSagaPage2,
  baseMoviesFromAmandine,
  baseMoviesFromRonanLetterboxd,
  baseMoviesApi,
} from '../../utils/entities/movies';

import {
  guillaumeMoviesPage1,
  guillaumeMoviesPage2,
  guillaumeMoviesPage3,
  guillaumeMoviesPage4,
  guillaumeMoviesPage5,
  guillaumeMoviesMcu,
  guillaumeMoviesDc,
  guillaumeMoviesOtherSuperheroes,
  guillaumeMoviesLove,
  guillaumeMoviesAnimated,
  guillaumeMoviesSagaPage1,
  guillaumeMoviesSagaPage2,
  guillaumeWatchlistMovies,
} from '../../utils/users/guillaume/movies';
import { williamMovies } from '../../utils/users/william/movies';
import {
  amandineMovies1,
  amandineMovies2,
  amandineWatchlistMovies,
} from '../../utils/users/amandine/movies';
import {
  ronanMovies,
  ronanCinemaMovies,
  ronanWatchlistMovies,
} from '../../utils/users/ronan/movies';
import { BaseMovie, UserMovie } from '../../models/movie-model';

export const allBaseMovies: BaseMovie[] = [
  ...baseMoviesPage1,
  ...baseMoviesPage2,
  ...baseMoviesPage3,
  ...baseMoviesPage4,
  ...baseMoviesMcu,
  ...baseMoviesDc,
  ...baseMoviesOtherSuperheroes,
  ...baseMoviesLove,
  ...baseMoviesAnimated,
  ...baseMoviesSagaPage1,
  ...baseMoviesSagaPage2,
  ...baseMoviesFromAmandine,
  ...baseMoviesFromRonanLetterboxd,
  ...baseMoviesApi,
];
export function getLocalMoviesByUser(userId: string): UserMovie[] {
  switch (userId) {
    case 'guillaume':
      return [
        ...guillaumeMoviesPage1,
        ...guillaumeMoviesPage2,
        ...guillaumeMoviesPage3,
        ...guillaumeMoviesPage4,
        ...guillaumeMoviesPage5,
        ...guillaumeMoviesMcu,
        ...guillaumeMoviesDc,
        ...guillaumeMoviesOtherSuperheroes,
        ...guillaumeMoviesLove,
        ...guillaumeMoviesAnimated,
        ...guillaumeMoviesSagaPage1,
        ...guillaumeMoviesSagaPage2,
      ];
    case 'william':
      return [...williamMovies];
    case 'amandine':
      return [...amandineMovies1, ...amandineMovies2];
    case 'ronan':
      return [...ronanMovies, ...ronanCinemaMovies];
    default:
      return [];
  }
}

export function getLocalWatchlistByUser(userId: string): UserMovie[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeWatchlistMovies];
    case 'amandine':
      return [...amandineWatchlistMovies];
    case 'ronan':
      return [...ronanWatchlistMovies];
    default:
      return [];
  }
}
