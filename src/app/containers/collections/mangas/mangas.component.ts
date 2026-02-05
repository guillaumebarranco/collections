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
import { MangaComponent } from '../../../components/collections/manga/manga.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { MangasHeaderComponent } from './mangas-header/mangas-header.component';
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
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  getAllBaseMangas,
  getAllMangas,
  getAllReadlistMangas,
  getOtherUsersMangasRated,
} from '../../../facades/mangas/mangas.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditMangaComponent } from '../../edit/edit-manga/edit-manga.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';
import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getApiBaseUrl } from '../../../core/config';
import { getFullManga } from '../../../helpers/full-entities-helper';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedManga = Manga & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-mangas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MangaComponent,
    MenuComponent,
    MatDialogModule,
    QuizzModalComponent,
    MangasHeaderComponent,
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

  viewOptions: { value: MangaView; label: string }[] = mangaViewOptions;

  mangasList = signal<{ [key: string]: Manga[] }>({});
  readlistMangasList = signal<{ [key: string]: Manga[] }>({});
  adminMangasList = signal<Manga[]>([]);
  baseMangasList = signal<Manga[]>([]);
  recommendations = signal<RecommendedManga[]>([]);
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
    this.selectedView() === 'readlist'
      ? getSortedMangas([...this.filteredMangas()], 'readPriority')
      : getSortedMangas([...this.filteredMangas()], this.selectedSort())
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

  onViewChange(view: MangaView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
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
      const mangas = baseMangas.map(getFullManga);
      this.adminMangasList.set(mangas);
      this.baseMangasList.set(mangas);
      return;
    }

    const userId = this.getActiveUserId();
    const [mangas, readlist, baseMangas] = await Promise.all([
      getAllMangas(userId),
      getAllReadlistMangas(userId),
      getAllBaseMangas(),
    ]);
    this.mangasList.set(mangas);
    this.readlistMangasList.set(readlist);
    this.baseMangasList.set(baseMangas.map(getFullManga));
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

    // S'assurer que baseMangasList est chargé
    if (this.baseMangasList().length === 0) {
      await this.refreshMangas();
    }

    this.isLoadingRecommendations.set(true);
    try {
      const othersRated = await getOtherUsersMangasRated(userId, 4);

      const detailsMap = new Map<string, Map<string, number>>();
      for (const manga of othersRated) {
        const key = `${manga.title}|${manga.author}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(manga.userId) ?? 0;
        if (manga.rating > prev) {
          userMap.set(manga.userId, manga.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allMangas().map((manga) => this.getMangaIdentityKey(manga))
      );

      const recommended = this.baseMangasList()
        .filter((manga) => {
          const key = this.getMangaIdentityKey(manga);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((manga) => {
          const details = detailsMap.get(this.getMangaIdentityKey(manga));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...manga,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getMangaIdentityKey(a));
          const detailsB = detailsMap.get(this.getMangaIdentityKey(b));
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
      console.warn('mangas:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedMangas = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((manga) => this.matchesSearch(manga, term));
  });

  getMangaIdentityKey(manga: Manga): string {
    return `${manga.title}|${manga.author}`;
  }

  getMangaRecommendationText(manga: Manga): string {
    const recommendationDetails =
      (manga as RecommendedManga).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à ce manga`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à ce manga`;
  }

  mangaAlreadyInUserReadlist(manga: Manga): boolean {
    const readlist = this.allReadlistMangas();
    return readlist.some(
      (m) => m.title === manga.title && m.author === manga.author
    );
  }

  async updateReadPriority(data: {
    manga: Manga;
    priority: number;
  }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/mangas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: data.manga.title,
          author: data.manga.author,
          rating: data.manga.rating,
          readTimes: data.manga.readTimes,
          readDate: data.manga.readDate,
          owned: data.manga.owned,
          readPriority: data.priority,
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

      await this.refreshMangas();
    } catch (error) {
      console.warn(
        'Erreur réseau lors de la mise à jour de la priorité.',
        error
      );
    }
  }

  addMangaToReadlist(manga: Manga) {
    this.router.navigate(['/select-mangas'], {
      queryParams: {
        readlist: 'true',
        title: manga.title,
        author: manga.author,
      },
    });
  }
}
