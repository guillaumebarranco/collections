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

export async function fetchBaseMoviesFromApi(): Promise<BaseMovie[]> {
  const response = await fetch(`${getApiBaseUrl()}/movies/entities`);
  if (!response.ok) {
    throw new Error('Movies entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.movies || [];
}
