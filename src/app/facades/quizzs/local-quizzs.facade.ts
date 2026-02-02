import { Quizz } from '../../models/quizz-model';
import { allQuizzs } from '../../utils/quizzs';

export function getLocalQuizzs(): Quizz[] {
  return allQuizzs;
}
