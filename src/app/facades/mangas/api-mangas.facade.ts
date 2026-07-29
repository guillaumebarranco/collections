import { getApiBaseUrl } from '../../core/config';
import { BaseManga, UserManga } from '../../models/manga-model';

export async function fetchUserMangasFromApi(
  userId: string
): Promise<UserManga[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/mangas/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Mangas API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.mangas || [];
}

export async function fetchReadlistMangasFromApi(
  userId: string
): Promise<UserManga[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/mangas/readlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Mangas readlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.mangas || [];
}

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserMangasFromApi(
  userId: string
): Promise<import('../../models/manga-model').Manga[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/mangas/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Mangas merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMergedReadlistMangasFromApi(
  userId: string
): Promise<import('../../models/manga-model').Manga[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/mangas/readlist/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Mangas readlist merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchBaseMangasFromApi(): Promise<BaseManga[]> {
  const response = await fetch(`${getApiBaseUrl()}/mangas/entities`);
  if (!response.ok) {
    throw new Error('Mangas entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.mangas || [];
}

/** Catalogue allégé pour les pages select. */
export async function fetchBaseMangasLightFromApi(): Promise<
  import('../../models/entity-light.model').LightManga[]
> {
  const response = await fetch(`${getApiBaseUrl()}/mangas/entities/light`);
  if (!response.ok) {
    throw new Error('Mangas entities light API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.mangas || [];
}

export type OtherUserMangaRating = {
  title: string;
  author: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersMangasRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserMangaRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/mangas/others-users-mangas-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Mangas others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.mangas || [];
}