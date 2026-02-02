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
import { MangaComponent } from '../../../components/manga/manga.component';
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
import { Manga } from '../../../models/manga-model';
import { Quizz } from '../../../models/quizz-model';
import {
  MangaView,
  mangaViewOptions,
  mangasSortOptions,
  getSortedMangas,
} from './mangas.utils';
import {
  getTotalMangaPages,
  getTotalMangaTomesRead,
  getEstimatedMangaReadingTime,
  PAGES_PER_MANGA_TOME,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseMangas,
  getAllMangas,
  getAllReadlistMangas,
} from '../../../facades/mangas/mangas.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditMangaComponent } from '../../edit/edit-manga/edit-manga.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-mangas',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MangaComponent,
    MenuComponent,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    MatDialogModule,
    QuizzModalComponent,
  ],
  templateUrl: './mangas.component.html',
  styleUrls: ['./mangas.component.scss'],
})
export class MangasComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'mangas_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<MangaView>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  sortOptions = signal<SortOption[]>(mangasSortOptions);

  viewOptions: ViewToggleOption[] = mangaViewOptions;

  mangasList = signal<{ [key: string]: Manga[] }>({});
  readlistMangasList = signal<{ [key: string]: Manga[] }>({});
  adminMangasList = signal<Manga[]>([]);

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

  allMangas = computed<Manga[]>(() => {
    if (this.isAdminView()) {
      return this.adminMangasList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.mangasList()[params['id']] || []
      : this.mangasList()['guillaume'];
  });

  allReadlistMangas = computed<Manga[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.readlistMangasList()[params['id']] || []
      : this.readlistMangasList()['guillaume'];
  });

  filteredMangas = computed<Manga[]>(() => {
    let mangas = this.allMangas();
    if (this.isAdminView()) {
      mangas = this.allMangas();
    } else if (this.selectedView() === 'readlist') {
      mangas = this.allReadlistMangas();
    } else if (this.selectedView() === 'owned') {
      mangas = this.allMangas().filter((manga) => manga.owned);
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return mangas;
    }

    return mangas.filter((manga) => this.matchesSearch(manga, term));
  });

  sortedMangas = computed<Manga[]>(() =>
    getSortedMangas([...this.filteredMangas()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const totalTomes = this.calculateTotalTomes();
    const totalPages = this.calculateTotalPages();
    const totalTomesRead = getTotalMangaTomesRead(this.filteredMangas());
    const totalPagesRead = getTotalMangaPages(this.filteredMangas());
    const estimatedReadingTime = getEstimatedMangaReadingTime(
      this.filteredMangas()
    );

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
    void this.refreshQuizzs();
    this.loadViewPreferencesFromStorage();
    await this.refreshMangas();
  }

  onViewChange(view: 'read' | 'readlist' | 'owned') {
    this.selectedView.set(view);
  }

  getSelectMangasRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-mangas` : '/select-mangas';
  }

  getSelectMangasRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-mangas-rating`
      : '/select-mangas-rating';
  }

  getSelectMangasTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-mangas-times-read`
      : '/select-mangas-times-read';
  }

  getSelectMangasOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-mangas-owned`
      : '/select-mangas-owned';
  }

  private matchesSearch(manga: Manga, term: string): boolean {
    const haystack = [manga.title, manga.author, manga.genre]
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
    for (const manga of this.filteredMangas()) {
      if (manga.nbTomes) {
        total += manga.nbTomes;
      }
    }
    return total;
  }

  private calculateTotalPages(): number {
    let total = 0;
    for (const manga of this.filteredMangas()) {
      if (manga.nbTomes) {
        total += manga.nbTomes * PAGES_PER_MANGA_TOME;
      }
    }
    return total;
  }

  private async refreshMangas() {
    if (this.isAdminView()) {
      const baseMangas = await getAllBaseMangas();
      const mangas = baseMangas.map((manga) => ({
        title: manga.title,
        author: manga.author,
        coverUrl: manga.coverUrl,
        pages: manga.pages,
        genre: manga.genre,
        nbTomes: manga.nbTomes,
        isFinished: manga.isFinished,
        rating: 0,
        readDate: '',
        readTimes: 0,
        owned: false,
      }));
      this.adminMangasList.set(mangas);
      return;
    }

    const userId = this.getActiveUserId();
    const [mangas, readlist] = await Promise.all([
      getAllMangas(userId),
      getAllReadlistMangas(userId),
    ]);
    this.mangasList.set(mangas);
    this.readlistMangasList.set(readlist);
  }

  private async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
  }

  openEditMangaDialog(manga: Manga): void {
    const mangas = this.sortedMangas();
    const index = mangas.findIndex(
      (item) => item.title === manga.title && item.author === manga.author
    );
    const dialogRef = this.dialog.open(EditMangaComponent, {
      data: {
        manga,
        userId: this.getActiveUserId(),
        list: mangas,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        void this.refreshMangas();
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
}
