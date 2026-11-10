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
import { AnimeView } from '../animes.utils';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { EntitySearchFieldComponent } from '../../../../components/shared/entity-search-field/entity-search-field.component';
import { CanEditDirective } from '../../../../directives/can-edit.directive';
import { createCollectionHeaderMobileAccordion } from '../../../../utils/collection-header-mobile';
import { CollectionMobileBackComponent } from '../../../../components/shared/collection-mobile-back/collection-mobile-back.component';

@Component({
  selector: 'app-animes-header',
  imports: [
    RouterModule,
    EntitySearchFieldComponent,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    CanEditDirective,
    CollectionMobileBackComponent,
  ],
  templateUrl: './animes-header.component.html',
  styleUrls: ['./animes-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimesHeaderComponent {
  onViewChange = output<AnimeView>();
  onMobileBack = output<void>();
  onOpenViewConfig = output<void>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  showTopFiveRank = input<boolean>(false);
  selectedView = input<AnimeView>('finished');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allAnimesCount = input<number>(0);
  filteredAnimesCount = input<number>(0);
  recommendedAnimesCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas d'items). */
  showFiltersAndSearch = input<boolean>(true);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: AnimeView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mobileAccordion = createCollectionHeaderMobileAccordion();

  readonly isMobileViewport = this.mobileAccordion.isMobileViewport;
  readonly toolsPanelExpanded = this.mobileAccordion.toolsPanelExpanded;

  selectedSort = signal<string>('rating');
  searchTerm = signal<string>('');

  addAnimesButtonLabel = computed(() =>
    this.selectedView() === 'watchlist' ||
    this.selectedView() === 'watchingInProgress'
      ? 'Ajouter des animés à voir'
      : 'Ajouter un animé'
  );

  canShowAddAnimesButton = computed(
    () =>
      this.selectedView() === 'finished' ||
      this.selectedView() === 'watchlist' ||
      this.selectedView() === 'watchingInProgress'
  );

  canShowUpdateAnimesRatingButton = computed(
    () => this.selectedView() === 'finished'
  );

  canShowUpdateAnimesTimesWatchedButton = computed(
    () => this.selectedView() === 'finished'
  );

  canShowUpdateAnimesOwnedButton = computed(
    () =>
      this.selectedView() === 'finished' ||
      this.selectedView() === 'watchlist' ||
      this.selectedView() === 'watchingInProgress' ||
      this.selectedView() === 'owned'
  );

  canShowTopFiveRankButton = computed(() => this.selectedView() === 'finished');

  canShowSortDropdown = computed(
    () =>
      this.selectedView() === 'finished' ||
      this.selectedView() === 'watchlist' ||
      this.selectedView() === 'watchingInProgress'
  );

  canShowFiltersAndSearch = computed(
    () =>
      (this.filteredAnimesCount() > 0 && this.searchTerm() === '') ||
      (this.searchTerm() !== '' &&
        (this.selectedView() === 'finished' ||
          this.selectedView() === 'watchlist' ||
          this.selectedView() === 'watchingInProgress' ||
          this.selectedView() === 'toReWatch' ||
          this.selectedView() === 'owned' ||
          this.selectedView() === 'recommendations'))
  );

  noDataForThisView = computed(
    () => this.filteredAnimesCount() === 0 && this.searchTerm() === ''
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'finished':
        return "Vous n'avez renseigné aucun animé terminée";
      case 'watchlist':
        return 'Vous n\'avez marqué aucun animé comme "à voir". Vous pouvez le faire via le bouton au-dessus.';
      case 'watchingInProgress':
        return "Vous n'avez aucun animé en cours de visionnage. Depuis « Animés à voir », utilisez « J'ai commencé cet animé » sur un titre.";
      case 'toReWatch':
        return 'Vous n\'avez marqué aucun animé comme "à revoir". Rendez-vous sur vos animés terminés et éditez une fiche pour la marquer comme "à revoir".';
      case 'owned':
        return 'Vous n\'avez marqué aucun animé comme "possédée". Utilisez le bouton "Possédées" au-dessus.';
      case 'borrowed':
        return 'Vous n\'avez marqué aucun animé comme "empruntée". Éditez une fiche pour indiquer l\'emprunt.';
      case 'loaned':
        return 'Vous n\'avez marqué aucun animé comme "prêtée". Éditez une fiche pour indiquer le prêt.';
      case 'sagas':
        return "Aucun animé à regrouper par saga pour l'instant. Ajoutez des animés ou complétez le champ saga.";
      case 'countries':
        return "Aucune donnée par pays pour l'instant. Complétez les pays sur vos animés.";
      case 'recommendations':
        return 'Aucune recommandation pour le moment.';
      default:
        return "Vous n'avez aucun animé à afficher pour cette sélection.";
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

  toggleToolsPanel(): void {
    this.mobileAccordion.toggleToolsPanel();
  }

  handleSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.onSearchChange.emit(value);
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  animesPageTitle = computed(() =>
    this.selectedView() === 'watchlist'
      ? 'Animés à voir'
      : this.selectedView() === 'watchingInProgress'
      ? 'Animés en cours de visionnage'
      : this.selectedView() === 'owned'
      ? 'Animés possédées'
      : this.selectedView() === 'borrowed'
      ? 'Animés empruntées'
      : this.selectedView() === 'loaned'
      ? 'Animés prêtées'
      : this.selectedView() === 'toReWatch'
      ? 'Animés à revoir'
      : this.selectedView() === 'sagas'
      ? 'Animés par saga'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : this.selectedView() === 'countries'
      ? 'Animés par pays'
      : 'Animés vues'
  );

  getSelectAnimesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-animes` : '/select-animes';
  }

  getSelectAnimesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-animes-rating`
      : '/select-animes-rating';
  }

  getSelectAnimesTimesWatchedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-animes-times-watched`
      : '/select-animes-times-watched';
  }

  getSelectAnimesOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-animes-owned`
      : '/select-animes-owned';
  }
}
