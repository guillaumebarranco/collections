import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { CountrySelectComponent } from '../../../components/country-select/country-select.component';

type AddBookEntityForm = {
  title: string;
  author: string;
  coverUrl: string;
  pages: number;
  genre: string;
  saga: string;
  sagaOrder: number;
  sagaFinished: boolean;
  releaseDate: string;
  description: string;
  countryOrigin: string;
};

type AddBookUserForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
  readPriority: number;
  ratingComment: string;
};

type AddBookDialogData = {
  userId: string;
};

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule, CountrySelectComponent],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent {
  private readonly dialogRef = inject(MatDialogRef<AddBookComponent>);
  private readonly dialogData = inject<AddBookDialogData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  entityForm = signal<AddBookEntityForm>({
    title: '',
    author: '',
    coverUrl: '',
    pages: 0,
    genre: '',
    saga: '',
    sagaOrder: 0,
    sagaFinished: true,
    releaseDate: '',
    description: '',
    countryOrigin: '',
  });

  userForm = signal<AddBookUserForm>({
    rating: 0,
    readTimes: 1,
    readDate: '',
    owned: false,
    readPriority: 1,
    ratingComment: '',
  });

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddBookEntityForm>(
    field: K,
    value: string | number | boolean
  ) {
    const current = this.entityForm();
    let nextValue: AddBookEntityForm[K] = value as AddBookEntityForm[K];
    if (field === 'pages' || field === 'sagaOrder') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddBookEntityForm[K];
    }
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateUserField<K extends keyof AddBookUserForm>(
    field: K,
    value: string | number
  ) {
    const current = this.userForm();
    let nextValue: AddBookUserForm[K] = value as AddBookUserForm[K];
    if (
      field === 'rating' ||
      field === 'readTimes' ||
      field === 'readPriority'
    ) {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as AddBookUserForm[K];
    }
    this.userForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'sagaFinished', checked: boolean) {
    const current = this.entityForm();
    this.entityForm.set({
      ...current,
      [field]: checked,
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

  getUserId(): string {
    return this.dialogData?.userId || DEFAULT_USER_ID;
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
      const response = await fetch(`${getApiBaseUrl()}/books/add`, {
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
