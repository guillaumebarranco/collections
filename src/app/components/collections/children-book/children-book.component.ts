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
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { EntityType } from '../../../models/quizz-model';

import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { ChildrenBookView } from '../../../containers/collections/children-books/children-books.utils';
import { ChildrenBook } from '../../../models/children-book-model';
import {
  isReading,
  normalizedReadTimes,
} from '../../../utils/in-progress.utils';
import { ReviewModalComponent } from '../../modals/review-modal/review-modal.component';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../modals/move-entity-review-modal/move-entity-review-modal.component';
import { MovieCommunityWatchersModalComponent } from '../../modals/movie-community-watchers-modal/movie-community-watchers-modal.component';
import { AuthService } from '../../../core/auth.service';
import { isBookApproximateReadDate } from '../../../utils/approximate-date-badges.utils';

@Component({
  selector: 'app-children-book',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    CanEditDirective,
  ],
  templateUrl: './children-book.component.html',
  styleUrls: ['./children-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenBookComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  @Input() childrenBook!: any;

  get showApproximateDateBadge(): boolean {
    return isBookApproximateReadDate(this.childrenBook);
  }

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() sagaBadge: 'Saga terminée' | 'Saga en cours' | null = null;
  @Input() isReadlistView = false;
  @Input() selectedView: ChildrenBookView = 'read';
  /** Afficher le bouton "Je veux lire ce livre" (consultation du profil d'un autre utilisateur). */
  @Input() showAddToMyReadlist = false;
  /** Le livre peut être ajouté à la readlist de l'utilisateur connecté (pas encore lu ni en readlist). */
  @Input() canAddToMyReadlist = false;
  /** Le livre peut être ajouté aux livres lus de l'utilisateur connecté (pas encore lu). */
  @Input() canAddAsRead = false;
  @Output() editRequested = new EventEmitter<void>();

  @Output() addToReadlist = new EventEmitter<any>();
  /** Émis quand l'utilisateur connecté clique sur "Je veux lire ce livre" (sur le profil d'un autre). */
  @Output() addToMyReadlist = new EventEmitter<ChildrenBook>();
  /** Émis quand l'utilisateur connecté clique sur "Tiens, j'ai déjà lu ce livre !" (sur le profil d'un autre). */
  @Output() addToMyRead = new EventEmitter<ChildrenBook>();
  @Output() readPriorityUpdated = new EventEmitter<{
    childrenBook: any;
    priority: number;
  }>();
  /** Readlist : marqué « en cours » (reading), API OK. */
  @Output() readlistStartedReading = new EventEmitter<ChildrenBook>();
  /** Après passage readlist → lu (API OK). */
  @Output() readlistMarkedAsRead = new EventEmitter<ChildrenBook>();
  @Output() wantToReRead = new EventEmitter<ChildrenBook>();
  @Output() haveReRead = new EventEmitter<ChildrenBook>();
  /** Afficher le sélecteur "Mon top 5" (rang 1-5). À utiliser dans les vues collection. */
  @Input() showTopFiveSelector = false;
  /** Rang actuel dans le top 5 personnel (1-5) ou null. */
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();
  /** Affiche le bouton communauté (œuvres lues). */
  @Input() showCommunityWatchersButton = false;

  isBaseEntityView = isBaseEntityView();

  requestEdit(): void {
    this.editRequested.emit();
  }

  isChildrenBookReading(): boolean {
    return isReading(this.childrenBook);
  }

  onStartedReadingClick(): void {
    this.readlistStartedReading.emit(this.childrenBook);
  }

  onTopFiveSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.topFiveRankChange.emit(
      value === '' ? null : Math.min(5, Math.max(1, parseInt(value, 10)))
    );
  }

  getReadPriority(): 1 | 2 | 3 {
    const p = this.childrenBook.readPriority ?? 1;
    return (p >= 1 && p <= 3 ? p : 1) as 1 | 2 | 3;
  }

  getEntityData(): EntityCardEntityData {
    return {
      alreadySeenRead: normalizedReadTimes(this.childrenBook.readTimes) >= 1,
      alreadyInList: this.isInReadlist,
      rating: this.childrenBook.rating ?? 0,
      hasRatingComment: !!this.childrenBook.ratingComment,
      currentPriority: this.getReadPriority(),
      entityType: EntityType.BOOK,
      wantToReRead: !!this.childrenBook.wantToReadAgain,
    };
  }

  updateReadPriority(priority: number): void {
    this.readPriorityUpdated.emit({ childrenBook: this.childrenBook, priority });
  }

  getActiveUserId(): string {
    const params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  openCommunityWatchersModal(): void {
    const authId = this.authService.getAuthenticatedUserId();
    const profileId = this.getActiveUserId();
    const currentUserId = (authId ?? profileId).toLowerCase();
    this.dialog.open(MovieCommunityWatchersModalComponent, {
      data: {
        workTitle: this.childrenBook.title,
        currentUserId,
        kind: 'childrenBook' as const,
        identity: { title: this.childrenBook.title, author: this.childrenBook.author },
      },
      width: 'min(420px, 95vw)',
      maxWidth: '95vw',
    });
  }

  openReviewModal(): void {
    this.dialog.open(ReviewModalComponent, {
      data: {
        workTitle: this.childrenBook.title,
        rating: this.childrenBook.rating ?? 0,
        ratingComment: this.childrenBook.ratingComment ?? '',
        userName: this.getActiveUserId(),
      },
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  addChildrenBookFromReadlist(): void {
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: { entityTitle: this.childrenBook.title },
      width: 'auto',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.callMoveChildrenBookFromReadlistApi(result.rating, result.ratingComment);
    });
  }

  private async callMoveChildrenBookFromReadlistApi(
    rating: number,
    ratingComment: string
  ): Promise<void> {
    try {
      const body: Record<string, unknown> = {
        userId: this.getActiveUserId(),
        'children-books': [this.childrenBook],
        readlist: false,
      };
      if (rating > 0 || ratingComment) {
        body['rating'] = rating;
        body['ratingComment'] = ratingComment;
      }
      const response = await fetch(
        `${getApiBaseUrl()}/children-books/move-children-book-from-readlist-to-read`,
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

      this.readlistMarkedAsRead.emit(this.childrenBook);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des livres.", error);
    }
  }
}
