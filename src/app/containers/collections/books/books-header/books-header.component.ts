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
import { BookView } from '../books.utils';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { DEFAULT_USER_ID } from '../../../../utils/constants';
import { CanEditDirective } from '../../../../directives/can-edit.directive';

@Component({
  selector: 'app-books-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    CanEditDirective,
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

  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
  searchTerm = signal<string>('');

  addBooksButtonLabel = computed(() =>
    this.selectedView() === 'readlist'
      ? 'Ajouter des livres à lire'
      : 'Ajouter des livres lus'
  );

  canShowAddBooksButton = computed(
    () => this.selectedView() === 'read' || this.selectedView() === 'readlist'
  );

  canShowUpdateBooksRatingButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateBooksTimesReadButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateBooksOwnedButton = computed(
    () =>
      this.selectedView() === 'read' ||
      this.selectedView() === 'readlist' ||
      this.selectedView() === 'owned'
  );

  canShowTopFiveRankButton = computed(() => this.selectedView() === 'read');

  canShowSortDropdown = computed(
    () => this.selectedView() === 'read' || this.selectedView() === 'readlist'
  );

  canShowFiltersAndSearch = computed(
    () =>
      this.filteredBooksCount() > 0 &&
      this.searchTerm() === '' &&
      (this.selectedView() === 'read' ||
        this.selectedView() === 'readlist' ||
        this.selectedView() === 'toReRead' ||
        this.selectedView() === 'owned' ||
        this.selectedView() === 'recommendations')
  );

  noDataForThisView = computed(
    () => this.filteredBooksCount() === 0 && this.searchTerm() === ''
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'read':
        return "Vous n'avez renseigné aucun livre lu";
      case 'readlist':
        return 'Vous n\'avez marqué aucun livre comme "à lire". Vous pouvez le faire via le bouton au-dessus.';
      case 'toReRead':
        return 'Vous n\'avez marqué aucun livre comme "à relire". Vous pouvez vous rendre sur vos livres lus et en cliquant sur le bouton d\'edit d\'un livre, le marqué comme "à relire".';
      case 'owned':
        return 'Vous n\'avez marqué aucun livre comme "possédé". Vous pouvez le faire via le bouton "Possédés" au-dessus.';
      case 'borrowed':
        return 'Vous n\'avez marqué aucun livre comme "emprunté". Vous pouvez vous rendre sur vos livres lus ou à lire et en cliquant sur le bouton d\'edit d\'un livre, le marqué comme "emprunté".';
      case 'loaned':
        return 'Vous n\'avez marqué aucun livre comme "prêté". Vous pouvez vous rendre sur vos livres lus ou à lire et en cliquant sur le bouton d\'edit d\'un livre, le marqué comme "emprunté".';
      default:
        return "Vous n'avez aucun livre à afficher pour cette sélection.";
    }
  });

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
      : this.selectedView() === 'loaned'
      ? 'Livres prêtés'
      : this.selectedView() === 'authors'
      ? 'Livres par auteur'
      : this.selectedView() === 'sagas'
      ? 'Livres par saga'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'Livres lus'
  );

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
