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

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserMoviesFromApi(
  userId: string
): Promise<import('../../models/movie-model').Movie[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/movies/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Movies merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMergedWatchlistMoviesFromApi(
  userId: string
): Promise<import('../../models/movie-model').Movie[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/movies/watchlist/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Movies watchlist merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchBaseMoviesFromApi(): Promise<BaseMovie[]> {
  const response = await fetch(`${getApiBaseUrl()}/movies/entities`);
  if (!response.ok) {
    throw new Error('Movies entities API error');
  }
  const data = await response.json();
  const raw = Array.isArray(data) ? data : data.movies || [];
  return raw.map((m: BaseMovie) => ({
    ...m,
    fromEntity: m.fromEntity ?? null,
  }));
}

/** Catalogue allégé pour les pages select. */
export async function fetchBaseMoviesLightFromApi(): Promise<
  import('../../models/entity-light.model').LightMovie[]
> {
  const response = await fetch(`${getApiBaseUrl()}/movies/entities/light`);
  if (!response.ok) {
    throw new Error('Movies entities light API error');
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
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserMovieRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/movies/others-users-movies-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Movies others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.movies || [];
}