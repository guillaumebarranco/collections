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

export async function fetchBaseMangasFromApi(): Promise<BaseManga[]> {
  const response = await fetch(`${getApiBaseUrl()}/mangas/entities`);
  if (!response.ok) {
    throw new Error('Mangas entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.mangas || [];
}
