import {
  ChangeDetectionStrategy,
  Component,
  computed,
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

  selectedView = input<MovieView>('watched');
  showTopFiveRank = input<boolean>(false);
  allMoviesCount = input<number>(0);
  filteredMoviesByYearCount = input<number>(0);
  recommendedMoviesCount = input<number>(0);
  /** Afficher le bloc stats, filtres et la recherche (masqué quand l'utilisateur n'a pas de films). */
  showFiltersAndSearch = input<boolean>(true);
  /** Listes de films de l'utilisateur (pour filtre par liste sur la vue "Films visionnés"). */
  userMoviesLists = input<UserMovieListItem[]>([]);
  /** Liste actuellement sélectionnée pour filtrer (null = pas de filtre). */
  selectedListFilter = input<string | null>(null);
  visibleMovieViewOptions = input<
    {
      value: MovieView;
      label: string;
    }[]
  >([]);

  private readonly activatedRoute = inject(ActivatedRoute);

  searchTerm = signal<string>('');

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
