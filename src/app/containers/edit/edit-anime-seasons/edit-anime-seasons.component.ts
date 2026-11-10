import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Anime, UserAnimeSeason } from '../../../models/anime-model';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/entity/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { ExtraDatesListComponent } from '../../../components/shared/extra-dates-list/extra-dates-list.component';
import { normalizeActivityExtraDates } from '../../../utils/activity-extra-dates.utils';

type EditAnimeSeasonsDialogData = {
  anime: Anime;
  userId?: string;
};

@Component({
  selector: 'app-edit-anime-seasons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    ExtraDatesListComponent,
  ],
  templateUrl: './edit-anime-seasons.component.html',
  styleUrls: ['./edit-anime-seasons.component.scss'],
})
export class EditAnimeSeasonsComponent {
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditAnimeSeasonsComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditAnimeSeasonsDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly anime = signal<Anime | null>(this.dialogData?.anime || null);
  readonly seasons = signal<UserAnimeSeason[]>(
    this.buildSeasons(this.dialogData?.anime)
  );
  readonly isSaving = signal(false);

  updateSeasonField(
    seasonNumber: number,
    field: 'seasonRating' | 'seasonTimesWatched' | 'firstViewedDate' | 'lastViewedDate',
    value: string | number
  ) {
    this.seasons.set(
      this.seasons().map((season) =>
        season.seasonNumber === seasonNumber
          ? {
              ...season,
              [field]:
                field === 'firstViewedDate' || field === 'lastViewedDate'
                  ? String(value)
                  : Number.isNaN(Number(value))
                  ? 0
                  : Number(value),
            }
          : season
      )
    );
  }

  updateSeasonOtherViewedDates(seasonNumber: number, dates: string[]): void {
    this.seasons.set(
      this.seasons().map((season) =>
        season.seasonNumber === seasonNumber
          ? { ...season, otherViewedDates: dates }
          : season
      )
    );
  }

  async onSubmit() {
    const anime = this.anime();
    if (!anime) return;
    if (!this.authService.canEdit(this.getCurrentUserId())) return;
    this.isSaving.set(true);
    try {
      const seasonsPayload = this.seasons().map((season) => ({
        ...season,
        otherViewedDates: normalizeActivityExtraDates(season.otherViewedDates),
      }));
      const response = await fetch(`${getApiBaseUrl()}/animes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.getCurrentUserId(),
          title: anime.title,
          director: anime.director,
          seasons: seasonsPayload,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-anime-seasons:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-anime-seasons:error', error);
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

  private buildSeasons(anime?: Anime | null): UserAnimeSeason[] {
    if (anime?.seasons && anime.seasons.length > 0) {
      return anime.seasons.map((season) => ({
        ...season,
        firstViewedDate: season.firstViewedDate || '',
        lastViewedDate: season.lastViewedDate || '',
        otherViewedDates: [...(season.otherViewedDates ?? [])],
      }));
    }
    const total = anime?.seasonsData?.length ?? 0;
    return Array.from({ length: total }, (_, index) => ({
      seasonNumber: index + 1,
      seasonRating: 0,
      watching: false,
      seasonTimesWatched: 0,
      firstViewedDate: '',
      lastViewedDate: '',
      otherViewedDates: [],
    }));
  }
}
