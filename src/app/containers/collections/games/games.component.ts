import { Component, computed, inject, signal, OnInit, effect } from '@angular/core';
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
import { Game } from '../../../models/game-model';
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
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import {
  getAllGames,
  getAllGamelistGames,
} from '../../../facades/games/games.facade';
import { LocalStorageService } from '../../../services/local-storage.service';

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
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly localStorageService = inject(LocalStorageService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'games_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<GameView>('played');
  searchTerm = signal<string>('');

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

  constructor() {
    effect(() => {
      if (this.isLoadingPreferences) return;
      const preferences = {
        view: this.selectedView(),
        sort: this.selectedSort(),
      };
      this.localStorageService.setItem(this.viewPreferencesStorageKey, preferences);
    });
  }

  allGames = computed<Game[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamesList()[params['id']] || []
      : this.gamesList()['guillaume'];
  });

  allGamelistGames = computed<Game[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamelistGamesList()[params['id']] || []
      : this.gamelistGamesList()['guillaume'];
  });

  filteredGames = computed<Game[]>(() => {
    let games = this.allGames();
    if (this.selectedView() === 'gamelist') {
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
    this.loadViewPreferencesFromStorage();
    void this.refreshGames();
  }

  async refreshGames() {
    const userId = this.getActiveUserId();
    const [games, gamelist] = await Promise.all([
      getAllGames(userId),
      getAllGamelistGames(userId),
    ]);
    this.gamesList.set(games);
    this.gamelistGamesList.set(gamelist);
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
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
