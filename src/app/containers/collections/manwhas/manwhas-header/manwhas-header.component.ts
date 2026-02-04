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
  onSearchChange = output<string>();
  onSortChange = output<string>();

  selectedView = input<ManwhaView>('read');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allManwhasCount = input<number>(0);
  allReadlistManwhasCount = input<number>(0);
  filteredManwhasCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: ManwhaView;
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

  manwhasPageTitle = computed(() => {
    if (this.isAdminView()) {
      return 'Manwhas';
    }
    return this.selectedView() === 'readlist'
      ? 'Manwhas à lire'
      : this.selectedView() === 'owned'
      ? 'Manwhas possédés'
      : 'Manwhas lus';
  });

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

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
