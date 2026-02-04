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
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-musics-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './musics-header.component.html',
  styleUrls: ['./musics-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicsHeaderComponent {
  onViewModeChange = output<string>();
  onFilterChange = output<string>();
  onSearchChange = output<string>();
  onSortChange = output<string>();

  selectedViewMode = input<string>('albums');
  selectedFilterInput = input<string>('popular');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allMusicsCount = input<number>(0);
  filteredMusicsCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: string;
      label: string;
    }[]
  >([]);
  filterOptions = input<
    {
      value: string;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  selectedSort = signal<string>('rating');
  selectedFilter = signal<string>('popular');
  searchTerm = signal<string>('');

  constructor() {
    effect(() => {
      this.selectedSort.set(this.selectedSortInput());
    });
    effect(() => {
      this.selectedFilter.set(this.selectedFilterInput());
    });
    effect(() => {
      this.searchTerm.set(this.searchTermInput());
    });
  }

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  getSelectMusicsRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-musics` : '/select-musics';
  }

  getSelectMusicsRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-musics-rating`
      : '/select-musics-rating';
  }

  getSelectMusicsTimesListenedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-musics-times-listened`
      : '/select-musics-times-listened';
  }
}
