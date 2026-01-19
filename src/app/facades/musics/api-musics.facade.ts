import { getApiBaseUrl } from '../../core/config';
import { BaseMusic, UserMusic } from '../../models/music-model';

export async function fetchUserMusicsFromApi(
  userId: string
): Promise<UserMusic[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/musics/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Musics API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.musics || [];
}

export async function fetchBaseMusicsFromApi(): Promise<BaseMusic[]> {
  const response = await fetch(`${getApiBaseUrl()}/musics/entities`);
  if (!response.ok) {
    throw new Error('Musics entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.musics || [];
}
