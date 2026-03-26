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
import { GameView } from '../games.utils';
import { StatItem } from '../../../../components/shared/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';
import { CanEditDirective } from '../../../../directives/can-edit.directive';

@Component({
  selector: 'app-games-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    CanEditDirective,
  ],
  templateUrl: './games-header.component.html',
  styleUrls: ['./games-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesHeaderComponent {
  onViewChange = output<GameView>();
  onOpenViewConfig = output<void>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();

  showTopFiveRank = input<boolean>(false);
  selectedView = input<GameView>('played');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allGamesCount = input<number>(0);
  allGamelistGamesCount = input<number>(0);
  filteredGamesCount = input<number>(0);
  recommendedGamesCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas d'items). */
  showFiltersAndSearch = input<boolean>(true);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: GameView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly activatedRoute = inject(ActivatedRoute);
  selectedSort = signal<string>('rating');
  searchTerm = signal<string>('');

  addGamesButtonLabel = computed(() =>
    this.selectedView() === 'gamelist'
      ? 'Ajouter des jeux à jouer'
      : 'Ajouter un jeu'
  );

  canShowAddGamesButton = computed(
    () => this.selectedView() === 'played' || this.selectedView() === 'gamelist'
  );

  canShowUpdateGamesRatingButton = computed(
    () => this.selectedView() === 'played'
  );

  canShowUpdateGamesTimesFinishedButton = computed(
    () => this.selectedView() === 'played'
  );

  canShowUpdateGamesOwnedButton = computed(
    () =>
      this.selectedView() === 'played' ||
      this.selectedView() === 'gamelist' ||
      this.selectedView() === 'owned'
  );

  canShowTopFiveRankButton = computed(() => this.selectedView() === 'played');

  canShowSortDropdown = computed(
    () => this.selectedView() === 'played' || this.selectedView() === 'gamelist'
  );

  canShowFiltersAndSearch = computed(
    () =>
      (this.filteredGamesCount() > 0 && this.searchTerm() === '') ||
      (this.searchTerm() !== '' &&
        (this.selectedView() === 'played' ||
          this.selectedView() === 'gamelist' ||
          this.selectedView() === 'owned' ||
          this.selectedView() === 'recommendations'))
  );

  noDataForThisView = computed(
    () => this.filteredGamesCount() === 0 && this.searchTerm() === ''
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'played':
        return "Vous n'avez renseigné aucun jeu dans votre ludothèque jouée";
      case 'gamelist':
        return 'Vous n\'avez marqué aucun jeu comme "à jouer". Vous pouvez le faire via le bouton au-dessus.';
      case 'platined':
        return 'Vous n\'avez marqué aucun jeu comme "platiné".';
      case 'owned':
        return 'Vous n\'avez marqué aucun jeu comme "possédé". Utilisez le bouton "Possédés" au-dessus.';
      case 'borrowed':
        return 'Vous n\'avez marqué aucun jeu comme "emprunté". Éditez une fiche jeu pour indiquer l\'emprunt.';
      case 'loaned':
        return 'Vous n\'avez marqué aucun jeu comme "prêté". Éditez une fiche jeu pour indiquer le prêt.';
      case 'finished':
        return 'Vous n\'avez marqué aucun jeu comme "terminé".';
      case 'toRePlay':
        return 'Vous n\'avez marqué aucun jeu comme "à rejouer".';
      case 'recommendations':
        return 'Aucune recommandation pour le moment.';
      default:
        return "Vous n'avez aucun jeu à afficher pour cette sélection.";
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

  gamesPageTitle = computed(() =>
    this.selectedView() === 'gamelist'
      ? '🎮 Jeux à jouer'
      : this.selectedView() === 'owned'
      ? '🎮 Jeux possédés'
      : this.selectedView() === 'borrowed'
      ? '🎮 Jeux empruntés'
      : this.selectedView() === 'loaned'
      ? '🎮 Jeux prêtés'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : '🎮 Jeux vidéo'
  );

  getSelectGamesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-games` : '/select-games';
  }

  getSelectGamesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-games-rating`
      : '/select-games-rating';
  }

  getSelectGamesTimesFinishedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-games-times-finished`
      : '/select-games-times-finished';
  }

  getSelectGamesOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-games-owned`
      : '/select-games-owned';
  }
}
