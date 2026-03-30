import { usersProfileBadge } from '../../utils/users/users-profile-badge';

/**
 * Badge de profil lu depuis users-profile-badge.ts.
 * `undefined` = pas d’entrée pour cet utilisateur.
 */
export function getLocalProfileBadge(
  userId: string
): string | null | undefined {
  const key = userId.trim().toLowerCase();
  if (!key) return undefined;
  if (!Object.prototype.hasOwnProperty.call(usersProfileBadge, key)) {
    return undefined;
  }
  const v = usersProfileBadge[key];
  return v === undefined ? null : v;
}
