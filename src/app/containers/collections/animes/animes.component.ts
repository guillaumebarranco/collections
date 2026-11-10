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
import { AnimeComponent } from '../../../components/collections/anime/anime.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { AnimesHeaderComponent } from './animes-header/animes-header.component';

import { normalizeAnimeGenres, Anime } from '../../../models/anime-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';

import {
  AnimeView,
  OptionalAnimeView,
  getAnimesByCountry,
  getAnimesBySaga,
  getAnimesSortOptions,
  getSortedAnimes,
  animeViewOptions,
} from './animes.utils';
import { formatTimeStats } from '../../../utils/stats.utils';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import {
  getAnimeTotalLengthMinutes,
  getAnimeWatchedLengthMinutes,
  isAnimeFinishedWithNewSeasonInProgress,
  isAnimeWatchlistInProgress,
} from '../../../utils/animes.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseAnimes,
  getAllAnimes,
  getAllWatchlistAnimes,
  getOtherUsersAnimesRated,
} from '../../../facades/animes/animes.facade';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { getEntityKey } from '../../../utils/top-five.utils';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullAnime } from '../../../helpers/full-entities-helper';
import {
  updateWatchPriority as updateWatchPriorityApi,
  markAnimeAsWantToReWatch as markAnimeAsWantToReWatchApi,
  markAnimeAsReWatched as markAnimeAsReWatchedApi,
  addAnimeToWatchlist as addAnimeToWatchlistApi,
  addAnimeAsWatched as addAnimeAsWatchedApi,
  markWatchlistAnimeAsStarted as markWatchlistAnimeAsStartedApi,
  markWatchedAnimeNextSeasonAsStarted as markWatchedAnimeNextSeasonAsStartedApi,
} from './animes.controller';
import { AuthService } from '../../../core/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BadgesService } from '../../../services/badges.service';
import { isOfflineModeBlockingOtherUsers } from '../../../core/offline/offline-mode.utils';
import { OfflineRestrictedMessageComponent } from '../../../components/shared/offline-restricted-message/offline-restricted-message.component';
import { LoaderComponent } from '../../../components/shared/loader/loader.component';
import { MobileCollectionPickerComponent } from '../../../components/shared/mobile-collection-picker/mobile-collection-picker.component';
import {
  mergeUniqueByKey,
  pickMobileViewCovers,
} from '../../../utils/mobile-view-previews';
import { openCollectionEntityFollowUpModal } from '../../../utils/collection-entity-follow-up-dialog';
import { buildAnimesWatchFollowUpProgress } from '../../../utils/collection-read-badge-follow-up.utils';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedAnime = Anime & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-animes',
  imports: [
    CommonModule,
    FormsModule,
    AnimeComponent,
    MenuComponent,
    MatDialogModule,

    AnimesHeaderComponent,
    RouterLink,
    OfflineRestrictedMessageComponent,
    LoaderComponent,
    MobileCollectionPickerComponent,
  ],
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss'],
})
export class AnimesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly badgesService = inject(BadgesService);
  private isLoadingPreferences = false;
  private isLoadingViewConfig = false;
  private readonly viewConfigStorageKey = 'animes_view_config';
  private readonly viewPreferencesStorageKey = 'animes_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<AnimeView>('finished');
  mobileSelectedView = signal(false);
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);

  optionalViewConfig = signal<Record<OptionalAnimeView, boolean>>({
    owned: true,
    borrowed: true,
    loaned: true,
    toReWatch: true,
    sagas: false,
    countries: false,
    recommendations: false,
  });

  sortOptions = computed<SortOption[]>(() =>
    getAnimesSortOptions(this.selectedView())
  );

  collapsedCountries = signal<Record<string, boolean>>({});

  viewOptions: { value: AnimeView; label: string }[] = animeViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) => this.isViewOptionVisible(option.value))
  );

  /** True tant que les animés n'ont pas été chargées une première fois. */
  isLoadingAnimes = signal<boolean>(true);

  animesList = signal<{ [key: string]: Anime[] }>({});
  watchingAnimesList = signal<{ [key: string]: Anime[] }>({});
  connectedUserAnimes = signal<Anime[]>([]);
  connectedUserWatchlist = signal<Anime[]>([]);
  baseAnimesList = signal<Anime[]>([]);
  recommendations = signal<RecommendedAnime[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsOfflineBlocked = signal(false);
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

  allAnimes = computed<Anime[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.animesList()[params['id']] || []
      : this.animesList()[DEFAULT_USER_ID];
  });

  allWatchlistAnimes = computed<Anime[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.watchingAnimesList()[params['id']] || []
      : this.watchingAnimesList()[DEFAULT_USER_ID];
  });

  /** Vues « vues / sagas / … » : afficher le bouton « nouvelle saison » si applicable. */
  showNewSeasonStartedAction = computed(() => {
    const v = this.selectedView();
    return (
      v !== 'watchlist' &&
      v !== 'watchingInProgress' &&
      v !== 'recommendations'
    );
  });

  /** True si l'utilisateur a des items dans la vue courante (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() => {
    const v = this.selectedView();
    if (v === 'watchlist') {
      return this.allWatchlistAnimes().length > 0;
    }
    if (v === 'watchingInProgress') {
      const wl = this.allWatchlistAnimes().filter((s) =>
        isAnimeWatchlistInProgress(s)
      );
      const hy = this.allAnimes().filter((s) =>
        isAnimeFinishedWithNewSeasonInProgress(s)
      );
      return wl.length + hy.length > 0;
    }
    return this.allAnimes().length > 0;
  });

  filteredAnimes = computed<Anime[]>(() => {
    let animes: Anime[] = [];
    if (this.selectedView() === 'watchlist') {
      animes = this.allWatchlistAnimes().filter(
        (s) => !isAnimeWatchlistInProgress(s)
      );
    } else if (this.selectedView() === 'watchingInProgress') {
      const keyFn = (s: Anime) => `${s.title}|${s.director}`;
      const fromWatchlist = this.allWatchlistAnimes().filter((s) =>
        isAnimeWatchlistInProgress(s)
      );
      const fromWatched = this.allAnimes().filter((s) =>
        isAnimeFinishedWithNewSeasonInProgress(s)
      );
      const seen = new Set<string>();
      animes = [...fromWatchlist, ...fromWatched].filter((s) => {
        const k = keyFn(s);
        if (seen.has(k)) {
          return false;
        }
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'owned') {
      animes = this.allAnimes().filter((anime) => anime.owned);
    } else if (this.selectedView() === 'borrowed') {
      const key = (s: Anime) => `${s.title}|${s.director}`;
      const readB = this.allAnimes().filter((s) => Boolean(s.borrowed.trim()));
      const listB = this.allWatchlistAnimes().filter((s) =>
        Boolean(s.borrowed.trim())
      );
      const seen = new Set<string>();
      animes = [...readB, ...listB].filter((s) => {
        const k = key(s);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const key = (s: Anime) => `${s.title}|${s.director}`;
      const readL = this.allAnimes().filter((s) => Boolean(s.loaned.trim()));
      const listL = this.allWatchlistAnimes().filter((s) =>
        Boolean(s.loaned.trim())
      );
      const seen = new Set<string>();
      animes = [...readL, ...listL].filter((s) => {
        const k = key(s);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'toReWatch') {
      animes = this.allAnimes().filter(
        (anime) => anime.wantToWatchAgain === true
      );
    } else if (
      this.selectedView() === 'sagas' ||
      this.selectedView() === 'countries'
    ) {
      animes = this.allAnimes();
    } else {
      animes = this.allAnimes();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return animes;
    }

    return animes.filter((anime) => this.matchesSearch(anime, term));
  });

  sortedAnimes = computed<Anime[]>(() =>
    this.selectedView() === 'watchlist' ||
    this.selectedView() === 'watchingInProgress'
      ? getSortedAnimes([...this.filteredAnimes()], 'watchPriority')
      : getSortedAnimes([...this.filteredAnimes()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    const animesToUse = this.filteredAnimes();

    const totalDurationMinutes = animesToUse.reduce(
      (sum, anime) => sum + getAnimeTotalLengthMinutes(anime),
      0
    );
    const totalWatchingMinutes = animesToUse.reduce(
      (sum, anime) => sum + getAnimeWatchedLengthMinutes(anime),
      0
    );
    const totalDuration = formatTimeStats(totalDurationMinutes);
    const totalWatchingTime = formatTimeStats(totalWatchingMinutes);

    return [
      {
        label: 'Durée totale de toutes les animés',
        value: totalDuration.formatted,
        icon: '📺',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé devant des animés',
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

  onOptionalViewChange(view: OptionalAnimeView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: AnimeView): boolean {
    if (
      view === 'finished' ||
      view === 'watchlist' ||
      view === 'watchingInProgress'
    ) {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalAnimeView, boolean>>
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
        view: AnimeView;
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
    void this.refreshAnimes();
  }

  async refreshAnimes() {
    this.isLoadingAnimes.set(true);
    try {
      const displayedUserId = this.getActiveUserId();
      const connectedUserId = this.authService.userId() ?? undefined;
      const isViewingOther = Boolean(
        connectedUserId &&
          displayedUserId &&
          displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
      );

      const [animes, watchlist] = await Promise.all([
        getAllAnimes(displayedUserId),
        getAllWatchlistAnimes(displayedUserId),
      ]);
      this.animesList.set(animes);
      this.watchingAnimesList.set(watchlist);

      if (this.viewNeedsBaseCatalog(this.selectedView())) {
        await this.ensureBaseAnimesLoaded();
      }

      if (isViewingOther && connectedUserId) {
        const [connectedAnimes, connectedWatchlist] = await Promise.all([
          getAllAnimes(connectedUserId),
          getAllWatchlistAnimes(connectedUserId),
        ]);
        this.connectedUserAnimes.set(connectedAnimes[connectedUserId] ?? []);
        this.connectedUserWatchlist.set(
          connectedWatchlist[connectedUserId] ?? []
        );
      } else {
        this.connectedUserAnimes.set([]);
        this.connectedUserWatchlist.set([]);
      }
    } finally {
      this.isLoadingAnimes.set(false);
    }
  }

  async onWatchlistStartedWatching(anime: Anime): Promise<void> {
    const ok = await markWatchlistAnimeAsStartedApi(
      anime,
      this.getActiveUserId()
    );
    if (ok) {
      await this.refreshAnimes();
    }
  }

  async onFinishedAnimeNewSeasonStarted(anime: Anime): Promise<void> {
    const ok = await markWatchedAnimeNextSeasonAsStartedApi(
      anime,
      this.getActiveUserId()
    );
    if (ok) {
      await this.refreshAnimes();
    }
  }

  async onWatchlistMarkedAsWatched(anime: Anime): Promise<void> {
    await this.refreshAnimes();
    if (this.isViewingOtherProfile()) return;
    void this.badgesService.loadFromApi(this.getActiveUserId());
    openCollectionEntityFollowUpModal(this.dialog, {
      entityTitle: anime.title,
      coverUrl: anime.coverUrl ?? '',
      coverAltPrefix: 'Jaquette de',
      messageLead: 'Vous avez vu',
      progressUnitLabel: 'animés',
      progressRows: buildAnimesWatchFollowUpProgress(this.allAnimes()),
    });
  }

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  topFive = computed(() => {
    this.topFiveService.cache();
    return this.topFiveService.getTopFive(this.getActiveUserId());
  });

  getTopFiveRank(anime: Anime): number | null {
    const tf = this.topFive();
    const key = getEntityKey('animes', anime);
    const idx = (tf.animes ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(anime: Anime, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'animes',
      getEntityKey('animes', anime),
      rank
    );
  }

  toggleTopFiveRankDisplay(): void {
    this.showTopFiveRank.set(!this.showTopFiveRank());
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  onMobileSelectView(view: string): void {
    this.mobileSelectedView.set(true);
    this.onViewChange(view as AnimeView);
  }

  onMobileBack(): void {
    this.mobileSelectedView.set(false);
  }

  mobileViewPreviews = computed(() =>
    pickMobileViewCovers(this.visibleViewOptions(), (view) =>
      this.animesForMobilePreview(view).map((anime) => ({
        key: `${anime.title}|${anime.director}`,
        coverUrl: anime.coverUrl,
        title: anime.title,
      }))
    )
  );

  private animesForMobilePreview(view: AnimeView): Anime[] {
    const key = (anime: Anime) => `${anime.title}|${anime.director}`;
    if (view === 'watchlist') {
      return this.allWatchlistAnimes().filter(
        (anime) => !isAnimeWatchlistInProgress(anime)
      );
    }
    if (view === 'watchingInProgress') {
      return mergeUniqueByKey(
        [
          this.allWatchlistAnimes().filter((anime) =>
            isAnimeWatchlistInProgress(anime)
          ),
          this.allAnimes().filter((anime) =>
            isAnimeFinishedWithNewSeasonInProgress(anime)
          ),
        ],
        key
      );
    }
    if (view === 'owned') {
      return this.allAnimes().filter((anime) => anime.owned);
    }
    if (view === 'borrowed') {
      return mergeUniqueByKey(
        [
          this.allAnimes().filter((anime) => Boolean(anime.borrowed.trim())),
          this.allWatchlistAnimes().filter((anime) =>
            Boolean(anime.borrowed.trim())
          ),
        ],
        key
      );
    }
    if (view === 'loaned') {
      return mergeUniqueByKey(
        [
          this.allAnimes().filter((anime) => Boolean(anime.loaned.trim())),
          this.allWatchlistAnimes().filter((anime) =>
            Boolean(anime.loaned.trim())
          ),
        ],
        key
      );
    }
    if (view === 'toReWatch') {
      return this.allAnimes().filter((anime) => anime.wantToWatchAgain);
    }
    if (view === 'recommendations') {
      return this.recommendedAnimes();
    }
    return this.allAnimes();
  }

  onViewChange(view: AnimeView) {
    this.selectedView.set(view);
    if (this.viewNeedsBaseCatalog(view)) {
      void this.ensureBaseAnimesLoaded();
    }
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  private viewNeedsBaseCatalog(view: AnimeView): boolean {
    return (
      view === 'sagas' ||
      view === 'countries' ||
      view === 'recommendations'
    );
  }

  private async ensureBaseAnimesLoaded(): Promise<void> {
    if (this.baseAnimesList().length > 0) return;
    const baseAnimes = await getAllBaseAnimes();
    this.baseAnimesList.set(baseAnimes.map(getFullAnime));
  }

  animesByCountry = computed(() => {
    if (this.selectedView() !== 'countries') return [];
    return getAnimesByCountry({
      sortedAnimes: this.sortedAnimes(),
      allAnimes: this.allAnimes(),
      baseAnimes: this.baseAnimesList(),
      selectedSort: this.selectedSort(),
    });
  });

  animesBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getAnimesBySaga({
      sortedAnimes: this.sortedAnimes(),
      allAnimes: this.allAnimes(),
      baseAnimes: this.baseAnimesList(),
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

  private matchesSearch(anime: Anime, term: string): boolean {
    const actors = anime.actors?.map((actor) => actor.name).join(' ') || '';
    const haystack = [
      anime.title,
      anime.director,
      actors,
      normalizeAnimeGenres(anime.genre).join(' '),
      anime.saga,
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

    if (isOfflineModeBlockingOtherUsers()) {
      this.recommendationsOfflineBlocked.set(true);
      this.recommendations.set([]);
      return;
    }
    this.recommendationsOfflineBlocked.set(false);

    const userId = this.getActiveUserId();
    if (
      this.recommendationsUserId() === userId &&
      this.recommendations().length > 0
    ) {
      return;
    }

    await this.ensureBaseAnimesLoaded();

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

      const othersRated = await getOtherUsersAnimesRated(
        userId,
        4,
        followedIds
      );

      const detailsMap = new Map<string, Map<string, number>>();
      for (const anime of othersRated) {
        const key = `${anime.title}|${anime.director}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(anime.userId) ?? 0;
        if (anime.rating > prev) {
          userMap.set(anime.userId, anime.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allAnimes().map((anime) => this.getAnimeIdentityKey(anime))
      );

      const recommended = this.baseAnimesList()
        .filter((anime) => {
          const key = this.getAnimeIdentityKey(anime);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((anime) => {
          const details = detailsMap.get(this.getAnimeIdentityKey(anime));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...anime,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getAnimeIdentityKey(a));
          const detailsB = detailsMap.get(this.getAnimeIdentityKey(b));
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
      console.warn('animes:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedAnimes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((anime) => this.matchesSearch(anime, term));
  });

  getAnimeIdentityKey(anime: Anime): string {
    return `${anime.title}|${anime.director}`;
  }

  getAnimeRecommendationText(anime: Anime): string {
    const recommendationDetails =
      (anime as RecommendedAnime).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à cet animé`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à cet animé`;
  }

  animeAlreadyInUserWatchlist(anime: Anime): boolean {
    const watchlist = this.allWatchlistAnimes();
    return watchlist.some(
      (s) => s.title === anime.title && s.director === anime.director
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

  canAddAnimeToMyWatchlist(anime: Anime): boolean {
    const key = this.getAnimeIdentityKey(anime);
    const inWatchlist = this.connectedUserWatchlist().some(
      (s) => this.getAnimeIdentityKey(s) === key
    );
    const alreadyWatched = this.connectedUserAnimes().some(
      (s) => this.getAnimeIdentityKey(s) === key
    );
    return !inWatchlist && !alreadyWatched;
  }

  canAddAnimeToMyWatched(anime: Anime): boolean {
    const key = this.getAnimeIdentityKey(anime);
    const alreadyWatched = this.connectedUserAnimes().some(
      (s) => this.getAnimeIdentityKey(s) === key
    );
    return !alreadyWatched;
  }

  async addAnimeToConnectedUserWatchlist(anime: Anime): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addAnimeToWatchlistApi(anime, connectedUserId);
    if (success) await this.refreshAnimes();
  }

  async addAnimeToConnectedUserAsWatched(anime: Anime): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addAnimeAsWatchedApi(anime, connectedUserId);
    if (success) await this.refreshAnimes();
  }

  addAnimeToWatchlist(anime: Anime) {
    this.router.navigate(['/select-animes'], {
      queryParams: {
        watchlist: 'true',
        title: anime.title,
        director: anime.director,
      },
    });
  }

  async updateWatchPriority(data: {
    anime: Anime;
    priority: number;
  }): Promise<void> {
    const success = await updateWatchPriorityApi(data, this.getActiveUserId());
    if (success) {
      await this.refreshAnimes();
    }
  }

  async markAnimeAsWantToReWatch(anime: Anime): Promise<void> {
    const success = await markAnimeAsWantToReWatchApi(
      anime,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshAnimes();
    }
  }

  async markAnimeAsReWatched(anime: Anime): Promise<void> {
    const success = await markAnimeAsReWatchedApi(
      anime,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshAnimes();
    }
  }
}
