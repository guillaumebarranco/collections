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
import { ChildrenBookView } from '../children-books.utils';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { DEFAULT_USER_ID } from '../../../../utils/constants';
import { createCollectionHeaderMobileAccordion } from '../../../../utils/collection-header-mobile';
import { CanEditDirective } from '../../../../directives/can-edit.directive';

@Component({
  selector: 'app-children-books-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    CanEditDirective,
  ],
  templateUrl: './children-books-header.component.html',
  styleUrls: ['./children-books-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenBooksHeaderComponent {
  onViewChange = output<ChildrenBookView>();
  onOpenViewConfig = output<void>();
  onYearFilterChange = output<string>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  selectedView = input<ChildrenBookView>('read');
  selectedSortInput = input<string>('readDate');
  selectedYearFilterInput = input<string>('all');
  searchTermInput = input<string>('');
  allChildrenBooksCount = input<number>(0);
  filteredChildrenBooksCount = input<number>(0);
  recommendedChildrenBooksCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas de livres lus). */
  showFiltersAndSearch = input<boolean>(true);
  sortOptions = input<SortOption[]>([]);
  yearFilterOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: ChildrenBookView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();
  showTopFiveRank = input<boolean>(false);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mobileAccordion = createCollectionHeaderMobileAccordion();

  readonly isMobileViewport = this.mobileAccordion.isMobileViewport;
  readonly toolsPanelExpanded = this.mobileAccordion.toolsPanelExpanded;

  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
  searchTerm = signal<string>('');

  addChildrenBooksButtonLabel = computed(() =>
    this.selectedView() === 'readlist' ||
    this.selectedView() === 'readingInProgress'
      ? 'Ajouter des livres à lire'
      : 'Ajouter des livres lus'
  );

  canShowAddChildrenBooksButton = computed(
    () =>
      this.selectedView() === 'read' ||
      this.selectedView() === 'readlist' ||
      this.selectedView() === 'readingInProgress'
  );

  canShowUpdateChildrenBooksRatingButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateChildrenBooksTimesReadButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateChildrenBooksOwnedButton = computed(
    () =>
      this.selectedView() === 'read' ||
      this.selectedView() === 'readlist' ||
      this.selectedView() === 'readingInProgress' ||
      this.selectedView() === 'owned'
  );

  canShowTopFiveRankButton = computed(() => this.selectedView() === 'read');

  canShowSortDropdown = computed(
    () =>
      this.selectedView() === 'read' ||
      this.selectedView() === 'readlist' ||
      this.selectedView() === 'readingInProgress'
  );

  canShowFiltersAndSearch = computed(
    () =>
      (this.filteredChildrenBooksCount() > 0 && this.searchTerm() === '') ||
      (this.searchTerm() !== '' &&
        (this.selectedView() === 'read' ||
          this.selectedView() === 'readlist' ||
          this.selectedView() === 'readingInProgress' ||
          this.selectedView() === 'toReRead' ||
          this.selectedView() === 'owned' ||
          this.selectedView() === 'recommendations'))
  );

  noDataForThisView = computed(
    () => this.filteredChildrenBooksCount() === 0 && this.searchTerm() === ''
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'read':
        return "Vous n'avez renseigné aucun livre lu";
      case 'readlist':
        return 'Vous n\'avez marqué aucun livre comme "à lire". Vous pouvez le faire via le bouton au-dessus.';
      case 'readingInProgress':
        return "Vous n'avez aucun livre en cours de lecture. Depuis « À lire », utilisez « J'ai commencé ce livre » sur un titre.";
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

  toggleToolsPanel(): void {
    this.mobileAccordion.toggleToolsPanel();
  }

  childrenBooksPageTitle = computed(() =>
    this.selectedView() === 'readlist'
      ? 'Livres pour enfants à lire'
      : this.selectedView() === 'readingInProgress'
      ? 'Livres pour enfants en cours de lecture'
      : this.selectedView() === 'owned'
      ? 'Livres pour enfants possédés'
      : this.selectedView() === 'borrowed'
      ? 'Livres pour enfants empruntés'
      : this.selectedView() === 'loaned'
      ? 'Livres pour enfants prêtés'
      : this.selectedView() === 'authors'
      ? 'Livres pour enfants par auteur'
      : this.selectedView() === 'sagas'
      ? 'Livres pour enfants par saga'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'Livres pour enfants lus'
  );

  getSelectChildrenBooksRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-children-books` : '/select-children-books';
  }

  getSelectChildrenBooksRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-children-books-rating`
      : '/select-children-books-rating';
  }

  getSelectChildrenBooksTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-children-books-times-read`
      : '/select-children-books-times-read';
  }

  getSelectChildrenBooksOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-children-books-owned`
      : '/select-children-books-owned';
  }
}
