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
import { SerieView } from '../series.utils';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { CanEditDirective } from '../../../../directives/can-edit.directive';

@Component({
  selector: 'app-series-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    CanEditDirective,
  ],
  templateUrl: './series-header.component.html',
  styleUrls: ['./series-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesHeaderComponent {
  onViewChange = output<SerieView>();
  onOpenViewConfig = output<void>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  showTopFiveRank = input<boolean>(false);
  selectedView = input<SerieView>('finished');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allSeriesCount = input<number>(0);
  filteredSeriesCount = input<number>(0);
  recommendedSeriesCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas d'items). */
  showFiltersAndSearch = input<boolean>(true);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: SerieView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly activatedRoute = inject(ActivatedRoute);
  selectedSort = signal<string>('rating');
  searchTerm = signal<string>('');

  addSeriesButtonLabel = computed(() =>
    this.selectedView() === 'watchlist'
      ? 'Ajouter des séries à voir'
      : 'Ajouter une série'
  );

  canShowAddSeriesButton = computed(
    () =>
      this.selectedView() === 'finished' || this.selectedView() === 'watchlist'
  );

  canShowUpdateSeriesRatingButton = computed(
    () => this.selectedView() === 'finished'
  );

  canShowUpdateSeriesTimesWatchedButton = computed(
    () => this.selectedView() === 'finished'
  );

  canShowUpdateSeriesOwnedButton = computed(
    () =>
      this.selectedView() === 'finished' ||
      this.selectedView() === 'watchlist' ||
      this.selectedView() === 'owned'
  );

  canShowTopFiveRankButton = computed(() => this.selectedView() === 'finished');

  canShowSortDropdown = computed(
    () =>
      this.selectedView() === 'finished' || this.selectedView() === 'watchlist'
  );

  canShowFiltersAndSearch = computed(
    () =>
      (this.filteredSeriesCount() > 0 && this.searchTerm() === '') ||
      (this.searchTerm() !== '' &&
        (this.selectedView() === 'finished' ||
          this.selectedView() === 'watchlist' ||
          this.selectedView() === 'toReWatch' ||
          this.selectedView() === 'owned' ||
          this.selectedView() === 'recommendations'))
  );

  noDataForThisView = computed(
    () => this.filteredSeriesCount() === 0 && this.searchTerm() === ''
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'finished':
        return "Vous n'avez renseigné aucune série terminée";
      case 'watchlist':
        return 'Vous n\'avez marqué aucune série comme "à voir". Vous pouvez le faire via le bouton au-dessus.';
      case 'toReWatch':
        return 'Vous n\'avez marqué aucune série comme "à revoir". Rendez-vous sur vos séries terminées et éditez une fiche pour la marquer comme "à revoir".';
      case 'owned':
        return 'Vous n\'avez marqué aucune série comme "possédée". Utilisez le bouton "Possédées" au-dessus.';
      case 'borrowed':
        return 'Vous n\'avez marqué aucune série comme "empruntée". Éditez une fiche pour indiquer l\'emprunt.';
      case 'loaned':
        return 'Vous n\'avez marqué aucune série comme "prêtée". Éditez une fiche pour indiquer le prêt.';
      case 'sagas':
        return "Aucune série à regrouper par saga pour l'instant. Ajoutez des séries ou complétez le champ saga.";
      case 'countries':
        return "Aucune donnée par pays pour l'instant. Complétez les pays sur vos séries.";
      case 'recommendations':
        return 'Aucune recommandation pour le moment.';
      default:
        return "Vous n'avez aucune série à afficher pour cette sélection.";
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

  seriesPageTitle = computed(() =>
    this.selectedView() === 'watchlist'
      ? 'Séries à voir'
      : this.selectedView() === 'owned'
      ? 'Séries possédées'
      : this.selectedView() === 'borrowed'
      ? 'Séries empruntées'
      : this.selectedView() === 'loaned'
      ? 'Séries prêtées'
      : this.selectedView() === 'toReWatch'
      ? 'Séries à revoir'
      : this.selectedView() === 'sagas'
      ? 'Séries par saga'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : this.selectedView() === 'countries'
      ? 'Séries par pays'
      : 'Séries finies'
  );

  getSelectSeriesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-series` : '/select-series';
  }

  getSelectSeriesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-rating`
      : '/select-series-rating';
  }

  getSelectSeriesTimesWatchedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-times-watched`
      : '/select-series-times-watched';
  }

  getSelectSeriesOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-owned`
      : '/select-series-owned';
  }
}
