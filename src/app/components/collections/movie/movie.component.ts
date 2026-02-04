import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Movie } from '../../../models/movie-model';
import { Quizz, EntityType } from '../../../models/quizz-model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditMovieComponent } from '../../../containers/edit/edit-movie/edit-movie.component';
import { EntityCardComponent } from '../../entity-card/entity-card.component';
import { AuthService } from '../../../core/auth.service';
import { matchesQuizzEntityTitle } from '../../../utils/quizzs/quizzs.utils';
import { getApiBaseUrl, isBaseEntityView } from '../../../core/config';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, MatDialogModule, EntityCardComponent],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  @Input() movie!: Movie;
  @Input() list: Movie[] = [];
  @Input() index = -1;
  @Input() quizzs: Quizz[] = [];
  @Input() readOnly = false;
  @Input() showToReWatchButton = false;
  @Input() showAddToWatchlistButton = false;
  @Input() isInWatchlist = false;
  @Output() movieUpdated = new EventEmitter<void>();
  @Output() openQuizz = new EventEmitter<Quizz[]>();
  @Output() wantToReWatch = new EventEmitter<Movie>();
  @Output() addToWatchlist = new EventEmitter<Movie>();
  isWatchList = input<boolean>(false);

  recommendationView = input<boolean>(false);
  recommendationText = input<string>('');

  isBaseEntityView = isBaseEntityView();

  readonly canEdit = computed(() => {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const isAdminView =
      this.authService.isAdmin() && this.router.url.startsWith('/admin');
    return isAdminView || this.authService.canEdit(directId || parentId);
  });

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  navigateToEdit(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const list = this.list && this.list.length > 0 ? this.list : [this.movie];
    const index = this.index >= 0 && this.index < list.length ? this.index : 0;
    const dialogRef = this.dialog.open(EditMovieComponent, {
      data: {
        movie: this.movie,
        userId: userId || 'guillaume',
        list,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.movieUpdated.emit();
      }
    });
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
        quizz.entityType === EntityType.MOVIE &&
        matchesQuizzEntityTitle(this.movie.title, quizz.entityTitle)
    );
  }

  openQuizzModal(): void {
    const entityQuizzs = this.getEntityQuizzs();
    if (entityQuizzs.length === 0) return;
    this.openQuizz.emit(entityQuizzs);
  }

  async addMovieFromWatchlist(): Promise<void> {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/movies/move-movie-from-watchlist-to-watched`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.getActiveUserId(),
            movies: [this.movie],
            watchlist: false,
          }),
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des films :",
          payload?.error || response.statusText
        );
        return;
      }

      this.movieUpdated.emit();
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des films.", error);
    }
  }
}
