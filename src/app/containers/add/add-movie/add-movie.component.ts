import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { CountrySelectComponent } from '../../../components/shared/country-select/country-select.component';

type AddMovieEntityForm = {
  title: string;
  director: string;
  actors: string;
  coverUrl: string;
  releaseDate: string;
  length: number;
  genre: string;
  saga: string;
  description: string;
  countryOrigin: string;
};

type AddMovieUserForm = {
  rating: number;
  timesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  seenAtCinema: boolean;
  owned: boolean;
  borrowed: string;
  loaned: string;
  wantToSeeAgain: boolean;
  watchPriority: number;
  ratingComment: string;
  inList: string[];
};

type AddMovieDialogData = {
  userId: string;
};

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, CountrySelectComponent],
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
})
export class AddMovieComponent {
  private readonly dialogRef = inject(MatDialogRef<AddMovieComponent>);
  private readonly dialogData = inject<AddMovieDialogData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  entityForm = signal<AddMovieEntityForm>({
    title: '',
    director: '',
    actors: '',
    coverUrl: '',
    releaseDate: '',
    length: 0,
    genre: '',
    saga: '',
    description: '',
    countryOrigin: '',
  });

  userForm = signal<AddMovieUserForm>({
    rating: 0,
    timesWatched: 1,
    firstViewedDate: '',
    lastViewedDate: '',
    seenAtCinema: false,
    owned: false,
    borrowed: '',
    loaned: '',
    wantToSeeAgain: false,
    watchPriority: 1,
    ratingComment: '',
    inList: [],
  });

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddMovieEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.entityForm();
    let nextValue: AddMovieEntityForm[K] = value as AddMovieEntityForm[K];
    if (field === 'length') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddMovieEntityForm[K];
    }
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateUserField<K extends keyof AddMovieUserForm>(
    field: K,
    value: string | number
  ) {
    const current = this.userForm();
    let nextValue: AddMovieUserForm[K] = value as AddMovieUserForm[K];
    if (
      field === 'rating' ||
      field === 'timesWatched' ||
      field === 'watchPriority'
    ) {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddMovieUserForm[K];
    }
    this.userForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(
    field: 'seenAtCinema' | 'owned' | 'wantToSeeAgain',
    checked: boolean
  ) {
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

  private getActorsList(): string[] {
    const raw = this.entityForm().actors || '';
    return raw
      .split(',')
      .map((actor) => actor.trim())
      .filter((actor) => actor.length > 0);
  }

  getUserId(): string {
    return this.dialogData?.userId || DEFAULT_USER_ID;
  }

  async onSubmit() {
    const entity = this.entityForm();
    const user = this.userForm();

    if (!entity.title || !entity.director) {
      this.errorMessage.set('Titre et réalisateur sont obligatoires.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/movies/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getUserId(),
          entity: {
            ...entity,
            actors: this.getActorsList(),
          },
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
