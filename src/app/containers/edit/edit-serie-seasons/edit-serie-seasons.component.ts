import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Serie, UserSerieSeason } from '../../../models/serie-model';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';

type EditSerieSeasonsDialogData = {
  serie: Serie;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-serie-seasons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-serie-seasons.component.html',
  styleUrls: ['./edit-serie-seasons.component.scss'],
})
export class EditSerieSeasonsComponent {
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditSerieSeasonsComponent>, {
    optional: true,
  });
  private readonly dialogData = inject<EditSerieSeasonsDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly serie = signal<Serie | null>(this.dialogData?.serie || null);
  readonly seasons = signal<UserSerieSeason[]>(
    this.buildSeasons(this.dialogData?.serie)
  );
  readonly isSaving = signal(false);

  updateSeasonField(
    seasonNumber: number,
    field: 'seasonRating' | 'seasonTimesWatched',
    value: string | number
  ) {
    const nextValue = Number(value);
    const normalizedValue = Number.isNaN(nextValue) ? 0 : nextValue;
    this.seasons.set(
      this.seasons().map((season) =>
        season.seasonNumber === seasonNumber
          ? {
              ...season,
              [field]: normalizedValue,
            }
          : season
      )
    );
  }

  async onSubmit() {
    const serie = this.serie();
    if (!serie) return;
    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/series`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.getCurrentUserId(),
          title: serie.title,
          director: serie.director,
          seasons: this.seasons(),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-serie-seasons:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-serie-seasons:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  close() {
    this.dialogRef?.close();
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const parentId = this.router.url.split('/')[1];
    return parentId || DEFAULT_USER_ID;
  }

  private buildSeasons(serie?: Serie | null): UserSerieSeason[] {
    if (serie?.seasons && serie.seasons.length > 0) {
      return serie.seasons;
    }
    const total =
      serie?.seasonsData?.length ??
      Math.max(0, Number(serie?.nbSeasons) || 0);
    return Array.from({ length: total }, (_, index) => ({
      seasonNumber: index + 1,
      seasonRating: 0,
      seasonTimesWatched: 0,
    }));
  }
}
