import { getApiBaseUrl } from '../../core/config';
import { Quizz } from '../../models/quizz-model';

export async function fetchQuizzsFromApi(): Promise<Quizz[]> {
  const response = await fetch(`${getApiBaseUrl()}/quizzs`);
  if (!response.ok) {
    throw new Error('Quizzs API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.quizzs || [];
}

export async function createQuizzOnApi(quizz: Quizz): Promise<Quizz> {
  const response = await fetch(`${getApiBaseUrl()}/quizzs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quizz),
  });
  if (!response.ok) {
    throw new Error('Quizzs API save error');
  }
  const data = await response.json();
  return data?.quizz ?? quizz;
}
