import { EntityType } from '../../models/quizz-model';

/**
 * Un score enregistré pour un quizz effectué par un utilisateur.
 */
export interface QuizzScoreEntry {
  entityType: EntityType | string;
  entityTitle: string;
  creator: string;
  level: number;
  correct: number;
  total: number;
  completedAt: string;
}

/**
 * Scores par utilisateur (userId -> liste de scores).
 * En localhost les données peuvent venir du fichier ou de l’API.
 * En prod, l’API est la seule source.
 */
export type UsersQuizzScores = Record<string, QuizzScoreEntry[]>;

/** Clé unique pour identifier un quizz (entityType + entityTitle + creator + level). */
export function getQuizzScoreKey(entry: {
  entityType: string;
  entityTitle: string;
  creator: string;
  level: number;
}): string {
  return `${entry.entityType}|${entry.entityTitle}|${entry.creator}|${entry.level}`;
}

/** Données statiques vides (utilisées comme fallback ou pour le typage). */
export const usersQuizzScores: UsersQuizzScores = {};
