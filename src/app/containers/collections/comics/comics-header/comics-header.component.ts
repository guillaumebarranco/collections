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
