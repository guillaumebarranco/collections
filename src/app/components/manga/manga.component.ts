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
import { ActivatedRoute } from '@angular/router';
import { EntityCardComponent } from '../entity-card/entity-card.component';
import { AuthService } from '../../core/auth.service';
import { Manga } from '../../models/manga-model';
import { Quizz, QuizzEntityType } from '../../models/quizz-model';
import { matchesQuizzEntityTitle } from '../../utils/quizzs/quizzs.utils';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-manga',
  standalone: true,
  imports: [CommonModule, EntityCardComponent],
  templateUrl: './manga.component.html',
  styleUrls: ['./manga.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  @Input() manga!: Manga;
  @Input() quizzs: Quizz[] = [];
  @Output() editRequested = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();

  readonly canEdit = computed(() => {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return this.authService.canEdit(directId || parentId);
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
        quizz.entityType === QuizzEntityType.MANGA &&
        matchesQuizzEntityTitle(this.manga.title, quizz.entityTitle)
    );
  }

  openQuizzModal(): void {
    const entityQuizzs = this.getEntityQuizzs();
    if (entityQuizzs.length === 0) return;
    this.openQuizz.emit(entityQuizzs);
  }
}
