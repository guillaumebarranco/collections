import { Movie, BaseMovie, UserMovie } from '../../models/movie-model';

import {
  getLocalMoviesByUser,
  getLocalWatchlistByUser,
  allBaseMovies,
} from './local-movies.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseMoviesFromApi,
  fetchOtherUsersMoviesRatedFromApi,
  fetchUserMoviesFromApi,
  fetchWatchlistMoviesFromApi,
} from './api-movies.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getMovieDataFromUserMovieAndBaseMovie } from '../../helpers/entities.helper';

const fetchBaseMoviesCached = createCachedFetcher(fetchBaseMoviesFromApi);

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

    return getMovieDataFromUserMovieAndBaseMovie(
      movie,
      definitiveMatchingMovie
    );
  });
}

export type OtherUserMovieRating = {
  title: string;
  director: string;
  rating: number;
  userId: string;
};

export {
  getMovieWatchers,
  type CommunityWatcherEntry as MovieWatcherEntry,
} from '../community/entity-community-watchers.facade';

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

export async function getOtherUsersMoviesRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserMovieRating[]> {
  const otherUsers =
    followedUserIds.length > 0
      ? followedUserIds.filter((id) => id !== currentUserId.toLowerCase())
      : [];
  if (isLocalhost()) {
    const results: OtherUserMovieRating[] = [];
    otherUsers.forEach((username) => {
      const movies = getLocalMoviesByUser(username);
      movies
        .filter((movie) => (movie.rating ?? 0) >= minRating)
        .forEach((movie) => {
          results.push({
            title: movie.title,
            director: movie.director,
            rating: movie.rating ?? 0,
            userId: username,
          });
        });
    });
    return results;
  }

  try {
    return await fetchOtherUsersMoviesRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}

export async function getAllBaseMovies(): Promise<BaseMovie[]> {
  if (isLocalhost()) {
    return allBaseMovies;
  }

  try {
    return await fetchBaseMoviesCached();
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

  try {
    const watchlist = await fetchWatchlistMoviesFromApi(currentUserId);
    return {
      [currentUserId]: await getAllMoviesData(watchlist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
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

  try {
    const watchlist = await fetchWatchlistMoviesFromApi(userId);
    return getAllMoviesData(watchlist);
  } catch {
    return [];
  }
}
