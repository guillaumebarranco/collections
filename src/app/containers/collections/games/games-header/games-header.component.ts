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
import { GameView } from '../games.utils';
import { StatItem } from '../../../../components/stats-display/stats-display.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-games-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './games-header.component.html',
  styleUrls: ['./games-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesHeaderComponent {
  onViewChange = output<GameView>();
  onSearchChange = output<string>();
  onSortChange = output<string>();

  selectedView = input<GameView>('played');
  selectedSortInput = input<string>('rating');
  searchTermInput = input<string>('');
  allGamesCount = input<number>(0);
  allGamelistGamesCount = input<number>(0);
  filteredGamesCount = input<number>(0);
  recommendedGamesCount = input<number>(0);
  sortOptions = input<SortOption[]>([]);
  viewOptions = input<
    {
      value: GameView;
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

  gamesPageTitle = computed(() => {
    if (this.isAdminView()) {
      return 'Jeux';
    }
    return this.selectedView() === 'gamelist'
      ? '🎮 Jeux à jouer'
      : this.selectedView() === 'owned'
      ? '🎮 Jeux possédés'
      : this.selectedView() === 'recommendations'
      ? 'Recommandations'
      : '🎮 Jeux vidéo';
  });

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

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
