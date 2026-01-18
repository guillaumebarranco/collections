import { Movie, BaseMovie, UserMovie } from '../../models/movie-model';

import {
  getLocalMoviesByUser,
  getLocalWatchlistByUser,
  allBaseMovies,
} from './local-movies.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseMoviesFromApi,
  fetchUserMoviesFromApi,
} from './api-movies.facade';

async function getAllMoviesData(movies: UserMovie[]): Promise<Movie[]> {
  const baseMovies = await getAllBaseMovies();

  return movies.map((movie: UserMovie) => {
    const matchingBaseMovie = baseMovies.filter(
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

export async function getAllMovies(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Movie[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllMoviesData(
        getLocalMoviesByUser(currentUserId)
      ),
    };
  }

  try {
    const userMovies = await fetchUserMoviesFromApi(currentUserId);
    return {
      [currentUserId]: await getAllMoviesData(userMovies),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseMovies(): Promise<BaseMovie[]> {
  if (isLocalhost()) {
    return allBaseMovies;
  }

  try {
    return await fetchBaseMoviesFromApi();
  } catch {
    return [];
  }
}

export async function getAllWatchlistMovies(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Movie[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllMoviesData(
        getLocalWatchlistByUser(currentUserId)
      ),
    };
  }

  const watchlist = getLocalWatchlistByUser(currentUserId);
  return {
    [currentUserId]: await getAllMoviesData(watchlist),
  };
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
