import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/view-toggle/view-toggle.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { MovieView } from '../movies.utils';
import { FormsModule } from '@angular/forms';
import { AddMovieComponent } from '../../../add/add-movie/add-movie.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DEFAULT_USER_ID } from '../../../../utils/constants';

@Component({
  selector: 'app-movies-header',
  imports: [RouterModule, FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './movies-header.component.html',
  styleUrls: ['./movies-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesHeaderComponent {
  onViewChange = output<MovieView>();
  onOpenViewConfig = output<void>();
  onYearFilterChange = output<string>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  selectedView = input<MovieView>('watched');
  showTopFiveRank = input<boolean>(false);
  allMoviesCount = input<number>(0);
  filteredMoviesByYearCount = input<number>(0);
  recommendedMoviesCount = input<number>(0);
  visibleMovieViewOptions = input<
    {
      value: MovieView;
      label: string;
    }[]
  >([]);

  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  searchTerm = signal<string>('');

  moviesPageTitle = computed(() => {
    if (this.isAdminView()) {
      return 'Films';
    }
    return this.selectedView() === 'watchlist'
      ? 'Films à voir'
      : this.selectedView() === 'cinema'
      ? 'Films vus au cinéma'
      : this.selectedView() === 'sagas'
      ? 'Films par saga'
      : this.selectedView() === 'actors'
      ? 'Films par acteur'
      : this.selectedView() === 'directors'
      ? 'Films par réalisateur'
      : this.selectedView() === 'countries'
      ? 'Films par pays'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : this.selectedView() === 'owned'
      ? 'Films possédés'
      : this.selectedView() === 'toReWatch'
      ? 'Films à revoir'
      : 'Films visionnés';
  });

  private userId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  getSelectMoviesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-movies` : '/select-movies';
  }

  getSelectWatchlistRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    const userId = hasNameParam ? params['id'] : DEFAULT_USER_ID;
    return hasNameParam ? [`/${userId}`, 'select-movies'] : ['/select-movies'];
  }

  getSelectCinemaRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? [`/${params['id']}`, 'select-movies']
      : ['/select-movies'];
  }

  getSelectMoviesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-rating`
      : '/select-movies-rating';
  }

  getSelectMoviesTimesWatchedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-times-watched`
      : '/select-movies-times-watched';
  }

  getSelectMoviesOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-owned`
      : '/select-movies-owned';
  }

  openAddMovieAdminDialog(): void {
    const dialogRef = this.dialog.open(AddMovieComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate(['/admin/movies']);
      }
    });
  }
}
