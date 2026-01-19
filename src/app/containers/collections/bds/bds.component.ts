import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookComponent } from '../../../components/book/book.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { Book } from '../../../models/book-model';
import { Bd } from '../../../models/bd-model';
import {
  getTotalMangaPages,
  getTotalMangaTomesRead,
  getEstimatedMangaReadingTime,
  PAGES_PER_MANGA_TOME,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import {
  getAllBds,
  getAllReadlistBds,
} from '../../../facades/bds/bds.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditBdComponent } from '../../edit/edit-bd/edit-bd.component';

@Component({
  selector: 'app-bds',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    BookComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    MatDialogModule,
  ],
  templateUrl: './bds.component.html',
  styleUrls: ['./bds.component.scss'],
})
export class BdsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  selectedSort = signal<string>('rating');
  selectedView = signal<'read' | 'readlist'>('read');
  searchTerm = signal<string>('');

  sortOptions = signal<SortOption[]>([
    { value: 'title', label: 'Titre (A-Z)' },
    { value: 'title-desc', label: 'Titre (Z-A)' },
    { value: 'author', label: 'Auteur (A-Z)' },
    { value: 'author-desc', label: 'Auteur (Z-A)' },
    { value: 'readDate', label: 'Date de lecture (récent)' },
    { value: 'readDate-asc', label: 'Date de lecture (ancien)' },
    { value: 'rating', label: 'Note (élevée)' },
    { value: 'rating-asc', label: 'Note (faible)' },
    { value: 'readTimes', label: 'Relectures (élevé)' },
    { value: 'readTimes-asc', label: 'Relectures (faible)' },
    { value: 'nbTomes', label: 'Nombre de tomes (élevé)' },
    { value: 'nbTomes-asc', label: 'Nombre de tomes (faible)' },
    { value: 'genre', label: 'Genre (A-Z)' },
    { value: 'genre-desc', label: 'Genre (Z-A)' },
  ]);

  bdsList = signal<{ [key: string]: Bd[] }>({});
  readlistBdsList = signal<{ [key: string]: Bd[] }>({});

  allBds = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const bds = hasNameParam
      ? this.bdsList()[params['id']] || []
      : this.bdsList()['guillaume'];

    return bds.map((bd) => ({
      title: bd.title,
      author: bd.author,
      rating: bd.rating,
      readDate: bd.readDate,
      readTimes: bd.readTimes,
      coverUrl: bd.coverUrl,
      pages: bd.pages || 0,
      genre: bd.genre,
      saga: '',
      sagaOrder: 0,
      nbTomes: bd.nbTomes || 0,
      isFinished: bd.isFinished || false,
    }));
  });

  allReadlistBds = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const bds = hasNameParam
      ? this.readlistBdsList()[params['id']] || []
      : this.readlistBdsList()['guillaume'];

    return bds.map((bd) => ({
      title: bd.title,
      author: bd.author,
      rating: bd.rating,
      readDate: bd.readDate,
      readTimes: bd.readTimes,
      coverUrl: bd.coverUrl,
      pages: bd.pages || 0,
      genre: bd.genre,
      saga: '',
      sagaOrder: 0,
      nbTomes: bd.nbTomes || 0,
      isFinished: bd.isFinished || false,
    }));
  });

  filteredBds = computed<Book[]>(() => {
    const bds =
      this.selectedView() === 'readlist'
        ? this.allReadlistBds()
        : this.allBds();

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return bds;
    }

    return bds.filter((bd) => this.matchesSearch(bd, term));
  });

  sortedBds = computed<Book[]>(() => {
    const sortedBds = [...this.filteredBds()];
    switch (this.selectedSort()) {
      case 'title':
        return sortedBds.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sortedBds.sort((a, b) => b.title.localeCompare(a.title));
      case 'author':
        return sortedBds.sort((a, b) => a.author.localeCompare(b.author));
      case 'author-desc':
        return sortedBds.sort((a, b) => b.author.localeCompare(a.author));
      case 'readDate':
        return sortedBds.sort(
          (a, b) =>
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
        );
      case 'readDate-asc':
        return sortedBds.sort(
          (a, b) =>
            new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
        );
      case 'rating':
        return sortedBds.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          const readTimesA = a.readTimes || 0;
          const readTimesB = b.readTimes || 0;
          return readTimesB - readTimesA;
        });
      case 'rating-asc':
        return sortedBds.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          if (ratingA !== ratingB) {
            return ratingA - ratingB;
          }
          const readTimesA = a.readTimes || 0;
          const readTimesB = b.readTimes || 0;
          return readTimesB - readTimesA;
        });
      case 'readTimes':
        return sortedBds.sort(
          (a, b) => (b.readTimes || 0) - (a.readTimes || 0)
        );
      case 'readTimes-asc':
        return sortedBds.sort(
          (a, b) => (a.readTimes || 0) - (b.readTimes || 0)
        );
      case 'nbTomes':
        return sortedBds.sort((a, b) => (b.nbTomes || 0) - (a.nbTomes || 0));
      case 'nbTomes-asc':
        return sortedBds.sort((a, b) => (a.nbTomes || 0) - (b.nbTomes || 0));
      case 'genre':
        return sortedBds.sort((a, b) => a.genre.localeCompare(b.genre));
      case 'genre-desc':
        return sortedBds.sort((a, b) => b.genre.localeCompare(a.genre));
      default:
        return sortedBds.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  });

  stats = computed<StatItem[]>(() => {
    const totalTomes = this.calculateTotalTomes();
    const totalPages = this.calculateTotalPages();
    const totalTomesRead = getTotalMangaTomesRead(this.filteredBds());
    const totalPagesRead = getTotalMangaPages(this.filteredBds());
    const estimatedReadingTime = getEstimatedMangaReadingTime(
      this.filteredBds()
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

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  async ngOnInit() {
    await this.refreshBds();
  }

  onViewChange(view: 'read' | 'readlist') {
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

  private matchesSearch(bd: Book, term: string): boolean {
    const haystack = [bd.title, bd.author, bd.genre]
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

  openEditBdDialog(bd: Bd): void {
    const dialogRef = this.dialog.open(EditBdComponent, {
      data: {
        bd,
        userId: this.getActiveUserId(),
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
