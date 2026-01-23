import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';

type AddSerieEntityForm = {
  title: string;
  director: string;
  actors: string;
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  genre: string;
  seasonsData: {
    seasonNumber: number;
    nbEpisodes: number;
    totalLength: number;
  }[];
};

type AddSerieDialogData = {
  userId: string;
};

type AddSerieUserForm = {
  owned: boolean;
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
    genre: '',
    seasonsData: [],
  });

  userForm = signal<AddSerieUserForm>({
    owned: false,
  });

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddSerieEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.entityForm();
    let nextValue: AddSerieEntityForm[K] = value as AddSerieEntityForm[K];
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  addSeason() {
    const current = this.entityForm();
    const nextNumber = current.seasonsData.length + 1;
    this.entityForm.set({
      ...current,
      seasonsData: [
        ...current.seasonsData,
        { seasonNumber: nextNumber, nbEpisodes: 0, totalLength: 0 },
      ],
    });
  }

  removeSeason(index: number) {
    const current = this.entityForm();
    const nextSeasons = current.seasonsData
      .filter((_, i) => i !== index)
      .map((season, i) => ({ ...season, seasonNumber: i + 1 }));
    this.entityForm.set({
      ...current,
      seasonsData: nextSeasons,
    });
  }

  updateSeasonField(
    index: number,
    field: 'nbEpisodes' | 'totalLength',
    value: string | number
  ) {
    const current = this.entityForm();
    const asNumber = Number(value);
    const normalized = Number.isNaN(asNumber) ? 0 : asNumber;
    const seasonsData = current.seasonsData.map((season, i) =>
      i === index ? { ...season, [field]: normalized } : season
    );
    this.entityForm.set({
      ...current,
      seasonsData,
    });
  }

  updateUserCheckbox(field: 'owned', checked: boolean) {
    const current = this.userForm();
    this.userForm.set({
      ...current,
      [field]: checked,
    });
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
    if (!entity.title || !entity.director) {
      this.errorMessage.set('Titre et créateur sont obligatoires.');
      return;
    }
    if (entity.seasonsData.length === 0) {
      this.errorMessage.set('Ajoutez au moins une saison.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/series/add`, {
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
          user: this.userForm(),
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
