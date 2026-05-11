import {
  baseMoviesSuperherosMcu,
  baseMoviesSuperHerosDc,
  baseMoviesSuperherosAutres,
  baseMoviesRomance,
  baseMoviesAnimationJapan,
  baseMoviesAnimationOthers,
  baseMoviesAnimationDisneyPixarDreamworks,
  baseMoviesSagaAutres,
  baseMoviesApi,
  baseMoviesWestern,
  baseMoviesDrame,
  baseMoviesComedie,
  baseMoviesFantastique,
  baseMoviesHorreur,
  baseMoviesJeunesse,
  baseMoviesAction,
  baseMoviesScienceFiction,
  baseMoviesThriller,
  baseMoviesAventure,
  baseMoviesDocumentaire,
  baseMoviesComedieMusicale,
  baseMoviesSagaAction,
  baseMoviesSagaComedie,
  baseMoviesSagaFantastique,
  baseMoviesSagaHorreur,
  baseMoviesSagaScienceFiction,
  baseMoviesLauryImportBatch,
  baseMoviesFromNinon,
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
  ...baseMoviesSagaAction,
  ...baseMoviesSagaAutres,
  ...baseMoviesSagaComedie,
  ...baseMoviesSagaFantastique,
  ...baseMoviesSagaHorreur,
  ...baseMoviesSagaScienceFiction,
  ...baseMoviesSuperherosMcu,
  ...baseMoviesSuperHerosDc,
  ...baseMoviesSuperherosAutres,
  ...baseMoviesRomance,
  ...baseMoviesAnimationDisneyPixarDreamworks,
  ...baseMoviesAnimationJapan,
  ...baseMoviesAnimationOthers,
  ...baseMoviesApi,
  ...baseMoviesWestern,
  ...baseMoviesDrame,
  ...baseMoviesComedie,
  ...baseMoviesFantastique,
  ...baseMoviesHorreur,
  ...baseMoviesJeunesse,
  ...baseMoviesAction,
  ...baseMoviesScienceFiction,
  ...baseMoviesThriller,
  ...baseMoviesAventure,
  ...baseMoviesDocumentaire,
  ...baseMoviesComedieMusicale,
  ...baseMoviesLauryImportBatch,
  ...baseMoviesFromNinon,
];
import { emmanuelleMovies } from '../../utils/users/emmanuelle/movies/emmanuelle_movies';
import { dantesMovies } from '../../utils/users/dantes/movies/dantes_movies';
import { bastienMovies } from '../../utils/users/bastien/movies/bastien_movies';
import { unhoMovies } from '../../utils/users/unho/movies/unho_movies';
import { unhoWatchListMovies } from '../../utils/users/unho/movies/unho_watchlist_movies';
import { marinaMovies } from '../../utils/users/marina/movies/marina_movies';
import { lucileMovies } from '../../utils/users/lucile/movies/lucile_movies';
import { lauryMovies } from '../../utils/users/laury/movies/laury_movies';
import { cassandreMovies } from '../../utils/users/cassandre/movies/cassandre_movies';

/** Utilisateurs avec des films « vus » locaux (aligné sur {@link getLocalMoviesByUser}). */
export const LOCAL_MOVIE_USER_IDS: readonly string[] = [
  'guillaume',
  'william',
  'amandine',
  'ronan',
  'kevin',
  'emmanuelle',
  'dantes',
  'bastien',
  'unho',
  'marina',
  'lucile',
  'laury',
  'cassandre',
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
      return [...amandineMovies1];
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
    case 'lucile':
      return [...lucileMovies];
    case 'laury':
      return [...lauryMovies];
    case 'cassandre':
      return [...cassandreMovies];
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
