import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

type AddSerieEntityForm = {
  title: string;
  director: string;
  actors: string;
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  totalLength: number;
  nbSeasons: number;
  nbEpisodesTotal: number;
  genre: string;
};

type AddSerieUserForm = {
  rating: number;
  timesWatched: number;
  stoppedAtSeason: number;
};

type AddSerieDialogData = {
  userId: string;
};

@Component({
  selector: 'app-add-serie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-serie.component.html',
  styleUrls: ['./add-serie.component.scss'],
})
export class AddSerieComponent {
  private readonly dialogRef = inject(MatDialogRef<AddSerieComponent>);
  private readonly dialogData = inject<AddSerieDialogData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  entityForm = signal<AddSerieEntityForm>({
    title: '',
    director: '',
    actors: '',
    coverUrl: '',
    releaseDate: '',
    endDate: '',
    totalLength: 0,
    nbSeasons: 0,
    nbEpisodesTotal: 0,
    genre: '',
  });

  userForm = signal<AddSerieUserForm>({
    rating: 0,
    timesWatched: 1,
    stoppedAtSeason: 0,
  });

  public apiUrl = document.location.origin.includes('localhost')
    ? `http://localhost:3001/api`
    : 'https://makya.webarranco.fr/api';

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddSerieEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.entityForm();
    let nextValue: AddSerieEntityForm[K] = value as AddSerieEntityForm[K];
    if (
      field === 'totalLength' ||
      field === 'nbSeasons' ||
      field === 'nbEpisodesTotal'
    ) {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as AddSerieEntityForm[K];
    }
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateUserField<K extends keyof AddSerieUserForm>(
    field: K,
    value: string | number
  ) {
    const current = this.userForm();
    let nextValue: AddSerieUserForm[K] = value as AddSerieUserForm[K];
    if (field === 'rating' || field === 'timesWatched' || field === 'stoppedAtSeason') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as AddSerieUserForm[K];
    }
    this.userForm.set({
      ...current,
      [field]: nextValue,
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

  private getActorsList(): string[] {
    const raw = this.entityForm().actors || '';
    return raw
      .split(',')
      .map((actor) => actor.trim())
      .filter((actor) => actor.length > 0);
  }

  private getUserId(): string {
    return this.dialogData?.userId || 'guillaume';
  }

  async onSubmit() {
    const entity = this.entityForm();
    const user = this.userForm();

    if (!entity.title || !entity.director) {
      this.errorMessage.set('Titre et créateur sont obligatoires.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const response = await fetch(`${this.apiUrl}/series/add`, {
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
