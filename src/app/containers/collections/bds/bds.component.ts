import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BdComponent } from '../../../components/bd/bd.component';
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
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { getAllBds, getAllReadlistBds } from '../../../facades/bds/bds.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditBdComponent } from '../../edit/edit-bd/edit-bd.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';

@Component({
  selector: 'app-bds',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    BdComponent,
    MenuComponent,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    MatDialogModule,
    QuizzModalComponent,
  ],
  templateUrl: './bds.component.html',
  styleUrls: ['./bds.component.scss'],
})
export class BdsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'bds_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<BdView>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  sortOptions = signal<SortOption[]>(bdsSortOptions);

  viewOptions: ViewToggleOption[] = bdViewOptions;

  bdsList = signal<{ [key: string]: Bd[] }>({});
  readlistBdsList = signal<{ [key: string]: Bd[] }>({});

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

  allBds = computed<Bd[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.bdsList()[params['id']] || []
      : this.bdsList()['guillaume'];
  });

  allReadlistBds = computed<Bd[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.readlistBdsList()[params['id']] || []
      : this.readlistBdsList()['guillaume'];
  });

  filteredBds = computed<Bd[]>(() => {
    let bds = this.allBds();
    if (this.selectedView() === 'readlist') {
      bds = this.allReadlistBds();
    } else if (this.selectedView() === 'owned') {
      bds = this.allBds().filter((bd) => bd.owned);
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return bds;
    }

    return bds.filter((bd) => this.matchesSearch(bd, term));
  });

  sortedBds = computed<Bd[]>(() =>
    getSortedBds([...this.filteredBds()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
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
    this.loadViewPreferencesFromStorage();
    void this.refreshQuizzs();
    await this.refreshBds();
  }

  onViewChange(view: 'read' | 'readlist' | 'owned') {
    this.selectedView.set(view);
  }

  getSelectBdsRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-bds` : '/select-bds';
  }

  getSelectBdsRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-bds-rating`
      : '/select-bds-rating';
  }

  getSelectBdsTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-bds-times-read`
      : '/select-bds-times-read';
  }

  getSelectBdsOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-bds-owned`
      : '/select-bds-owned';
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
    const userId = this.getActiveUserId();
    const [bds, readlist] = await Promise.all([
      getAllBds(userId),
      getAllReadlistBds(userId),
    ]);
    this.bdsList.set(bds);
    this.readlistBdsList.set(readlist);
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
}
