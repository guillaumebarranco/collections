import { getApiBaseUrl } from '../../core/config';
import { BaseComic, UserComic } from '../../models/comic-model';

export async function fetchUserComicsFromApi(
  userId: string
): Promise<UserComic[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/comics/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Comics API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}

export async function fetchReadlistComicsFromApi(
  userId: string
): Promise<UserComic[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/comics/readlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Comics readlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserComicsFromApi(
  userId: string
): Promise<import('../../models/comic-model').Comic[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/comics/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Comics merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMergedReadlistComicsFromApi(
  userId: string
): Promise<import('../../models/comic-model').Comic[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/comics/readlist/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Comics readlist merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchBaseComicsFromApi(): Promise<BaseComic[]> {
  const response = await fetch(`${getApiBaseUrl()}/comics/entities`);
  if (!response.ok) {
    throw new Error('Comics entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}

/** Catalogue allégé pour les pages select. */
export async function fetchBaseComicsLightFromApi(): Promise<
  import('../../models/entity-light.model').LightComic[]
> {
  const response = await fetch(`${getApiBaseUrl()}/comics/entities/light`);
  if (!response.ok) {
    throw new Error('Comics entities light API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}

export type OtherUserComicRating = {
  title: string;
  writer: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersComicsRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserComicRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/comics/others-users-comics-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Comics others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}