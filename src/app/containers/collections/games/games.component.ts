import {
  Component,
  computed,
  inject,
  signal,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from '../../../components/game/game.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  ViewToggleComponent,
  ViewToggleOption,
} from '../../../components/view-toggle/view-toggle.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Game } from '../../../models/game-model';
import { Quizz } from '../../../models/quizz-model';
import {
  formatTimeStats,
  ItemWithGameLength,
  TimeStats,
} from '../../../utils/stats.utils';
import {
  GameView,
  gameViewOptions,
  gamesSortOptions,
  getSortedGames,
} from './games.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseGames,
  getAllGames,
  getAllGamelistGames,
} from '../../../facades/games/games.facade';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';

import {
  getTotalTimeToFinishGames,
  getTotalPlayedTime,
  getTotalTimeToFinishGamesAtHundredPercent,
} from '../../../utils/games.utils';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    GameComponent,
    MenuComponent,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    QuizzModalComponent,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'games_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<GameView>('played');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  sortOptions = signal<SortOption[]>(gamesSortOptions);

  viewOptions = computed<ViewToggleOption[]>(() => {
    const options: ViewToggleOption[] = gameViewOptions;

    if (this.platinedGames().length === 0) {
      return options.filter((option) => option.value !== 'platined');
    }

    return options;
  });

  gamesList = signal<{ [key: string]: Game[] }>({});
  gamelistGamesList = signal<{ [key: string]: Game[] }>({});
  adminGamesList = signal<Game[]>([]);

  constructor() {
    effect(() => {
      if (this.isLoadingPreferences || this.isAdminView()) return;
      const preferences = {
        view: this.selectedView(),
        sort: this.selectedSort(),
      };
      this.localStorageService.setItem(
        this.viewPreferencesStorageKey,
        preferences
      );
    });
  }

  allGames = computed<Game[]>(() => {
    if (this.isAdminView()) {
      return this.adminGamesList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamesList()[params['id']] || []
      : this.gamesList()['guillaume'];
  });

  allGamelistGames = computed<Game[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamelistGamesList()[params['id']] || []
      : this.gamelistGamesList()['guillaume'];
  });

  filteredGames = computed<Game[]>(() => {
    let games = this.allGames();
    if (this.isAdminView()) {
      games = this.allGames();
    } else if (this.selectedView() === 'gamelist') {
      games = this.allGamelistGames();
    } else if (this.selectedView() === 'platined') {
      games = this.allGames().filter((game) => game.platined);
    } else if (this.selectedView() === 'owned') {
      games = this.allGames().filter((game) => game.owned);
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return games;
    }

    return games.filter((game) => this.matchesSearch(game, term));
  });

  platinedGames = computed<Game[]>(() => {
    return this.allGames().filter((game) => game.platined);
  });

  sortedGames = computed<Game[]>(() =>
    getSortedGames([...this.filteredGames()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const totalTimeToFinishGames = getTotalTimeToFinishGames(
      this.filteredGames()
    );
    const totalTimeToFinishGamesAtHundredPercent =
      getTotalTimeToFinishGamesAtHundredPercent(this.filteredGames());
    const totalPlayTime = getTotalPlayedTime(this.filteredGames());
    const totalPlatines = this.filteredGames().filter(
      (game) => game.platined
    ).length;

    return [
      {
        label: 'Temps total pour terminer tous les jeux',
        value: totalTimeToFinishGames.formatted,
        icon: '🎮',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total pour platiner/100% tous les jeux',
        value: totalTimeToFinishGamesAtHundredPercent.formatted,
        icon: '🎮',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé à jouer',
        value: totalPlayTime.formatted,
        icon: '⏱️',
        color: StatItemColor.PRIMARY,
      },
      {
        label: 'Nombre de trophées platines (PlayStation)',
        value: `${totalPlatines}`,
        icon: '🏆',
        color: StatItemColor.WARNING,
      },
    ];
  });

  ngOnInit() {
    if (this.isAdminView()) {
      this.selectedView.set('finished');
    }
    void this.refreshQuizzs();
    this.loadViewPreferencesFromStorage();
    void this.refreshGames();
  }

  async refreshGames() {
    if (this.isAdminView()) {
      const baseGames = await getAllBaseGames();
      const games = baseGames.map((game) => ({
        title: game.title,
        editor: game.editor,
        hero: game.hero,
        coverUrl: game.coverUrl,
        releaseDate: game.releaseDate,
        averageTimeToFinish: game.averageTimeToFinish,
        averageTimeToHundredPercent: game.averageTimeToHundredPercent,
        platform: game.platform,
        saga: game.saga,
        platineTime: game.platineTime,
        rating: 0,
        timesFinished: 0,
        timesFinishedHundredPercent: 0,
        additionnalEstimatedTime: 0,
        platined: false,
        owned: false,
      }));
      this.adminGamesList.set(games);
      return;
    }

    const userId = this.getActiveUserId();
    const [games, gamelist] = await Promise.all([
      getAllGames(userId),
      getAllGamelistGames(userId),
    ]);
    this.gamesList.set(games);
    this.gamelistGamesList.set(gamelist);
  }

  private async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  public isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: 'played' | 'platined' | 'gamelist' | 'owned') {
    this.selectedView.set(view);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  openQuizzModal(quizzs: Quizz[]) {
    if (!quizzs || quizzs.length === 0) return;
    this.activeQuizzs.set(quizzs);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal() {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
  }

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: 'played' | 'platined' | 'gamelist' | 'owned';
        sort: string;
      }>
    >(this.viewPreferencesStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingPreferences = true;
    if (
      parsed.view &&
      ['played', 'platined', 'gamelist', 'owned'].includes(parsed.view)
    ) {
      this.selectedView.set(parsed.view);
    }
    if (
      parsed.sort &&
      this.sortOptions().some((opt) => opt.value === parsed.sort)
    ) {
      this.selectedSort.set(parsed.sort);
    }
    this.isLoadingPreferences = false;
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

  private matchesSearch(game: Game, term: string): boolean {
    const haystack = [
      game.title,
      game.editor,
      game.platform,
      game.saga,
      game.hero,
    ]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = this.normalizeSearchText(haystack);
    const normalizedTerm = this.normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
