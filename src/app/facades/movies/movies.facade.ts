import { Movie, BaseMovie, UserMovie } from '../../models/movie-model';
import type { LightMovie } from '../../models/entity-light.model';
import {
  fetchBaseMoviesFromApi,
  fetchBaseMoviesLightFromApi,
  fetchMergedUserMoviesFromApi,
  fetchMergedWatchlistMoviesFromApi,
  fetchOtherUsersMoviesRatedFromApi,
  fetchUserMoviesFromApi,
  fetchWatchlistMoviesFromApi,
} from './api-movies.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getMovieDataFromUserMovieAndBaseMovie } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseMoviesCached = createCachedFetcher(fetchBaseMoviesFromApi);
const fetchBaseMoviesLightCached = createCachedFetcher(
  fetchBaseMoviesLightFromApi
);

async function getAllMoviesData(movies: UserMovie[]): Promise<Movie[]> {
  const baseMovies = await getAllBaseMovies();

  return movies.map((movie: UserMovie) => {
    const matchingBaseMovie = baseMovies.filter(
      (baseMovie: BaseMovie) => baseMovie.title === movie.title
    );

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

async function getMergedUserMovies(userId: string): Promise<Movie[]> {
  try {
    return await fetchMergedUserMoviesFromApi(userId);
  } catch {
    const userMovies = await fetchUserMoviesFromApi(userId);
    return getAllMoviesData(userMovies);
  }
}

async function getMergedWatchlistMovies(userId: string): Promise<Movie[]> {
  try {
    return await fetchMergedWatchlistMoviesFromApi(userId);
  } catch {
    const watchlist = await fetchWatchlistMoviesFromApi(userId);
    return getAllMoviesData(watchlist);
  }
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
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllMoviesData(offline.movies.user),
    };
  }

  try {
    return {
      [currentUserId]: await getMergedUserMovies(currentUserId),
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
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
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
  const offline = getActiveOfflineCache();
  if (offline) {
    return offline.movies.base;
  }

  try {
    return await fetchBaseMoviesCached();
  } catch {
    return [];
  }
}

/** Catalogue allégé pour les pages select. */
export async function getAllBaseMoviesLight(): Promise<LightMovie[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    return offline.movies.base.map((m) => ({
      title: m.title,
      director: m.director,
      coverUrl: m.coverUrl ?? '',
      releaseDate: m.releaseDate ?? '',
      selectDisplayOrder: m.selectDisplayOrder ?? 0,
    }));
  }

  try {
    return await fetchBaseMoviesLightCached();
  } catch {
    return [];
  }
}

export async function getAllWatchlistMovies(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Movie[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllMoviesData(offline.movies.watchlist),
    };
  }

  try {
    return {
      [currentUserId]: await getMergedWatchlistMovies(currentUserId),
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
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllMoviesData(offline.movies.user);
  }

  try {
    return await getMergedUserMovies(userId);
  } catch {
    return [];
  }
}

/** User movies bruts (clés d'exclusion select, sans join catalogue). */
export async function getUserMoviesRaw(userId: string): Promise<UserMovie[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.movies.user;
  }
  try {
    return await fetchUserMoviesFromApi(userId);
  } catch {
    return [];
  }
}

export async function getWatchlistMoviesRaw(
  userId: string
): Promise<UserMovie[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.movies.watchlist;
  }
  try {
    return await fetchWatchlistMoviesFromApi(userId);
  } catch {
    return [];
  }
}

export async function getCurrentWatchlistMoviesByUser(
  userId: string
): Promise<Movie[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllMoviesData(offline.movies.watchlist);
  }

  try {
    return await getMergedWatchlistMovies(userId);
  } catch {
    return [];
  }
}
