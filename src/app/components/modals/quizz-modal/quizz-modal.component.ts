import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import { Quizz } from '../../../models/quizz-model';
import { normalizeQuizzText } from '../../../utils/quizzs/quizzs.utils';
import { AuthService } from '../../../core/auth.service';
import { saveQuizzScore } from '../../../facades/quizzs/quizzs.facade';

@Component({
  selector: 'app-quizz-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizz-modal.component.html',
  styleUrls: ['./quizz-modal.component.scss'],
})
export class QuizzModalComponent {
  private readonly authService = inject(AuthService);

  quizzs = input.required<Quizz[]>();
  isOpen = input.required<boolean>();
  /** Quand fourni à l’ouverture, ce quizz est sélectionné directement (liste ignorée). */
  preselectedQuizz = input<Quizz | null>(null);
  close = output<void>();
  /** Émis après enregistrement du score (pour rafraîchir la liste des scores côté parent). */
  scoreSaved = output<void>();

  selectedQuizz = signal<Quizz | null>(null);
  answers = signal<string[]>([]);
  submitted = signal(false);
  savingScore = signal(false);
  scoreSaveError = signal<string | null>(null);
  private wasOpen = false;

  readonly score = computed(() => {
    if (!this.submitted() || !this.selectedQuizz()) return null;
    const questions = this.selectedQuizz()!.questions;
    let correct = 0;
    questions.forEach((question, index) => {
      const answer = this.answers()[index] || '';
      if (this.isAnswerCorrect(question.acceptedAnswers, answer)) {
        correct += 1;
      }
    });
    return { correct, total: questions.length };
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open && !this.wasOpen) {
        const preselected = this.preselectedQuizz();
        if (preselected) {
          this.selectQuizz(preselected);
        } else {
          this.selectedQuizz.set(null);
          this.answers.set([]);
          this.submitted.set(false);
        }
      }
      this.wasOpen = open;
    });
  }

  selectQuizz(quizz: Quizz) {
    this.selectedQuizz.set(quizz);
    this.answers.set(Array.from({ length: quizz.questions.length }, () => ''));
    this.submitted.set(false);
  }

  backToList() {
    this.selectedQuizz.set(null);
    this.answers.set([]);
    this.submitted.set(false);
  }

  updateAnswer(index: number, value: string) {
    this.answers.update((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  async submitAnswers() {
    this.submitted.set(true);
    this.scoreSaveError.set(null);
    const q = this.selectedQuizz();
    const scoreVal = this.score();
    const userId =
      this.authService.getAuthenticatedUserId?.() ?? this.authService.userId();
    if (q && scoreVal && userId) {
      this.savingScore.set(true);
      try {
        await saveQuizzScore(userId, {
          entityType: q.entityType,
          entityTitle: q.entityTitle,
          creator: q.creator,
          level: q.level,
          correct: scoreVal.correct,
          total: scoreVal.total,
        });
        this.scoreSaved.emit();
      } catch {
        this.scoreSaveError.set('Score non enregistré.');
      } finally {
        this.savingScore.set(false);
      }
    }
  }

  isQuestionCorrect(acceptedAnswers: string[], answer: string): boolean {
    if (!this.submitted()) return false;
    return this.isAnswerCorrect(acceptedAnswers, answer);
  }

  private isAnswerCorrect(acceptedAnswers: string[], answer: string): boolean {
    if (!answer) return false;
    const normalizedAnswer = normalizeQuizzText(answer);
    return acceptedAnswers.some(
      (accepted) => normalizeQuizzText(accepted) === normalizedAnswer
    );
  }
}
