import { Movie, BaseMovie, UserMovie } from '../../../models/movie-model';

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
} from '../../../utils/movies/index';

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
} from '../../../utils/guillaume/movies';
import { williamMovies } from '../../../utils/william/movies';
import { amandineMovies1 } from '../../../utils/amandine/movies/amandine_movies_1';
import { amandineMovies2 } from '../../../utils/amandine/movies/amandine_movies_2';

const allBaseMovies: BaseMovie[] = [
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
];

export function getAllMovies(): { [key: string]: Movie[] } {
  return {
    guillaume: getAllMoviesData([
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
    ]),
    william: getAllMoviesData([...williamMovies]),
    kevin: [],
    amandine: getAllMoviesData([...amandineMovies1, ...amandineMovies2]),
  };
}

export function getAllMoviesMerged(): Movie[] {
  return Object.values(getAllMovies()).flat();
}

function getAllMoviesData(movies: UserMovie[]): Movie[] {
  return movies.map((movie: UserMovie) => {
    const matchingBaseMovie = allBaseMovies.find(
      (baseMovie: BaseMovie) => baseMovie.title === movie.title
    );
    return {
      title: movie.title,
      director: movie.director,
      rating: movie.rating,
      timesWatched: movie.timesWatched,
      lastViewedDate: movie.lastViewedDate,
      actors: matchingBaseMovie?.actors || [],
      coverUrl: matchingBaseMovie?.coverUrl || '',
      releaseDate: matchingBaseMovie?.releaseDate || '',
      length: matchingBaseMovie?.length || 0,
      genre: matchingBaseMovie?.genre || '',
    };
  });
}
