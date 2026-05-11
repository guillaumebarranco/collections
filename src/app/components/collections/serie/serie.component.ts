import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Serie } from '../../../models/serie-model';
import { ReviewModalComponent } from '../../modals/review-modal/review-modal.component';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../modals/move-entity-review-modal/move-entity-review-modal.component';
import { EntityType } from '../../../models/quizz-model';
import { SerieView } from '../../../containers/collections/series/series.utils';
import { EditSerieComponent } from '../../../containers/edit/edit-serie/edit-serie.component';
import { EditSerieSeasonsComponent } from '../../../containers/edit/edit-serie-seasons/edit-serie-seasons.component';
import { EntityCardComponent } from '../../entity/entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity/entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { AuthService } from '../../../core/auth.service';
import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { StarInfo } from '../../../models/various-model';
import { getRatingStars } from '../../../utils/constants';
import {
  isSerieWatchlistNotStarted,
  serieShowsNewSeasonStartedButton,
} from '../../../utils/series.utils';
import { MovieCommunityWatchersModalComponent } from '../../modals/movie-community-watchers-modal/movie-community-watchers-modal.component';

@Component({
  selector: 'app-serie',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    CanEditDirective,
  ],
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SerieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  @Input() serie!: Serie;
  @Input() list: Serie[] = [];
  @Input() index = -1;

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInWatchlist = false;
  @Input() recommendationBadge = '';
  @Input() isWatchlistView = false;
  @Input() selectedView: SerieView = 'finished';
  @Input() showAddToMyWatchlist = false;
  @Input() canAddToMyWatchlist = false;
  @Input() canAddAsWatched = false;
  /** Afficher l’action « nouvelle saison » (vues / sagas / pays, pas watchlist ni reco). */
  @Input() showNewSeasonStartedAction = false;
  @Output() serieUpdated = new EventEmitter<void>();
  /** Après watchlist → vu (API OK). */
  @Output() watchlistMarkedAsWatched = new EventEmitter<Serie>();
  /** Watchlist : marqué « en cours » (seasonTimesWatched 0.5 par saison), API OK. */
  @Output() watchlistStartedWatching = new EventEmitter<Serie>();
  /** Fichier vus : saison N+1 passée à 0.5, API OK. */
  @Output() finishedSerieNewSeasonStarted = new EventEmitter<Serie>();

  @Output() addToWatchlist = new EventEmitter<Serie>();
  @Output() addToMyWatchlist = new EventEmitter<Serie>();
  @Output() addToMyWatched = new EventEmitter<Serie>();
  @Output() watchPriorityUpdated = new EventEmitter<{
    serie: Serie;
    priority: number;
  }>();
  @Output() wantToReWatch = new EventEmitter<Serie>();
  @Output() haveReWatched = new EventEmitter<Serie>();
  @Input() showTopFiveSelector = false;
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();
  /** Affiche le bouton communauté (séries vues). */
  @Input() showCommunityWatchersButton = false;

  isBaseEntityView = isBaseEntityView();
  seasonsExpanded = signal(false);

  getActiveUserId(): string {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  onTopFiveSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.topFiveRankChange.emit(
      value === '' ? null : Math.min(5, Math.max(1, parseInt(value, 10)))
    );
  }

  openCommunityWatchersModal(): void {
    const authId = this.authService.getAuthenticatedUserId();
    const profileId = this.getActiveUserId();
    const currentUserId = (authId ?? profileId).toLowerCase();
    this.dialog.open(MovieCommunityWatchersModalComponent, {
      data: {
        workTitle: this.serie.title,
        currentUserId,
        kind: 'serie' as const,
        identity: { title: this.serie.title, director: this.serie.director },
      },
      width: 'min(420px, 95vw)',
      maxWidth: '95vw',
    });
  }

  openReviewModal(): void {
    const seasons = this.serie.seasons ?? [];
    const total = seasons.reduce((s, se) => s + (se.seasonRating ?? 0), 0);
    const avgRating =
      seasons.length > 0 ? Math.round((total / seasons.length) * 2) / 2 : 0;
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.serie.title,
        rating: avgRating,
        ratingComment: this.serie.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  getWatchPriority(): 1 | 2 | 3 {
    const p = this.serie.watchPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    const seasons = this.serie.seasons ?? [];
    const alreadySeenRead =
      seasons.length > 0 &&
      seasons.some((s) => (s.seasonTimesWatched ?? 0) >= 1);
    return {
      alreadySeenRead,
      alreadyInList: this.isInWatchlist,
      rating: 0,
      hasRatingComment: !!this.serie.ratingComment,
      currentPriority: this.getWatchPriority(),
      entityType: EntityType.SERIE,
      wantToReRead: !!this.serie.wantToWatchAgain,
    };
  }

  navigateToEdit(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const list = this.list && this.list.length > 0 ? this.list : [this.serie];
    const index = this.index >= 0 && this.index < list.length ? this.index : 0;
    const dialogRef = this.dialog.open(EditSerieComponent, {
      data: {
        serie: this.serie,
        userId: userId || DEFAULT_USER_ID,
        list,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.serieUpdated.emit();
      }
    });
  }

  openSeasonsDialog(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const dialogRef = this.dialog.open(EditSerieSeasonsComponent, {
      data: {
        serie: this.serie,
        userId: userId || DEFAULT_USER_ID,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.serieUpdated.emit();
      }
    });
  }

  toggleSeasonsInline(): void {
    this.seasonsExpanded.set(!this.seasonsExpanded());
  }

  getSerieSeasons() {
    if (this.serie.seasons && this.serie.seasons.length > 0) {
      return this.serie.seasons;
    }
    const total = this.serie.seasonsData?.length ?? 0;
    return Array.from({ length: total }, (_, index) => ({
      seasonNumber: index + 1,
      seasonRating: 0,
      seasonTimesWatched: 0,
    }));
  }

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  updateWatchPriority(priority: number): void {
    this.watchPriorityUpdated.emit({ serie: this.serie, priority });
  }

  onStartedWatchingClick(): void {
    this.watchlistStartedWatching.emit(this.serie);
  }

  watchlistSerieNotStarted(): boolean {
    return isSerieWatchlistNotStarted(this.serie);
  }

  showMarkNewSeasonButton(): boolean {
    return (
      this.showNewSeasonStartedAction &&
      serieShowsNewSeasonStartedButton(this.serie)
    );
  }

  onStartedNewSeasonClick(): void {
    this.finishedSerieNewSeasonStarted.emit(this.serie);
  }

  addSerieFromWatchlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.serie.title },
      width: 'auto',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveSerieFromWatchlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveSerieFromWatchlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        series: [this.serie],
        watchlist: false,
      };
      if (ratingComment) {
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/series/move-serie-from-watchlist-to-watched`,
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
          'Échec du passage de la série en « vus » :',
          payload?.error || response.statusText
        );
        return;
      }

      this.watchlistMarkedAsWatched.emit(this.serie);
    } catch (error) {
      console.warn(
        'Erreur réseau lors du passage de la série en « vus ».',
        error
      );
    }
  }
}
