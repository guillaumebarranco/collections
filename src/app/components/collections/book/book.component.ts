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
import { MatDialog } from '@angular/material/dialog';
import { EntityCardComponent } from '../../entity/entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity/entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { EntityType } from '../../../models/quizz-model';

import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { BookView } from '../../../containers/collections/books/books.utils';
import { Book } from '../../../models/book-model';
import { ReviewModalComponent } from '../../modals/review-modal/review-modal.component';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../modals/move-entity-review-modal/move-entity-review-modal.component';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    CanEditDirective,
  ],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  @Input() book!: any;

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() sagaBadge: 'Saga terminée' | 'Saga en cours' | null = null;
  @Input() isReadlistView = false;
  @Input() selectedView: BookView = 'read';
  @Output() editRequested = new EventEmitter<void>();

  @Output() addToReadlist = new EventEmitter<any>();
  @Output() readPriorityUpdated = new EventEmitter<{
    book: any;
    priority: number;
  }>();
  @Output() bookUpdated = new EventEmitter<void>();
  @Output() wantToReRead = new EventEmitter<Book>();
  @Output() haveReRead = new EventEmitter<Book>();
  /** Afficher le sélecteur "Mon top 5" (rang 1-5). À utiliser dans les vues collection. */
  @Input() showTopFiveSelector = false;
  /** Rang actuel dans le top 5 personnel (1-5) ou null. */
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
    const p = this.book.readPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    return {
      alreadySeenRead: !!(this.book.readTimes && this.book.readTimes > 0),
      alreadyInList: this.isInReadlist,
      rating: this.book.rating ?? 0,
      hasRatingComment: !!this.book.ratingComment,
      currentPriority: this.getReadPriority(),
      entityType: EntityType.BOOK,
      wantToReRead: !!this.book.wantToReadAgain,
    };
  }

  updateReadPriority(priority: number): void {
    this.readPriorityUpdated.emit({ book: this.book, priority });
  }

  getActiveUserId(): string {
    const params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  openReviewModal(): void {
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.book.title,
        rating: this.book.rating ?? 0,
        ratingComment: this.book.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  addBookFromReadlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.book.title },
      width: 'auto',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveBookFromReadlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveBookFromReadlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        books: [this.book],
        readlist: false,
      };
      if (rating > 0 || ratingComment) {
        body['rating'] = rating;
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/books/move-book-from-readlist-to-read`,
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
          "Échec de l'ajout batch des livres :",
          payload?.error || response.statusText
        );
        return;
      }

      this.bookUpdated.emit();
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des livres.", error);
    }
  }
}
