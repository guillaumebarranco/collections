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
import { EntityCardComponent } from '../../entity/entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity/entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { ReviewModalComponent } from '../../modals/review-modal/review-modal.component';
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { Manga } from '../../../models/manga-model';
import { EntityType } from '../../../models/quizz-model';

import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { MangaView } from '../../../containers/collections/mangas/mangas.utils';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../modals/move-entity-review-modal/move-entity-review-modal.component';

@Component({
  selector: 'app-manga',
  standalone: true,
  imports: [
    CommonModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    MatDialogModule,
    CanEditDirective,
  ],
  templateUrl: './manga.component.html',
  styleUrls: ['./manga.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  @Input() manga!: Manga;

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  /** Badge parution (recommandations) : même logique visuelle que sagaBadge côté livres. */
  @Input() serializationBadge: 'Manga fini' | 'Manga en cours' | null = null;
  @Input() isReadlistView = false;
  @Input() selectedView: MangaView = 'read';
  @Input() showAddToMyReadlist = false;
  @Input() canAddToMyReadlist = false;
  @Input() canAddAsRead = false;
  @Output() editRequested = new EventEmitter<void>();

  @Output() addToReadlist = new EventEmitter<Manga>();
  @Output() addToMyReadlist = new EventEmitter<Manga>();
  @Output() addToMyRead = new EventEmitter<Manga>();
  @Output() readPriorityUpdated = new EventEmitter<{
    manga: Manga;
    priority: number;
  }>();
  @Output() wantToReRead = new EventEmitter<Manga>();
  @Output() haveReRead = new EventEmitter<Manga>();
  /** Readlist : marqué « en cours » (readTimes 0.5), API OK. */
  @Output() readlistStartedReading = new EventEmitter<Manga>();
  @Output() readlistMarkedAsRead = new EventEmitter<Manga>();
  @Input() showTopFiveSelector = false;
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();

  isBaseEntityView = isBaseEntityView();

  requestEdit(): void {
    this.editRequested.emit();
  }

  onStartedReadingClick(): void {
    this.readlistStartedReading.emit(this.manga);
  }

  onTopFiveSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.topFiveRankChange.emit(
      value === '' ? null : Math.min(5, Math.max(1, parseInt(value, 10)))
    );
  }

  getReadPriority(): 1 | 2 | 3 {
    const p = this.manga.readPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    return {
      alreadySeenRead: (this.manga.readTimes ?? 0) >= 1,
      alreadyInList: this.isInReadlist,
      rating: this.manga.rating ?? 0,
      hasRatingComment: !!this.manga.ratingComment,
      currentPriority: this.getReadPriority(),
      entityType: EntityType.MANGA,
      wantToReRead: !!this.manga.wantToReadAgain,
    };
  }

  updateReadPriority(priority: number): void {
    this.readPriorityUpdated.emit({ manga: this.manga, priority });
  }

  getActiveUserId(): string {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  openReviewModal(): void {
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.manga.title,
        rating: this.manga.rating ?? 0,
        ratingComment: this.manga.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  addMangaFromReadlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.manga.title },
      width: 'auto',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveMangaFromReadlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveMangaFromReadlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        mangas: [this.manga],
      };
      if (rating > 0 || ratingComment) {
        body['rating'] = rating;
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/mangas/move-manga-from-readlist-to-read`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec du passage du manga en lu :',
          payload?.error || response.statusText
        );
        return;
      }
      this.readlistMarkedAsRead.emit(this.manga);
    } catch (error) {
      console.warn('Erreur réseau lors du passage du manga en lu.', error);
    }
  }

  getTopFiveLabel(manga: Manga) {
    return `top5-${manga.title}-${manga.author}`;
  }
}
