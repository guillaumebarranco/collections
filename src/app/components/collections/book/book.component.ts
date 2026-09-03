import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
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
import { BookView } from '../../../containers/collections/books/books.utils';
import { Book } from '../../../models/book-model';
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
import { BookInspiredMoviesModalComponent } from '../../modals/book-inspired-movies-modal/book-inspired-movies-modal.component';
import { AuthService } from '../../../core/auth.service';
import { isBookApproximateReadDate } from '../../../utils/approximate-date-badges.utils';
import { bookHasInspiredMovies } from '../../../utils/book-movie-adaptations.utils';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    EntityCardComponent,
    EntityCardRatingAndButtonsComponent,
    CanEditDirective,
  ],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  readonly hasInspiredMovies = signal(false);

  @Input() book!: any;

  get showApproximateDateBadge(): boolean {
    return isBookApproximateReadDate(this.book);
  }

  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() sagaBadge: 'Saga terminée' | 'Saga en cours' | null = null;
  @Input() isReadlistView = false;
  @Input() selectedView: BookView = 'read';
  /** Afficher le bouton "Je veux lire ce livre" (consultation du profil d'un autre utilisateur). */
  @Input() showAddToMyReadlist = false;
  /** Le livre peut être ajouté à la readlist de l'utilisateur connecté (pas encore lu ni en readlist). */
  @Input() canAddToMyReadlist = false;
  /** Le livre peut être ajouté aux livres lus de l'utilisateur connecté (pas encore lu). */
  @Input() canAddAsRead = false;
  @Output() editRequested = new EventEmitter<void>();

  @Output() addToReadlist = new EventEmitter<any>();
  /** Émis quand l'utilisateur connecté clique sur "Je veux lire ce livre" (sur le profil d'un autre). */
  @Output() addToMyReadlist = new EventEmitter<Book>();
  /** Émis quand l'utilisateur connecté clique sur "Tiens, j'ai déjà lu ce livre !" (sur le profil d'un autre). */
  @Output() addToMyRead = new EventEmitter<Book>();
  @Output() readPriorityUpdated = new EventEmitter<{
    book: any;
    priority: number;
  }>();
  /** Readlist : marqué « en cours » (reading), API OK. */
  @Output() readlistStartedReading = new EventEmitter<Book>();
  /** Après passage readlist → lu (API OK). */
  @Output() readlistMarkedAsRead = new EventEmitter<Book>();
  @Output() wantToReRead = new EventEmitter<Book>();
  @Output() haveReRead = new EventEmitter<Book>();
  /** Afficher le sélecteur "Mon top 5" (rang 1-5). À utiliser dans les vues collection. */
  @Input() showTopFiveSelector = false;
  /** Rang actuel dans le top 5 personnel (1-5) ou null. */
  @Input() topFiveRank: number | null = null;
  @Output() topFiveRankChange = new EventEmitter<number | null>();
  /** Affiche le bouton communauté (œuvres lues). */
  @Input() showCommunityWatchersButton = false;

  isBaseEntityView = isBaseEntityView();

  ngOnInit(): void {
    void this.refreshInspiredMovies();
  }

  requestEdit(): void {
    this.editRequested.emit();
  }

  openInspiredMoviesModal(): void {
    if (!this.hasInspiredMovies()) return;
    this.dialog.open(BookInspiredMoviesModalComponent, {
      data: {
        bookTitle: this.book.title,
        bookAuthor: this.book.author ?? '',
        userId: this.authService.getAuthenticatedUserId(),
      },
      width: 'min(480px, 95vw)',
      maxWidth: '95vw',
    });
  }

  isBookReading(): boolean {
    return isReading(this.book);
  }

  onStartedReadingClick(): void {
    this.readlistStartedReading.emit(this.book);
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
      alreadySeenRead: normalizedReadTimes(this.book.readTimes) >= 1,
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

  openCommunityWatchersModal(): void {
    const authId = this.authService.getAuthenticatedUserId();
    const profileId = this.getActiveUserId();
    const currentUserId = (authId ?? profileId).toLowerCase();
    this.dialog.open(MovieCommunityWatchersModalComponent, {
      data: {
        workTitle: this.book.title,
        currentUserId,
        kind: 'book' as const,
        identity: { title: this.book.title, author: this.book.author },
      },
      width: 'min(420px, 95vw)',
      maxWidth: '95vw',
    });
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

      this.readlistMarkedAsRead.emit(this.book);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des livres.", error);
    }
  }

  private async refreshInspiredMovies(): Promise<void> {
    const title = this.book?.title ?? '';
    const author = this.book?.author ?? '';
    if (!title) {
      this.hasInspiredMovies.set(false);
      return;
    }
    try {
      this.hasInspiredMovies.set(await bookHasInspiredMovies(title, author));
    } catch {
      this.hasInspiredMovies.set(false);
    }
  }
}
