import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/view-toggle/view-toggle.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MovieView } from '../movies.utils';
import { FormsModule } from '@angular/forms';
import { DEFAULT_USER_ID } from '../../../../utils/constants';

@Component({
  selector: 'app-movies-header',
  imports: [RouterModule, FormsModule, ViewToggleComponent],
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

  selectedView = input<MovieView>('watched');
  showTopFiveRank = input<boolean>(false);
  allMoviesCount = input<number>(0);
  filteredMoviesByYearCount = input<number>(0);
  recommendedMoviesCount = input<number>(0);
  visibleMovieViewOptions = input<
    {
      value: MovieView;
      label: string;
    }[]
  >([]);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

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
      : this.selectedView() === 'toReWatch'
      ? 'Films à revoir'
      : 'Films visionnés'
  );

  private userId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

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
