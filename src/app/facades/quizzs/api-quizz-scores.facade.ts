import { getApiBaseUrl } from '../../core/config';
import type { QuizzScoreEntry } from '../../utils/users/users-quizz-scores';

export async function fetchQuizzScoresFromApi(
  userId: string
): Promise<QuizzScoreEntry[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/quizzs/scores/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Quizz scores API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function saveQuizzScoreOnApi(
  userId: string,
  entry: Omit<QuizzScoreEntry, 'completedAt'>
): Promise<QuizzScoreEntry[]> {
  const response = await fetch(`${getApiBaseUrl()}/quizzs/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      entityType: entry.entityType,
      entityTitle: entry.entityTitle,
      creator: entry.creator,
      level: entry.level,
      correct: entry.correct,
      total: entry.total,
    }),
  });
  if (!response.ok) {
    throw new Error('Quizz score save API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
