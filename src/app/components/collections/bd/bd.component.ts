import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { ReviewModalComponent } from '../../review-modal/review-modal.component';
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { Bd } from '../../../models/bd-model';
import { EntityType } from '../../../models/quizz-model';

import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { BdView } from '../../../containers/collections/bds/bds.utils';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../move-entity-review-modal/move-entity-review-modal.component';
import { DEFAULT_USER_ID } from '../../../utils/constants';

@Component({
  selector: 'app-bd',
  standalone: true,
  imports: [
    CommonModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    MatDialogModule,
    CanEditDirective,
  ],
  templateUrl: './bd.component.html',
  styleUrls: ['./bd.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BdComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  @Input() bd!: Bd;

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() isReadlistView = false;
  @Input() selectedView: BdView = 'read';
  @Output() editRequested = new EventEmitter<void>();

  @Output() addToReadlist = new EventEmitter<Bd>();
  @Output() readPriorityUpdated = new EventEmitter<{
    bd: Bd;
    priority: number;
  }>();
  @Output() wantToReRead = new EventEmitter<Bd>();
  @Output() haveReRead = new EventEmitter<Bd>();
  @Output() bdUpdated = new EventEmitter<void>();
  @Input() showTopFiveSelector = false;
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();

  isBaseEntityView = isBaseEntityView();

  requestEdit(): void {
    this.editRequested.emit();
  }

  onTopFiveSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.topFiveRankChange.emit(
      value === '' ? null : Math.min(5, Math.max(1, parseInt(value, 10)))
    );
  }

  getReadPriority(): 1 | 2 | 3 {
    const p = this.bd.readPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    return {
      alreadySeenRead: !!(this.bd.readTimes && this.bd.readTimes > 0),
      alreadyInList: this.isInReadlist,
      rating: this.bd.rating ?? 0,
      hasRatingComment: !!this.bd.ratingComment,
      currentPriority: this.getReadPriority(),
      entityType: EntityType.BD,
      wantToReRead: !!this.bd.wantToReadAgain,
    };
  }

  updateReadPriority(priority: number): void {
    this.readPriorityUpdated.emit({ bd: this.bd, priority });
  }

  getActiveUserId(): string {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  openReviewModal(): void {
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.bd.title,
        rating: this.bd.rating ?? 0,
        ratingComment: this.bd.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  addBdFromReadlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.bd.title },
      width: 'auto',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveBdFromReadlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveBdFromReadlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        bds: [this.bd],
      };
      if (rating > 0 || ratingComment) {
        body['rating'] = rating;
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/bds/move-bd-from-readlist-to-read`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec du passage de la BD en lue :',
          payload?.error || response.statusText
        );
        return;
      }
      this.bdUpdated.emit();
    } catch (error) {
      console.warn('Erreur réseau lors du passage de la BD en lue.', error);
    }
  }

  getTopFiveLabel(bd: Bd) {
    return `top5-${bd.title}-${bd.writer}`;
  }
}
