import { getApiBaseUrl } from '../../core/config';
import type { TopFiveByEntity } from '../../models/top-five-model';

/**
 * Récupère le Top 5 personnel d'un utilisateur depuis l'API.
 */
export async function fetchTopFiveFromApi(
  userId: string
): Promise<TopFiveByEntity> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/top-five`
  );
  if (!response.ok) {
    throw new Error('Top five API error');
  }
  const data = await response.json();
  return data as TopFiveByEntity;
}

/**
 * Enregistre le Top 5 personnel d'un utilisateur via l'API.
 */
export async function saveTopFiveToApi(
  userId: string,
  topFive: TopFiveByEntity
): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/top-five`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topFive),
    }
  );
  if (!response.ok) {
    throw new Error('Top five save API error');
  }
}
