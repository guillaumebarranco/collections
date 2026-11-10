import { getApiBaseUrl } from '../../core/config';
import { BaseAnime, UserAnime } from '../../models/anime-model';

export async function fetchUserAnimesFromApi(
  userId: string
): Promise<UserAnime[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/animes/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Animes API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.animes || [];
}

export async function fetchWatchlistAnimesFromApi(
  userId: string
): Promise<UserAnime[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/animes/watchlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Animes watchlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.animes || [];
}

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserAnimesFromApi(
  userId: string
): Promise<import('../../models/anime-model').Anime[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/animes/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Animes merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMergedWatchlistAnimesFromApi(
  userId: string
): Promise<import('../../models/anime-model').Anime[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/animes/watchlist/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Animes watchlist merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchBaseAnimesFromApi(): Promise<BaseAnime[]> {
  const response = await fetch(`${getApiBaseUrl()}/animes/entities`);
  if (!response.ok) {
    throw new Error('Animes entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.animes || [];
}

/** Catalogue allégé pour les pages select. */
export async function fetchBaseAnimesLightFromApi(): Promise<
  import('../../models/entity-light.model').LightAnime[]
> {
  const response = await fetch(`${getApiBaseUrl()}/animes/entities/light`);
  if (!response.ok) {
    throw new Error('Animes entities light API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.animes || [];
}

export type OtherUserAnimeRating = {
  title: string;
  director: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersAnimesRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserAnimeRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/animes/others-users-animes-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Animes others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.animes || [];
}