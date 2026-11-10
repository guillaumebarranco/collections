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
import { Anime } from '../../../models/anime-model';
import { ReviewModalComponent } from '../../modals/review-modal/review-modal.component';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../modals/move-entity-review-modal/move-entity-review-modal.component';
import { EntityType } from '../../../models/quizz-model';
import { AnimeView } from '../../../containers/collections/animes/animes.utils';
import { EditAnimeComponent } from '../../../containers/edit/edit-anime/edit-anime.component';
import { EditAnimeSeasonsComponent } from '../../../containers/edit/edit-anime-seasons/edit-anime-seasons.component';
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
  getAnimeLastViewedSeasonInfo,
  isAnimeWatchlistNotStarted,
  animeShowsNewSeasonStartedButton,
  type AnimeLastViewedSeasonInfo,
} from '../../../utils/animes.utils';
import { MovieCommunityWatchersModalComponent } from '../../modals/movie-community-watchers-modal/movie-community-watchers-modal.component';
import { PersonBadgeComponent } from '../../shared/person-badge/person-badge.component';
import { PersonNamesPipe } from '../../shared/person-badge/person-names.pipe';
import { EntityQuotesComponent } from '../../shared/entity-quotes/entity-quotes.component';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    CanEditDirective,
    PersonBadgeComponent,
    PersonNamesPipe,
    EntityQuotesComponent,
  ],
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  @Input() anime!: Anime;
  @Input() list: Anime[] = [];
  @Input() index = -1;

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInWatchlist = false;
  @Input() recommendationBadge = '';
  @Input() isWatchlistView = false;
  @Input() selectedView: AnimeView = 'finished';
  @Input() showAddToMyWatchlist = false;
  @Input() canAddToMyWatchlist = false;
  @Input() canAddAsWatched = false;
  /** Afficher l’action « nouvelle saison » (vues / sagas / pays, pas watchlist ni reco). */
  @Input() showNewSeasonStartedAction = false;
  @Output() animeUpdated = new EventEmitter<void>();
  /** Après watchlist → vu (API OK). */
  @Output() watchlistMarkedAsWatched = new EventEmitter<Anime>();
  /** Watchlist : marqué « en cours » (watching par saison), API OK. */
  @Output() watchlistStartedWatching = new EventEmitter<Anime>();
  /** Fichier vus : saison N+1 en watching, API OK. */
  @Output() finishedAnimeNewSeasonStarted = new EventEmitter<Anime>();

  @Output() addToWatchlist = new EventEmitter<Anime>();
  @Output() addToMyWatchlist = new EventEmitter<Anime>();
  @Output() addToMyWatched = new EventEmitter<Anime>();
  @Output() watchPriorityUpdated = new EventEmitter<{
    anime: Anime;
    priority: number;
  }>();
  @Output() wantToReWatch = new EventEmitter<Anime>();
  @Output() haveReWatched = new EventEmitter<Anime>();
  @Input() showTopFiveSelector = false;
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();
  /** Affiche le bouton communauté (animés vues). */
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
        workTitle: this.anime.title,
        currentUserId,
        kind: 'anime' as const,
        identity: { title: this.anime.title, director: this.anime.director },
      },
      width: 'min(420px, 95vw)',
      maxWidth: '95vw',
    });
  }

  openReviewModal(): void {
    const seasons = this.anime.seasons ?? [];
    const total = seasons.reduce((s, se) => s + (se.seasonRating ?? 0), 0);
    const avgRating =
      seasons.length > 0 ? Math.round((total / seasons.length) * 2) / 2 : 0;
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.anime.title,
        rating: avgRating,
        ratingComment: this.anime.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  getWatchPriority(): 1 | 2 | 3 {
    const p = this.anime.watchPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    const seasons = this.anime.seasons ?? [];
    const alreadySeenRead =
      seasons.length > 0 &&
      seasons.some((s) => (s.seasonTimesWatched ?? 0) >= 1);
    return {
      alreadySeenRead,
      alreadyInList: this.isInWatchlist,
      rating: 0,
      hasRatingComment: !!this.anime.ratingComment,
      currentPriority: this.getWatchPriority(),
      entityType: EntityType.ANIME,
      wantToReRead: !!this.anime.wantToWatchAgain,
    };
  }

  navigateToEdit(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const list = this.list && this.list.length > 0 ? this.list : [this.anime];
    const index = this.index >= 0 && this.index < list.length ? this.index : 0;
    const dialogRef = this.dialog.open(EditAnimeComponent, {
      data: {
        anime: this.anime,
        userId: userId || DEFAULT_USER_ID,
        list,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.animeUpdated.emit();
      }
    });
  }

  openSeasonsDialog(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const dialogRef = this.dialog.open(EditAnimeSeasonsComponent, {
      data: {
        anime: this.anime,
        userId: userId || DEFAULT_USER_ID,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.animeUpdated.emit();
      }
    });
  }

  toggleSeasonsInline(): void {
    this.seasonsExpanded.set(!this.seasonsExpanded());
  }

  getLastViewedSeasonInfo(): AnimeLastViewedSeasonInfo | null {
    return getAnimeLastViewedSeasonInfo(this.anime);
  }

  getAnimeSeasons() {
    if (this.anime.seasons && this.anime.seasons.length > 0) {
      return this.anime.seasons;
    }
    const total = this.anime.seasonsData?.length ?? 0;
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

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  updateWatchPriority(priority: number): void {
    this.watchPriorityUpdated.emit({ anime: this.anime, priority });
  }

  onStartedWatchingClick(): void {
    this.watchlistStartedWatching.emit(this.anime);
  }

  watchlistAnimeNotStarted(): boolean {
    return isAnimeWatchlistNotStarted(this.anime);
  }

  showMarkNewSeasonButton(): boolean {
    return (
      this.showNewSeasonStartedAction &&
      animeShowsNewSeasonStartedButton(this.anime)
    );
  }

  onStartedNewSeasonClick(): void {
    this.finishedAnimeNewSeasonStarted.emit(this.anime);
  }

  addAnimeFromWatchlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.anime.title },
      width: 'auto',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveAnimeFromWatchlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveAnimeFromWatchlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        animes: [this.anime],
        watchlist: false,
      };
      if (ratingComment) {
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/animes/move-anime-from-watchlist-to-watched`,
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
          "Échec du passage de l'animé en « vus » :",
          payload?.error || response.statusText
        );
        return;
      }

      this.watchlistMarkedAsWatched.emit(this.anime);
    } catch (error) {
      console.warn(
        "Erreur réseau lors du passage de l'animé en « vus ».",
        error
      );
    }
  }
}
