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
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import {
  EntityCardRatingAndButtonsComponent,
  EntityCardEntityData,
} from '../../entity-card-rating-and-buttons/entity-card-rating-and-buttons.component';
import { ReviewModalComponent } from '../../review-modal/review-modal.component';
import { AuthService } from '../../../core/auth.service';
import { Manwha } from '../../../models/manwha-model';
import { Quizz, EntityType } from '../../../models/quizz-model';
import { matchesQuizzEntityTitle } from '../../../utils/quizzs/quizzs.utils';
import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { ManwhaView } from '../../../containers/collections/manwhas/manwhas.utils';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../move-entity-review-modal/move-entity-review-modal.component';

@Component({
  selector: 'app-manwha',
  standalone: true,
  imports: [
    CommonModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    MatDialogModule,
  ],
  templateUrl: './manwha.component.html',
  styleUrls: ['./manwha.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManwhaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  @Input() manwha!: Manwha;
  @Input() quizzs: Quizz[] = [];
  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() isReadlistView = false;
  @Input() selectedView: ManwhaView = 'read';
  @Output() editRequested = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();
  @Output() addToReadlist = new EventEmitter<Manwha>();
  @Output() readPriorityUpdated = new EventEmitter<{
    manwha: Manwha;
    priority: number;
  }>();
  @Output() wantToReRead = new EventEmitter<Manwha>();
  @Output() haveReRead = new EventEmitter<Manwha>();
  @Output() manwhaUpdated = new EventEmitter<void>();

  isBaseEntityView = isBaseEntityView();

  readonly canEdit = computed(() => {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const isAdminView =
      this.authService.isAdmin() && this.router.url.startsWith('/admin');
    return isAdminView || this.authService.canEdit(directId || parentId);
  });

  requestEdit(): void {
    this.editRequested.emit();
  }

  getReadPriority(): 1 | 2 | 3 {
    const p = this.manwha.readPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    return {
      rating: this.manwha.rating ?? 0,
      hasRatingComment: !!this.manwha.ratingComment,
      currentPriority: this.getReadPriority(),
      entityType: EntityType.MANWHA,
      wantToReRead: !!this.manwha.wantToReadAgain,
    };
  }

  getEntityQuizzs(): Quizz[] {
    return this.quizzs.filter(
      (quizz) =>
        quizz.entityType === EntityType.MANWHA &&
        matchesQuizzEntityTitle(this.manwha.title, quizz.entityTitle)
    );
  }

  openQuizzModal(): void {
    const entityQuizzs = this.getEntityQuizzs();
    if (entityQuizzs.length === 0) return;
    this.openQuizz.emit(entityQuizzs);
  }

  updateReadPriority(priority: number): void {
    this.readPriorityUpdated.emit({ manwha: this.manwha, priority });
  }

  private getActiveUserId(): string {
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
      this.manwhaUpdated.emit();
    } catch (error) {
      console.warn('Erreur réseau lors du passage du manwha en lu.', error);
    }
  }
}
