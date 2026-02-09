import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Movie } from '../../../models/movie-model';
import { Quizz, EntityType } from '../../../models/quizz-model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditMovieComponent } from '../../../containers/edit/edit-movie/edit-movie.component';
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import { AuthService } from '../../../core/auth.service';
import { matchesQuizzEntityTitle } from '../../../utils/quizzs/quizzs.utils';
import { getApiBaseUrl, isBaseEntityView } from '../../../core/config';
import { MovieView } from '../../../containers/collections/movies/movies.utils';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, MatDialogModule, EntityCardComponent],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  @Input() movie!: Movie;
  @Input() list: Movie[] = [];
  @Input() index = -1;
  @Input() quizzs: Quizz[] = [];
  @Input() readOnly = false;
  @Input() showToReWatchButton = false;
  @Input() showAddToWatchlistButton = false;
  @Input() isInWatchlist = false;
  @Input() selectedView: MovieView = 'watched';
  @Input() recommendationBadge = '';
  @Output() movieUpdated = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();
  @Output() wantToReWatch = new EventEmitter<Movie>();
  @Output() addToWatchlist = new EventEmitter<Movie>();
  @Output() hasReWatched = new EventEmitter<Movie>();
  @Output() watchPriorityUpdated = new EventEmitter<{ movie: Movie; priority: number }>();
  isWatchList = input<boolean>(false);

  recommendationView = input<boolean>(false);
  recommendationText = input<string>('');

  isBaseEntityView = isBaseEntityView();

  /** Afficher tous les acteurs (au-delà des 3 premiers). */
  actorsExpanded = signal<boolean>(false);

  /** Acteurs à afficher : 3 premiers ou tous si déplié. */
  visibleActors = computed(() => {
    const list = this.movie?.actors ?? [];
    return this.actorsExpanded() ? list : list.slice(0, 3);
  });

  toggleActorsExpanded(): void {
    this.actorsExpanded.update((v) => !v);
  }

  /** Réalisateurs : chaîne splittée par virgules (model = string). */
  directorsList = computed(() => {
    const raw = this.movie?.director?.trim();
    if (!raw) return [];
    return raw.split(',').map((d) => d.trim()).filter(Boolean);
  });

  /** Afficher tous les réalisateurs (au-delà des 2 premiers). */
  directorsExpanded = signal<boolean>(false);

  /** Réalisateurs à afficher : 2 premiers ou tous si déplié. */
  visibleDirectors = computed(() => {
    const list = this.directorsList();
    return this.directorsExpanded() ? list : list.slice(0, 2);
  });

  toggleDirectorsExpanded(): void {
    this.directorsExpanded.update((v) => !v);
  }

  readonly canEdit = computed(() => {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const isAdminView =
      this.authService.isAdmin() && this.router.url.startsWith('/admin');
    return isAdminView || this.authService.canEdit(directId || parentId);
  });

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  navigateToEdit(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const list = this.list && this.list.length > 0 ? this.list : [this.movie];
    const index = this.index >= 0 && this.index < list.length ? this.index : 0;
    const dialogRef = this.dialog.open(EditMovieComponent, {
      data: {
        movie: this.movie,
        userId: userId || 'guillaume',
        list,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.movieUpdated.emit();
      }
    });
  }

  getRatingStars(rating: number): StarInfo[] {
    const stars: StarInfo[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push({ type: 'full', value: i });
      } else if (rating >= i - 0.5) {
        stars.push({ type: 'half', value: i });
      } else {
        stars.push({ type: 'empty', value: i });
      }
    }
    return stars;
  }

  getEntityQuizzs(): Quizz[] {
    return this.quizzs.filter(
      (quizz) =>
        quizz.entityType === EntityType.MOVIE &&
        matchesQuizzEntityTitle(this.movie.title, quizz.entityTitle)
    );
  }

  openQuizzModal(): void {
    const entityQuizzs = this.getEntityQuizzs();
    if (entityQuizzs.length === 0) return;
    this.openQuizz.emit(entityQuizzs);
  }

  updateWatchPriority(priority: number): void {
    this.watchPriorityUpdated.emit({ movie: this.movie, priority });
  }

  async addMovieFromWatchlist(): Promise<void> {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/movies/move-movie-from-watchlist-to-watched`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.getActiveUserId(),
            movies: [this.movie],
            watchlist: false,
          }),
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des films :",
          payload?.error || response.statusText
        );
        return;
      }

      this.movieUpdated.emit();
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des films.", error);
    }
  }
}
