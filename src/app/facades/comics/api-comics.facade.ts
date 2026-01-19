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

export async function fetchBaseComicsFromApi(): Promise<BaseComic[]> {
  const response = await fetch(`${getApiBaseUrl()}/comics/entities`);
  if (!response.ok) {
    throw new Error('Comics entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}
