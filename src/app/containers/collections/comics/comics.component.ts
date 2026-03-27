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
import { ComicComponent } from '../../../components/collections/comic/comic.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { ComicsHeaderComponent } from './comics-header/comics-header.component';

import { Comic } from '../../../models/comic-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

import {
  ComicView,
  OptionalComicView,
  comicViewOptions,
  comicsSortOptions,
  getComicsBySaga,
  getSortedComics,
} from './comics.utils';
import {
  getTotalComicsPages,
  getEstimatedComicsReadingTime,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBaseComics,
  getAllComics,
  getAllReadlistComics,
  getOtherUsersComicsRated,
} from '../../../facades/comics/comics.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditComicComponent } from '../../edit/edit-comic/edit-comic.component';
import { LocalStorageService } from '../../../services/local-storage.service';

import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullComic } from '../../../helpers/full-entities-helper';
import {
  updateReadPriority as updateReadPriorityApi,
  markComicAsWantToReRead as markComicAsWantToReReadApi,
  markComicAsReRead as markComicAsReReadApi,
  addComicToReadlist as addComicToReadlistApi,
  addComicAsRead as addComicAsReadApi,
} from './comics.controller';
import { TopFiveService } from '../../../services/top-five.service';
import { FollowsService } from '../../../services/follows.service';
import { AuthService } from '../../../core/auth.service';
import { getEntityKey } from '../../../utils/top-five.utils';
type RecommendationDetail = { userId: string; rating: number };
type RecommendedComic = Comic & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-comics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComicComponent,
    MenuComponent,
    MatDialogModule,

    ComicsHeaderComponent,
    RouterLink,
  ],
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
})
export class ComicsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly topFiveService = inject(TopFiveService);
  private readonly followsService = inject(FollowsService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private isLoadingViewConfig = false;
  private readonly viewConfigStorageKey = 'comics_view_config';
  private readonly viewPreferencesStorageKey = 'comics_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<ComicView>('read');
  searchTerm = signal<string>('');
  showTopFiveRank = signal<boolean>(false);
  isViewConfigOpen = signal<boolean>(false);

  optionalViewConfig = signal<Record<OptionalComicView, boolean>>({
    owned: true,
    borrowed: true,
    loaned: true,
    toReRead: true,
    sagas: true,
    recommendations: false,
  });

  sortOptions = signal<SortOption[]>(comicsSortOptions);

  viewOptions: { value: ComicView; label: string }[] = comicViewOptions;

  visibleViewOptions = computed(() =>
    this.viewOptions.filter((option) => this.isViewOptionVisible(option.value))
  );

  comicsList = signal<{ [key: string]: Comic[] }>({});
  readlistComicsList = signal<{ [key: string]: Comic[] }>({});
  connectedUserComics = signal<Comic[]>([]);
  connectedUserReadlist = signal<Comic[]>([]);
  baseComicsList = signal<Comic[]>([]);
  recommendations = signal<RecommendedComic[]>([]);
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

  allComics = computed<Comic[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.comicsList()[params['id']] || []
      : this.comicsList()[DEFAULT_USER_ID];
  });

  allReadlistComics = computed<Comic[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.readlistComicsList()[params['id']] || []
      : this.readlistComicsList()[DEFAULT_USER_ID];
  });

  /** True si l'utilisateur a des items dans la vue courante (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() =>
    this.selectedView() === 'readlist'
      ? this.allReadlistComics().length > 0
      : this.allComics().length > 0
  );

  filteredComics = computed<Comic[]>(() => {
    let comics: Comic[];
    if (this.selectedView() === 'readlist') {
      comics = this.allReadlistComics();
    } else if (this.selectedView() === 'owned') {
      comics = this.allComics().filter((comic) => comic.owned);
    } else if (this.selectedView() === 'borrowed') {
      const key = (c: Comic) => `${c.title}|${c.writer}`;
      const readB = this.allComics().filter((c) => Boolean(c.borrowed.trim()));
      const listB = this.allReadlistComics().filter((c) =>
        Boolean(c.borrowed.trim())
      );
      const seen = new Set<string>();
      comics = [...readB, ...listB].filter((c) => {
        const k = key(c);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'loaned') {
      const key = (c: Comic) => `${c.title}|${c.writer}`;
      const readL = this.allComics().filter((c) => Boolean(c.loaned.trim()));
      const listL = this.allReadlistComics().filter((c) =>
        Boolean(c.loaned.trim())
      );
      const seen = new Set<string>();
      comics = [...readL, ...listL].filter((c) => {
        const k = key(c);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    } else if (this.selectedView() === 'toReRead') {
      comics = this.allComics().filter(
        (comic) => comic.wantToReadAgain === true
      );
    } else {
      comics = this.allComics();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return comics;
    }

    return comics.filter((comic) => this.matchesSearch(comic, term));
  });

  sortedComics = computed<Comic[]>(() =>
    this.selectedView() === 'readlist'
      ? getSortedComics([...this.filteredComics()], 'readPriority')
      : getSortedComics([...this.filteredComics()], this.selectedSort())
  );

  comicsBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getComicsBySaga({
      sortedComics: this.sortedComics(),
      allComics: this.allComics(),
      baseComics: this.baseComicsList(),
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
    const totalTomes = this.calculateTotalComics();
    const totalPages = this.calculateTotalPages();
    const totalPagesRead = getTotalComicsPages(this.filteredComics());
    const estimatedReadingTime = getEstimatedComicsReadingTime(
      this.filteredComics()
    );

    return [
      {
        label: "Nombre d'albums",
        value: `${totalTomes.toLocaleString()}`,
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

  onOptionalViewChange(view: OptionalComicView, enabled: boolean): void {
    this.optionalViewConfig.update((current) => ({
      ...current,
      [view]: enabled,
    }));
  }

  private isViewOptionVisible(view: ComicView): boolean {
    if (view === 'read' || view === 'readlist') {
      return true;
    }
    return this.optionalViewConfig()[view];
  }

  private loadViewConfigFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<Record<OptionalComicView, boolean>>
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
        view: ComicView;
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
      this.selectedView.set(parsed.view as ComicView);
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
    await this.refreshComics();
  }

  onViewChange(view: ComicView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  private matchesSearch(comic: Comic, term: string): boolean {
    const haystack = [
      comic.title,
      comic.writer,
      comic.designer,
      comic.genre,
      comic.saga,
    ]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private calculateTotalComics(): number {
    let total = 0;
    for (const comic of this.filteredComics()) {
      total += 1;
    }
    return total;
  }

  private calculateTotalPages(): number {
    let total = 0;
    for (const comic of this.filteredComics()) {
      total += comic.pages || 0;
    }

    return total;
  }

  private async refreshComics() {
    const displayedUserId = this.getActiveUserId();
    const connectedUserId = this.authService.userId() ?? undefined;
    const isViewingOther = Boolean(
      connectedUserId &&
        displayedUserId &&
        displayedUserId.toLowerCase() !== connectedUserId.toLowerCase()
    );

    const [comics, readlist, baseComics] = await Promise.all([
      getAllComics(displayedUserId),
      getAllReadlistComics(displayedUserId),
      getAllBaseComics(),
    ]);
    this.comicsList.set(comics);
    this.readlistComicsList.set(readlist);
    this.baseComicsList.set(baseComics.map(getFullComic));

    if (isViewingOther && connectedUserId) {
      const [connectedComics, connectedReadlist] = await Promise.all([
        getAllComics(connectedUserId),
        getAllReadlistComics(connectedUserId),
      ]);
      this.connectedUserComics.set(connectedComics[connectedUserId] ?? []);
      this.connectedUserReadlist.set(connectedReadlist[connectedUserId] ?? []);
    } else {
      this.connectedUserComics.set([]);
      this.connectedUserReadlist.set([]);
    }
  }

  openEditComicDialog(comic: Comic): void {
    const comics = this.sortedComics();
    const index = comics.findIndex(
      (item) => item.title === comic.title && item.writer === comic.writer
    );
    const dialogRef = this.dialog.open(EditComicComponent, {
      data: {
        comic,
        userId: this.getActiveUserId(),
        list: comics,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        void this.refreshComics();
      }
    });
  }

  onComicUpdated(): void {
    void this.refreshComics();
  }

  async updateReadPriority(data: {
    comic: Comic;
    priority: number;
  }): Promise<void> {
    const success = await updateReadPriorityApi(data, this.getActiveUserId());
    if (success) {
      await this.refreshComics();
    }
  }

  async markComicAsWantToReRead(comic: Comic): Promise<void> {
    const success = await markComicAsWantToReReadApi(
      comic,
      this.getActiveUserId()
    );
    if (success) {
      await this.refreshComics();
    }
  }

  async markComicAsReRead(comic: Comic): Promise<void> {
    const success = await markComicAsReReadApi(comic, this.getActiveUserId());
    if (success) {
      await this.refreshComics();
    }
  }

  getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? DEFAULT_USER_ID;
  }

  getTopFiveRank(comic: Comic): number | null {
    const tf = this.topFive();
    const key = getEntityKey('comics', comic);
    const idx = (tf.comics ?? []).indexOf(key);
    return idx === -1 ? null : idx + 1;
  }

  onTopFiveRankChange(comic: Comic, rank: number | null): void {
    this.topFiveService.setRank(
      this.getActiveUserId(),
      'comics',
      getEntityKey('comics', comic),
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

    // S'assurer que baseComicsList est chargé
    if (this.baseComicsList().length === 0) {
      await this.refreshComics();
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

      const othersRated = await getOtherUsersComicsRated(
        userId,
        4,
        followedIds
      );

      const detailsMap = new Map<string, Map<string, number>>();
      for (const comic of othersRated) {
        const key = `${comic.title}|${comic.writer}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(comic.userId) ?? 0;
        if (comic.rating > prev) {
          userMap.set(comic.userId, comic.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allComics().map((comic) => this.getComicIdentityKey(comic))
      );

      const recommended = this.baseComicsList()
        .filter((comic) => {
          const key = this.getComicIdentityKey(comic);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((comic) => {
          const details = detailsMap.get(this.getComicIdentityKey(comic));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...comic,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getComicIdentityKey(a));
          const detailsB = detailsMap.get(this.getComicIdentityKey(b));
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
      console.warn('comics:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedComics = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((comic) => this.matchesSearch(comic, term));
  });

  getComicIdentityKey(comic: Comic): string {
    return `${comic.title}|${comic.writer}`;
  }

  getComicRecommendationText(comic: Comic): string {
    const recommendationDetails =
      (comic as RecommendedComic).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à ce comic`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à ce comic`;
  }

  comicAlreadyInUserReadlist(comic: Comic): boolean {
    const readlist = this.allReadlistComics();
    return readlist.some(
      (c) => c.title === comic.title && c.writer === comic.writer
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

  canAddComicToMyReadlist(comic: Comic): boolean {
    const key = this.getComicIdentityKey(comic);
    const inReadlist = this.connectedUserReadlist().some(
      (c) => this.getComicIdentityKey(c) === key
    );
    const alreadyRead = this.connectedUserComics().some(
      (c) =>
        this.getComicIdentityKey(c) === key &&
        Boolean(c.readTimes && c.readTimes > 0)
    );
    return !inReadlist && !alreadyRead;
  }

  canAddComicToMyRead(comic: Comic): boolean {
    const key = this.getComicIdentityKey(comic);
    const alreadyRead = this.connectedUserComics().some(
      (c) =>
        this.getComicIdentityKey(c) === key &&
        Boolean(c.readTimes && c.readTimes > 0)
    );
    return !alreadyRead;
  }

  async addComicToConnectedUserReadlist(comic: Comic): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addComicToReadlistApi(comic, connectedUserId);
    if (success) await this.refreshComics();
  }

  async addComicToConnectedUserAsRead(comic: Comic): Promise<void> {
    const connectedUserId = this.authService.userId();
    if (!connectedUserId) return;
    const success = await addComicAsReadApi(comic, connectedUserId);
    if (success) await this.refreshComics();
  }

  addComicToReadlist(comic: Comic) {
    this.router.navigate(['/select-comics'], {
      queryParams: {
        readlist: 'true',
        title: comic.title,
        writer: comic.writer,
      },
    });
  }
}
