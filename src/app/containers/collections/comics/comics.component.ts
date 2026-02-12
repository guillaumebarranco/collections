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
import { SortOption } from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { ComicsHeaderComponent } from './comics-header/comics-header.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Comic } from '../../../models/comic-model';
import { Quizz } from '../../../models/quizz-model';
import {
  ComicView,
  comicViewOptions,
  comicsSortOptions,
  getSortedComics,
} from './comics.utils';
import {
  getTotalComicsPages,
  getEstimatedComicsReadingTime,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  getAllBaseComics,
  getAllComics,
  getAllReadlistComics,
  getOtherUsersComicsRated,
} from '../../../facades/comics/comics.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditComicComponent } from '../../edit/edit-comic/edit-comic.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';
import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getFullComic } from '../../../helpers/full-entities-helper';
import {
  updateReadPriority as updateReadPriorityApi,
  markComicAsWantToReRead as markComicAsWantToReReadApi,
  markComicAsReRead as markComicAsReReadApi,
} from './comics.controller';
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
    QuizzModalComponent,
    ComicsHeaderComponent,
  ],
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
})
export class ComicsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'comics_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<ComicView>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  sortOptions = signal<SortOption[]>(comicsSortOptions);

  viewOptions: { value: ComicView; label: string }[] = comicViewOptions;

  comicsList = signal<{ [key: string]: Comic[] }>({});
  readlistComicsList = signal<{ [key: string]: Comic[] }>({});
  adminComicsList = signal<Comic[]>([]);
  baseComicsList = signal<Comic[]>([]);
  recommendations = signal<RecommendedComic[]>([]);
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

  allComics = computed<Comic[]>(() => {
    if (this.isAdminView()) {
      return this.adminComicsList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.comicsList()[params['id']] || []
      : this.comicsList()['guillaume'];
  });

  allReadlistComics = computed<Comic[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.readlistComicsList()[params['id']] || []
      : this.readlistComicsList()['guillaume'];
  });

  filteredComics = computed<Comic[]>(() => {
    let comics = this.allComics();
    if (this.isAdminView()) {
      comics = this.allComics();
    } else if (this.selectedView() === 'readlist') {
      comics = this.allReadlistComics();
    } else if (this.selectedView() === 'owned') {
      comics = this.allComics().filter((comic) => comic.owned);
    } else if (this.selectedView() === 'toReRead') {
      comics = this.allComics().filter((comic) => comic.wantToReadAgain === true);
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

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const totalTomes = this.calculateTotalComics();
    const totalPages = this.calculateTotalPages();
    const totalPagesRead = getTotalComicsPages(this.filteredComics());
    const estimatedReadingTime = getEstimatedComicsReadingTime(
      this.filteredComics()
    );

    return [
      {
        label: 'Total des comics',
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
    await this.refreshComics();
  }

  onViewChange(view: ComicView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  private matchesSearch(comic: Comic, term: string): boolean {
    const haystack = [comic.title, comic.writer, comic.designer, comic.genre]
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
    if (this.isAdminView()) {
      const baseComics = await getAllBaseComics();
      const comics = baseComics.map(getFullComic);
      this.adminComicsList.set(comics);
      this.baseComicsList.set(comics);
      return;
    }

    const userId = this.getActiveUserId();
    const [comics, readlist, baseComics] = await Promise.all([
      getAllComics(userId),
      getAllReadlistComics(userId),
      getAllBaseComics(),
    ]);
    this.comicsList.set(comics);
    this.readlistComicsList.set(readlist);
    this.baseComicsList.set(baseComics.map(getFullComic));
  }

  private async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
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
    const success = await markComicAsWantToReReadApi(comic, this.getActiveUserId());
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

    // S'assurer que baseComicsList est chargé
    if (this.baseComicsList().length === 0) {
      await this.refreshComics();
    }

    this.isLoadingRecommendations.set(true);
    try {
      const othersRated = await getOtherUsersComicsRated(userId, 4);

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
