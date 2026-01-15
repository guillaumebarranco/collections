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
  baseMoviesApi,
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
  guillaumeWatchlistMovies,
} from '../utils/users/guillaume/movies';
import { williamMovies } from '../utils/users/william/movies';
import {
  amandineMovies1,
  amandineMovies2,
  amandineWatchlistMovies,
} from '../utils/users/amandine/movies';
import {
  ronanMovies,
  ronanCinemaMovies,
  ronanWatchlistMovies,
} from '../utils/users/ronan/movies';

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
  ...baseMoviesApi,
];

const DEFAULT_USER_IDS = ['guillaume', 'william', 'kevin', 'amandine', 'ronan'];

function isLocalhost(): boolean {
  return document.location.origin.includes('localhost');
}

function getApiBaseUrl(): string {
  if (isLocalhost()) {
    return 'http://localhost:3001/api';
  }
  return `${document.location.origin}/api`;
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

function getLocalMoviesByUser(userId: string): UserMovie[] {
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

function getLocalWatchlistByUser(userId: string): UserMovie[] {
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

async function fetchUserMoviesFromApi(userId: string): Promise<UserMovie[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/movies/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Movies API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.movies || [];
}

export async function getAllMovies(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Movie[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllMoviesData(getLocalMoviesByUser('guillaume')),
      william: getAllMoviesData(getLocalMoviesByUser('william')),
      kevin: [],
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
      william: [],
      kevin: [],
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
