import { CommonModule } from '@angular/common';
import { Component, input, output, signal, computed, effect } from '@angular/core';
import { Quizz } from '../../models/quizz-model';
import { normalizeQuizzText } from '../../utils/quizzs/quizzs.utils';

@Component({
  selector: 'app-quizz-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizz-modal.component.html',
  styleUrls: ['./quizz-modal.component.scss'],
})
export class QuizzModalComponent {
  quizzs = input.required<Quizz[]>();
  isOpen = input.required<boolean>();
  close = output<void>();

  selectedQuizz = signal<Quizz | null>(null);
  answers = signal<string[]>([]);
  submitted = signal(false);
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
        this.selectedQuizz.set(null);
        this.answers.set([]);
        this.submitted.set(false);
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

  submitAnswers() {
    this.submitted.set(true);
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
