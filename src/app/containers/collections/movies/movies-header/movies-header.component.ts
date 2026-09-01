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
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { MovieView } from '../movies.utils';
import { FormsModule } from '@angular/forms';
import { DEFAULT_USER_ID } from '../../../../utils/constants';
import type { UserMovieListItem } from '../../../../models/movie-list.model';
import { CanEditDirective } from '../../../../directives/can-edit.directive';
import { createCollectionHeaderMobileAccordion } from '../../../../utils/collection-header-mobile';

@Component({
  selector: 'app-movies-header',
  imports: [RouterModule, FormsModule, ViewToggleComponent, CanEditDirective],
  templateUrl: './movies-header.component.html',
  styleUrls: ['./movies-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesHeaderComponent {
  onViewChange = output<MovieView>();
  onOpenViewConfig = output<void>();
  onYearFilterChange = output<string>();
  onSearchChange = output<string>();
  onSortChange = output<string>();
  onTopFiveRankChange = output<void>();
  onListFilterChange = output<string | null>();
  onDeleteMovieList = output<string>();

  selectedView = input<MovieView>('watched');
  showTopFiveRank = input<boolean>(false);
  allMoviesCount = input<number>(0);
  filteredMoviesByYearCount = input<number>(0);
  recommendedMoviesCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas de films). */
  showFiltersAndSearch = input<boolean>(true);
  /** Listes de films de l'utilisateur (filtre par liste sur les vues "Films visionnés" et "Films à voir"). */
  userMoviesLists = input<UserMovieListItem[]>([]);
  /** Noms des listes sans aucun film (supprimables). */
  emptyMovieListNames = input<ReadonlySet<string>>(new Set());
  /** Liste actuellement sélectionnée pour filtrer (null = pas de filtre). */
  selectedListFilter = input<string | null>(null);
  searchTermInput = input<string>('');
  visibleMovieViewOptions = input<
    {
      value: MovieView;
      label: string;
    }[]
  >([]);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mobileAccordion = createCollectionHeaderMobileAccordion();

  readonly isMobileViewport = this.mobileAccordion.isMobileViewport;
  readonly toolsPanelExpanded = this.mobileAccordion.toolsPanelExpanded;

  searchTerm = signal<string>('');

  constructor() {
    effect(() => {
      this.searchTerm.set(this.searchTermInput());
    });
  }

  toggleToolsPanel(): void {
    this.mobileAccordion.toggleToolsPanel();
  }

  addMoviesButtonLabel = computed(() =>
    this.selectedView() === 'watchlist'
      ? 'Ajouter des films à voir'
      : this.selectedView() === 'cinema'
      ? 'Modifier mes films vus au cinema'
      : 'Ajouter des films vus'
  );

  canShowAddMoviesButton = computed(
    () =>
      this.selectedView() === 'watched' ||
      this.selectedView() === 'watchlist' ||
      this.selectedView() === 'cinema'
  );

  canShowUpdateMoviesRatingButton = computed(
    () => this.selectedView() === 'watched' || this.selectedView() === 'cinema'
  );

  canShowUpdateMoviesTimesWatchedButton = computed(
    () => this.selectedView() === 'watched' || this.selectedView() === 'cinema'
  );

  canShowUpdateMoviesOwnedButton = computed(
    () =>
      this.selectedView() === 'watched' ||
      this.selectedView() === 'cinema' ||
      this.selectedView() === 'owned'
  );

  canShowTopFiveRankButton = computed(() => this.selectedView() === 'watched');

  canShowFiltersAndSearch = computed(
    () =>
      (this.searchTerm() !== '' ||
        (this.filteredMoviesByYearCount() > 0 && this.searchTerm() === '')) &&
      (this.selectedView() === 'watched' ||
        this.selectedView() === 'watchlist' ||
        this.selectedView() === 'cinema' ||
        this.selectedView() === 'owned')
  );

  noDataForThisView = computed(
    () =>
      this.filteredMoviesByYearCount() === 0 &&
      this.searchTerm() === '' &&
      this.selectedListFilter() === null
  );

  noDataMessageText = computed(() => {
    switch (this.selectedView()) {
      case 'watched':
        return "Vous n'avez renseigné aucun film visionné";
      case 'watchlist':
        return 'Vous n\'avez marqué aucun film comme "à voir". Vous pouvez le faire via le bouton au-dessus.';
      case 'toReWatch':
        return 'Vous n\'avez marqué aucun film comme "à revoir". Rendez-vous sur vos films visionnés et éditez une fiche pour le marquer comme "à revoir".';
      case 'cinema':
        return "Vous n'avez indiqué aucun film vu au cinéma. Sélectionnez parmi vos films vus ceux vus au cinéma.";
      case 'owned':
        return 'Vous n\'avez marqué aucun film comme "possédé". Utilisez le bouton "Possédés" au-dessus.';
      case 'borrowed':
        return 'Vous n\'avez marqué aucun film comme "emprunté". Éditez une fiche pour indiquer l\'emprunt.';
      case 'loaned':
        return 'Vous n\'avez marqué aucun film comme "prêté". Éditez une fiche pour indiquer le prêt.';
      case 'sagas':
        return "Aucun film à regrouper par saga pour l'instant. Complétez les sagas sur vos films.";
      case 'actors':
        return 'Aucun film à afficher par acteur. Ajoutez des acteurs ou des films.';
      case 'directors':
        return 'Aucun film à afficher par réalisateur. Ajoutez des réalisateurs ou des films.';
      case 'countries':
        return 'Aucun film à afficher par pays. Complétez les pays sur vos films.';
      case 'oscars':
        return 'Aucun film oscarisé à afficher pour le moment.';
      case 'oscarsByYear':
        return 'Aucun film oscarisé à afficher par année pour le moment.';
      case 'recommendations':
        return 'Aucune recommandation pour le moment.';
      default:
        return "Vous n'avez aucun film à afficher pour cette sélection.";
    }
  });

  handleSearchChange(value: string): void {
    // IMPORTANT: on met aussi à jour le signal local
    // pour que `canShowFiltersAndSearch()` ne cache pas les filtres pendant qu'on tape.
    this.searchTerm.set(value);
    this.onSearchChange.emit(value);
  }

  moviesPageTitle = computed(() =>
    this.selectedView() === 'watchlist'
      ? 'Films à voir'
      : this.selectedView() === 'cinema'
      ? 'Films vus au cinéma'
      : this.selectedView() === 'sagas'
      ? 'Films par saga'
      : this.selectedView() === 'actors'
      ? 'Films par acteur'
      : this.selectedView() === 'directors'
      ? 'Films par réalisateur'
      : this.selectedView() === 'countries'
      ? 'Films par pays'
      : this.selectedView() === 'oscars'
      ? 'Films par Oscars'
      : this.selectedView() === 'oscarsByYear'
      ? 'Films par Oscars (années)'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : this.selectedView() === 'owned'
      ? 'Films possédés'
      : this.selectedView() === 'borrowed'
      ? 'Films empruntés'
      : this.selectedView() === 'loaned'
      ? 'Films prêtés'
      : this.selectedView() === 'toReWatch'
      ? 'Films à revoir'
      : 'Films visionnés'
  );

  getSelectMoviesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-movies` : '/select-movies';
  }

  getSelectWatchlistRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    const userId = hasNameParam ? params['id'] : DEFAULT_USER_ID;
    return hasNameParam ? [`/${userId}`, 'select-movies'] : ['/select-movies'];
  }

  getSelectCinemaRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? [`/${params['id']}`, 'select-movies']
      : ['/select-movies'];
  }

  getSelectMoviesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-rating`
      : '/select-movies-rating';
  }

  getSelectMoviesTimesWatchedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-times-watched`
      : '/select-movies-times-watched';
  }

  getSelectMoviesOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-movies-owned`
      : '/select-movies-owned';
  }
}
