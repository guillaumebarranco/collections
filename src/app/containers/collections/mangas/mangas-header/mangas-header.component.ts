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
import { MangaView } from '../mangas.utils';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { CanEditDirective } from '../../../../directives/can-edit.directive';

@Component({
  selector: 'app-mangas-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    CanEditDirective,
  ],
  templateUrl: './mangas-header.component.html',
  styleUrls: ['./mangas-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangasHeaderComponent {
  onViewChange = output<MangaView>();
  onOpenViewConfig = output<void>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  showTopFiveRank = input<boolean>(false);
  selectedView = input<MangaView>('read');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allMangasCount = input<number>(0);
  allReadlistMangasCount = input<number>(0);
  filteredMangasCount = input<number>(0);
  recommendedMangasCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas d'items). */
  showFiltersAndSearch = input<boolean>(true);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: MangaView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly activatedRoute = inject(ActivatedRoute);

  selectedSort = signal<string>('rating');
  searchTerm = signal<string>('');

  addMangasButtonLabel = computed(() =>
    this.selectedView() === 'readlist' ||
    this.selectedView() === 'readingInProgress'
      ? 'Ajouter des mangas à lire'
      : 'Ajouter des mangas'
  );

  canShowAddMangasButton = computed(
    () =>
      this.selectedView() === 'read' ||
      this.selectedView() === 'readlist' ||
      this.selectedView() === 'readingInProgress'
  );

  canShowUpdateMangasRatingButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateMangasTimesReadButton = computed(
    () => this.selectedView() === 'read'
  );

  canShowUpdateMangasOwnedButton = computed(
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
      (this.filteredMangasCount() > 0 && this.searchTerm() === '') ||
      (this.searchTerm() !== '' &&
        (this.selectedView() === 'read' ||
          this.selectedView() === 'readlist' ||
          this.selectedView() === 'readingInProgress' ||
          this.selectedView() === 'toReRead' ||
          this.selectedView() === 'owned' ||
          this.selectedView() === 'recommendations'))
  );

  noDataForThisView = computed(
    () => this.filteredMangasCount() === 0 && this.searchTerm() === ''
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'read':
        return "Vous n'avez renseigné aucun manga lu";
      case 'readlist':
        return 'Vous n\'avez marqué aucun manga comme "à lire". Vous pouvez le faire via le bouton au-dessus.';
      case 'readingInProgress':
        return "Vous n'avez aucun manga en cours de lecture. Depuis « Mangas à lire », utilisez « J'ai commencé ce manga » sur un titre.";
      case 'toReRead':
        return 'Vous n\'avez marqué aucun manga comme "à relire". Rendez-vous sur vos mangas lus et éditez une fiche pour le marquer comme "à relire".';
      case 'owned':
        return 'Vous n\'avez marqué aucun manga comme "possédé". Utilisez le bouton "Possédés" au-dessus.';
      case 'borrowed':
        return 'Vous n\'avez marqué aucun manga comme "emprunté". Sur vos mangas lus ou à lire, éditez une fiche pour indiquer l\'emprunt.';
      case 'loaned':
        return 'Vous n\'avez marqué aucun manga comme "prêté". Sur vos mangas lus ou à lire, éditez une fiche pour indiquer le prêt.';
      case 'recommendations':
        return 'Aucune recommandation pour le moment.';
      default:
        return "Vous n'avez aucun manga à afficher pour cette sélection.";
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

  mangasPageTitle = computed(() =>
    this.selectedView() === 'readlist'
      ? 'Mangas à lire'
      : this.selectedView() === 'readingInProgress'
      ? 'Mangas en cours de lecture'
      : this.selectedView() === 'owned'
      ? 'Mangas possédés'
      : this.selectedView() === 'borrowed'
      ? 'Mangas empruntés'
      : this.selectedView() === 'loaned'
      ? 'Mangas prêtés'
      : this.selectedView() === 'toReRead'
      ? 'Mangas à relire'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'Mangas lus'
  );

  getSelectMangasRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-mangas` : '/select-mangas';
  }

  getSelectMangasRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-mangas-rating`
      : '/select-mangas-rating';
  }

  getSelectMangasTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-mangas-times-read`
      : '/select-mangas-times-read';
  }

  getSelectMangasOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-mangas-owned`
      : '/select-mangas-owned';
  }
}
