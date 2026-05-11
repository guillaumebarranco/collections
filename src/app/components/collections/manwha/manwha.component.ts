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
import { AuthService } from '../../../core/auth.service';
import { EntityCardComponent } from '../../entity/entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity/entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { ReviewModalComponent } from '../../modals/review-modal/review-modal.component';
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { Manwha } from '../../../models/manwha-model';
import { EntityType } from '../../../models/quizz-model';

import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { ManwhaView } from '../../../containers/collections/manwhas/manwhas.utils';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../modals/move-entity-review-modal/move-entity-review-modal.component';
import { MovieCommunityWatchersModalComponent } from '../../modals/movie-community-watchers-modal/movie-community-watchers-modal.component';

@Component({
  selector: 'app-manwha',
  standalone: true,
  imports: [
    CommonModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    MatDialogModule,
    CanEditDirective,
  ],
  templateUrl: './manwha.component.html',
  styleUrls: ['./manwha.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManwhaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  @Input() manwha!: Manwha;

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() isReadlistView = false;
  @Input() selectedView: ManwhaView = 'read';
  @Input() showAddToMyReadlist = false;
  @Input() canAddToMyReadlist = false;
  @Input() canAddAsRead = false;
  @Output() editRequested = new EventEmitter<void>();

  @Output() addToReadlist = new EventEmitter<Manwha>();
  @Output() addToMyReadlist = new EventEmitter<Manwha>();
  @Output() addToMyRead = new EventEmitter<Manwha>();
  @Output() readPriorityUpdated = new EventEmitter<{
    manwha: Manwha;
    priority: number;
  }>();
  @Output() wantToReRead = new EventEmitter<Manwha>();
  @Output() haveReRead = new EventEmitter<Manwha>();
  @Output() readlistStartedReading = new EventEmitter<Manwha>();
  @Output() readlistMarkedAsRead = new EventEmitter<Manwha>();
  @Input() showTopFiveSelector = false;
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();
  @Input() showCommunityWatchersButton = false;

  isBaseEntityView = isBaseEntityView();

  requestEdit(): void {
    this.editRequested.emit();
  }

  onStartedReadingClick(): void {
    this.readlistStartedReading.emit(this.manwha);
  }

  onTopFiveSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.topFiveRankChange.emit(
      value === '' ? null : Math.min(5, Math.max(1, parseInt(value, 10)))
    );
  }

  getReadPriority(): 1 | 2 | 3 {
    const p = this.manwha.readPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    return {
      alreadySeenRead: (this.manwha.readTimes ?? 0) >= 1,
      alreadyInList: this.isInReadlist,
      rating: this.manwha.rating ?? 0,
      hasRatingComment: !!this.manwha.ratingComment,
      currentPriority: this.getReadPriority(),
      entityType: EntityType.MANWHA,
      wantToReRead: !!this.manwha.wantToReadAgain,
    };
  }

  updateReadPriority(priority: number): void {
    this.readPriorityUpdated.emit({ manwha: this.manwha, priority });
  }

  openCommunityWatchersModal(): void {
    const authId = this.authService.getAuthenticatedUserId();
    const profileId = this.getActiveUserId();
    const currentUserId = (authId ?? profileId).toLowerCase();
    this.dialog.open(MovieCommunityWatchersModalComponent, {
      data: {
        workTitle: this.manwha.title,
        currentUserId,
        kind: 'manwha' as const,
        identity: { title: this.manwha.title, author: this.manwha.author },
      },
      width: 'min(420px, 95vw)',
      maxWidth: '95vw',
    });
  }

  getActiveUserId(): string {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  openReviewModal(): void {
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.manwha.title,
        rating: this.manwha.rating ?? 0,
        ratingComment: this.manwha.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  addManwhaFromReadlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.manwha.title },
      width: 'auto',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveManwhaFromReadlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveManwhaFromReadlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        manwhas: [this.manwha],
      };
      if (rating > 0 || ratingComment) {
        body['rating'] = rating;
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/manwhas/move-manwha-from-readlist-to-read`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec du passage du manwha en lu :',
          payload?.error || response.statusText
        );
        return;
      }
      this.readlistMarkedAsRead.emit(this.manwha);
    } catch (error) {
      console.warn('Erreur réseau lors du passage du manwha en lu.', error);
    }
  }

  getTopFiveLabel(manwha: Manwha) {
    return `top5-${manwha.title}-${manwha.author}`;
  }
}
