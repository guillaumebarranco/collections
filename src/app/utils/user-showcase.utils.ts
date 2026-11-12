import type { TopFiveByEntity, TopFiveEntityType } from '../models/top-five-model';
import { TOP_FIVE_ENTITY_TYPES } from '../models/top-five-model';
import {
  findEntityByKey,
  getEntityDisplayLabel,
  type Entity,
} from './top-five.utils';

/** Œuvre proposable dans le top 5 du tableau de bord. */
export interface ShowcaseCandidate {
  entityType: TopFiveEntityType;
  key: string;
  title: string;
  coverUrl: string;
  entityLabel: string;
  /** Rang (1-5) dans le top 5 de sa collection. */
  rank: number;
}

/**
 * Liste les œuvres déjà classées dans un top 5 de collection,
 * dans l'ordre des collections puis du rang.
 */
export function listShowcaseCandidates(
  topFive: TopFiveByEntity,
  lists: Partial<Record<TopFiveEntityType, Entity[]>>,
  labels: Record<TopFiveEntityType, string>
): ShowcaseCandidate[] {
  const candidates: ShowcaseCandidate[] = [];
  for (const entityType of TOP_FIVE_ENTITY_TYPES) {
    const keys = topFive[entityType] ?? [];
    const list = lists[entityType] ?? [];
    keys.forEach((key, index) => {
      if (!key) return;
      const entity = findEntityByKey(list, entityType, key);
      if (!entity) return;
      const rawCover = (entity as { coverUrl?: unknown }).coverUrl;
      candidates.push({
        entityType,
        key,
        title: getEntityDisplayLabel(entityType, entity),
        coverUrl: typeof rawCover === 'string' ? rawCover : '',
        entityLabel: labels[entityType] ?? entityType,
        rank: index + 1,
      });
    });
  }
  return candidates;
}
