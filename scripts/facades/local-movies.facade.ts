import type { BaseMovie, UserMovie } from '../../src/app/models/movie-model';
import { loadAllBaseEntityArrays, loadUserEntityArrays } from '../local-entity-loader';

export const allBaseMovies = loadAllBaseEntityArrays('movies') as BaseMovie[];

export function getLocalMoviesByUser(userId: string): UserMovie[] {
  return loadUserEntityArrays(
    userId,
    'movies',
    (file) => !file.includes('watchlist')
  ) as UserMovie[];
}
