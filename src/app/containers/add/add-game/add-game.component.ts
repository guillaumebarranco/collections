import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import type { UserGameSession } from '../../../models/game-model';

type AddGameEntityForm = {
  title: string;
  editor: string;
  hero: string;
  coverUrl: string;
  releaseDate: string;
  averageTimeToFinish: number;
  platform: string;
  saga: string;
  platineTime: number;
};

type SessionCompletionType = 'platined' | 'hundred' | 'finished' | 'none';

type AddGameSessionForm = {
  completion: SessionCompletionType;
  additionnalEstimatedTime: number;
};

type AddGameUserForm = {
  rating: number;
  sessions: AddGameSessionForm[];
  owned: boolean;
  gamelistPriority: number;
  wantToPlayAgain: boolean;
};

type AddGameDialogData = {
  userId: string;
};

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss'],
})
export class AddGameComponent {
  private readonly dialogRef = inject(MatDialogRef<AddGameComponent>);
  private readonly dialogData = inject<AddGameDialogData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  entityForm = signal<AddGameEntityForm>({
    title: '',
    editor: '',
    hero: '',
    coverUrl: '',
    releaseDate: '',
    averageTimeToFinish: 0,
    platform: '',
    saga: '',
    platineTime: 0,
  });

  userForm = signal<AddGameUserForm>({
    rating: 0,
    sessions: [{ completion: 'none', additionnalEstimatedTime: 0 }],
    owned: false,
    gamelistPriority: 1,
    wantToPlayAgain: false,
  });

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddGameEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.entityForm();
    let nextValue: AddGameEntityForm[K] = value as AddGameEntityForm[K];
    if (field === 'averageTimeToFinish' || field === 'platineTime') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddGameEntityForm[K];
    }
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateUserField<K extends keyof AddGameUserForm>(
    field: K,
    value: string | number
  ) {
    const current = this.userForm();
    let nextValue: AddGameUserForm[K] = value as AddGameUserForm[K];
    if (field === 'rating' || field === 'gamelistPriority') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as AddGameUserForm[K];
    }
    this.userForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateSessionCompletion(sessionIndex: number, completion: SessionCompletionType) {
    const current = this.userForm();
    if (sessionIndex < 0 || sessionIndex >= current.sessions.length) return;
    const next = [...current.sessions];
    next[sessionIndex] = { ...next[sessionIndex], completion };
    this.userForm.set({ ...current, sessions: next });
  }

  updateSessionAdditionnalTime(sessionIndex: number, value: string | number) {
    const current = this.userForm();
    if (sessionIndex < 0 || sessionIndex >= current.sessions.length) return;
    const hours = Number(value);
    const next = [...current.sessions];
    next[sessionIndex] = {
      ...next[sessionIndex],
      additionnalEstimatedTime: Number.isNaN(hours) ? 0 : hours,
    };
    this.userForm.set({ ...current, sessions: next });
  }

  addSession() {
    const current = this.userForm();
    this.userForm.set({
      ...current,
      sessions: [...current.sessions, { completion: 'none', additionnalEstimatedTime: 0 }],
    });
  }

  removeSession(sessionIndex: number) {
    const current = this.userForm();
    if (current.sessions.length <= 1) return;
    const next = current.sessions.filter((_, i) => i !== sessionIndex);
    this.userForm.set({ ...current, sessions: next });
  }

  canShowPlatinedOption(sessionIndex: number): boolean {
    const entity = this.entityForm();
    if (entity.platineTime <= 0) return false;
    const current = this.userForm();
    return !current.sessions.some((s, i) => i !== sessionIndex && s.completion === 'platined');
  }

  updateCheckbox(field: 'owned', checked: boolean) {
    const current = this.userForm();
    this.userForm.set({
      ...current,
      [field]: checked,
    });
  }

  setRatingFromClick(star: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    const half = target.clientWidth / 2;
    const nextValue = event.offsetX < half ? star - 0.5 : star;
    this.updateUserField('rating', Math.max(0, nextValue));
  }

  getStarType(rating: number, star: number): 'full' | 'half' | 'empty' {
    if (rating >= star) {
      return 'full';
    }
    if (rating >= star - 0.5) {
      return 'half';
    }
    return 'empty';
  }

  private getUserId(): string {
    return this.dialogData?.userId || 'guillaume';
  }

  async onSubmit() {
    const entity = this.entityForm();
    const user = this.userForm();

    if (!entity.title || !entity.editor) {
      this.errorMessage.set('Titre et editeur sont obligatoires.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const sessions: UserGameSession[] = user.sessions.map((f) => ({
        finishedGame: f.completion === 'finished',
        finishedGameWithHundredPercent: f.completion === 'hundred',
        platinedGame: f.completion === 'platined',
        additionnalEstimatedTime: f.completion === 'none' ? (f.additionnalEstimatedTime ?? 0) : 0,
      }));
      const userPayload = {
        rating: user.rating,
        owned: user.owned,
        gamelistPriority: user.gamelistPriority,
        wantToPlayAgain: user.wantToPlayAgain ?? false,
        sessions,
      };
      const response = await fetch(`${getApiBaseUrl()}/games/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getUserId(),
          entity,
          user: userPayload,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        this.errorMessage.set(payload?.error || "Erreur lors de l'ajout.");
        return;
      }

      this.dialogRef.close({ created: true, payload });
    } catch (error) {
      this.errorMessage.set("Erreur reseau lors de l'ajout.");
    } finally {
      this.isSaving.set(false);
    }
  }
}
