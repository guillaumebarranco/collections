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
import { BookView } from '../books.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './books-header.component.html',
  styleUrls: ['./books-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksHeaderComponent {
  onViewChange = output<BookView>();
  onYearFilterChange = output<string>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onGroupByChange = output<string>();

  selectedView = input<BookView>('read');
  selectedSortInput = input<string>('readDate');
  selectedYearFilterInput = input<string>('all');
  selectedGroupByInput = input<string>('none');
  searchTermInput = input<string>('');
  allBooksCount = input<number>(0);
  filteredBooksCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  yearFilterOptions = input<SortOption[]>([]);
  groupByOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: BookView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
  selectedGroupBy = signal<string>('none');
  searchTerm = signal<string>('');

  constructor() {
    // Synchroniser les inputs avec les signaux locaux
    effect(() => {
      this.selectedSort.set(this.selectedSortInput());
    });
    effect(() => {
      this.selectedYearFilter.set(this.selectedYearFilterInput());
    });
    effect(() => {
      this.selectedGroupBy.set(this.selectedGroupByInput());
    });
    effect(() => {
      this.searchTerm.set(this.searchTermInput());
    });
  }

  booksPageTitle = computed(() => {
    if (this.isAdminView()) {
      return 'Livres';
    }
    return this.selectedView() === 'readlist'
      ? 'Livres à lire'
      : this.selectedView() === 'owned'
      ? 'Livres possédés'
      : this.selectedView() === 'authors'
      ? 'Livres par auteur'
      : 'Livres lus';
  });

  private userId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  getSelectBooksRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-books` : '/select-books';
  }

  getSelectBooksRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-books-rating`
      : '/select-books-rating';
  }

  getSelectBooksTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-books-times-read`
      : '/select-books-times-read';
  }

  getSelectBooksOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-books-owned`
      : '/select-books-owned';
  }
}
