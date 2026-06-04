import { Quizz } from '../../models/quizz-model';
import { createQuizzOnApi, fetchQuizzsFromApi } from './api-quizzs.facade';
import {
  fetchQuizzScoresFromApi,
  saveQuizzScoreOnApi,
} from './api-quizz-scores.facade';
import type { QuizzScoreEntry } from '../../utils/users/users-quizz-scores';

export async function getAllQuizzs(): Promise<Quizz[]> {
  try {
    return await fetchQuizzsFromApi();
  } catch {
    return [];
  }
}

export async function createQuizz(quizz: Quizz): Promise<Quizz> {
  return createQuizzOnApi(quizz);
}

export async function getQuizzScoresForUser(
  userId: string
): Promise<QuizzScoreEntry[]> {
  if (!userId.trim()) return [];
  try {
    return await fetchQuizzScoresFromApi(userId.trim().toLowerCase());
  } catch {
    return [];
  }
}

export async function saveQuizzScore(
  userId: string,
  entry: Omit<QuizzScoreEntry, 'completedAt'>
): Promise<QuizzScoreEntry[]> {
  const normalized = userId.trim().toLowerCase();
  if (!normalized) return [];
  return saveQuizzScoreOnApi(normalized, {
    ...entry,
    entityType: entry.entityType as string,
  });
}
