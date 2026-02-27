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
import { BookView } from '../books.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { DEFAULT_USER_ID } from '../../../../utils/constants';

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
  onOpenViewConfig = output<void>();
  onYearFilterChange = output<string>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  selectedView = input<BookView>('read');
  selectedSortInput = input<string>('readDate');
  selectedYearFilterInput = input<string>('all');
  searchTermInput = input<string>('');
  allBooksCount = input<number>(0);
  filteredBooksCount = input<number>(0);
  recommendedBooksCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas de livres lus). */
  showFiltersAndSearch = input<boolean>(true);
  sortOptions = input<SortOption[]>([]);
  yearFilterOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: BookView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();
  showTopFiveRank = input<boolean>(false);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
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
      this.searchTerm.set(this.searchTermInput());
    });
  }

  booksPageTitle = computed(() =>
    this.selectedView() === 'readlist'
      ? 'Livres à lire'
      : this.selectedView() === 'owned'
      ? 'Livres possédés'
      : this.selectedView() === 'borrowed'
      ? 'Livres empruntés'
      : this.selectedView() === 'authors'
      ? 'Livres par auteur'
      : this.selectedView() === 'sagas'
      ? 'Livres par saga'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'Livres lus'
  );

  private userId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
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
