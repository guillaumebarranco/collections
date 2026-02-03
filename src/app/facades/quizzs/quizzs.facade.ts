import { Quizz } from '../../models/quizz-model';
import { isLocalhost } from '../../core/config';
import { getLocalQuizzs } from './local-quizzs.facade';
import { createQuizzOnApi, fetchQuizzsFromApi } from './api-quizzs.facade';

export async function getAllQuizzs(): Promise<Quizz[]> {
  if (isLocalhost()) {
    return getLocalQuizzs();
  }

  try {
    return await fetchQuizzsFromApi();
  } catch {
    return [];
  }
}

export async function createQuizz(quizz: Quizz): Promise<Quizz> {
  return createQuizzOnApi(quizz);
}
