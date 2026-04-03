import { BadgeDefinition } from '../../models/badge-model';
import { BDS_BADGE_DEFINITIONS } from '../badges/bds-badges';
import { BOOKS_BADGE_DEFINITIONS } from '../badges/books-badges';
import { COMICS_BADGE_DEFINITIONS } from '../badges/comics-badges';
import { GAMES_BADGE_DEFINITIONS } from '../badges/games-badges';
import { MANGAS_BADGE_DEFINITIONS } from '../badges/mangas-badges';
import { MANWHAS_BADGE_DEFINITIONS } from '../badges/manwhas-badges';
import { MOVIES_BADGE_DEFINITIONS } from '../badges/movies-badges';
import { SERIES_BADGE_DEFINITIONS } from '../badges/series-badges';

/**
 * Système de badges (gamification) pour les utilisateurs Makya.
 * Définitions de base des badges. Les badges débloqués par utilisateur
 * sont récupérés via l'API (BadgesService), comme les Top 5 personnels.
 * Chaque badge est associé à une image dans public/badges (ex. graine-lecteur.png).
 */

/** Définitions de tous les badges disponibles (catalogue de base). */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  ...BOOKS_BADGE_DEFINITIONS,
  ...MOVIES_BADGE_DEFINITIONS,
  ...GAMES_BADGE_DEFINITIONS,
  ...MANGAS_BADGE_DEFINITIONS,
  ...MANWHAS_BADGE_DEFINITIONS,
  ...COMICS_BADGE_DEFINITIONS,
  ...BDS_BADGE_DEFINITIONS,
  ...SERIES_BADGE_DEFINITIONS,
];

export function getBadgeDefinitionById(
  id: string
): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === id);
}

export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  image: string;
  earned: true;
}

export interface LockedBadge {
  id: string;
  name: string;
  description: string;
  image: string;
  earned: false;
}

export type BadgeDisplay = EarnedBadge | LockedBadge;

/**
 * Construit la liste des badges à afficher en fusionnant les définitions de base
 * avec les ids de badges débloqués par l'utilisateur (récupérés via l'API).
 */
export function getBadgesDisplay(earnedBadgeIds: string[]): BadgeDisplay[] {
  const earnedSet = new Set(earnedBadgeIds);
  return BADGE_DEFINITIONS.map((def) => ({
    id: def.id,
    name: def.name,
    description: def.description,
    image: def.image,
    earned: earnedSet.has(def.id),
  })) as BadgeDisplay[];
}
