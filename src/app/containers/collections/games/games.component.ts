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
import { GameComponent } from '../../../components/collections/game/game.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { GamesHeaderComponent } from './games-header/games-header.component';
import { QuizzModalComponent } from '../../../components/modals/quizz-modal/quizz-modal.component';
import { Game } from '../../../models/game-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import { Quizz } from '../../../models/quizz-model';

import {
  GameView,
  OptionalGameView,
  gameViewOptions,
  gamesSortOptions,
  getSortedGames,
} from './games.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseGames,
  getAllGames,
  getAllGamelistGames,
  getOtherUsersGamesRated,
} from '../../../facades/games/games.facade';
import { LocalStorageService } from '../../../services/local-storage.service';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullGame } from '../../../helpers/full-entities-helper';
import {
  updateGamelistPriority as updateGamelistPriorityApi,
  markGameAsWantToRePlay as markGameAsWantToRePlayApi,
  markGameAsRePlayed as markGameAsRePlayedApi,
} from './games.controller';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { getEntityKey } from '../../../utils/top-five.utils';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedGame = Game & {
  recommendationDetails: RecommendationDetail[];
};

import {
  getTotalTimeToFinishGames,
  getTotalPlayedTime,
  getTotalTimeToFinishGamesAtHundredPercent,
} from '../../../utils/games.utils';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GameComponent,
    MenuComponent,
    QuizzModalComponent,
    GamesHeaderComponent,
    RouterLink,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private isLoadingPreferences = false;
  private isLoadingViewConfig = false;
  private readonly viewConfigStorageKey = 'games_view_config';
  private readonly viewPreferencesStorageKey = 'games_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<GameView>('played');
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);
  optionalViewConfig = signal<Record<OptionalGameView, boolean>>({
    platined: true,
    owned: true,
    finished: true,
    toRePlay: true,
    recommendations: false,
  });

  sortOptions = signal<SortOption[]>(gamesSortOptions);

  viewOptions = computed<{ value: GameView; label: string }[]>(() => {
    const options: { value: GameView; label: string }[] = gameViewOptions;

    if (this.platinedGames().length === 0) {
      return options.filter((option) => option.value !== 'platined');
    }

    return options;
  });

  visibleViewOptions = computed(() =>
    this.viewOptions().filter((option) =>
      this.isViewOptionVisible(option.value)
    )
  );

  gamesList = signal<{ [key: string]: Game[] }>({});
  gamelistGamesList = signal<{ [key: string]: Game[] }>({});
  baseGamesList = signal<Game[]>([]);
  recommendations = signal<RecommendedGame[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

  topFive = computed(() => {
    this.topFiveService.cache();
    return this.topFiveService.getTopFive(this.getActiveUserId());
  });

  constructor() {
    effect(() => {
      if (this.isLoadingPreferences) return;
      const preferences = {
        view: this.selectedView(),
        sort: this.selectedSort(),
      };
      this.localStorageService.setItem(
        this.viewPreferencesStorageKey,
        preferences
      );
    });

    effect(() => {
      const config = this.optionalViewConfig();
      if (this.isLoadingViewConfig) return;
      this.localStorageService.setItem(this.viewConfigStorageKey, config);
    });

    effect(() => {
      const view = this.selectedView();
      if (!this.isViewOptionVisible(view)) {
        this.selectedView.set('played');
      }
    });
  }

  allGames = computed<Game[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamesList()[params['id']] || []
      : this.gamesList()[DEFAULT_USER_ID];
  });

  allGamelistGames = computed<Game[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamelistGamesList()[params['id']] || []
      : this.gamelistGamesList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des items dans la vue courante (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() =>
    this.selectedView() === 'gamelist'
      ? this.allGamelistGames().length > 0
      : this.allGames().length > 0
  );

  filteredGames = computed<Game[]>(() => {
    let games: Game[];
    if (this.selectedView() === 'gamelist') {
      games = this.allGamelistGames();
    } else if (this.selectedView() === 'platined') {
      games = this.allGames().filter((game) => game.platined);
    } else if (this.selectedView() === 'owned') {
      games = this.allGames().filter((game) => game.owned);
    } else if (this.selectedView() === 'toRePlay') {
      games = this.allGames().filter((game) => game.wantToPlayAgain === true);
    } else {
      games = this.allGames();
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
    this.selectedView() === 'gamelist'
      ? getSortedGames([...this.filteredGames()], 'gamelistPriority')
      : getSortedGames([...this.filteredGames()], this.selectedSort())
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
    this.loadViewConfigFromStorage();
    this.loadViewPreferencesFromStorage();
    void this.refreshGames();
  }

  async refreshGames() {
    const userId = this.getActiveUserId();
    const [games, gamelist, baseGames] = await Promise.all([
      getAllGames(userId),
      getAllGamelistGames(userId),
      getAllBaseGames(),
    ]);
    this.gamesList.set(games);
    this.gamelistGamesList.set(gamelist);
    this.baseGamesList.set(baseGames.map(getFullGame));
  }

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  getTopFiveRank(game: Game): number | null {
    const tf = this.topFive();
    const key = getEntityKey('games', game);
    const idx = (tf.games ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(game: Game, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'games',
      getEntityKey('games', game),
      rank
    );
  }

  toggleTopFiveRankDisplay(): void {
    this.showTopFiveRank.set(!this.showTopFiveRank());
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: GameView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  openViewConfig(): void {
    this.isViewConfigOpen.set(true);
  }

  closeViewConfig(): void {
    this.isViewConfigOpen.set(false);
  }

  onOptionalViewChange(view: OptionalGameView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: GameView): boolean {
    if (view === 'played' || view === 'gamelist') {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalGameView, boolean>>
    >(this.viewConfigStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingViewConfig = true;
    this.optionalViewConfig.set({
      platined: parsed.platined ?? true,
      owned: parsed.owned ?? true,
      finished: parsed.finished ?? true,
      toRePlay: parsed.toRePlay ?? true,
      recommendations: parsed.recommendations ?? false,
    });
    this.isLoadingViewConfig = false;
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

    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  readonly followedIdsForRecommendations = signal<string[]>([]);

  async loadRecommendations() {
    if (this.isLoadingRecommendations()) return;

    const userId = this.getActiveUserId();
    if (
      this.recommendationsUserId() === userId &&
      this.recommendations().length > 0
    ) {
      return;
    }

    // S'assurer que baseGamesList est chargé
    if (this.baseGamesList().length === 0) {
      await this.refreshGames();
    }

    this.isLoadingRecommendations.set(true);
    try {
      await this.followsService.loadFromApi(userId);
      const followedIds = this.followsService.getFollows(userId);
      this.followedIdsForRecommendations.set(followedIds);

      if (followedIds.length === 0) {
        this.recommendations.set([]);
        this.recommendationsUserId.set(userId);
        return;
      }

      const othersRated = await getOtherUsersGamesRated(userId, 4, followedIds);

      const detailsMap = new Map<string, Map<string, number>>();
      for (const game of othersRated) {
        const key = `${game.title}|${game.editor}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(game.userId) ?? 0;
        if (game.rating > prev) {
          userMap.set(game.userId, game.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allGames().map((game) => this.getGameIdentityKey(game))
      );

      const recommended = this.baseGamesList()
        .filter((game) => {
          const key = this.getGameIdentityKey(game);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((game) => {
          const details = detailsMap.get(this.getGameIdentityKey(game));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...game,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getGameIdentityKey(a));
          const detailsB = detailsMap.get(this.getGameIdentityKey(b));
          const countA = detailsA?.size ?? 0;
          const countB = detailsB?.size ?? 0;
          if (countB !== countA) return countB - countA;
          const maxA = detailsA ? Math.max(...detailsA.values()) : 0;
          const maxB = detailsB ? Math.max(...detailsB.values()) : 0;
          if (maxB !== maxA) return maxB - maxA;
          return a.title.localeCompare(b.title);
        });

      this.recommendations.set(recommended);
      this.recommendationsUserId.set(userId);
    } catch (error) {
      console.warn('games:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedGames = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((game) => this.matchesSearch(game, term));
  });

  getGameIdentityKey(game: Game): string {
    return `${game.title}|${game.editor}`;
  }

  getGameRecommendationText(game: Game): string {
    const recommendationDetails =
      (game as RecommendedGame).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à ce jeu`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à ce jeu`;
  }

  gameAlreadyInUserGamelist(game: Game): boolean {
    const gamelist = this.allGamelistGames();
    return gamelist.some(
      (g) => g.title === game.title && g.editor === game.editor
    );
  }

  addGameToGamelist(game: Game) {
    this.router.navigate(['/select-games'], {
      queryParams: {
        gamelist: 'true',
        title: game.title,
        editor: game.editor,
      },
    });
  }

  async updateGamelistPriority(data: {
    game: Game;
    priority: number;
  }): Promise<void> {
    const success = await updateGamelistPriorityApi(
      data,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshGames();
    }
  }

  async markGameAsWantToRePlay(game: Game): Promise<void> {
    const success = await markGameAsWantToRePlayApi(
      game,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshGames();
    }
  }

  async markGameAsRePlayed(game: Game): Promise<void> {
    const success = await markGameAsRePlayedApi(game, this.getActiveUserId());
    if (success) {
      await this.refreshGames();
    }
  }
}
