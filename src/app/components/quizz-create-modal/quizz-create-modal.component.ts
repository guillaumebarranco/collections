import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Quizz, EntityType, QuizzQuestion } from '../../models/quizz-model';
import { createQuizz } from '../../facades/quizzs/quizzs.facade';

type QuizzCreateData = {
  entityTitle: string;
  entityType: EntityType;
  creator: string;
};

type QuestionForm = {
  title: string;
  multipleChoice: boolean;
  proposedAnswersText: string;
  acceptedAnswersText: string;
};

const MAX_QUESTIONS = 20;

@Component({
  selector: 'app-quizz-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quizz-create-modal.component.html',
  styleUrls: ['./quizz-create-modal.component.scss'],
})
export class QuizzCreateModalComponent {
  private readonly dialogRef = inject(MatDialogRef<QuizzCreateModalComponent>, {
    optional: true,
  });
  private readonly data = inject<QuizzCreateData>(MAT_DIALOG_DATA);

  readonly entityTitle = this.data.entityTitle;
  readonly entityType = this.data.entityType;
  readonly creator = this.data.creator;

  level = signal<number>(1);
  questions = signal<QuestionForm[]>([this.createEmptyQuestion()]);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');

  readonly canAddQuestion = computed(
    () => this.questions().length < MAX_QUESTIONS
  );

  readonly isValid = computed(() => {
    if (!this.entityTitle || !this.creator) return false;
    return this.questions().every((question) => {
      if (!question.title.trim()) return false;
      const accepted = this.parseAnswers(question.acceptedAnswersText);
      if (accepted.length === 0) return false;
      if (question.multipleChoice) {
        const proposed = this.parseAnswers(question.proposedAnswersText);
        return proposed.length > 0;
      }
      return true;
    });
  });

  addQuestion() {
    if (!this.canAddQuestion()) return;
    this.questions.update((current) => [
      ...current,
      this.createEmptyQuestion(),
    ]);
  }

  removeQuestion(index: number) {
    this.questions.update((current) => current.filter((_, i) => i !== index));
    if (this.questions().length === 0) {
      this.questions.set([this.createEmptyQuestion()]);
    }
  }

  updateQuestion(index: number, patch: Partial<QuestionForm>) {
    this.questions.update((current) =>
      current.map((question, i) =>
        i === index ? { ...question, ...patch } : question
      )
    );
  }

  async saveQuizz() {
    console.log('this.isValid()', this.isValid());

    if (!this.isValid()) {
      this.errorMessage.set('Merci de compléter toutes les questions.');
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set('');
    try {
      const quizz = this.buildQuizzPayload();
      const saved = await createQuizz(quizz);
      this.dialogRef?.close({ created: true, quizz: saved });
    } catch (error) {
      this.errorMessage.set("Impossible d'enregistrer le quizz.");
      console.error('create-quizz:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  close() {
    this.dialogRef?.close();
  }

  private buildQuizzPayload(): Quizz {
    const questions: QuizzQuestion[] = this.questions().map(
      (question, index) => {
        const proposedAnswers = question.multipleChoice
          ? this.parseAnswers(question.proposedAnswersText)
          : [];
        const acceptedAnswers = this.parseAnswers(question.acceptedAnswersText);
        return {
          id: index + 1,
          title: question.title.trim(),
          multipleChoice: question.multipleChoice,
          proposedAnswers,
          acceptedAnswers,
        };
      }
    );
    return {
      creator: this.creator,
      entityType: this.entityType,
      entityTitle: this.entityTitle,
      level: this.level(),
      questions,
    };
  }

  private createEmptyQuestion(): QuestionForm {
    return {
      title: '',
      multipleChoice: false,
      proposedAnswersText: '',
      acceptedAnswersText: '',
    };
  }

  private parseAnswers(value: string): string[] {
    return value
      .split(/[,\\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
