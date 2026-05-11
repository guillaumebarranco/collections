import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Game } from '../../../models/game-model';
import { ReviewModalComponent } from '../../modals/review-modal/review-modal.component';
import { EntityType } from '../../../models/quizz-model';
import { EditGameComponent } from '../../../containers/edit/edit-game/edit-game.component';
import { EntityCardComponent } from '../../entity/entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity/entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { AuthService } from '../../../core/auth.service';
import { getGameTimePlayed } from '../../../utils/games.utils';

import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { GameView } from '../../../containers/collections/games/games.utils';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../modals/move-entity-review-modal/move-entity-review-modal.component';
import { MovieCommunityWatchersModalComponent } from '../../modals/movie-community-watchers-modal/movie-community-watchers-modal.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    CanEditDirective,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  @Input() game!: Game;
  @Input() list: Game[] = [];
  @Input() index = -1;

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInGamelist = false;
  @Input() recommendationBadge = '';
  @Input() isGamelistView = false;
  @Input() selectedView: GameView = 'played';
  @Input() showAddToMyGamelist = false;
  @Input() canAddToMyGamelist = false;
  @Input() canAddAsPlayed = false;
  @Output() gameUpdated = new EventEmitter<void>();
  /** Après gamelist → joué (API OK). */
  @Output() gamelistMarkedAsPlayed = new EventEmitter<Game>();

  @Output() addToGamelist = new EventEmitter<Game>();
  @Output() addToMyGamelist = new EventEmitter<Game>();
  @Output() addToMyPlayed = new EventEmitter<Game>();
  @Output() gamelistPriorityUpdated = new EventEmitter<{
    game: Game;
    priority: number;
  }>();
  @Output() wantToRePlay = new EventEmitter<Game>();
  @Output() haveRePlayed = new EventEmitter<Game>();
  @Input() showTopFiveSelector = false;
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();
  /** Affiche le bouton communauté (jeux joués). */
  @Input() showCommunityWatchersButton = false;

  isBaseEntityView = isBaseEntityView();

  getActiveUserId(): string {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  openCommunityWatchersModal(): void {
    const authId = this.authService.getAuthenticatedUserId();
    const profileId = this.getActiveUserId();
    const currentUserId = (authId ?? profileId).toLowerCase();
    this.dialog.open(MovieCommunityWatchersModalComponent, {
      data: {
        workTitle: this.game.title,
        currentUserId,
        kind: 'game' as const,
        identity: { title: this.game.title, editor: this.game.editor },
      },
      width: 'min(420px, 95vw)',
      maxWidth: '95vw',
    });
  }

  openReviewModal(): void {
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.game.title,
        rating: this.game.rating ?? 0,
        ratingComment: this.game.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  navigateToEdit(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const list = this.list && this.list.length > 0 ? this.list : [this.game];
    const index = this.index >= 0 && this.index < list.length ? this.index : 0;
    const dialogRef = this.dialog.open(EditGameComponent, {
      data: {
        game: this.game,
        userId: userId || DEFAULT_USER_ID,
        list,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.gameUpdated.emit();
      }
    });
  }

  getGamelistPriority(): 1 | 2 | 3 {
    const p = this.game.gamelistPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  onTopFiveSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.topFiveRankChange.emit(
      value === '' ? null : Math.min(5, Math.max(1, parseInt(value, 10)))
    );
  }

  getEntityData(): EntityCardEntityData {
    return {
      alreadySeenRead: !!(this.game.sessions && this.game.sessions.length > 0),
      alreadyInList: this.isInGamelist,
      rating: this.game.rating ?? 0,
      hasRatingComment: !!this.game.ratingComment,
      currentPriority: this.getGamelistPriority(),
      entityType: EntityType.GAME,
      wantToReRead: !!this.game.wantToPlayAgain,
    };
  }

  getGameTimePlayed(game: Game): number {
    const data = getGameTimePlayed({
      sessions: game.sessions,
      averageTimeToFinish: game.averageTimeToFinish,
      platineTime: game.platineTime,
      averageTimeToHundredPercent: game.averageTimeToHundredPercent,
    });

    return data;
  }

  updateGamelistPriority(priority: number): void {
    this.gamelistPriorityUpdated.emit({ game: this.game, priority });
  }

  addGameFromGamelist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.game.title },
      width: 'auto',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveGameFromGamelistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveGameFromGamelistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        games: [this.game],
      };
      if (rating > 0 || ratingComment) {
        body['rating'] = rating;
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/games/move-game-from-gamelist-to-played`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec du passage du jeu en joué :',
          payload?.error || response.statusText
        );
        return;
      }
      this.gamelistMarkedAsPlayed.emit(this.game);
    } catch (error) {
      console.warn('Erreur réseau lors du passage du jeu en joué.', error);
    }
  }

  getTopFiveLabel(game: Game) {
    return `top5-${game.title}-${game.editor}`;
  }
}
