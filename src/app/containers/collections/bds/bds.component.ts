import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BdComponent } from '../../../components/collections/bd/bd.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { BdsHeaderComponent } from './bds-header/bds-header.component';

import { Bd } from '../../../models/bd-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

import {
  BdView,
  OptionalBdView,
  bdViewOptions,
  bdsSortOptions,
  getBdsBySaga,
  getSortedBds,
} from './bds.utils';
import {
  getEstimatedBdReadingTime,
  getTotalBdPages,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseBds,
  getAllBds,
  getAllReadlistBds,
  getOtherUsersBdsRated,
} from '../../../facades/bds/bds.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditBdComponent } from '../../edit/edit-bd/edit-bd.component';
import { LocalStorageService } from '../../../services/local-storage.service';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullBd } from '../../../helpers/full-entities-helper';
import {
  updateReadPriority as updateReadPriorityApi,
  markBdAsWantToReRead as markBdAsWantToReReadApi,
  markBdAsReRead as markBdAsReReadApi,
  addBdToReadlist as addBdToReadlistApi,
  addBdAsRead as addBdAsReadApi,
} from './bds.controller';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { AuthService } from '../../../core/auth.service';
import { getEntityKey } from '../../../utils/top-five.utils';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedBd = Bd & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-bds',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BdComponent,
    MenuComponent,
    MatDialogModule,

    BdsHeaderComponent,
    RouterLink,
  ],
  templateUrl: './bds.component.html',
  styleUrls: ['./bds.component.scss'],
})
export class BdsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private isLoadingViewConfig = false;
  private readonly viewConfigStorageKey = 'bds_view_config';
  private readonly viewPreferencesStorageKey = 'bds_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<BdView>('read');
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);

  optionalViewConfig = signal<Record<OptionalBdView, boolean>>({
    owned: true,
    borrowed: true,
    loaned: true,
    toReRead: true,
    sagas: true,
    recommendations: false,
  });

  sortOptions = signal<SortOption[]>(bdsSortOptions);

  viewOptions: { value: BdView; label: string }[] = bdViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) => this.isViewOptionVisible(option.value))
  );

  bdsList = signal<{ [key: string]: Bd[] }>({});
  readlistBdsList = signal<{ [key: string]: Bd[] }>({});
  connectedUserBds = signal<Bd[]>([]);
  connectedUserReadlist = signal<Bd[]>([]);
  baseBdsList = signal<Bd[]>([]);
  recommendations = signal<RecommendedBd[]>([]);
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
        this.selectedView.set('read');
      }
    });
  }

  allBds = computed<Bd[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.bdsList()[params['id']] || []
      : this.bdsList()[DEFAULT_USER_ID];
  });

  allReadlistBds = computed<Bd[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.readlistBdsList()[params['id']] || []
      : this.readlistBdsList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des items dans la vue courante (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() =>
    this.selectedView() === 'readlist'
      ? this.allReadlistBds().length > 0
      : this.allBds().length > 0
  );

  filteredBds = computed<Bd[]>(() => {
    let bds: Bd[];
    if (this.selectedView() === 'readlist') {
      bds = this.allReadlistBds();
    } else if (this.selectedView() === 'owned') {
      bds = this.allBds().filter((bd) => bd.owned);
    } else if (this.selectedView() === 'borrowed') {
      const key = (b: Bd) => `${b.title}|${b.writer}`;
      const readB = this.allBds().filter((b) => Boolean(b.borrowed?.trim()));
      const listB = this.allReadlistBds().filter((b) =>
        Boolean(b.borrowed?.trim())
      );
      const seen = new Set<string>();
      bds = [...readB, ...listB].filter((b) => {
        const k = key(b);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const key = (b: Bd) => `${b.title}|${b.writer}`;
      const readL = this.allBds().filter((b) => Boolean(b.loaned?.trim()));
      const listL = this.allReadlistBds().filter((b) =>
        Boolean(b.loaned?.trim())
      );
      const seen = new Set<string>();
      bds = [...readL, ...listL].filter((b) => {
        const k = key(b);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'toReRead') {
      bds = this.allBds().filter((bd) => bd.wantToReadAgain === true);
    } else {
      bds = this.allBds();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return bds;
    }

    return bds.filter((bd) => this.matchesSearch(bd, term));
  });

  sortedBds = computed<Bd[]>(() =>
    this.selectedView() === 'readlist'
      ? getSortedBds([...this.filteredBds()], 'readPriority')
      : getSortedBds([...this.filteredBds()], this.selectedSort())
  );

  bdsBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getBdsBySaga({
      sortedBds: this.sortedBds(),
      allBds: this.allBds(),
      baseBds: this.baseBdsList(),
      selectedSort: this.selectedSort(),
    });
  });

  collapsedSagas = signal<Record<string, boolean>>({});

  toggleSaga(saga: string): void {
    this.collapsedSagas.update((current) => ({
      ...current,
      [saga]: !current[saga],
    }));
  }

  isSagaCollapsed(saga: string): boolean {
    return Boolean(this.collapsedSagas()[saga]);
  }

  stats = computed<StatItem[]>(() => {
    const albumCount = this.filteredBds().length;
    const totalPages = this.calculateTotalPagesOnce();
    const totalPagesRead = getTotalBdPages(this.filteredBds());
    const estimatedReadingTime = getEstimatedBdReadingTime(this.filteredBds());

    return [
      {
        label: "Nombre d'albums",
        value: `${albumCount.toLocaleString()}`,
        icon: '📚',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Total des pages (albums)',
        value: `${totalPages.toLocaleString()} pages`,
        icon: '📖',
        color: StatItemColor.INFO,
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

  onOptionalViewChange(view: OptionalBdView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: BdView): boolean {
    if (view === 'read' || view === 'readlist') {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalBdView, boolean>>
    >(this.viewConfigStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingViewConfig = true;
    this.optionalViewConfig.set({
      owned: parsed.owned ?? true,
      borrowed: parsed.borrowed ?? true,
      loaned: parsed.loaned ?? true,
      toReRead: parsed.toReRead ?? true,
      sagas: parsed.sagas ?? true,
      recommendations: parsed.recommendations ?? false,
    });
    this.isLoadingViewConfig = false;
  }

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: BdView;
        sort: string;
      }>
    >(this.viewPreferencesStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingPreferences = true;
    if (
      parsed.view &&
      [
        'read',
        'readlist',
        'owned',
        'borrowed',
        'loaned',
        'toReRead',
        'sagas',
        'recommendations',
      ].includes(parsed.view)
    ) {
      this.selectedView.set(parsed.view as BdView);
    }
    if (parsed.sort) {
      const legacy =
        parsed.sort === 'nbTomes'
          ? 'sagaOrder'
          : parsed.sort === 'nbTomes-asc'
            ? 'sagaOrder-asc'
            : parsed.sort;
      if (this.sortOptions().some((opt) => opt.value === legacy)) {
        this.selectedSort.set(legacy);
      }
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
    this.loadViewConfigFromStorage();
    this.loadViewPreferencesFromStorage();
    await this.refreshBds();
  }

  onViewChange(view: BdView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  private matchesSearch(bd: Bd, term: string): boolean {
    const haystack = [bd.title, bd.writer, bd.designer, bd.genre, bd.saga]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private calculateTotalPagesOnce(): number {
    let total = 0;
    for (const bd of this.filteredBds()) {
      if (bd.pages) {
        total += bd.pages;
      }
    }
    return total;
  }

  private async refreshBds() {
    const displayedUserId = this.getActiveUserId();
    const connectedUserId = this.authService.userId() ?? undefined;
    const isViewingOther = Boolean(
      connectedUserId &&
        displayedUserId &&
        displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
    );

    const [bds, readlist, baseBds] = await Promise.all([
      getAllBds(displayedUserId),
      getAllReadlistBds(displayedUserId),
      getAllBaseBds(),
    ]);
    this.bdsList.set(bds);
    this.readlistBdsList.set(readlist);
    this.baseBdsList.set(baseBds.map(getFullBd));

    if (isViewingOther && connectedUserId) {
      const [connectedBds, connectedReadlist] = await Promise.all([
        getAllBds(connectedUserId),
        getAllReadlistBds(connectedUserId),
      ]);
      this.connectedUserBds.set(connectedBds[connectedUserId] ?? []);
      this.connectedUserReadlist.set(connectedReadlist[connectedUserId] ?? []);
    } else {
      this.connectedUserBds.set([]);
      this.connectedUserReadlist.set([]);
    }
  }

  openEditBdDialog(bd: Bd): void {
    const bds = this.sortedBds();
    const index = bds.findIndex(
      (item) => item.title === bd.title && item.writer === bd.writer
    );
    const dialogRef = this.dialog.open(EditBdComponent, {
      data: {
        bd,
        userId: this.getActiveUserId(),
        list: bds,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        void this.refreshBds();
      }
    });
  }

  onBdUpdated(): void {
    void this.refreshBds();
  }

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  getTopFiveRank(bd: Bd): number | null {
    const tf = this.topFive();
    const key = getEntityKey('bds', bd);
    const idx = (tf.bds ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(bd: Bd, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'bds',
      getEntityKey('bds', bd),
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

    // S'assurer que baseBdsList est chargé
    if (this.baseBdsList().length === 0) {
      await this.refreshBds();
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

      const othersRated = await getOtherUsersBdsRated(userId, 4, followedIds);

      const detailsMap = new Map<string, Map<string, number>>();
      for (const bd of othersRated) {
        const key = `${bd.title}|${bd.writer}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(bd.userId) ?? 0;
        if (bd.rating > prev) {
          userMap.set(bd.userId, bd.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allBds().map((bd) => this.getBdIdentityKey(bd))
      );

      const recommended = this.baseBdsList()
        .filter((bd) => {
          const key = this.getBdIdentityKey(bd);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((bd) => {
          const details = detailsMap.get(this.getBdIdentityKey(bd));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...bd,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getBdIdentityKey(a));
          const detailsB = detailsMap.get(this.getBdIdentityKey(b));
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
      console.warn('bds:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedBds = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((bd) => this.matchesSearch(bd, term));
  });

  getBdIdentityKey(bd: Bd): string {
    return `${bd.title}|${bd.writer}`;
  }

  getBdRecommendationText(bd: Bd): string {
    const recommendationDetails =
      (bd as RecommendedBd).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à cette BD`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à cette BD`;
  }

  bdAlreadyInUserReadlist(bd: Bd): boolean {
    const readlist = this.allReadlistBds();
    return readlist.some((b) => b.title === bd.title && b.writer === bd.writer);
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

  canAddBdToMyReadlist(bd: Bd): boolean {
    const key = this.getBdIdentityKey(bd);
    const inReadlist = this.connectedUserReadlist().some(
      (b) => this.getBdIdentityKey(b) === key
    );
    const alreadyRead = this.connectedUserBds().some(
      (b) =>
        this.getBdIdentityKey(b) === key &&
        Boolean(b.readTimes && b.readTimes > 0)
    );
    return !inReadlist && !alreadyRead;
  }

  canAddBdToMyRead(bd: Bd): boolean {
    const key = this.getBdIdentityKey(bd);
    const alreadyRead = this.connectedUserBds().some(
      (b) =>
        this.getBdIdentityKey(b) === key &&
        Boolean(b.readTimes && b.readTimes > 0)
    );
    return !alreadyRead;
  }

  async addBdToConnectedUserReadlist(bd: Bd): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addBdToReadlistApi(bd, connectedUserId);
    if (success) await this.refreshBds();
  }

  async addBdToConnectedUserAsRead(bd: Bd): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addBdAsReadApi(bd, connectedUserId);
    if (success) await this.refreshBds();
  }

  async updateReadPriority(data: { bd: Bd; priority: number }): Promise<void> {
    const success = await updateReadPriorityApi(data, this.getActiveUserId());
    if (success) {
      await this.refreshBds();
    }
  }

  async markBdAsWantToReRead(bd: Bd): Promise<void> {
    const success = await markBdAsWantToReReadApi(bd, this.getActiveUserId());
    if (success) {
      await this.refreshBds();
    }
  }

  async markBdAsReRead(bd: Bd): Promise<void> {
    const success = await markBdAsReReadApi(bd, this.getActiveUserId());
    if (success) {
      await this.refreshBds();
    }
  }

  addBdToReadlist(bd: Bd) {
    this.router.navigate(['/select-bds'], {
      queryParams: {
        readlist: 'true',
        title: bd.title,
        writer: bd.writer,
      },
    });
  }
}
