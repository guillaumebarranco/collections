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
import {
  ManwhaView,
  getSortedManwhas,
  manwhaViewOptions,
  manwhasSortOptions,
} from './manwhas.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseManwhas,
  getAllManwhas,
  getAllReadlistManwhas,
} from '../../../facades/manwhas/manwhas.facade';
import {
  getTotalManwhasPages,
  getTotalManwhasChaptersRead,
  getEstimatedManwhaReadingTime,
  PAGES_PER_MANWHA_CHAPTER,
} from '../../../utils/stats.utils';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditManwhaComponent } from '../../edit/edit-manwha/edit-manwha.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Quizz } from '../../../models/quizz-model';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';
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
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'manwhas_view_preferences';
  selectedSort = signal<string>('rating');
  selectedView = signal<ManwhaView>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  sortOptions = signal<SortOption[]>(manwhasSortOptions);

  viewOptions: { value: ManwhaView; label: string }[] = manwhaViewOptions;

  manwhasList = signal<{ [key: string]: Manwha[] }>({});
  readlistManwhasList = signal<{ [key: string]: Manwha[] }>({});
  adminManwhasList = signal<Manwha[]>([]);

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

  allManwhas = computed<Manwha[]>(() => {
    if (this.isAdminView()) {
      return this.adminManwhasList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const manwhas = hasNameParam
      ? this.manwhasList()[params['id']] || []
      : this.manwhasList()['guillaume'];

    return manwhas;
  });

  allReadlistManwhas = computed<Manwha[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.readlistManwhasList()[params['id']] || []
      : this.readlistManwhasList()['guillaume'];
  });

  filteredManwhas = computed<Manwha[]>(() => {
    let manwhas = this.allManwhas();
    if (this.isAdminView()) {
      manwhas = this.allManwhas();
    } else if (this.selectedView() === 'readlist') {
      manwhas = this.allReadlistManwhas();
    } else if (this.selectedView() === 'owned') {
      manwhas = this.allManwhas().filter((manwha) => manwha.owned);
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return manwhas;
    }

    return manwhas.filter((manwha) => this.matchesSearch(manwha, term));
  });

  sortedManwhas = computed<Manwha[]>(() =>
    getSortedManwhas([...this.filteredManwhas()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
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
    void this.refreshQuizzs();
    this.loadViewPreferencesFromStorage();
    await this.refreshManwhas();
  }

  onViewChange(view: 'read' | 'readlist' | 'owned') {
    this.selectedView.set(view);
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

  private async refreshManwhas() {
    if (this.isAdminView()) {
      const baseManwhas = await getAllBaseManwhas();
      const manwhas = baseManwhas.map((manwha) => ({
        title: manwha.title,
        author: manwha.author,
        coverUrl: manwha.coverUrl,
        pages: manwha.pages,
        genre: manwha.genre,
        nbChapters: manwha.nbChapters,
        isFinished: manwha.isFinished,
        rating: 0,
        readDate: '',
        readTimes: 0,
        owned: false,
      }));
      this.adminManwhasList.set(manwhas);
      return;
    }

    const userId = this.getActiveUserId();
    const [manwhas, readlist] = await Promise.all([
      getAllManwhas(userId),
      getAllReadlistManwhas(userId),
    ]);
    this.manwhasList.set(manwhas);
    this.readlistManwhasList.set(readlist);
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
}
