import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';

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

type AddGameUserForm = {
  rating: number;
  timesFinished: number;
  additionnalEstimatedTime: number;
  timesFinishedHundredPercent: number;
  platined: boolean;
  owned: boolean;
  gamelistPriority: number;
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
    timesFinished: 1,
    additionnalEstimatedTime: 0,
    timesFinishedHundredPercent: 0,
    platined: false,
    owned: false,
    gamelistPriority: 0,
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
    if (
      field === 'rating' ||
      field === 'timesFinished' ||
      field === 'additionnalEstimatedTime' ||
      field === 'timesFinishedHundredPercent' ||
      field === 'gamelistPriority'
    ) {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as AddGameUserForm[K];
    }
    this.userForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'platined' | 'owned', checked: boolean) {
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
      const response = await fetch(`${getApiBaseUrl()}/games/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getUserId(),
          entity,
          user,
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
