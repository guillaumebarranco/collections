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
import { MatDialog } from '@angular/material/dialog';
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import { AuthService } from '../../../core/auth.service';
import { Quizz, EntityType } from '../../../models/quizz-model';
import { matchesQuizzEntityTitle } from '../../../utils/quizzs/quizzs.utils';
import { isBaseEntityView, getApiBaseUrl } from '../../../core/config';
import { BookView } from '../../../containers/collections/books/books.utils';
import { Book } from '../../../models/book-model';
import { ReviewModalComponent } from '../../review-modal/review-modal.component';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, EntityCardComponent],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  @Input() book!: any;
  @Input() quizzs: Quizz[] = [];
  @Input() readOnly = false;
  @Input() recommendationText = '';
  @Input() showAddToReadlistButton = false;
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() sagaBadge: 'Saga terminée' | 'Saga en cours' | null = null;
  @Input() isReadlistView = false;
  @Input() showToReReadButton = false;
  @Input() selectedView: BookView = 'read';
  @Output() editRequested = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();
  @Output() addToReadlist = new EventEmitter<any>();
  @Output() readPriorityUpdated = new EventEmitter<{
    book: any;
    priority: number;
  }>();
  @Output() bookUpdated = new EventEmitter<void>();
  @Output() wantToReRead = new EventEmitter<Book>();
  @Output() haveReRead = new EventEmitter<Book>();

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

  getEntityQuizzs(): Quizz[] {
    return this.quizzs.filter(
      (quizz) =>
        quizz.entityType === EntityType.BOOK &&
        matchesQuizzEntityTitle(this.book.title, quizz.entityTitle)
    );
  }

  openQuizzModal(): void {
    const entityQuizzs = this.getEntityQuizzs();
    if (entityQuizzs.length === 0) return;
    this.openQuizz.emit(entityQuizzs);
  }

  updateReadPriority(priority: number): void {
    this.readPriorityUpdated.emit({ book: this.book, priority });
  }

  private getActiveUserId(): string {
    const params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
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

  async addBookFromReadlist(): Promise<void> {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/books/move-book-from-readlist-to-read`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.getActiveUserId(),
            books: [this.book],
            readlist: false,
          }),
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

      // Émettre un événement pour rafraîchir la liste
      this.bookUpdated.emit();
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des livres.", error);
    }
  }
}
