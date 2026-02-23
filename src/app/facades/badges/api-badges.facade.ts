import { getApiBaseUrl } from '../../core/config';
import type { UserBadgeIds } from '../../models/badge-model';

/**
 * Récupère les badges débloqués d'un utilisateur depuis l'API.
 */
export async function fetchUserBadgesFromApi(
  userId: string
): Promise<UserBadgeIds> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/badges`
  );
  if (!response.ok) {
    throw new Error('Badges API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.badgeIds ?? [];
}
