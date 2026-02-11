import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Game } from '../../../models/game-model';
import { Quizz, EntityType } from '../../../models/quizz-model';
import { EditGameComponent } from '../../../containers/edit/edit-game/edit-game.component';
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import { AuthService } from '../../../core/auth.service';
import { getGameTimePlayed } from '../../../utils/games.utils';
import { matchesQuizzEntityTitle } from '../../../utils/quizzs/quizzs.utils';
import { isBaseEntityView } from '../../../core/config';
import { GameView } from '../../../containers/collections/games/games.utils';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatDialogModule, EntityCardComponent],
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
  @Input() quizzs: Quizz[] = [];
  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() showAddToGamelistButton = false;
  @Input() isInGamelist = false;
  @Input() recommendationBadge = '';
  @Input() isGamelistView = false;
  @Input() showToRePlayButton = false;
  @Input() selectedView: GameView = 'finished';
  @Output() gameUpdated = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();
  @Output() addToGamelist = new EventEmitter<Game>();
  @Output() gamelistPriorityUpdated = new EventEmitter<{
    game: Game;
    priority: number;
  }>();
  @Output() wantToRePlay = new EventEmitter<Game>();
  @Output() haveRePlayed = new EventEmitter<Game>();

  isBaseEntityView = isBaseEntityView();

  readonly canEdit = computed(() => {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const isAdminView =
      this.authService.isAdmin() && this.router.url.startsWith('/admin');
    return isAdminView || this.authService.canEdit(directId || parentId);
  });

  navigateToEdit(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const list = this.list && this.list.length > 0 ? this.list : [this.game];
    const index = this.index >= 0 && this.index < list.length ? this.index : 0;
    const dialogRef = this.dialog.open(EditGameComponent, {
      data: {
        game: this.game,
        userId: userId || 'guillaume',
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

  getGameTimePlayed(game: Game): number {
    const data = getGameTimePlayed({
      sessions: game.sessions,
      averageTimeToFinish: game.averageTimeToFinish,
      platineTime: game.platineTime,
      averageTimeToHundredPercent: game.averageTimeToHundredPercent,
    });

    console.log(game.title, data);

    return data;
  }

  getEntityQuizzs(): Quizz[] {
    return this.quizzs.filter(
      (quizz) =>
        quizz.entityType === EntityType.GAME &&
        matchesQuizzEntityTitle(this.game.title, quizz.entityTitle)
    );
  }

  openQuizzModal(): void {
    const entityQuizzs = this.getEntityQuizzs();
    if (entityQuizzs.length === 0) return;
    this.openQuizz.emit(entityQuizzs);
  }

  updateGamelistPriority(priority: number): void {
    this.gamelistPriorityUpdated.emit({ game: this.game, priority });
  }
}
