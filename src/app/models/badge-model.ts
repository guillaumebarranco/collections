/**
 * Modèle des badges utilisateur.
 * Les badges débloqués sont stockés par userId (côté API / cache).
 */

/** Liste des ids de badges débloqués pour un utilisateur. */
export type UserBadgeIds = string[];

/** Cache : badges par userId. */
export interface UserBadgesByUser {
  [userId: string]: UserBadgeIds;
}
