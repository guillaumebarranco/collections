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

export const BADGES_IMAGE_PATH = '/badges';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  /** Chemin de l'image du badge (fichier dans public/badges). */
  image: string;
}

/** Réponse API GET /users/:userId/profile-badge */
export interface ProfileBadgeResponse {
  badgeId: string | null;
}
