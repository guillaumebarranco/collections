import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';

type AddManwhaEntityForm = {
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  nbTomes: number;
  isFinished: boolean;
};

type AddManwhaUserForm = {
  rating: number;
  readTimes: number;
  readDate: string;
};

type AddManwhaDialogData = {
  userId: string;
};

@Component({
  selector: 'app-add-manwha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-manwha.component.html',
  styleUrls: ['./add-manwha.component.scss'],
})
export class AddManwhaComponent {
  private readonly dialogRef = inject(MatDialogRef<AddManwhaComponent>);
  private readonly dialogData = inject<AddManwhaDialogData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  entityForm = signal<AddManwhaEntityForm>({
    title: '',
    author: '',
    coverUrl: '',
    genre: '',
    nbTomes: 0,
    isFinished: true,
  });

  userForm = signal<AddManwhaUserForm>({
    rating: 0,
    readTimes: 1,
    readDate: '',
  });

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddManwhaEntityForm>(
    field: K,
    value: string | number | boolean
  ) {
    const current = this.entityForm();
    let nextValue: AddManwhaEntityForm[K] = value as AddManwhaEntityForm[K];
    if (field === 'nbTomes') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddManwhaEntityForm[K];
    }
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateUserField<K extends keyof AddManwhaUserForm>(
    field: K,
    value: string | number
  ) {
    const current = this.userForm();
    let nextValue: AddManwhaUserForm[K] = value as AddManwhaUserForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddManwhaUserForm[K];
    }
    this.userForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'isFinished', checked: boolean) {
    const current = this.entityForm();
    this.entityForm.set({
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

    if (!entity.title || !entity.author) {
      this.errorMessage.set('Titre et auteur sont obligatoires.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/manwhas/add`, {
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
      this.errorMessage.set("Erreur réseau lors de l'ajout.");
    } finally {
      this.isSaving.set(false);
    }
  }
}
