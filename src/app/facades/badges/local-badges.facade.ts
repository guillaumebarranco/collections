import { usersBadges } from '../../utils/users/users-badges';

/**
 * Retourne les ids de badges débloqués pour un utilisateur (données locales).
 */
export function getLocalBadgesByUser(userId: string): string[] {
  const ids = usersBadges[userId];
  return Array.isArray(ids) ? ids : [];
}
