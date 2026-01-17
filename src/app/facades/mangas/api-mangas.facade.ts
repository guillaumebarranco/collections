import { getApiBaseUrl } from '../../core/config';
import { UserManga } from '../../models/manga-model';

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
