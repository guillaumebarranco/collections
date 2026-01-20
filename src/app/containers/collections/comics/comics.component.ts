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
import { Comic } from '../../../models/comic-model';
import {
  getTotalMangaPages,
  getTotalMangaTomesRead,
  getEstimatedMangaReadingTime,
  PAGES_PER_MANGA_TOME,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import {
  getAllComics,
  getAllReadlistComics,
} from '../../../facades/comics/comics.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditComicComponent } from '../../edit/edit-comic/edit-comic.component';

@Component({
  selector: 'app-comics',
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
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
})
export class ComicsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  selectedSort = signal<string>('rating');
  selectedView = signal<'read' | 'readlist'>('read');
  searchTerm = signal<string>('');

  sortOptions = signal<SortOption[]>([
    { value: 'title', label: 'Titre (A-Z)' },
    { value: 'title-desc', label: 'Titre (Z-A)' },
    { value: 'designer', label: 'Designer (A-Z)' },
    { value: 'designer-desc', label: 'Designer (Z-A)' },
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

  comicsList = signal<{ [key: string]: Comic[] }>({});
  readlistComicsList = signal<{ [key: string]: Comic[] }>({});

  allComics = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const comics = hasNameParam
      ? this.comicsList()[params['id']] || []
      : this.comicsList()['guillaume'];

    return comics.map((comic) => ({
      title: comic.title,
      author: comic.designer,
      rating: comic.rating,
      readDate: comic.readDate,
      readTimes: comic.readTimes,
      coverUrl: comic.coverUrl,
      pages: comic.pages || 0,
      genre: comic.genre,
      saga: '',
      sagaOrder: 0,
      nbTomes: comic.nbTomes || 0,
      isFinished: comic.isFinished || false,
    }));
  });

  allReadlistComics = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const comics = hasNameParam
      ? this.readlistComicsList()[params['id']] || []
      : this.readlistComicsList()['guillaume'];

    return comics.map((comic) => ({
      title: comic.title,
      author: comic.designer,
      rating: comic.rating,
      readDate: comic.readDate,
      readTimes: comic.readTimes,
      coverUrl: comic.coverUrl,
      pages: comic.pages || 0,
      genre: comic.genre,
      saga: '',
      sagaOrder: 0,
      nbTomes: comic.nbTomes || 0,
      isFinished: comic.isFinished || false,
    }));
  });

  filteredComics = computed<Book[]>(() => {
    const comics =
      this.selectedView() === 'readlist'
        ? this.allReadlistComics()
        : this.allComics();

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return comics;
    }

    return comics.filter((comic) => this.matchesSearch(comic, term));
  });

  sortedComics = computed<Book[]>(() => {
    const sortedComics = [...this.filteredComics()];
    switch (this.selectedSort()) {
      case 'title':
        return sortedComics.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sortedComics.sort((a, b) => b.title.localeCompare(a.title));
      case 'designer':
        return sortedComics.sort((a, b) => a.author.localeCompare(b.author));
      case 'designer-desc':
        return sortedComics.sort((a, b) => b.author.localeCompare(a.author));
      case 'readDate':
        return sortedComics.sort(
          (a, b) =>
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
        );
      case 'readDate-asc':
        return sortedComics.sort(
          (a, b) =>
            new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
        );
      case 'rating':
        return sortedComics.sort((a, b) => {
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
        return sortedComics.sort((a, b) => {
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
        return sortedComics.sort(
          (a, b) => (b.readTimes || 0) - (a.readTimes || 0)
        );
      case 'readTimes-asc':
        return sortedComics.sort(
          (a, b) => (a.readTimes || 0) - (b.readTimes || 0)
        );
      case 'nbTomes':
        return sortedComics.sort((a, b) => (b.nbTomes || 0) - (a.nbTomes || 0));
      case 'nbTomes-asc':
        return sortedComics.sort((a, b) => (a.nbTomes || 0) - (b.nbTomes || 0));
      case 'genre':
        return sortedComics.sort((a, b) => a.genre.localeCompare(b.genre));
      case 'genre-desc':
        return sortedComics.sort((a, b) => b.genre.localeCompare(a.genre));
      default:
        return sortedComics.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  });

  stats = computed<StatItem[]>(() => {
    const totalTomes = this.calculateTotalTomes();
    const totalPages = this.calculateTotalPages();
    const totalTomesRead = getTotalMangaTomesRead(this.filteredComics());
    const totalPagesRead = getTotalMangaPages(this.filteredComics());
    const estimatedReadingTime = getEstimatedMangaReadingTime(
      this.filteredComics()
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
    await this.refreshComics();
  }

  onViewChange(view: 'read' | 'readlist') {
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

  private matchesSearch(comic: Book, term: string): boolean {
    const haystack = [comic.title, comic.author, comic.genre]
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
    for (const comic of this.filteredComics()) {
      if (comic.nbTomes) {
        total += comic.nbTomes;
      }
    }
    return total;
  }

  private calculateTotalPages(): number {
    let total = 0;
    for (const comic of this.filteredComics()) {
      if (comic.nbTomes) {
        total += comic.nbTomes * PAGES_PER_MANGA_TOME;
      }
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

  openEditComicDialog(comic: Comic): void {
    const dialogRef = this.dialog.open(EditComicComponent, {
      data: {
        comic,
        userId: this.getActiveUserId(),
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
