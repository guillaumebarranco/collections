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
import { ViewToggleComponent } from '../../../../components/view-toggle/view-toggle.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../../components/sort-dropdown/sort-dropdown.component';
import { StatsDisplayComponent } from '../../../../components/stats-display/stats-display.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { ComicView } from '../comics.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comics-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './comics-header.component.html',
  styleUrls: ['./comics-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComicsHeaderComponent {
  onViewChange = output<ComicView>();
  onSearchChange = output<string>();
  onSortChange = output<string>();

  selectedView = input<ComicView>('read');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allComicsCount = input<number>(0);
  allReadlistComicsCount = input<number>(0);
  filteredComicsCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: ComicView;
      label: string;
    }[]
  >([]);
  stats = input.required<StatItem[]>();

  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

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

  comicsPageTitle = computed(() => {
    if (this.isAdminView()) {
      return 'Comics';
    }
    return this.selectedView() === 'readlist'
      ? 'Comics à lire'
      : this.selectedView() === 'owned'
      ? 'Comics possédés'
      : 'Comics lus';
  });

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

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
