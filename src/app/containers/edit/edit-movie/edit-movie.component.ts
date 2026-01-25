import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Movie } from '../../../models/movie-model';
import { getMoviesByUser } from '../../../facades/movies/movies.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';

type EditMovieForm = {
  rating: number;
  timesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  seenAtCinema: boolean;
  owned: boolean;
};

type EditMovieEntityForm = {
  actors: string;
  coverUrl: string;
  releaseDate: string;
  length: number;
  genre: string;
};

type EditMovieDialogData = {
  movie: Movie;
  userId?: string;
  list?: Movie[];
  index?: number;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss'],
})
export class EditMovieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditMovieComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditMovieDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly movie = signal<Movie | null>(null);
  readonly movieForm = signal<EditMovieForm | null>(null);
  readonly movieEntityForm = signal<EditMovieEntityForm | null>(null);
  readonly movieNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly isAdmin = computed(() => this.authService.isAdmin());
  readonly hasDialogUpdates = signal<boolean>(false);
  readonly dialogList = signal<Movie[]>([]);
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

  readonly movieSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.movie) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadMovieFromSlug(params);
    });
  }

  updateField<K extends keyof EditMovieForm>(field: K, value: string | number) {
    const current = this.movieForm();
    if (!current) return;

    let nextValue: EditMovieForm[K] = value as EditMovieForm[K];
    if (field === 'rating' || field === 'timesWatched') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditMovieForm[K];
    }

    this.movieForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'seenAtCinema' | 'owned', checked: boolean) {
    const current = this.movieForm();
    if (!current) return;
    this.movieForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditMovieEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.movieEntityForm();
    if (!current) return;
    let nextValue: EditMovieEntityForm[K] = value as EditMovieEntityForm[K];
    if (field === 'length') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditMovieEntityForm[K];
    }
    this.movieEntityForm.set({
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

  async onSubmit(navigateAfterSave = false) {
    const form = this.movieForm();
    const movie = this.movie();
    if (!form || !movie) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: movie.title,
          director: movie.director,
          rating: form.rating,
          timesWatched: form.timesWatched,
          firstViewedDate: form.firstViewedDate,
          lastViewedDate: form.lastViewedDate,
          seenAtCinema: form.seenAtCinema,
          owned: form.owned,
          entity: this.isAdmin()
            ? this.toEntityPayload(this.movieEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-movie:error', payload);
        return;
      }

      if (this.dialogRef) {
        if (navigateAfterSave && this.canNavigateNext()) {
          this.hasDialogUpdates.set(true);
          this.navigateNext();
          return;
        }
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-movie:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const movie = this.movie();
    if (!movie) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce film de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/movies/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: movie.title,
          director: movie.director,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-movie:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToMovies();
    } catch (error) {
      console.error('edit-movie:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  navigateToMovies() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'movies']);
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

  getActorsLabel(actors: Movie['actors'] | undefined): string {
    if (!actors?.length) return '';
    return actors.map((actor) => actor.name).join(', ');
  }

  private async loadMovieFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const movies = await getMoviesByUser(userId);
    const matched = movies.find((movie) => {
      return this.toSlug(`${movie.title} ${movie.director}`) === slug;
    });

    if (!matched) {
      this.movie.set(null);
      this.movieForm.set(null);
      this.movieNotFound.set(true);
      return;
    }

    this.movie.set(matched);
    this.movieForm.set(this.toForm(matched));
    this.movieEntityForm.set(this.toEntityForm(matched));
    this.movieNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private toForm(movie: Movie): EditMovieForm {
    return {
      rating: movie.rating,
      timesWatched: movie.timesWatched,
      firstViewedDate: movie.firstViewedDate,
      lastViewedDate: movie.lastViewedDate,
      seenAtCinema: movie.seenAtCinema,
      owned: movie.owned,
    };
  }

  private toEntityForm(movie: Movie): EditMovieEntityForm {
    return {
      actors: (movie.actors || []).map((actor) => actor.name).join(', '),
      coverUrl: movie.coverUrl,
      releaseDate: movie.releaseDate,
      length: movie.length,
      genre: movie.genre,
    };
  }

  private toEntityPayload(form: EditMovieEntityForm | null) {
    if (!form) return undefined;
    return {
      actors: form.actors
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean),
      coverUrl: form.coverUrl,
      releaseDate: form.releaseDate,
      length: form.length,
      genre: form.genre,
    };
  }

  private canEditCurrentUser(): boolean {
    return this.authService.canEdit(this.getCurrentUserId());
  }

  private setupDialogNavigation(data: EditMovieDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.movie];
    const index = this.resolveDialogIndex(list, data.index, data.movie);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setMovie(list[index] ?? data.movie);
  }

  private resolveDialogIndex(
    list: Movie[],
    index: number | undefined,
    movie: Movie
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === movie.title && item.director === movie.director
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setMovie(list[nextIndex]);
  }

  private setMovie(movie: Movie): void {
    this.movie.set(movie);
    this.movieForm.set(this.toForm(movie));
    this.movieEntityForm.set(this.toEntityForm(movie));
    this.movieNotFound.set(false);
  }

  private toSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }
}
