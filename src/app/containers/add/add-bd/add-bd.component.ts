import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';

type AddBdEntityForm = {
  title: string;
  designer: string;
  writer: string;
  coverUrl: string;
  releaseDate: string;
  genre: string;
  saga: string;
  sagaOrder: number;
  description: string;
};

type AddBdUserForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
  borrowed: string;
  loaned: string;
  ratingComment: string;
};

type AddBdDialogData = {
  userId: string;
  listMode?: 'watchlist' | 'readlist' | 'gamelist' | null;
};

@Component({
  selector: 'app-add-bd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-bd.component.html',
  styleUrls: ['./add-bd.component.scss'],
})
export class AddBdComponent {
  private readonly dialogRef = inject(MatDialogRef<AddBdComponent>);
  private readonly dialogData = inject<AddBdDialogData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  entityForm = signal<AddBdEntityForm>({
    title: '',
    designer: '',
    writer: '',
    coverUrl: '',
    releaseDate: '',
    genre: '',
    saga: '',
    sagaOrder: 0,
    description: '',
  });

  userForm = signal<AddBdUserForm>({
    rating: 0,
    readTimes: 1,
    readDate: '',
    owned: false,
    borrowed: '',
    loaned: '',
    ratingComment: '',
  });

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddBdEntityForm>(
    field: K,
    value: string | number | boolean
  ) {
    const current = this.entityForm();
    let nextValue: AddBdEntityForm[K] = value as AddBdEntityForm[K];
    if (field === 'sagaOrder') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as AddBdEntityForm[K];
    }
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateUserField<K extends keyof AddBdUserForm>(
    field: K,
    value: string | number
  ) {
    const current = this.userForm();
    let nextValue: AddBdUserForm[K] = value as AddBdUserForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as AddBdUserForm[K];
    }
    this.userForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateUserCheckbox(field: 'owned', checked: boolean) {
    const current = this.userForm();
    this.userForm.set({
      ...current,
      [field]: checked,
    });
  }

  setRatingFromClick(star: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    const width = target.clientWidth;
    const x = event.offsetX;
    const ratio = x / width;
    const offset = ratio < 0.25 ? 0.75 : ratio < 0.5 ? 0.5 : ratio < 0.75 ? 0.25 : 0;
    const nextValue = Math.round((star - offset) * 4) / 4;
    this.updateUserField('rating', Math.max(0, Math.min(5, nextValue)));
  }

  getStarType(rating: number, star: number): 'full' | 'threeQuarter' | 'half' | 'quarter' | 'empty' {
    if (rating >= star) return 'full';
    if (rating >= star - 0.25) return 'threeQuarter';
    if (rating >= star - 0.5) return 'half';
    if (rating >= star - 0.75) return 'quarter';
    return 'empty';
  }

  private getUserId(): string {
    return this.dialogData?.userId || DEFAULT_USER_ID;
  }

  get headerTitle(): string {
    return this.dialogData?.listMode === 'readlist'
      ? 'Ajouter une BD à lire'
      : 'Ajouter une BD';
  }

  async onSubmit() {
    const entity = this.entityForm();
    const user = this.userForm();

    if (!entity.title || !entity.designer || !entity.writer) {
      this.errorMessage.set('Titre, designer et writer sont obligatoires.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/bds/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getUserId(),
          readlist: this.dialogData?.listMode === 'readlist',
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
