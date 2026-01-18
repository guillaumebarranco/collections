import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Serie } from '../../../models/serie-model';
import { getSeriesByUser } from '../../../facades/series/series.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';

type EditSerieForm = {
  rating: number;
  timesWatched: number;
  stoppedAtSeason: number;
};

type EditSerieDialogData = {
  serie: Serie;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-serie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-serie.component.html',
  styleUrls: ['./edit-serie.component.scss'],
})
export class EditSerieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditSerieComponent>, {
    optional: true,
  });
  private readonly dialogData = inject<EditSerieDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly serie = signal<Serie | null>(null);
  readonly serieForm = signal<EditSerieForm | null>(null);
  readonly serieNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly serieSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.serie) {
      this.serie.set(this.dialogData.serie);
      this.serieForm.set(this.toForm(this.dialogData.serie));
      this.serieNotFound.set(false);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadSerieFromSlug(params);
    });
  }

  updateField<K extends keyof EditSerieForm>(field: K, value: string | number) {
    const current = this.serieForm();
    if (!current) return;

    let nextValue: EditSerieForm[K] = value as EditSerieForm[K];
    if (
      field === 'rating' ||
      field === 'timesWatched' ||
      field === 'stoppedAtSeason'
    ) {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditSerieForm[K];
    }

    this.serieForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  setRatingFromClick(star: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    const half = target.clientWidth / 2;
    const nextValue = event.offsetX < half ? star - 0.5 : star;
    this.updateField('rating', Math.max(0, nextValue));
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

  async onSubmit() {
    const form = this.serieForm();
    const serie = this.serie();
    if (!form || !serie) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/series`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: serie.title,
          director: serie.director,
          rating: form.rating,
          timesWatched: form.timesWatched,
          stoppedAtSeason: form.stoppedAtSeason,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-serie:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-serie:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  navigateToSeries() {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'series']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  getActorsLabel(actors: Serie['actors'] | undefined): string {
    if (!actors?.length) return '';
    return actors.map((actor) => actor.name).join(', ');
  }

  private async loadSerieFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const series = await getSeriesByUser(userId);
    const matched = series.find((serie) => {
      return this.toSlug(`${serie.title} ${serie.director}`) === slug;
    });

    if (!matched) {
      this.serie.set(null);
      this.serieForm.set(null);
      this.serieNotFound.set(true);
      return;
    }

    this.serie.set(matched);
    this.serieForm.set(this.toForm(matched));
    this.serieNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private toForm(serie: Serie): EditSerieForm {
    return {
      rating: serie.rating,
      timesWatched: serie.timesWatched,
      stoppedAtSeason: serie.stoppedAtSeason || 0,
    };
  }

  private toSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }
}
