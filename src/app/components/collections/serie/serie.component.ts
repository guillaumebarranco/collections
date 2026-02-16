import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Serie } from '../../../models/serie-model';
import { ReviewModalComponent } from '../../review-modal/review-modal.component';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../move-entity-review-modal/move-entity-review-modal.component';
import { Quizz, EntityType } from '../../../models/quizz-model';
import { SerieView } from '../../../containers/collections/series/series.utils';
import { EditSerieComponent } from '../../../containers/edit/edit-serie/edit-serie.component';
import { EditSerieSeasonsComponent } from '../../../containers/edit/edit-serie-seasons/edit-serie-seasons.component';
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { AuthService } from '../../../core/auth.service';
import { matchesQuizzEntityTitle } from '../../../utils/quizzs/quizzs.utils';
import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-serie',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
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
  @Input() quizzs: Quizz[] = [];
  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInWatchlist = false;
  @Input() recommendationBadge = '';
  @Input() isWatchlistView = false;
  @Input() selectedView: SerieView = 'finished';
  @Output() serieUpdated = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();
  @Output() addToWatchlist = new EventEmitter<Serie>();
  @Output() watchPriorityUpdated = new EventEmitter<{
    serie: Serie;
    priority: number;
  }>();
  @Output() wantToReWatch = new EventEmitter<Serie>();
  @Output() haveReWatched = new EventEmitter<Serie>();

  isBaseEntityView = isBaseEntityView();
  seasonsExpanded = signal(false);

  readonly canEdit = computed(() => {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const isAdminView =
      this.authService.isAdmin() && this.router.url.startsWith('/admin');
    return isAdminView || this.authService.canEdit(directId || parentId);
  });

  private getActiveUserId(): string {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || 'guillaume';
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
    return {
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
        userId: userId || 'guillaume',
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
        userId: userId || 'guillaume',
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
        quizz.entityType === EntityType.SERIE &&
        matchesQuizzEntityTitle(this.serie.title, quizz.entityTitle)
    );
  }

  openQuizzModal(): void {
    const entityQuizzs = this.getEntityQuizzs();
    if (entityQuizzs.length === 0) return;
    this.openQuizz.emit(entityQuizzs);
  }

  updateWatchPriority(priority: number): void {
    this.watchPriorityUpdated.emit({ serie: this.serie, priority });
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

      this.serieUpdated.emit();
    } catch (error) {
      console.warn(
        'Erreur réseau lors du passage de la série en « vus ».',
        error
      );
    }
  }
}
