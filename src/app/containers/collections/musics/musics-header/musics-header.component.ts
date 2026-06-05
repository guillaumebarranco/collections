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
import { ViewToggleComponent } from '../../../../components/shared/view-toggle/view-toggle.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../../components/shared/sort-dropdown/sort-dropdown.component';
import { StatsDisplayComponent } from '../../../../components/shared/stats-display/stats-display.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { createCollectionHeaderMobileAccordion } from '../../../../utils/collection-header-mobile';

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
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas de musiques). */
  showFiltersAndSearch = input<boolean>(true);
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

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mobileAccordion = createCollectionHeaderMobileAccordion();

  readonly isMobileViewport = this.mobileAccordion.isMobileViewport;
  readonly toolsPanelExpanded = this.mobileAccordion.toolsPanelExpanded;

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

  toggleToolsPanel(): void {
    this.mobileAccordion.toggleToolsPanel();
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
