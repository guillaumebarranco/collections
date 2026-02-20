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
import { ReviewModalComponent } from '../../review-modal/review-modal.component';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../move-entity-review-modal/move-entity-review-modal.component';
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { AuthService } from '../../../core/auth.service';
import { matchesQuizzEntityTitle } from '../../../utils/quizzs/quizzs.utils';
import { getApiBaseUrl, isBaseEntityView } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { MovieView } from '../../../containers/collections/movies/movies.utils';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
  ],
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
  @Input() isInWatchlist = false;
  @Input() selectedView: MovieView = 'watched';
  @Input() recommendationBadge = '';
  @Output() movieUpdated = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();
  @Output() wantToReWatch = new EventEmitter<Movie>();
  @Output() addToWatchlist = new EventEmitter<Movie>();
  @Output() hasReWatched = new EventEmitter<Movie>();
  @Output() watchPriorityUpdated = new EventEmitter<{
    movie: Movie;
    priority: number;
  }>();
  @Input() showTopFiveSelector = false;
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();
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
    return raw
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
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
    return params['id'] ?? DEFAULT_USER_ID;
  }

  openReviewModal(): void {
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.movie.title,
        rating: this.movie.rating ?? 0,
        ratingComment: this.movie.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  onTopFiveSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.topFiveRankChange.emit(
      value === '' ? null : Math.min(5, Math.max(1, parseInt(value, 10)))
    );
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
        userId: userId || DEFAULT_USER_ID,
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

  getWatchPriority(): 1 | 2 | 3 {
    const p = this.movie.watchPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  /** Vue groupée (acteurs, réalisateurs, sagas, pays) où les films "déjà vus" ne doivent pas afficher "Ajouter à ma watchlist". */
  private get isGroupedMovieView(): boolean {
    const v = this.selectedView;
    return v === 'actors' || v === 'directors' || v === 'sagas' || v === 'countries';
  }

  /** Afficher le bouton "Ajouter à ma watchlist" (masqué en vue groupée pour les films déjà vus). */
  get showAddToWatchlistButton(): boolean {
    if (this.isGroupedMovieView && !this.readOnly) return false;
    return true;
  }

  getEntityData(): EntityCardEntityData {
    return {
      rating: this.movie.rating ?? 0,
      hasRatingComment: !!this.movie.ratingComment,
      currentPriority: this.getWatchPriority(),
      entityType: EntityType.MOVIE,
      wantToReRead: !!this.movie.wantToSeeAgain,
    };
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

  addMovieFromWatchlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.movie.title },
      width: 'auto',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveMovieFromWatchlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveMovieFromWatchlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        movies: [this.movie],
        watchlist: false,
      };
      if (rating > 0 || ratingComment) {
        body['rating'] = rating;
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/movies/move-movie-from-watchlist-to-watched`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
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
