import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import {
  BaseSerieSeasonData,
  Serie,
  UserSerieSeason,
} from '../../../models/serie-model';
import { getSeriesByUser } from '../../../facades/series/series.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';

type EditSerieForm = {
  seasons: UserSerieSeason[];
  owned: boolean;
};

type EditSerieEntityForm = {
  actors: string;
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  genre: string;
  seasonsData: BaseSerieSeasonData[];
};

type EditSerieDialogData = {
  serie: Serie;
  userId?: string;
  list?: Serie[];
  index?: number;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-serie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-serie.component.html',
  styleUrls: ['./edit-serie.component.scss'],
})
export class EditSerieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditSerieComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditSerieDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly serie = signal<Serie | null>(null);
  readonly serieForm = signal<EditSerieForm | null>(null);
  readonly serieEntityForm = signal<EditSerieEntityForm | null>(null);
  readonly serieNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly isAdmin = computed(() => this.authService.isAdmin());
  readonly dialogList = signal<Serie[]>([]);
  readonly dialogIndex = signal<number>(-1);
  readonly hasDialogNavigation = computed(() => {
    return (
      this.isDialogMode() &&
      this.dialogList().length > 1 &&
      this.dialogIndex() >= 0
    );
  });
  readonly canNavigatePrevious = computed(() => {
    return this.hasDialogNavigation() && this.dialogIndex() > 0;
  });
  readonly canNavigateNext = computed(() => {
    return (
      this.hasDialogNavigation() &&
      this.dialogIndex() < this.dialogList().length - 1
    );
  });
  readonly dialogPositionLabel = computed(() => {
    if (!this.hasDialogNavigation()) return '';
    return `${this.dialogIndex() + 1}/${this.dialogList().length}`;
  });

  readonly serieSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.serie) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadSerieFromSlug(params);
    });
  }

  async onSubmit() {
    const form = this.serieForm();
    const serie = this.serie();
    if (!form || !serie) return;
    if (!this.canEditCurrentUser()) return;

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
          seasons: form.seasons,
          owned: form.owned,
          entity: this.isAdmin()
            ? this.toEntityPayload(this.serieEntityForm())
            : undefined,
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

  async onDelete() {
    const serie = this.serie();
    if (!serie) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer cette série de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/series/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: serie.title,
          director: serie.director,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-serie:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToSeries();
    } catch (error) {
      console.error('edit-serie:delete:error', error);
    } finally {
      this.isDeleting.set(false);
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

  navigatePrevious(): void {
    this.navigateToOffset(-1);
  }

  navigateNext(): void {
    this.navigateToOffset(1);
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
    this.serieEntityForm.set(this.toEntityForm(matched));
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
      seasons: this.buildSeasons(serie),
      owned: serie.owned,
    };
  }

  private toEntityForm(serie: Serie): EditSerieEntityForm {
    return {
      actors: (serie.actors || []).map((actor) => actor.name).join(', '),
      coverUrl: serie.coverUrl,
      releaseDate: serie.releaseDate,
      endDate: serie.endDate,
      genre: serie.genre,
      seasonsData: serie.seasonsData || [],
    };
  }

  private toEntityPayload(form: EditSerieEntityForm | null) {
    if (!form) return undefined;
    return {
      actors: form.actors
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean),
      coverUrl: form.coverUrl,
      releaseDate: form.releaseDate,
      endDate: form.endDate,
      genre: form.genre,
      seasonsData: form.seasonsData,
    };
  }

  updateCheckbox(field: 'owned', checked: boolean) {
    const current = this.serieForm();
    if (!current) return;
    this.serieForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditSerieEntityForm>(
    field: K,
    value: string
  ) {
    const current = this.serieEntityForm();
    if (!current) return;
    this.serieEntityForm.set({
      ...current,
      [field]: value,
    });
  }

  updateSeasonDataField(
    seasonNumber: number,
    field: 'nbEpisodes' | 'totalLength',
    value: string | number
  ) {
    const current = this.serieEntityForm();
    if (!current) return;
    const nextValue = Number(value);
    const normalizedValue = Number.isNaN(nextValue) ? 0 : nextValue;
    const nextSeasons = current.seasonsData.map((season) =>
      season.seasonNumber === seasonNumber
        ? {
            ...season,
            [field]: normalizedValue,
          }
        : season
    );
    this.serieEntityForm.set({
      ...current,
      seasonsData: nextSeasons,
    });
  }

  updateSeasonField(
    seasonNumber: number,
    field: 'seasonRating' | 'seasonTimesWatched',
    value: string | number
  ) {
    const current = this.serieForm();
    if (!current) return;

    const nextValue = Number(value);
    const normalizedValue = Number.isNaN(nextValue) ? 0 : nextValue;
    const nextSeasons = current.seasons.map((season) =>
      season.seasonNumber === seasonNumber
        ? {
            ...season,
            [field]: normalizedValue,
          }
        : season
    );

    this.serieForm.set({
      ...current,
      seasons: nextSeasons,
    });
  }

  setRatingFromClick(seasonNumber: number, star: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    const half = target.clientWidth / 2;
    const nextValue = event.offsetX < half ? star - 0.5 : star;
    this.updateSeasonField(seasonNumber, 'seasonRating', Math.max(0, nextValue));
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

  private buildSeasons(serie: Serie): UserSerieSeason[] {
    if (serie.seasons && serie.seasons.length > 0) {
      return serie.seasons;
    }
    const total = serie.seasonsData?.length ?? 0;
    return Array.from({ length: total }, (_, index) => ({
      seasonNumber: index + 1,
      seasonRating: 0,
      seasonTimesWatched: 0,
    }));
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

  private canEditCurrentUser(): boolean {
    return this.authService.canEdit(this.getCurrentUserId());
  }

  private setupDialogNavigation(data: EditSerieDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.serie];
    const index = this.resolveDialogIndex(list, data.index, data.serie);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setSerie(list[index] ?? data.serie);
  }

  private resolveDialogIndex(
    list: Serie[],
    index: number | undefined,
    serie: Serie
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === serie.title && item.director === serie.director
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setSerie(list[nextIndex]);
  }

  private setSerie(serie: Serie): void {
    this.serie.set(serie);
    this.serieForm.set(this.toForm(serie));
    this.serieEntityForm.set(this.toEntityForm(serie));
    this.serieNotFound.set(false);
  }
}
