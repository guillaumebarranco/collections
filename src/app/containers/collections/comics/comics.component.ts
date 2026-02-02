import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComicComponent } from '../../../components/comic/comic.component';
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
import { Comic } from '../../../models/comic-model';
import { Quizz } from '../../../models/quizz-model';
import {
  ComicView,
  comicViewOptions,
  comicsSortOptions,
  getSortedComics,
} from './comics.utils';
import {
  getTotalComicsTomesRead,
  getTotalComicsPages,
  getEstimatedComicsReadingTime,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import {
  getAllComics,
  getAllReadlistComics,
} from '../../../facades/comics/comics.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditComicComponent } from '../../edit/edit-comic/edit-comic.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';

@Component({
  selector: 'app-comics',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ComicComponent,
    MenuComponent,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    MatDialogModule,
    QuizzModalComponent,
  ],
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
})
export class ComicsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly localStorageService = inject(LocalStorageService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'comics_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<ComicView>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  sortOptions = signal<SortOption[]>(comicsSortOptions);

  viewOptions: ViewToggleOption[] = comicViewOptions;

  comicsList = signal<{ [key: string]: Comic[] }>({});
  readlistComicsList = signal<{ [key: string]: Comic[] }>({});

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

  allComics = computed<Comic[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.comicsList()[params['id']] || []
      : this.comicsList()['guillaume'];
  });

  allReadlistComics = computed<Comic[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.readlistComicsList()[params['id']] || []
      : this.readlistComicsList()['guillaume'];
  });

  filteredComics = computed<Comic[]>(() => {
    let comics = this.allComics();
    if (this.selectedView() === 'readlist') {
      comics = this.allReadlistComics();
    } else if (this.selectedView() === 'owned') {
      comics = this.allComics().filter((comic) => comic.owned);
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return comics;
    }

    return comics.filter((comic) => this.matchesSearch(comic, term));
  });

  sortedComics = computed<Comic[]>(() =>
    getSortedComics([...this.filteredComics()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
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
    this.loadViewPreferencesFromStorage();
    void this.refreshQuizzs();
    await this.refreshComics();
  }

  onViewChange(view: 'read' | 'readlist' | 'owned') {
    this.selectedView.set(view);
  }

  getSelectComicsRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-comics` : '/select-comics';
  }

  getSelectComicsRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-comics-rating`
      : '/select-comics-rating';
  }

  getSelectComicsTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-comics-times-read`
      : '/select-comics-times-read';
  }

  getSelectComicsOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-comics-owned`
      : '/select-comics-owned';
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
    const userId = this.getActiveUserId();
    const [comics, readlist] = await Promise.all([
      getAllComics(userId),
      getAllReadlistComics(userId),
    ]);
    this.comicsList.set(comics);
    this.readlistComicsList.set(readlist);
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

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }
}
