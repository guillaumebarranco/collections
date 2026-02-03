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
import {
  SortDropdownComponent,
  SortOption,
} from '../../../../components/sort-dropdown/sort-dropdown.component';
import { StatsDisplayComponent } from '../../../../components/stats-display/stats-display.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { MovieView } from '../movies.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movies-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
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

  selectedView = input<MovieView>('watched');
  allMoviesCount = input<number>(0);
  filteredMoviesByYearCount = input<number>(0);
  recommendedMoviesCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  yearFilterOptions = input<SortOption[]>([]);
  visibleMovieViewOptions = input<
    {
      value: MovieView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  selectedSort = signal<string>('lastViewedDate');
  selectedYearFilter = signal<string>('all');
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
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : this.selectedView() === 'owned'
      ? 'Films possédés'
      : 'Films visionnés';
  });

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
    const userId = hasNameParam ? params['id'] : 'guillaume';
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
}
