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
import { SortOption } from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { BdsHeaderComponent } from './bds-header/bds-header.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Bd } from '../../../models/bd-model';
import { Quizz } from '../../../models/quizz-model';
import {
  BdView,
  bdViewOptions,
  bdsSortOptions,
  getSortedBds,
} from './bds.utils';
import {
  PAGES_PER_MANGA_TOME,
  getEstimatedBdReadingTime,
  getTotalTomesBdRead,
  getTotalBdPages,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  getAllBaseBds,
  getAllBds,
  getAllReadlistBds,
  getOtherUsersBdsRated,
} from '../../../facades/bds/bds.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditBdComponent } from '../../edit/edit-bd/edit-bd.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';
import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getApiBaseUrl } from '../../../core/config';
import { getFullBd } from '../../../helpers/full-entities-helper';

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
    QuizzModalComponent,
    BdsHeaderComponent,
  ],
  templateUrl: './bds.component.html',
  styleUrls: ['./bds.component.scss'],
})
export class BdsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'bds_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<BdView>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  sortOptions = signal<SortOption[]>(bdsSortOptions);

  viewOptions: { value: BdView; label: string }[] = bdViewOptions;

  bdsList = signal<{ [key: string]: Bd[] }>({});
  readlistBdsList = signal<{ [key: string]: Bd[] }>({});
  adminBdsList = signal<Bd[]>([]);
  baseBdsList = signal<Bd[]>([]);
  recommendations = signal<RecommendedBd[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

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

  allBds = computed<Bd[]>(() => {
    if (this.isAdminView()) {
      return this.adminBdsList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.bdsList()[params['id']] || []
      : this.bdsList()['guillaume'];
  });

  allReadlistBds = computed<Bd[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.readlistBdsList()[params['id']] || []
      : this.readlistBdsList()['guillaume'];
  });

  filteredBds = computed<Bd[]>(() => {
    let bds = this.allBds();
    if (this.isAdminView()) {
      bds = this.allBds();
    } else if (this.selectedView() === 'readlist') {
      bds = this.allReadlistBds();
    } else if (this.selectedView() === 'owned') {
      bds = this.allBds().filter((bd) => bd.owned);
    } else if (this.selectedView() === 'toReRead') {
      bds = this.allBds().filter((bd) => bd.wantToReadAgain === true);
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

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const totalTomes = this.calculateTotalTomes();
    const totalPages = this.calculateTotalPages();
    const totalTomesRead = getTotalTomesBdRead(this.filteredBds());
    const totalPagesRead = getTotalBdPages(this.filteredBds());
    const estimatedReadingTime = getEstimatedBdReadingTime(this.filteredBds());

    return [
      {
        label: 'Total des tomes',
        value: `${totalTomes.toLocaleString()} tomes`,
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
        label: 'Total des tomes lus (avec relectures)',
        value: `${totalTomesRead.toLocaleString()} tomes`,
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
    if (this.isAdminView()) {
      this.selectedView.set('read');
    }
    this.loadViewPreferencesFromStorage();
    void this.refreshQuizzs();
    await this.refreshBds();
  }

  onViewChange(view: BdView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  private matchesSearch(bd: Bd, term: string): boolean {
    const haystack = [bd.title, bd.writer, bd.designer, bd.genre]
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

  private calculateTotalTomes(): number {
    let total = 0;
    for (const bd of this.filteredBds()) {
      if (bd.nbTomes) {
        total += bd.nbTomes;
      }
    }
    return total;
  }

  private calculateTotalPages(): number {
    let total = 0;
    for (const bd of this.filteredBds()) {
      if (bd.nbTomes) {
        total += bd.nbTomes * PAGES_PER_MANGA_TOME;
      }
    }
    return total;
  }

  private async refreshBds() {
    if (this.isAdminView()) {
      const baseBds = await getAllBaseBds();
      const bds = baseBds.map(getFullBd);
      this.adminBdsList.set(bds);
      this.baseBdsList.set(bds);
      return;
    }

    const userId = this.getActiveUserId();
    const [bds, readlist, baseBds] = await Promise.all([
      getAllBds(userId),
      getAllReadlistBds(userId),
      getAllBaseBds(),
    ]);
    this.bdsList.set(bds);
    this.readlistBdsList.set(readlist);
    this.baseBdsList.set(baseBds.map(getFullBd));
  }

  private async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
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

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  public isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  async loadRecommendations() {
    if (this.isAdminView()) return;
    if (this.isLoadingRecommendations()) return;

    const userId = this.getActiveUserId();
    if (
      this.recommendationsUserId() === userId &&
      this.recommendations().length
    ) {
      return;
    }

    // S'assurer que baseBdsList est chargé
    if (this.baseBdsList().length === 0) {
      await this.refreshBds();
    }

    this.isLoadingRecommendations.set(true);
    try {
      const othersRated = await getOtherUsersBdsRated(userId, 4);

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

  async updateReadPriority(data: { bd: Bd; priority: number }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/bds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: data.bd.title,
          writer: data.bd.writer,
          rating: data.bd.rating,
          readTimes: data.bd.readTimes,
          readDate: data.bd.readDate,
          owned: data.bd.owned,
          readPriority: data.priority,
          wantToReadAgain: data.bd.wantToReadAgain ?? false,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec de la mise à jour de la priorité :',
          payload?.error || response.statusText
        );
        return;
      }

      await this.refreshBds();
    } catch (error) {
      console.warn(
        'Erreur réseau lors de la mise à jour de la priorité.',
        error
      );
    }
  }

  async markBdAsWantToReRead(bd: Bd): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/bds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: bd.title,
          writer: bd.writer,
          rating: bd.rating,
          readTimes: bd.readTimes,
          readDate: bd.readDate,
          owned: bd.owned,
          readPriority: bd.readPriority ?? 1,
          wantToReadAgain: true,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn('Échec marquer à relire:', payload?.error || response.statusText);
        return;
      }
      await this.refreshBds();
    } catch (error) {
      console.warn('Erreur réseau marquer BD à relire.', error);
    }
  }

  async markBdAsReRead(bd: Bd): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/bds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: bd.title,
          writer: bd.writer,
          rating: bd.rating,
          readTimes: bd.readTimes,
          readDate: bd.readDate,
          owned: bd.owned,
          readPriority: bd.readPriority ?? 1,
          wantToReadAgain: false,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn('Échec marquer relu:', payload?.error || response.statusText);
        return;
      }
      await this.refreshBds();
    } catch (error) {
      console.warn('Erreur réseau marquer BD relue.', error);
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
