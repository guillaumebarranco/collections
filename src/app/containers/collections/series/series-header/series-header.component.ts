import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
import { SerieView } from '../series.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-series-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './series-header.component.html',
  styleUrls: ['./series-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesHeaderComponent {
  onViewChange = output<SerieView>();
  onOpenViewConfig = output<void>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  showTopFiveRank = input<boolean>(false);
  selectedView = input<SerieView>('finished');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allSeriesCount = input<number>(0);
  filteredSeriesCount = input<number>(0);
  recommendedSeriesCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: SerieView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  selectedSort = signal<string>('rating');
  searchTerm = signal<string>('');

  constructor() {
    effect(() => {
      this.selectedSort.set(this.selectedSortInput());
    });
    effect(() => {
      this.searchTerm.set(this.searchTermInput());
    });
  }

  seriesPageTitle = computed(() => {
    if (this.isAdminView()) {
      return 'Séries';
    }
    return this.selectedView() === 'watchlist'
      ? 'Séries à voir'
      : this.selectedView() === 'owned'
      ? 'Séries possédées'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'Séries finies';
  });

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  getSelectSeriesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-series` : '/select-series';
  }

  getSelectSeriesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-rating`
      : '/select-series-rating';
  }

  getSelectSeriesTimesWatchedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-times-watched`
      : '/select-series-times-watched';
  }

  getSelectSeriesOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-owned`
      : '/select-series-owned';
  }
}
