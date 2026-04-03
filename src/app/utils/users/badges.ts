import { BadgeDefinition } from '../../models/badge-model';
import { BDS_BADGE_DEFINITIONS } from '../badges/bds-badges';
import { BOOKS_BADGE_DEFINITIONS } from '../badges/books-badges';
import { COMICS_BADGE_DEFINITIONS } from '../badges/comics-badges';
import { GAMES_BADGE_DEFINITIONS } from '../badges/games-badges';
import { MANGAS_BADGE_DEFINITIONS } from '../badges/mangas-badges';
import { MANWHAS_BADGE_DEFINITIONS } from '../badges/manwhas-badges';
import { MOVIES_BADGE_DEFINITIONS } from '../badges/movies-badges';
import { SERIES_BADGE_DEFINITIONS } from '../badges/series-badges';
import {
  assertBadgeDefinitionsMatchThresholdMapping,
  type BadgeThresholdStats,
  getBadgeThresholdStatKey,
} from './badge-threshold-stat';

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

assertBadgeDefinitionsMatchThresholdMapping(BADGE_DEFINITIONS);

export function getBadgeDefinitionById(
  id: string
): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === id);
}

/**
 * Remplit `current/target` pour tous les badges ayant un {@link BadgeDefinition.threshold}.
 * Les sagas et autres cas spéciaux restent gérés à part.
 */
export function fillBadgeProgressFromDefinitions(
  progress: Record<string, string>,
  stats: BadgeThresholdStats
): void {
  for (const def of BADGE_DEFINITIONS) {
    if (def.threshold === undefined) {
      continue;
    }
    const key = getBadgeThresholdStatKey(def.id);
    if (key === null) {
      continue;
    }
    progress[def.id] = `${stats[key]}/${def.threshold}`;
  }
}

export type { BadgeThresholdStatKey, BadgeThresholdStats } from './badge-threshold-stat';
export {
  BADGE_SAGA_IDS,
  getBadgeThresholdStatKey,
} from './badge-threshold-stat';

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

/** Onglet du dashboard « Badges » (une entité = un sous-onglet). */
export type BadgeDashboardTabKey =
  | 'books'
  | 'mangas'
  | 'manwhas'
  | 'comics'
  | 'bds'
  | 'movies'
  | 'series'
  | 'games'
  | 'other';

const BADGE_ID_PREFIX_TO_TAB: { prefix: string; key: BadgeDashboardTabKey }[] =
  [
    { prefix: 'mangas-', key: 'mangas' },
    { prefix: 'manwhas-', key: 'manwhas' },
    { prefix: 'comics-', key: 'comics' },
    { prefix: 'bds-', key: 'bds' },
    { prefix: 'series-', key: 'series' },
  ];

/**
 * Détermine l'onglet dashboard pour un badge.
 * Les badges mangas / manwhas / comics / BDs / séries réutilisent des images
 * sous /books/, /movies/ ou /games/ : on ne peut pas se fier au chemin seul.
 */
export function getBadgeDashboardTabKey(
  badgeId: string,
  imagePath: string
): BadgeDashboardTabKey {
  for (const { prefix, key } of BADGE_ID_PREFIX_TO_TAB) {
    if (badgeId.startsWith(prefix)) {
      return key;
    }
  }
  const image = (imagePath || '').toLowerCase();
  if (image.includes('/books/')) {
    return 'books';
  }
  if (image.includes('/movies/')) {
    return 'movies';
  }
  if (image.includes('/games/')) {
    return 'games';
  }
  return 'other';
}
