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
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { MangasHeaderComponent } from './mangas-header/mangas-header.component';

import { Manga } from '../../../models/manga-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

import {
  MangaView,
  OptionalMangaView,
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
  getOtherUsersMangasRated,
} from '../../../facades/mangas/mangas.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditMangaComponent } from '../../edit/edit-manga/edit-manga.component';
import { LocalStorageService } from '../../../services/local-storage.service';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullManga } from '../../../helpers/full-entities-helper';
import {
  updateReadPriority as updateReadPriorityApi,
  markMangaAsWantToReRead as markMangaAsWantToReReadApi,
  markMangaAsReRead as markMangaAsReReadApi,
  addMangaToReadlist as addMangaToReadlistApi,
  addMangaAsRead as addMangaAsReadApi,
} from './mangas.controller';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { AuthService } from '../../../core/auth.service';
import { getEntityKey } from '../../../utils/top-five.utils';

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

    MangasHeaderComponent,
    RouterLink,
  ],
  templateUrl: './mangas.component.html',
  styleUrls: ['./mangas.component.scss'],
})
export class MangasComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private isLoadingViewConfig = false;
  private readonly viewConfigStorageKey = 'mangas_view_config';
  private readonly viewPreferencesStorageKey = 'mangas_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<MangaView>('read');
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);

  optionalViewConfig = signal<Record<OptionalMangaView, boolean>>({
    owned: true,
    borrowed: true,
    loaned: true,
    toReRead: true,
    recommendations: false,
  });

  sortOptions = signal<SortOption[]>(mangasSortOptions);

  viewOptions: { value: MangaView; label: string }[] = mangaViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) => this.isViewOptionVisible(option.value))
  );

  mangasList = signal<{ [key: string]: Manga[] }>({});
  readlistMangasList = signal<{ [key: string]: Manga[] }>({});
  /** Mangas lus par l'utilisateur connecté (rempli uniquement en consultation d'un autre profil). */
  connectedUserMangas = signal<Manga[]>([]);
  /** Readlist de l'utilisateur connecté (rempli uniquement en consultation d'un autre profil). */
  connectedUserReadlist = signal<Manga[]>([]);
  baseMangasList = signal<Manga[]>([]);
  recommendations = signal<RecommendedManga[]>([]);
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

  allMangas = computed<Manga[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.mangasList()[params['id']] || []
      : this.mangasList()[DEFAULT_USER_ID];
  });

  allReadlistMangas = computed<Manga[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.readlistMangasList()[params['id']] || []
      : this.readlistMangasList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des items dans la vue courante (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() =>
    this.selectedView() === 'readlist'
      ? this.allReadlistMangas().length > 0
      : this.allMangas().length > 0
  );

  filteredMangas = computed<Manga[]>(() => {
    let mangas: Manga[];
    if (this.selectedView() === 'readlist') {
      mangas = this.allReadlistMangas();
    } else if (this.selectedView() === 'owned') {
      mangas = this.allMangas().filter((manga) => manga.owned);
    } else if (this.selectedView() === 'borrowed') {
      const key = (m: Manga) => `${m.title}|${m.author}`;
      const readB = this.allMangas().filter((m) => Boolean(m.borrowed.trim()));
      const listB = this.allReadlistMangas().filter((m) =>
        Boolean(m.borrowed.trim())
      );
      const seen = new Set<string>();
      mangas = [...readB, ...listB].filter((m) => {
        const k = key(m);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const key = (m: Manga) => `${m.title}|${m.author}`;
      const readL = this.allMangas().filter((m) => Boolean(m.loaned.trim()));
      const listL = this.allReadlistMangas().filter((m) =>
        Boolean(m.loaned.trim())
      );
      const seen = new Set<string>();
      mangas = [...readL, ...listL].filter((m) => {
        const k = key(m);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'toReRead') {
      mangas = this.allMangas().filter(
        (manga) => manga.wantToReadAgain === true
      );
    } else {
      mangas = this.allMangas();
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

  openViewConfig(): void {
    this.isViewConfigOpen.set(true);
  }

  closeViewConfig(): void {
    this.isViewConfigOpen.set(false);
  }

  onOptionalViewChange(view: OptionalMangaView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: MangaView): boolean {
    if (view === 'read' || view === 'readlist') {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalMangaView, boolean>>
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
        view: MangaView;
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
    this.loadViewConfigFromStorage();
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

    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
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
    const userId = this.getActiveUserId();
    const displayedUserId = userId;
    const connectedUserId = this.authService.userId() ?? undefined;
    const isViewingOther = Boolean(
      connectedUserId &&
        displayedUserId &&
        displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
    );

    const [mangas, readlist, baseMangas] = await Promise.all([
      getAllMangas(displayedUserId),
      getAllReadlistMangas(displayedUserId),
      getAllBaseMangas(),
    ]);
    this.mangasList.set(mangas);
    this.readlistMangasList.set(readlist);
    this.baseMangasList.set(baseMangas.map(getFullManga));

    if (isViewingOther && connectedUserId) {
      const [connectedMangas, connectedReadlist] = await Promise.all([
        getAllMangas(connectedUserId),
        getAllReadlistMangas(connectedUserId),
      ]);
      this.connectedUserMangas.set(connectedMangas[connectedUserId] ?? []);
      this.connectedUserReadlist.set(connectedReadlist[connectedUserId] ?? []);
    } else {
      this.connectedUserMangas.set([]);
      this.connectedUserReadlist.set([]);
    }
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

  onMangaUpdated(): void {
    void this.refreshMangas();
  }

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  getTopFiveRank(manga: Manga): number | null {
    const tf = this.topFive();
    const key = getEntityKey('mangas', manga);
    const idx = (tf.mangas ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(manga: Manga, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'mangas',
      getEntityKey('mangas', manga),
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

    // S'assurer que baseMangasList est chargé
    if (this.baseMangasList().length === 0) {
      await this.refreshMangas();
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

      const othersRated = await getOtherUsersMangasRated(
        userId,
        4,
        followedIds
      );

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

  canAddMangaToMyReadlist(manga: Manga): boolean {
    const key = this.getMangaIdentityKey(manga);
    const inReadlist = this.connectedUserReadlist().some(
      (m) => this.getMangaIdentityKey(m) === key
    );
    const alreadyRead = this.connectedUserMangas().some(
      (m) =>
        this.getMangaIdentityKey(m) === key &&
        Boolean(m.readTimes && m.readTimes > 0)
    );
    return !inReadlist && !alreadyRead;
  }

  canAddMangaToMyRead(manga: Manga): boolean {
    const key = this.getMangaIdentityKey(manga);
    const alreadyRead = this.connectedUserMangas().some(
      (m) =>
        this.getMangaIdentityKey(m) === key &&
        Boolean(m.readTimes && m.readTimes > 0)
    );
    return !alreadyRead;
  }

  async addMangaToConnectedUserReadlist(manga: Manga): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addMangaToReadlistApi(manga, connectedUserId);
    if (success) await this.refreshMangas();
  }

  async addMangaToConnectedUserAsRead(manga: Manga): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addMangaAsReadApi(manga, connectedUserId);
    if (success) await this.refreshMangas();
  }

  async updateReadPriority(data: {
    manga: Manga;
    priority: number;
  }): Promise<void> {
    const success = await updateReadPriorityApi(data, this.getActiveUserId());
    if (success) {
      await this.refreshMangas();
    }
  }

  async markMangaAsWantToReRead(manga: Manga): Promise<void> {
    const success = await markMangaAsWantToReReadApi(
      manga,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshMangas();
    }
  }

  async markMangaAsReRead(manga: Manga): Promise<void> {
    const success = await markMangaAsReReadApi(manga, this.getActiveUserId());
    if (success) {
      await this.refreshMangas();
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
