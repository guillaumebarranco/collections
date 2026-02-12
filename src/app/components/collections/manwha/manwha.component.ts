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
import { ReviewModalComponent } from '../../review-modal/review-modal.component';
import { AuthService } from '../../../core/auth.service';
import { Manwha } from '../../../models/manwha-model';
import { Quizz, EntityType } from '../../../models/quizz-model';
import { matchesQuizzEntityTitle } from '../../../utils/quizzs/quizzs.utils';
import { isBaseEntityView } from '../../../core/config';
import { ManwhaView } from '../../../containers/collections/manwhas/manwhas.utils';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-manwha',
  standalone: true,
  imports: [CommonModule, EntityCardComponent, MatDialogModule],
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
  @Input() showAddToReadlistButton = false;
  @Input() isInReadlist = false;
  @Input() recommendationBadge = '';
  @Input() isReadlistView = false;
  @Input() showToReReadButton = false;
  @Input() selectedView: ManwhaView = 'read';
  @Output() editRequested = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();
  @Output() addToReadlist = new EventEmitter<Manwha>();
  @Output() readPriorityUpdated = new EventEmitter<{ manwha: Manwha; priority: number }>();
  @Output() wantToReRead = new EventEmitter<Manwha>();
  @Output() haveReRead = new EventEmitter<Manwha>();

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
    return directId || parentId || 'guillaume';
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
}
