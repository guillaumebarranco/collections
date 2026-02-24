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
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { BdView } from '../bds.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bds-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './bds-header.component.html',
  styleUrls: ['./bds-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BdsHeaderComponent {
  onViewChange = output<BdView>();
  onOpenViewConfig = output<void>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  showTopFiveRank = input<boolean>(false);
  selectedView = input<BdView>('read');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allBdsCount = input<number>(0);
  allReadlistBdsCount = input<number>(0);
  filteredBdsCount = input<number>(0);
  recommendedBdsCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: BdView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly activatedRoute = inject(ActivatedRoute);

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

  bdsPageTitle = computed(() =>
    this.selectedView() === 'readlist'
      ? 'BD à lire'
      : this.selectedView() === 'owned'
      ? 'BD possédées'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'BD lues'
  );

  getSelectBdsRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-bds` : '/select-bds';
  }

  getSelectBdsRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-bds-rating`
      : '/select-bds-rating';
  }

  getSelectBdsTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-bds-times-read`
      : '/select-bds-times-read';
  }

  getSelectBdsOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-bds-owned`
      : '/select-bds-owned';
  }
}
