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
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ManwhaView } from '../manwhas.utils';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { CanEditDirective } from '../../../../directives/can-edit.directive';

@Component({
  selector: 'app-manwhas-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    CanEditDirective,
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
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas d'items). */
  showFiltersAndSearch = input<boolean>(true);
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

  addManwhasButtonLabel = computed(() =>
    this.selectedView() === 'readlist'
      ? 'Ajouter des manwhas à lire'
      : 'Ajouter des manwhas'
  );

  canShowAddManwhasButton = computed(
    () => this.selectedView() === 'read' || this.selectedView() === 'readlist'
  );

  canShowUpdateManwhasRatingButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateManwhasTimesReadButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateManwhasOwnedButton = computed(
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
      (this.filteredManwhasCount() > 0 && this.searchTerm() === '') ||
      (this.searchTerm() !== '' &&
        (this.selectedView() === 'read' ||
          this.selectedView() === 'readlist' ||
          this.selectedView() === 'toReRead' ||
          this.selectedView() === 'owned' ||
          this.selectedView() === 'recommendations'))
  );

  noDataForThisView = computed(
    () => this.filteredManwhasCount() === 0 && this.searchTerm() === ''
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'read':
        return "Vous n'avez renseigné aucun manwha lu";
      case 'readlist':
        return 'Vous n\'avez marqué aucun manwha comme "à lire". Vous pouvez le faire via le bouton au-dessus.';
      case 'toReRead':
        return 'Vous n\'avez marqué aucun manwha comme "à relire". Rendez-vous sur vos manwhas lus et éditez une fiche pour le marquer comme "à relire".';
      case 'owned':
        return 'Vous n\'avez marqué aucun manwha comme "possédé". Utilisez le bouton "Possédés" au-dessus.';
      case 'borrowed':
        return 'Vous n\'avez marqué aucun manwha comme "emprunté". Sur vos manwhas lus ou à lire, éditez une fiche pour indiquer l\'emprunt.';
      case 'loaned':
        return 'Vous n\'avez marqué aucun manwha comme "prêté". Sur vos manwhas lus ou à lire, éditez une fiche pour indiquer le prêt.';
      case 'recommendations':
        return 'Aucune recommandation pour le moment.';
      default:
        return "Vous n'avez aucun manwha à afficher pour cette sélection.";
    }
  });

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
      : this.selectedView() === 'borrowed'
      ? 'Manwhas empruntés'
      : this.selectedView() === 'loaned'
      ? 'Manwhas prêtés'
      : this.selectedView() === 'toReRead'
      ? 'Manwhas à relire'
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
