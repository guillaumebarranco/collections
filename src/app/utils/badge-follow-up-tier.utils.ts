import type { BadgeDefinition } from '../models/badge-model';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';
import {
  BADGE_DEFINITIONS,
  getBadgeThresholdStatKey,
  type BadgeThresholdStatKey,
} from './users/badges';

/** Paliers d’un type de métrique (ex. livres lus, films romance), triés par seuil. */
export function getTiersForThresholdStatKey(
  statKey: BadgeThresholdStatKey
): { id: string; threshold: number }[] {
  return BADGE_DEFINITIONS.filter(
    (b: BadgeDefinition) =>
      b.threshold !== undefined && getBadgeThresholdStatKey(b.id) === statKey
  )
    .map((b) => ({ id: b.id, threshold: b.threshold! }))
    .sort((a, b) => a.threshold - b.threshold);
}

function badgeMetaFromId(id: string): { name: string; image: string } {
  const def = BADGE_DEFINITIONS.find((b) => b.id === id);
  return {
    name: def?.name ?? id,
    image: def?.image ?? '/badges/movies/Kevin_McCallister.png',
  };
}

/**
 * Progression vers le prochain palier pour une métrique (current / target du badge ciblé).
 */
export function computeNextTierProgressRow(
  current: number,
  statKey: BadgeThresholdStatKey
): EntityBadgeProgressRow | null {
  const tiers = getTiersForThresholdStatKey(statKey);
  if (tiers.length === 0) {
    return null;
  }
  const tier = tiers.find((t) => current < t.threshold);
  if (!tier) {
    const last = tiers[tiers.length - 1];
    const meta = badgeMetaFromId(last.id);
    return {
      badgeId: last.id,
      badgeName: meta.name,
      badgeImage: meta.image,
      current,
      target: last.threshold,
      complete: current >= last.threshold,
    };
  }
  const meta = badgeMetaFromId(tier.id);
  return {
    badgeId: tier.id,
    badgeName: meta.name,
    badgeImage: meta.image,
    current,
    target: tier.threshold,
    complete: false,
  };
}
