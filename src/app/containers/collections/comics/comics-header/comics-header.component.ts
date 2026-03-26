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
import { ComicView } from '../comics.utils';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { CanEditDirective } from '../../../../directives/can-edit.directive';

@Component({
  selector: 'app-comics-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    CanEditDirective,
  ],
  templateUrl: './comics-header.component.html',
  styleUrls: ['./comics-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComicsHeaderComponent {
  onViewChange = output<ComicView>();
  onOpenViewConfig = output<void>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  showTopFiveRank = input<boolean>(false);
  selectedView = input<ComicView>('read');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allComicsCount = input<number>(0);
  allReadlistComicsCount = input<number>(0);
  filteredComicsCount = input<number>(0);
  recommendedComicsCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas d'items). */
  showFiltersAndSearch = input<boolean>(true);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: ComicView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly activatedRoute = inject(ActivatedRoute);
  selectedSort = signal<string>('rating');
  searchTerm = signal<string>('');

  addComicsButtonLabel = computed(() =>
    this.selectedView() === 'readlist'
      ? 'Ajouter des comics à lire'
      : 'Ajouter des comics'
  );

  canShowAddComicsButton = computed(
    () => this.selectedView() === 'read' || this.selectedView() === 'readlist'
  );

  canShowUpdateComicsRatingButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateComicsTimesReadButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateComicsOwnedButton = computed(
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
      (this.filteredComicsCount() > 0 && this.searchTerm() === '') ||
      (this.searchTerm() !== '' &&
        (this.selectedView() === 'read' ||
          this.selectedView() === 'readlist' ||
          this.selectedView() === 'toReRead' ||
          this.selectedView() === 'owned' ||
          this.selectedView() === 'recommendations'))
  );

  noDataForThisView = computed(
    () => this.filteredComicsCount() === 0 && this.searchTerm() === ''
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'read':
        return "Vous n'avez renseigné aucun comic lu";
      case 'readlist':
        return 'Vous n\'avez marqué aucun comic comme "à lire". Vous pouvez le faire via le bouton au-dessus.';
      case 'toReRead':
        return 'Vous n\'avez marqué aucun comic comme "à relire". Rendez-vous sur vos comics lus et éditez une fiche pour la marquer comme "à relire".';
      case 'owned':
        return 'Vous n\'avez marqué aucun comic comme "possédé". Utilisez le bouton "Possédés" au-dessus.';
      case 'borrowed':
        return 'Vous n\'avez marqué aucun comic comme "emprunté". Sur vos comics lus ou à lire, éditez une fiche pour indiquer l\'emprunt.';
      case 'loaned':
        return 'Vous n\'avez marqué aucun comic comme "prêté". Sur vos comics lus ou à lire, éditez une fiche pour indiquer le prêt.';
      case 'sagas':
        return "Aucun comic à regrouper par saga pour l'instant. Ajoutez des comics ou complétez le champ saga.";
      case 'recommendations':
        return 'Aucune recommandation pour le moment.';
      default:
        return "Vous n'avez aucun comic à afficher pour cette sélection.";
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

  comicsPageTitle = computed(() =>
    this.selectedView() === 'readlist'
      ? 'Comics à lire'
      : this.selectedView() === 'owned'
      ? 'Comics possédés'
      : this.selectedView() === 'borrowed'
      ? 'Comics empruntés'
      : this.selectedView() === 'loaned'
      ? 'Comics prêtés'
      : this.selectedView() === 'toReRead'
      ? 'Comics à relire'
      : this.selectedView() === 'sagas'
      ? 'Comics par saga'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'Comics lus'
  );

  getSelectComicsRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-comics` : '/select-comics';
  }

  getSelectComicsRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-comics-rating`
      : '/select-comics-rating';
  }

  getSelectComicsTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-comics-times-read`
      : '/select-comics-times-read';
  }

  getSelectComicsOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-comics-owned`
      : '/select-comics-owned';
  }
}
