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
import { MangaView } from '../mangas.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mangas-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './mangas-header.component.html',
  styleUrls: ['./mangas-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangasHeaderComponent {
  onViewChange = output<MangaView>();
  onSearchChange = output<string>();
  onSortChange = output<string>();

  selectedView = input<MangaView>('read');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allMangasCount = input<number>(0);
  allReadlistMangasCount = input<number>(0);
  filteredMangasCount = input<number>(0);
  recommendedMangasCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: MangaView;
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

  mangasPageTitle = computed(() => {
    if (this.isAdminView()) {
      return 'Mangas';
    }
    return this.selectedView() === 'readlist'
      ? 'Mangas à lire'
      : this.selectedView() === 'owned'
      ? 'Mangas possédés'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : 'Mangas lus';
  });

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

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
