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
import { ManwhaView } from '../manwhas.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manwhas-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './manwhas-header.component.html',
  styleUrls: ['./manwhas-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManwhasHeaderComponent {
  onViewChange = output<ManwhaView>();
  onOpenViewConfig = output<void>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  showTopFiveRank = input<boolean>(false);
  selectedView = input<ManwhaView>('read');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allManwhasCount = input<number>(0);
  allReadlistManwhasCount = input<number>(0);
  filteredManwhasCount = input<number>(0);
  recommendedManwhasCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: ManwhaView;
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

  manwhasPageTitle = computed(() =>
    this.selectedView() === 'readlist'
      ? 'Manwhas à lire'
      : this.selectedView() === 'owned'
      ? 'Manwhas possédés'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'Manwhas lus'
  );

  getSelectManwhasRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-manwhas` : '/select-manwhas';
  }

  getSelectManwhasRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-manwhas-rating`
      : '/select-manwhas-rating';
  }

  getSelectManwhasTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-manwhas-times-read`
      : '/select-manwhas-times-read';
  }

  getSelectManwhasOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-manwhas-owned`
      : '/select-manwhas-owned';
  }
}
