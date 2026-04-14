import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManwhaComponent } from '../../../components/collections/manwha/manwha.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import { ManwhasHeaderComponent } from './manwhas-header/manwhas-header.component';
import { Manwha } from '../../../models/manwha-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import {
  ManwhaView,
  OptionalManwhaView,
  getSortedManwhas,
  manwhaViewOptions,
  manwhasSortOptions,
} from './manwhas.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseManwhas,
  getAllManwhas,
  getAllReadlistManwhas,
  getOtherUsersManwhasRated,
} from '../../../facades/manwhas/manwhas.facade';
import {
  getTotalManwhasPages,
  getTotalManwhasChaptersRead,
  getEstimatedManwhaReadingTime,
  PAGES_PER_MANWHA_CHAPTER,
  formatTimeStats,
  MINUTES_PER_PAGE,
} from '../../../utils/stats.utils';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditManwhaComponent } from '../../edit/edit-manwha/edit-manwha.component';
import { LocalStorageService } from '../../../services/local-storage.service';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullManwha } from '../../../helpers/full-entities-helper';
import {
  updateReadPriority as updateReadPriorityApi,
  markManwhaAsWantToReRead as markManwhaAsWantToReReadApi,
  markManwhaAsReRead as markManwhaAsReReadApi,
  addManwhaToReadlist as addManwhaToReadlistApi,
  addManwhaAsRead as addManwhaAsReadApi,
  markReadlistManwhaAsStarted as markReadlistManwhaAsStartedApi,
} from './manwhas.controller';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { AuthService } from '../../../core/auth.service';
import { getEntityKey } from '../../../utils/top-five.utils';
import { isLocalhost } from '../../../core/config';
import { BadgesService } from '../../../services/badges.service';
import { openCollectionEntityFollowUpModal } from '../../../utils/collection-entity-follow-up-dialog';
import { buildManwhaReadlistFollowUpProgress } from '../../../utils/collection-read-badge-follow-up.utils';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedManwha = Manwha & {
  recommendationDetails: RecommendationDetail[];
};
@Component({
  selector: 'app-manwhas',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ManwhaComponent,
    MenuComponent,
    MatDialogModule,

    ManwhasHeaderComponent,
  ],
  templateUrl: './manwhas.component.html',
  styleUrls: ['./manwhas.component.scss'],
})
export class ManwhasComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private readonly authService = inject(AuthService);
  private readonly badgesService = inject(BadgesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private isInitializing = false;
  private isLoadingPreferences = false;
  private isLoadingViewConfig = false;
  private readonly viewConfigStorageKey = 'manwhas_view_config';
  private readonly viewPreferencesStorageKey = 'manwhas_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<ManwhaView>('read');
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);

  optionalViewConfig = signal<Record<OptionalManwhaView, boolean>>({
    owned: true,
    borrowed: true,
    loaned: true,
    toReRead: true,
    recommendations: false,
  });

  sortOptions = signal<SortOption[]>(manwhasSortOptions);

  viewOptions: { value: ManwhaView; label: string }[] = manwhaViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) => this.isViewOptionVisible(option.value))
  );

  manwhasList = signal<{ [key: string]: Manwha[] }>({});
  readlistManwhasList = signal<{ [key: string]: Manwha[] }>({});
  connectedUserManwhas = signal<Manwha[]>([]);
  connectedUserReadlist = signal<Manwha[]>([]);
  baseManwhasList = signal<Manwha[]>([]);
  recommendations = signal<RecommendedManwha[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

  topFive = computed(() => {
    this.topFiveService.cache();
    return this.topFiveService.getTopFive(this.getActiveUserId());
  });

  constructor() {
    effect(() => {
      if (this.isInitializing) return;

      const queryParams: Record<string, string | null> = {};

      if (this.selectedView() !== 'read') {
        queryParams['view'] = this.selectedView();
      } else {
        queryParams['view'] = null;
      }

      if (this.selectedSort() !== 'rating') {
        queryParams['sort'] = this.selectedSort();
      } else {
        queryParams['sort'] = null;
      }

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams:
          Object.keys(queryParams).length > 0 ? queryParams : {},
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

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
        this.selectedView.set('read');
      }
    });
  }

  private loadParamsFromUrl(queryParams: Params): void {
    const v = queryParams['view'];
    if (
      v === 'readlist' ||
      v === 'readingInProgress' ||
      v === 'read' ||
      v === 'owned' ||
      v === 'borrowed' ||
      v === 'loaned' ||
      v === 'toReRead' ||
      v === 'recommendations'
    ) {
      this.selectedView.set(v as ManwhaView);
      if (v === 'recommendations') {
        void this.loadRecommendations();
      }
    }

    if (queryParams['sort']) {
      const validSort = this.sortOptions().find(
        (opt) => opt.value === queryParams['sort']
      );
      if (validSort) {
        this.selectedSort.set(queryParams['sort']);
      }
    }
  }

  allManwhas = computed<Manwha[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.manwhasList()[params['id']] || []
      : this.manwhasList()[DEFAULT_USER_ID];
  });

  allReadlistManwhas = computed<Manwha[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.readlistManwhasList()[params['id']] || []
      : this.readlistManwhasList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des manwhas lus (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() => this.allManwhas().length > 0);

  filteredManwhas = computed<Manwha[]>(() => {
    let manwhas: Manwha[];
    if (this.selectedView() === 'readlist') {
      manwhas = this.allReadlistManwhas().filter(
        (m) => (m.readTimes ?? 0) !== 0.5
      );
    } else if (this.selectedView() === 'readingInProgress') {
      manwhas = this.allReadlistManwhas().filter(
        (m) => (m.readTimes ?? 0) === 0.5
      );
    } else if (this.selectedView() === 'owned') {
      manwhas = this.allManwhas().filter((manwha) => manwha.owned);
    } else if (this.selectedView() === 'borrowed') {
      const key = (m: Manwha) => `${m.title}|${m.author}`;
      const readB = this.allManwhas().filter((m) => Boolean(m.borrowed.trim()));
      const listB = this.allReadlistManwhas().filter((m) =>
        Boolean(m.borrowed.trim())
      );
      const seen = new Set<string>();
      manwhas = [...readB, ...listB].filter((m) => {
        const k = key(m);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const key = (m: Manwha) => `${m.title}|${m.author}`;
      const readL = this.allManwhas().filter((m) => Boolean(m.loaned.trim()));
      const listL = this.allReadlistManwhas().filter((m) =>
        Boolean(m.loaned.trim())
      );
      const seen = new Set<string>();
      manwhas = [...readL, ...listL].filter((m) => {
        const k = key(m);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'toReRead') {
      manwhas = this.allManwhas().filter(
        (manwha) => manwha.wantToReadAgain === true
      );
    } else {
      manwhas = this.allManwhas();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return manwhas;
    }

    return manwhas.filter((manwha) => this.matchesSearch(manwha, term));
  });

  sortedManwhas = computed<Manwha[]>(() =>
    this.selectedView() === 'readlist' ||
    this.selectedView() === 'readingInProgress'
      ? getSortedManwhas([...this.filteredManwhas()], 'readPriority')
      : getSortedManwhas([...this.filteredManwhas()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    const list = this.filteredManwhas();
    const totalChapters = this.calculateTotalChapters();
    const totalPagesEstimate = list.reduce(
      (acc, m) => acc + (m.nbChapters ?? 0) * PAGES_PER_MANWHA_CHAPTER,
      0
    );

    if (
      this.selectedView() === 'readlist' ||
      this.selectedView() === 'readingInProgress'
    ) {
      const estimatedFromPages = formatTimeStats(
        totalPagesEstimate * MINUTES_PER_PAGE
      );
      return [
        {
          label: 'Total des chapitres',
          value: `${totalChapters.toLocaleString()} chapitres`,
          icon: '📚',
          color: StatItemColor.SUCCESS,
        },
        {
          label: 'Total des pages (estimation)',
          value: `${totalPagesEstimate.toLocaleString()} pages`,
          icon: '📖',
          color: StatItemColor.INFO,
        },
        {
          label: 'Temps estimé de lecture',
          value: estimatedFromPages.formatted,
          icon: '⏱️',
          color: StatItemColor.PRIMARY,
        },
      ];
    }

    const totalPages = this.calculateTotalManwhasPages();
    const totalChaptersRead = getTotalManwhasChaptersRead(list);
    const totalPagesRead = getTotalManwhasPages(list);
    const estimatedReadingTime = getEstimatedManwhaReadingTime(list);

    return [
      {
        label: 'Total des chapitres',
        value: `${totalChapters.toLocaleString()} chapitres`,
        icon: '📚',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Total des pages',
        value: `${totalPages.toLocaleString()} pages`,
        icon: '📖',
        color: StatItemColor.INFO,
      },
      {
        label: 'Total des chapitres lus (avec relectures)',
        value: `${totalChaptersRead.toLocaleString()} chapitres`,
        icon: '📚',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Total des pages lues (avec relectures)',
        value: `${totalPagesRead.toLocaleString()} pages`,
        icon: '📖',
        color: StatItemColor.INFO,
      },
      {
        label: 'Temps estimé de lecture',
        value: estimatedReadingTime.formatted,
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

  onOptionalViewChange(view: OptionalManwhaView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: ManwhaView): boolean {
    if (view === 'read' || view === 'readlist' || view === 'readingInProgress') {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalManwhaView, boolean>>
    >(this.viewConfigStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingViewConfig = true;
    this.optionalViewConfig.set({
      owned: parsed.owned ?? true,
      borrowed: parsed.borrowed ?? true,
      loaned: parsed.loaned ?? true,
      toReRead: parsed.toReRead ?? true,
      recommendations: parsed.recommendations ?? false,
    });
    this.isLoadingViewConfig = false;
  }

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: ManwhaView;
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

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  async ngOnInit() {
    this.isInitializing = true;
    this.loadViewConfigFromStorage();
    this.loadViewPreferencesFromStorage();
    this.loadParamsFromUrl(this.activatedRoute.snapshot.queryParams);
    this.isInitializing = false;
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.isInitializing = true;
      this.loadParamsFromUrl(queryParams);
      this.isInitializing = false;
    });
    await this.refreshManwhas();
  }

  onViewChange(view: ManwhaView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  private matchesSearch(manwha: Manwha, term: string): boolean {
    const haystack = [manwha.title, manwha.author, manwha.genre]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  getSelectManwhasRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-manwhas` : '/select-manwhas';
  }

  private calculateTotalChapters(): number {
    let total = 0;
    for (const manwha of this.filteredManwhas()) {
      if (manwha.nbChapters) {
        total += manwha.nbChapters;
      }
    }
    return total;
  }

  private calculateTotalManwhasPages(): number {
    let total = 0;
    for (const manwha of this.filteredManwhas()) {
      if (manwha.nbChapters) {
        total += manwha.nbChapters * PAGES_PER_MANWHA_CHAPTER;
      }
    }
    return total;
  }

  openEditManwhaDialog(manwha: Manwha): void {
    const manwhas = this.sortedManwhas();
    const index = manwhas.findIndex(
      (item) => item.title === manwha.title && item.author === manwha.author
    );
    const dialogRef = this.dialog.open(EditManwhaComponent, {
      data: {
        manwha,
        userId: this.getActiveUserId(),
        list: manwhas,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        void this.refreshManwhas();
      }
    });
  }

  async onReadlistStartedReading(manwha: Manwha): Promise<void> {
    const ok = await markReadlistManwhaAsStartedApi(
      manwha,
      this.getActiveUserId()
    );
    if (ok) {
      await this.refreshManwhas();
    }
  }

  async onReadlistMarkedAsRead(manwha: Manwha): Promise<void> {
    await this.refreshManwhas();
    if (this.isViewingOtherProfile()) return;
    if (!isLocalhost()) {
      void this.badgesService.loadFromApi(this.getActiveUserId());
    }
    openCollectionEntityFollowUpModal(this.dialog, {
      entityTitle: manwha.title,
      coverUrl: manwha.coverUrl ?? '',
      coverAltPrefix: 'Couverture de',
      messageLead: 'Vous avez lu',
      progressUnitLabel: 'manhwas lus',
      progressRows: buildManwhaReadlistFollowUpProgress(this.allManwhas()),
    });
  }

  private async refreshManwhas() {
    const displayedUserId = this.getActiveUserId();
    const connectedUserId = this.authService.userId() ?? undefined;
    const isViewingOther = Boolean(
      connectedUserId &&
        displayedUserId &&
        displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
    );

    const [manwhas, readlist, baseManwhas] = await Promise.all([
      getAllManwhas(displayedUserId),
      getAllReadlistManwhas(displayedUserId),
      getAllBaseManwhas(),
    ]);
    this.manwhasList.set(manwhas);
    this.readlistManwhasList.set(readlist);
    this.baseManwhasList.set(baseManwhas.map(getFullManwha));

    this.cdr.detectChanges();

    if (isViewingOther && connectedUserId) {
      const [connectedManwhas, connectedReadlist] = await Promise.all([
        getAllManwhas(connectedUserId),
        getAllReadlistManwhas(connectedUserId),
      ]);
      this.connectedUserManwhas.set(connectedManwhas[connectedUserId] ?? []);
      this.connectedUserReadlist.set(connectedReadlist[connectedUserId] ?? []);
    } else {
      this.connectedUserManwhas.set([]);
      this.connectedUserReadlist.set([]);
    }
  }

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  getTopFiveRank(manwha: Manwha): number | null {
    const tf = this.topFive();
    const key = getEntityKey('manwhas', manwha);
    const idx = (tf.manwhas ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(manwha: Manwha, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'manwhas',
      getEntityKey('manwhas', manwha),
      rank
    );
  }

  toggleTopFiveRankDisplay(): void {
    this.showTopFiveRank.set(!this.showTopFiveRank());
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

    // S'assurer que baseManwhasList est chargé
    if (this.baseManwhasList().length === 0) {
      await this.refreshManwhas();
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

      const othersRated = await getOtherUsersManwhasRated(
        userId,
        4,
        followedIds
      );

      const detailsMap = new Map<string, Map<string, number>>();
      for (const manwha of othersRated) {
        const key = `${manwha.title}|${manwha.author}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(manwha.userId) ?? 0;
        if (manwha.rating > prev) {
          userMap.set(manwha.userId, manwha.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allManwhas().map((manwha) => this.getManwhaIdentityKey(manwha))
      );

      const recommended = this.baseManwhasList()
        .filter((manwha) => {
          const key = this.getManwhaIdentityKey(manwha);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((manwha) => {
          const details = detailsMap.get(this.getManwhaIdentityKey(manwha));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...manwha,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getManwhaIdentityKey(a));
          const detailsB = detailsMap.get(this.getManwhaIdentityKey(b));
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
      console.warn('manwhas:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedManwhas = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((manwha) => this.matchesSearch(manwha, term));
  });

  getManwhaIdentityKey(manwha: Manwha): string {
    return `${manwha.title}|${manwha.author}`;
  }

  getManwhaRecommendationText(manwha: Manwha): string {
    const recommendationDetails =
      (manwha as RecommendedManwha).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à ce manwha`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à ce manwha`;
  }

  manwhaAlreadyInUserReadlist(manwha: Manwha): boolean {
    const readlist = this.allReadlistManwhas();
    return readlist.some(
      (m) => m.title === manwha.title && m.author === manwha.author
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

  canShowAddToMyReadlist(): boolean {
    return this.isViewingOtherProfile();
  }

  canAddManwhaToMyReadlist(manwha: Manwha): boolean {
    const key = this.getManwhaIdentityKey(manwha);
    const inReadlist = this.connectedUserReadlist().some(
      (m) => this.getManwhaIdentityKey(m) === key
    );
    const alreadyRead = this.connectedUserManwhas().some(
      (m) =>
        this.getManwhaIdentityKey(m) === key &&
        (m.readTimes ?? 0) >= 1
    );
    return !inReadlist && !alreadyRead;
  }

  canAddManwhaToMyRead(manwha: Manwha): boolean {
    const key = this.getManwhaIdentityKey(manwha);
    const alreadyRead = this.connectedUserManwhas().some(
      (m) =>
        this.getManwhaIdentityKey(m) === key &&
        (m.readTimes ?? 0) >= 1
    );
    return !alreadyRead;
  }

  async addManwhaToConnectedUserReadlist(manwha: Manwha): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addManwhaToReadlistApi(manwha, connectedUserId);
    if (success) await this.refreshManwhas();
  }

  async addManwhaToConnectedUserAsRead(manwha: Manwha): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addManwhaAsReadApi(manwha, connectedUserId);
    if (success) await this.refreshManwhas();
  }

  async updateReadPriority(data: {
    manwha: Manwha;
    priority: number;
  }): Promise<void> {
    const success = await updateReadPriorityApi(data, this.getActiveUserId());
    if (success) {
      await this.refreshManwhas();
    }
  }

  async markManwhaAsWantToReRead(manwha: Manwha): Promise<void> {
    const success = await markManwhaAsWantToReReadApi(
      manwha,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshManwhas();
    }
  }

  async markManwhaAsReRead(manwha: Manwha): Promise<void> {
    const success = await markManwhaAsReReadApi(manwha, this.getActiveUserId());
    if (success) {
      await this.refreshManwhas();
    }
  }

  addManwhaToReadlist(manwha: Manwha) {
    this.router.navigate(['/select-manwhas'], {
      queryParams: {
        readlist: 'true',
        title: manwha.title,
        author: manwha.author,
      },
    });
  }
}
