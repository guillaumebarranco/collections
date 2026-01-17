import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';

type AddMangaEntityForm = {
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  nbTomes: number;
  isFinished: boolean;
};

type AddMangaUserForm = {
  rating: number;
  readTimes: number;
  readDate: string;
};

type AddMangaDialogData = {
  userId: string;
};

@Component({
  selector: 'app-add-manga',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-manga.component.html',
  styleUrls: ['./add-manga.component.scss'],
})
export class AddMangaComponent {
  private readonly dialogRef = inject(MatDialogRef<AddMangaComponent>);
  private readonly dialogData = inject<AddMangaDialogData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  entityForm = signal<AddMangaEntityForm>({
    title: '',
    author: '',
    coverUrl: '',
    genre: '',
    nbTomes: 0,
    isFinished: true,
  });

  userForm = signal<AddMangaUserForm>({
    rating: 0,
    readTimes: 1,
    readDate: '',
  });

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddMangaEntityForm>(
    field: K,
    value: string | number | boolean
  ) {
    const current = this.entityForm();
    let nextValue: AddMangaEntityForm[K] = value as AddMangaEntityForm[K];
    if (field === 'nbTomes') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddMangaEntityForm[K];
    }
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateUserField<K extends keyof AddMangaUserForm>(
    field: K,
    value: string | number
  ) {
    const current = this.userForm();
    let nextValue: AddMangaUserForm[K] = value as AddMangaUserForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddMangaUserForm[K];
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
      const response = await fetch(`${getApiBaseUrl()}/mangas/add`, {
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
