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
import { SerieComponent } from '../../../components/collections/serie/serie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { SeriesHeaderComponent } from './series-header/series-header.component';

import { Serie } from '../../../models/serie-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';

import {
  SerieView,
  OptionalSerieView,
  getSeriesByCountry,
  getSeriesBySaga,
  getSeriesSortOptions,
  getSortedSeries,
  serieViewOptions,
} from './series.utils';
import { formatTimeStats } from '../../../utils/stats.utils';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import {
  getSerieTotalLengthMinutes,
  getSerieWatchedLengthMinutes,
} from '../../../utils/series.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseSeries,
  getAllSeries,
  getAllWatchlistSeries,
  getOtherUsersSeriesRated,
} from '../../../facades/series/series.facade';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { getEntityKey } from '../../../utils/top-five.utils';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullSerie } from '../../../helpers/full-entities-helper';
import {
  updateWatchPriority as updateWatchPriorityApi,
  markSerieAsWantToReWatch as markSerieAsWantToReWatchApi,
  markSerieAsReWatched as markSerieAsReWatchedApi,
  addSerieToWatchlist as addSerieToWatchlistApi,
  addSerieAsWatched as addSerieAsWatchedApi,
} from './series.controller';
import { AuthService } from '../../../core/auth.service';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedSerie = Serie & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-series',
  imports: [
    CommonModule,
    FormsModule,
    SerieComponent,
    MenuComponent,

    SeriesHeaderComponent,
    RouterLink,
  ],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private isLoadingViewConfig = false;
  private readonly viewConfigStorageKey = 'series_view_config';
  private readonly viewPreferencesStorageKey = 'series_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<SerieView>('finished');
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);

  optionalViewConfig = signal<Record<OptionalSerieView, boolean>>({
    owned: true,
    borrowed: true,
    loaned: true,
    toReWatch: true,
    sagas: false,
    countries: false,
    recommendations: false,
  });

  sortOptions = computed<SortOption[]>(() =>
    getSeriesSortOptions(this.selectedView())
  );

  collapsedCountries = signal<Record<string, boolean>>({});

  viewOptions: { value: SerieView; label: string }[] = serieViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) => this.isViewOptionVisible(option.value))
  );

  seriesList = signal<{ [key: string]: Serie[] }>({});
  watchingSeriesList = signal<{ [key: string]: Serie[] }>({});
  connectedUserSeries = signal<Serie[]>([]);
  connectedUserWatchlist = signal<Serie[]>([]);
  baseSeriesList = signal<Serie[]>([]);
  recommendations = signal<RecommendedSerie[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

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
        this.selectedView.set('finished');
      }
    });
  }

  allSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.seriesList()[params['id']] || []
      : this.seriesList()[DEFAULT_USER_ID];
  });

  allWatchlistSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.watchingSeriesList()[params['id']] || []
      : this.watchingSeriesList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des items dans la vue courante (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() =>
    this.selectedView() === 'watchlist'
      ? this.allWatchlistSeries().length > 0
      : this.allSeries().length > 0
  );

  filteredSeries = computed<Serie[]>(() => {
    let series: Serie[] = [];
    if (this.selectedView() === 'watchlist') {
      series = this.allWatchlistSeries();
    } else if (this.selectedView() === 'owned') {
      series = this.allSeries().filter((serie) => serie.owned);
    } else if (this.selectedView() === 'borrowed') {
      const key = (s: Serie) => `${s.title}|${s.director}`;
      const readB = this.allSeries().filter((s) =>
        Boolean(s.borrowed?.trim())
      );
      const listB = this.allWatchlistSeries().filter((s) =>
        Boolean(s.borrowed?.trim())
      );
      const seen = new Set<string>();
      series = [...readB, ...listB].filter((s) => {
        const k = key(s);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const key = (s: Serie) => `${s.title}|${s.director}`;
      const readL = this.allSeries().filter((s) => Boolean(s.loaned?.trim()));
      const listL = this.allWatchlistSeries().filter((s) =>
        Boolean(s.loaned?.trim())
      );
      const seen = new Set<string>();
      series = [...readL, ...listL].filter((s) => {
        const k = key(s);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'toReWatch') {
      series = this.allSeries().filter(
        (serie) => serie.wantToWatchAgain === true
      );
    } else if (
      this.selectedView() === 'sagas' ||
      this.selectedView() === 'countries'
    ) {
      series = this.allSeries();
    } else {
      series = this.allSeries();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return series;
    }

    return series.filter((serie) => this.matchesSearch(serie, term));
  });

  sortedSeries = computed<Serie[]>(() =>
    this.selectedView() === 'watchlist'
      ? getSortedSeries([...this.filteredSeries()], 'watchPriority')
      : getSortedSeries([...this.filteredSeries()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    const seriesToUse = this.filteredSeries();

    const totalDurationMinutes = seriesToUse.reduce(
      (sum, serie) => sum + getSerieTotalLengthMinutes(serie),
      0
    );
    const totalWatchingMinutes = seriesToUse.reduce(
      (sum, serie) => sum + getSerieWatchedLengthMinutes(serie),
      0
    );
    const totalDuration = formatTimeStats(totalDurationMinutes);
    const totalWatchingTime = formatTimeStats(totalWatchingMinutes);

    return [
      {
        label: 'Durée totale de toutes les séries',
        value: totalDuration.formatted,
        icon: '📺',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé devant des séries',
        value: totalWatchingTime.formatted,
        icon: '⏱️',
        color: StatItemColor.PRIMARY,
      },
    ];
  });

  openViewConfig(): void {
    this.isViewConfigOpen.set(true);
  }

  closeViewConfig(): void {
    this.isViewConfigOpen.set(false);
  }

  onOptionalViewChange(view: OptionalSerieView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: SerieView): boolean {
    if (view === 'finished' || view === 'watchlist') {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalSerieView, boolean>>
    >(this.viewConfigStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingViewConfig = true;
    this.optionalViewConfig.set({
      owned: parsed.owned ?? true,
      borrowed: parsed.borrowed ?? true,
      loaned: parsed.loaned ?? true,
      toReWatch: parsed.toReWatch ?? true,
      sagas: parsed.sagas ?? false,
      countries: parsed.countries ?? false,
      recommendations: parsed.recommendations ?? false,
    });
    this.isLoadingViewConfig = false;
  }

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: SerieView;
        sort: string;
      }>
    >(this.viewPreferencesStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingPreferences = true;
    if (
      parsed.view &&
      this.viewOptions.some((opt) => opt.value === parsed.view)
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

  ngOnInit() {
    this.loadViewConfigFromStorage();
    this.loadViewPreferencesFromStorage();
    void this.refreshSeries();
  }

  async refreshSeries() {
    const displayedUserId = this.getActiveUserId();
    const connectedUserId = this.authService.userId() ?? undefined;
    const isViewingOther = Boolean(
      connectedUserId &&
        displayedUserId &&
        displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
    );

    const [series, watchlist, baseSeries] = await Promise.all([
      getAllSeries(displayedUserId),
      getAllWatchlistSeries(displayedUserId),
      getAllBaseSeries(),
    ]);
    this.seriesList.set(series);
    this.watchingSeriesList.set(watchlist);
    this.baseSeriesList.set(baseSeries.map(getFullSerie));

    if (isViewingOther && connectedUserId) {
      const [connectedSeries, connectedWatchlist] = await Promise.all([
        getAllSeries(connectedUserId),
        getAllWatchlistSeries(connectedUserId),
      ]);
      this.connectedUserSeries.set(connectedSeries[connectedUserId] ?? []);
      this.connectedUserWatchlist.set(connectedWatchlist[connectedUserId] ?? []);
    } else {
      this.connectedUserSeries.set([]);
      this.connectedUserWatchlist.set([]);
    }
  }

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  topFive = computed(() => {
    this.topFiveService.cache();
    return this.topFiveService.getTopFive(this.getActiveUserId());
  });

  getTopFiveRank(serie: Serie): number | null {
    const tf = this.topFive();
    const key = getEntityKey('series', serie);
    const idx = (tf.series ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(serie: Serie, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'series',
      getEntityKey('series', serie),
      rank
    );
  }

  toggleTopFiveRankDisplay(): void {
    this.showTopFiveRank.set(!this.showTopFiveRank());
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: SerieView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  seriesByCountry = computed(() => {
    if (this.selectedView() !== 'countries') return [];
    return getSeriesByCountry({
      sortedSeries: this.sortedSeries(),
      allSeries: this.allSeries(),
      baseSeries: this.baseSeriesList(),
      selectedSort: this.selectedSort(),
    });
  });

  seriesBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getSeriesBySaga({
      sortedSeries: this.sortedSeries(),
      allSeries: this.allSeries(),
      baseSeries: this.baseSeriesList(),
      selectedSort: this.selectedSort(),
    });
  });

  collapsedSagas = signal<Record<string, boolean>>({});

  toggleSaga(saga: string): void {
    this.collapsedSagas.update((prev) => ({
      ...prev,
      [saga]: !prev[saga],
    }));
  }

  isSagaCollapsed(saga: string): boolean {
    return !!this.collapsedSagas()[saga];
  }

  toggleCountry(country: string): void {
    this.collapsedCountries.update((prev) => ({
      ...prev,
      [country]: !prev[country],
    }));
  }

  isCountryCollapsed(country: string): boolean {
    return !!this.collapsedCountries()[country];
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  private matchesSearch(serie: Serie, term: string): boolean {
    const actors = serie.actors?.map((actor) => actor.name).join(' ') || '';
    const haystack = [
      serie.title,
      serie.director,
      actors,
      serie.genre,
      serie.saga,
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

    // S'assurer que baseSeriesList est chargé
    if (this.baseSeriesList().length === 0) {
      await this.refreshSeries();
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

      const othersRated = await getOtherUsersSeriesRated(
        userId,
        4,
        followedIds
      );

      const detailsMap = new Map<string, Map<string, number>>();
      for (const serie of othersRated) {
        const key = `${serie.title}|${serie.director}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(serie.userId) ?? 0;
        if (serie.rating > prev) {
          userMap.set(serie.userId, serie.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allSeries().map((serie) => this.getSerieIdentityKey(serie))
      );

      const recommended = this.baseSeriesList()
        .filter((serie) => {
          const key = this.getSerieIdentityKey(serie);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((serie) => {
          const details = detailsMap.get(this.getSerieIdentityKey(serie));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...serie,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getSerieIdentityKey(a));
          const detailsB = detailsMap.get(this.getSerieIdentityKey(b));
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
      console.warn('series:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedSeries = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((serie) => this.matchesSearch(serie, term));
  });

  getSerieIdentityKey(serie: Serie): string {
    return `${serie.title}|${serie.director}`;
  }

  getSerieRecommendationText(serie: Serie): string {
    const recommendationDetails =
      (serie as RecommendedSerie).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à cette série`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à cette série`;
  }

  serieAlreadyInUserWatchlist(serie: Serie): boolean {
    const watchlist = this.allWatchlistSeries();
    return watchlist.some(
      (s) => s.title === serie.title && s.director === serie.director
    );
  }

  isViewingOtherProfile(): boolean {
    const connected = this.authService.userId();
    const displayed = this.getActiveUserId();
    return Boolean(
      connected &&
        displayed &&
        displayed.toLowerCase() !== connected.toLowerCase()
    );
  }

  canShowAddToMyWatchlist(): boolean {
    return this.isViewingOtherProfile();
  }

  canAddSerieToMyWatchlist(serie: Serie): boolean {
    const key = this.getSerieIdentityKey(serie);
    const inWatchlist = this.connectedUserWatchlist().some(
      (s) => this.getSerieIdentityKey(s) === key
    );
    const alreadyWatched = this.connectedUserSeries().some(
      (s) => this.getSerieIdentityKey(s) === key
    );
    return !inWatchlist && !alreadyWatched;
  }

  canAddSerieToMyWatched(serie: Serie): boolean {
    const key = this.getSerieIdentityKey(serie);
    const alreadyWatched = this.connectedUserSeries().some(
      (s) => this.getSerieIdentityKey(s) === key
    );
    return !alreadyWatched;
  }

  async addSerieToConnectedUserWatchlist(serie: Serie): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addSerieToWatchlistApi(serie, connectedUserId);
    if (success) await this.refreshSeries();
  }

  async addSerieToConnectedUserAsWatched(serie: Serie): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addSerieAsWatchedApi(serie, connectedUserId);
    if (success) await this.refreshSeries();
  }

  addSerieToWatchlist(serie: Serie) {
    this.router.navigate(['/select-series'], {
      queryParams: {
        watchlist: 'true',
        title: serie.title,
        director: serie.director,
      },
    });
  }

  async updateWatchPriority(data: {
    serie: Serie;
    priority: number;
  }): Promise<void> {
    const success = await updateWatchPriorityApi(data, this.getActiveUserId());
    if (success) {
      await this.refreshSeries();
    }
  }

  async markSerieAsWantToReWatch(serie: Serie): Promise<void> {
    const success = await markSerieAsWantToReWatchApi(
      serie,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshSeries();
    }
  }

  async markSerieAsReWatched(serie: Serie): Promise<void> {
    const success = await markSerieAsReWatchedApi(
      serie,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshSeries();
    }
  }
}
