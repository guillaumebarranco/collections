import {
  baseMoviesPage1,
  baseMoviesPage2,
  baseMoviesPage3,
  baseMoviesPage4,
  baseMoviesPage5,
  baseMoviesPage6,
  baseMoviesPage7,
  baseMoviesMcu,
  baseMoviesDc,
  baseMoviesOtherSuperheroes,
  baseMoviesLove,
  baseMoviesAnimated,
  baseMoviesAnimated2,
  baseMoviesSagaPage1,
  baseMoviesSagaPage2,
  baseMoviesSagaPage3,
  baseMoviesFromAmandine,
  baseMoviesFromMarina,
  baseMoviesFromRonanLetterboxd,
  baseMoviesApi,
  baseMoviesPage8,
  baseMoviesPage9,
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
import { williamWatchListMovies } from '../../utils/users/william/movies/william_watchlist_movies';
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
import { kevinMovies } from '../../utils/users/kevin/movies/kevin_movies';
import { kevinWatchlistMovies } from '../../utils/users/kevin/movies/kevin_watchlist_movies';

export const allBaseMovies: BaseMovie[] = [
  ...baseMoviesPage1,
  ...baseMoviesPage2,
  ...baseMoviesPage3,
  ...baseMoviesPage4,
  ...baseMoviesPage5,
  ...baseMoviesPage6,
  ...baseMoviesPage7,
  ...baseMoviesPage8,
  ...baseMoviesPage9,
  ...baseMoviesMcu,
  ...baseMoviesDc,
  ...baseMoviesOtherSuperheroes,
  ...baseMoviesLove,
  ...baseMoviesAnimated,
  ...baseMoviesAnimated2,
  ...baseMoviesSagaPage1,
  ...baseMoviesSagaPage2,
  ...baseMoviesSagaPage3,
  ...baseMoviesFromAmandine,
  ...baseMoviesFromMarina,
  ...baseMoviesFromRonanLetterboxd,
  ...baseMoviesApi,
];
import { emmanuelleMovies } from '../../utils/users/emmanuelle/movies/emmanuelle_movies';
import { dantesMovies } from '../../utils/users/dantes/movies/dantes_movies';
import { bastienMovies } from '../../utils/users/bastien/movies/bastien_movies';
import { unhoMovies } from '../../utils/users/unho/movies/unho_movies';
import { unhoWatchListMovies } from '../../utils/users/unho/movies/unho_watchlist_movies';
import { marinaMovies } from '../../utils/users/marina/movies/marina_movies';

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
    case 'kevin':
      return [...kevinMovies];
    case 'emmanuelle':
      return [...emmanuelleMovies];
    case 'dantes':
      return [...dantesMovies];
    case 'bastien':
      return [...bastienMovies];
    case 'unho':
      return [...unhoMovies];
    case 'marina':
      return [...marinaMovies];
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
    case 'kevin':
      return [...kevinWatchlistMovies];
    case 'william':
      return [...williamWatchListMovies];
    case 'unho':
      return [...unhoWatchListMovies];
    default:
      return [];
  }
}
