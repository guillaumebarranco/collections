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
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { ReviewModalComponent } from '../../review-modal/review-modal.component';
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { Comic } from '../../../models/comic-model';
import { EntityType } from '../../../models/quizz-model';

import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { ComicView } from '../../../containers/collections/comics/comics.utils';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../move-entity-review-modal/move-entity-review-modal.component';

@Component({
  selector: 'app-comic',
  standalone: true,
  imports: [
    CommonModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    MatDialogModule,
    CanEditDirective,
  ],
  templateUrl: './comic.component.html',
  styleUrls: ['./comic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComicComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  @Input() comic!: Comic;

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() isReadlistView = false;
  @Input() selectedView: ComicView = 'read';
  @Output() editRequested = new EventEmitter<void>();

  @Output() addToReadlist = new EventEmitter<Comic>();
  @Output() readPriorityUpdated = new EventEmitter<{
    comic: Comic;
    priority: number;
  }>();
  @Output() wantToReRead = new EventEmitter<Comic>();
  @Output() haveReRead = new EventEmitter<Comic>();
  @Output() comicUpdated = new EventEmitter<void>();
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
    const p = this.comic.readPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    return {
      alreadySeenRead: !!(this.comic.readTimes && this.comic.readTimes > 0),
      alreadyInList: this.isInReadlist,
      rating: this.comic.rating ?? 0,
      hasRatingComment: !!this.comic.ratingComment,
      currentPriority: this.getReadPriority(),
      entityType: EntityType.COMIC,
      wantToReRead: !!this.comic.wantToReadAgain,
    };
  }

  updateReadPriority(priority: number): void {
    this.readPriorityUpdated.emit({ comic: this.comic, priority });
  }

  getActiveUserId(): string {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  openReviewModal(): void {
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.comic.title,
        rating: this.comic.rating ?? 0,
        ratingComment: this.comic.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  addComicFromReadlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.comic.title },
      width: 'auto',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveComicFromReadlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveComicFromReadlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        comics: [this.comic],
      };
      if (rating > 0 || ratingComment) {
        body['rating'] = rating;
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/comics/move-comic-from-readlist-to-read`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec du passage du comic en lu :',
          payload?.error || response.statusText
        );
        return;
      }
      this.comicUpdated.emit();
    } catch (error) {
      console.warn('Erreur réseau lors du passage du comic en lu.', error);
    }
  }

  getTopFiveLabel(comic: Comic) {
    return `top5-${comic.title}-${comic.writer}`;
  }
}
