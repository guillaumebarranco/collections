import { Movie, BaseMovie, UserMovie } from '../../models/movie-model';

import {
  getLocalMoviesByUser,
  getLocalWatchlistByUser,
  allBaseMovies,
} from './local-movies.facade';
import { DEFAULT_USER_IDS, isLocalhost } from '../../core/config';
import { fetchUserMoviesFromApi } from './api-movies.facade';

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

function buildMoviesMap(
  userId: string,
  movies: Movie[]
): { [key: string]: Movie[] } {
  return DEFAULT_USER_IDS.reduce(
    (acc, id) => ({
      ...acc,
      [id]: id === userId ? movies : [],
    }),
    {} as { [key: string]: Movie[] }
  );
}

export async function getAllMovies(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Movie[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllMoviesData(getLocalMoviesByUser('guillaume')),
      william: getAllMoviesData(getLocalMoviesByUser('william')),
      kevin: getAllMoviesData(getLocalMoviesByUser('kevin')),
      amandine: getAllMoviesData(getLocalMoviesByUser('amandine')),
      ronan: getAllMoviesData(getLocalMoviesByUser('ronan')),
    };
  }

  try {
    const userMovies = await fetchUserMoviesFromApi(currentUserId);
    return buildMoviesMap(currentUserId, getAllMoviesData(userMovies));
  } catch {
    return buildMoviesMap(currentUserId, []);
  }
}

export async function getAllWatchlistMovies(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Movie[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllMoviesData(getLocalWatchlistByUser('guillaume')),
      william: getAllMoviesData(getLocalWatchlistByUser('william')),
      kevin: getAllMoviesData(getLocalWatchlistByUser('kevin')),
      amandine: getAllMoviesData(getLocalWatchlistByUser('amandine')),
      ronan: getAllMoviesData(getLocalWatchlistByUser('ronan')),
    };
  }

  const watchlist = getLocalWatchlistByUser(currentUserId);
  return buildMoviesMap(currentUserId, getAllMoviesData(watchlist));
}

export async function getAllMoviesMerged(
  currentUserId = 'guillaume'
): Promise<Movie[]> {
  const allMovies = await getAllMovies(currentUserId);
  return Object.values(allMovies)
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

export async function getMoviesByUser(userId: string): Promise<Movie[]> {
  if (isLocalhost()) {
    return getAllMoviesData(getLocalMoviesByUser(userId));
  }

  try {
    const userMovies = await fetchUserMoviesFromApi(userId);
    return getAllMoviesData(userMovies);
  } catch {
    return [];
  }
}

export async function getCurrentWatchlistMoviesByUser(
  userId: string
): Promise<Movie[]> {
  if (isLocalhost()) {
    return getAllMoviesData(getLocalWatchlistByUser(userId));
  }

  return getAllMoviesData(getLocalWatchlistByUser(userId));
}
