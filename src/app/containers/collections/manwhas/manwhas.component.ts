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
import { ManwhaComponent } from '../../../components/collections/manwha/manwha.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/sort-dropdown/sort-dropdown.component';
import { ManwhasHeaderComponent } from './manwhas-header/manwhas-header.component';
import { Manwha } from '../../../models/manwha-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
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
} from '../../../utils/stats.utils';
import {
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditManwhaComponent } from '../../edit/edit-manwha/edit-manwha.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Quizz } from '../../../models/quizz-model';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullManwha } from '../../../helpers/full-entities-helper';
import {
  updateReadPriority as updateReadPriorityApi,
  markManwhaAsWantToReRead as markManwhaAsWantToReReadApi,
  markManwhaAsReRead as markManwhaAsReReadApi,
} from './manwhas.controller';
import { TopFiveService } from '../../../services/top-five.service';
import { getEntityKey } from '../../../utils/top-five.utils';

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
    QuizzModalComponent,
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
  private isLoadingPreferences = false;
  private isLoadingViewConfig = false;
  private readonly viewConfigStorageKey = 'manwhas_view_config';
  private readonly viewPreferencesStorageKey = 'manwhas_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<ManwhaView>('read');
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);
  optionalViewConfig = signal<Record<OptionalManwhaView, boolean>>({
    owned: true,
    toReRead: true,
    recommendations: false,
  });

  sortOptions = signal<SortOption[]>(manwhasSortOptions);

  viewOptions: { value: ManwhaView; label: string }[] = manwhaViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) =>
      this.isViewOptionVisible(option.value)
    )
  );

  manwhasList = signal<{ [key: string]: Manwha[] }>({});
  readlistManwhasList = signal<{ [key: string]: Manwha[] }>({});
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

  /** True si l'utilisateur a des items dans la vue courante (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() =>
    this.selectedView() === 'readlist'
      ? this.allReadlistManwhas().length > 0
      : this.allManwhas().length > 0
  );

  filteredManwhas = computed<Manwha[]>(() => {
    let manwhas: Manwha[];
    if (this.selectedView() === 'readlist') {
      manwhas = this.allReadlistManwhas();
    } else if (this.selectedView() === 'owned') {
      manwhas = this.allManwhas().filter((manwha) => manwha.owned);
    } else if (this.selectedView() === 'toReRead') {
      manwhas = this.allManwhas().filter((manwha) => manwha.wantToReadAgain === true);
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
    this.selectedView() === 'readlist'
      ? getSortedManwhas([...this.filteredManwhas()], 'readPriority')
      : getSortedManwhas([...this.filteredManwhas()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    const totalChapters = this.calculateTotalChapters();
    const totalPages = this.calculateTotalManwhasPages();
    const totalChaptersRead = getTotalManwhasChaptersRead(
      this.filteredManwhas()
    );
    const totalPagesRead = getTotalManwhasPages(this.filteredManwhas());
    const estimatedReadingTime = getEstimatedManwhaReadingTime(
      this.filteredManwhas()
    );

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
    if (view === 'read' || view === 'readlist') {
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
      toReRead: parsed.toReRead ?? true,
      recommendations: parsed.recommendations ?? false,
    });
    this.isLoadingViewConfig = false;
  }

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: 'read' | 'readlist' | 'owned';
        sort: string;
      }>
    >(this.viewPreferencesStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingPreferences = true;
    if (parsed.view && ['read', 'readlist', 'owned'].includes(parsed.view)) {
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

  openQuizzModal(quizzs: Quizz[]) {
    if (!quizzs || quizzs.length === 0) return;
    this.activeQuizzs.set(quizzs);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal() {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
  }

  async ngOnInit() {
    this.loadViewConfigFromStorage();
    void this.refreshQuizzs();
    this.loadViewPreferencesFromStorage();
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

  onManwhaUpdated(): void {
    void this.refreshManwhas();
  }

  private async refreshManwhas() {
    const userId = this.getActiveUserId();
    const [manwhas, readlist, baseManwhas] = await Promise.all([
      getAllManwhas(userId),
      getAllReadlistManwhas(userId),
      getAllBaseManwhas(),
    ]);
    this.manwhasList.set(manwhas);
    this.readlistManwhasList.set(readlist);
    this.baseManwhasList.set(baseManwhas.map(getFullManwha));
  }

  private async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
  }

  private getActiveUserId(): string {
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

  async loadRecommendations() {
    if (this.isLoadingRecommendations()) return;

    const userId = this.getActiveUserId();
    if (
      this.recommendationsUserId() === userId &&
      this.recommendations().length
    ) {
      return;
    }

    // S'assurer que baseManwhasList est chargé
    if (this.baseManwhasList().length === 0) {
      await this.refreshManwhas();
    }

    this.isLoadingRecommendations.set(true);
    try {
      const othersRated = await getOtherUsersManwhasRated(userId, 4);

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
    const success = await markManwhaAsWantToReReadApi(manwha, this.getActiveUserId());
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
