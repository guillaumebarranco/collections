import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Serie } from '../../models/serie-model';
import { Quizz, QuizzEntityType } from '../../models/quizz-model';
import { EditSerieComponent } from '../../containers/edit/edit-serie/edit-serie.component';
import { EditSerieSeasonsComponent } from '../../containers/edit/edit-serie-seasons/edit-serie-seasons.component';
import { EntityCardComponent } from '../entity-card/entity-card.component';
import { AuthService } from '../../core/auth.service';
import { matchesQuizzEntityTitle } from '../../utils/quizzs/quizzs.utils';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-serie',
  standalone: true,
  imports: [CommonModule, MatDialogModule, EntityCardComponent],
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SerieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  @Input() serie!: Serie;
  @Input() list: Serie[] = [];
  @Input() index = -1;
  @Input() quizzs: Quizz[] = [];
  @Output() serieUpdated = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();

  seasonsExpanded = signal(false);

  readonly canEdit = computed(() => {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return this.authService.canEdit(directId || parentId);
  });

  navigateToEdit(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const list = this.list && this.list.length > 0 ? this.list : [this.serie];
    const index =
      this.index >= 0 && this.index < list.length ? this.index : 0;
    const dialogRef = this.dialog.open(EditSerieComponent, {
      data: {
        serie: this.serie,
        userId: userId || 'guillaume',
        list,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.serieUpdated.emit();
      }
    });
  }

  openSeasonsDialog(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const dialogRef = this.dialog.open(EditSerieSeasonsComponent, {
      data: {
        serie: this.serie,
        userId: userId || 'guillaume',
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.serieUpdated.emit();
      }
    });
  }

  toggleSeasonsInline(): void {
    this.seasonsExpanded.set(!this.seasonsExpanded());
  }

  getSerieSeasons() {
    if (this.serie.seasons && this.serie.seasons.length > 0) {
      return this.serie.seasons;
    }
    const total = this.serie.seasonsData?.length ?? 0;
    return Array.from({ length: total }, (_, index) => ({
      seasonNumber: index + 1,
      seasonRating: 0,
      seasonTimesWatched: 0,
    }));
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
        quizz.entityType === QuizzEntityType.SERIE &&
        matchesQuizzEntityTitle(this.serie.title, quizz.entityTitle)
    );
  }

  openQuizzModal(): void {
    const entityQuizzs = this.getEntityQuizzs();
    if (entityQuizzs.length === 0) return;
    this.openQuizz.emit(entityQuizzs);
  }
}
