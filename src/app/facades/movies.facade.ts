import { Movie, BaseMovie, UserMovie } from '../models/movie-model';

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
} from '../utils/entities/movies';

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
} from '../utils/users/guillaume/movies';
import { williamMovies } from '../utils/users/william/movies';
import { amandineMovies1 } from '../utils/users/amandine/movies/amandine_movies_1';
import { amandineMovies2 } from '../utils/users/amandine/movies/amandine_movies_2';
import { guillaumeWatchlistMovies } from '../utils/users/guillaume/movies/guillaume_watchlist_movies';
import { ronanMovies } from '../utils/users/ronan/movies/ronan_movies';
import { ronanLetterboxdMovies } from '../utils/users/ronan/movies/ronan_letterboxd_movies';
import { ronanCinemaMovies } from '../utils/users/ronan/movies/ronan_cinema_movies';

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
  ...baseMoviesFromAmandine,
  ...baseMoviesFromRonanLetterboxd,
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
    ronan: getAllMoviesData([
      ...ronanMovies,
      ...ronanLetterboxdMovies,
      ...ronanCinemaMovies,
    ]),
  };
}

export function getAllWatchlistMovies(): { [key: string]: Movie[] } {
  return {
    guillaume: getAllMoviesData([...guillaumeWatchlistMovies]),
    william: [],
    kevin: [],
    amandine: [],
    ronan: [],
  };
}

export function getAllMoviesMerged(): Movie[] {
  return Object.values(getAllMovies())
    .flat()
    .reduce((acc: Movie[], item: Movie) => {
      if (
        acc.find(
          (movie) =>
            movie.title === item.title && movie.director === item.director
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export function getMoviesByUser(userId: string): Movie[] {
  const allMoviesData = getAllMovies();
  return allMoviesData[userId] || [];
}

export function getCurrentWatchlistMoviesByUser(userId: string): Movie[] {
  const allWatchlistMoviesData = getAllWatchlistMovies();
  return allWatchlistMoviesData[userId] || [];
}

function getAllMoviesData(movies: UserMovie[]): Movie[] {
  return movies.map((movie: UserMovie) => {
    const matchingBaseMovie = allBaseMovies.filter(
      (baseMovie: BaseMovie) => baseMovie.title === movie.title
    );

    // For the case when multiple movies have the same name, hence matching from movie director
    const definitiveMatchingMovie =
      matchingBaseMovie.length === 1
        ? matchingBaseMovie[0]
        : matchingBaseMovie.filter((baseMovie: BaseMovie) => {
            return baseMovie.director === movie.director;
          })[0];

    return {
      title: movie.title,
      director: movie.director,
      rating: movie.rating,
      timesWatched: movie.timesWatched,
      firstViewedDate: movie.firstViewedDate,
      lastViewedDate: movie.lastViewedDate,
      actors: definitiveMatchingMovie?.actors || [],
      coverUrl: definitiveMatchingMovie?.coverUrl || '',
      releaseDate: definitiveMatchingMovie?.releaseDate || '',
      length: definitiveMatchingMovie?.length || 0,
      genre: definitiveMatchingMovie?.genre || '',
      seenAtCinema: movie.seenAtCinema,
    };
  });
}
