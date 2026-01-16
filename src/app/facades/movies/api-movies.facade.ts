import { getApiBaseUrl } from '../../core/config';
import { UserMovie } from '../../models/movie-model';

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
