import { getApiBaseUrl } from '../../core/config';
import { BaseMovie, UserMovie } from '../../models/movie-model';

export async function fetchUserMoviesFromApi(
  userId: string
): Promise<UserMovie[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/movies/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Movies API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.movies || [];
}

export async function fetchWatchlistMoviesFromApi(
  userId: string
): Promise<UserMovie[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/movies/watchlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Movies watchlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.movies || [];
}

export async function fetchBaseMoviesFromApi(): Promise<BaseMovie[]> {
  const response = await fetch(`${getApiBaseUrl()}/movies/entities`);
  if (!response.ok) {
    throw new Error('Movies entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.movies || [];
}

export type OtherUserMovieRating = {
  title: string;
  director: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersMoviesRatedFromApi(
  userId: string,
  minRating = 4
): Promise<OtherUserMovieRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  const response = await fetch(
    `${getApiBaseUrl()}/movies/others-users-movies-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Movies others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.movies || [];
}