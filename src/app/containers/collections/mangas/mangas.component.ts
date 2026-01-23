import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookComponent } from '../../../components/book/book.component';
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
import { Book } from '../../../models/book-model';
import { Manga } from '../../../models/manga-model';
import {
  getTotalMangaPages,
  getTotalMangaTomesRead,
  getEstimatedMangaReadingTime,
  PAGES_PER_MANGA_TOME,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import {
  getAllMangas,
  getAllReadlistMangas,
} from '../../../facades/mangas/mangas.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditMangaComponent } from '../../edit/edit-manga/edit-manga.component';

@Component({
  selector: 'app-mangas',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    BookComponent,
    MenuComponent,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    MatDialogModule,
  ],
  templateUrl: './mangas.component.html',
  styleUrls: ['./mangas.component.scss'],
})
export class MangasComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  selectedSort = signal<string>('rating');
  selectedView = signal<'read' | 'readlist' | 'owned'>('read');
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

  viewOptions: ViewToggleOption[] = [
    { value: 'read', label: 'Mangas lus' },
    { value: 'readlist', label: 'Mangas à lire' },
    { value: 'owned', label: 'Mangas possédés' },
  ];

  mangasList = signal<{ [key: string]: Manga[] }>({});
  readlistMangasList = signal<{ [key: string]: Manga[] }>({});

  allMangas = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const mangas = hasNameParam
      ? this.mangasList()[params['id']] || []
      : this.mangasList()['guillaume'];

    return mangas.map((manga) => ({
      title: manga.title,
      author: manga.author,
      rating: manga.rating,
      readDate: manga.readDate,
      readTimes: manga.readTimes,
      coverUrl: manga.coverUrl,
      pages: manga.pages || 0,
      genre: manga.genre,
      saga: '',
      sagaOrder: 0,
      nbTomes: manga.nbTomes || 0,
      isFinished: manga.isFinished || false,
      owned: manga.owned ?? false,
    }));
  });

  allReadlistMangas = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const mangas = hasNameParam
      ? this.readlistMangasList()[params['id']] || []
      : this.readlistMangasList()['guillaume'];

    return mangas.map((manga) => ({
      title: manga.title,
      author: manga.author,
      rating: manga.rating,
      readDate: manga.readDate,
      readTimes: manga.readTimes,
      coverUrl: manga.coverUrl,
      pages: manga.pages || 0,
      genre: manga.genre,
      saga: '',
      sagaOrder: 0,
      nbTomes: manga.nbTomes || 0,
      isFinished: manga.isFinished || false,
      owned: manga.owned ?? false,
    }));
  });

  filteredMangas = computed<Book[]>(() => {
    let mangas = this.allMangas();
    if (this.selectedView() === 'readlist') {
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

  sortedMangas = computed<Book[]>(() => {
    const sortedMangas = [...this.filteredMangas()];
    switch (this.selectedSort()) {
      case 'title':
        return sortedMangas.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sortedMangas.sort((a, b) => b.title.localeCompare(a.title));
      case 'author':
        return sortedMangas.sort((a, b) => a.author.localeCompare(b.author));
      case 'author-desc':
        return sortedMangas.sort((a, b) => b.author.localeCompare(a.author));
      case 'readDate':
        return sortedMangas.sort(
          (a, b) =>
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
        );
      case 'readDate-asc':
        return sortedMangas.sort(
          (a, b) =>
            new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
        );
      case 'rating':
        return sortedMangas.sort((a, b) => {
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
        return sortedMangas.sort((a, b) => {
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
        return sortedMangas.sort(
          (a, b) => (b.readTimes || 0) - (a.readTimes || 0)
        );
      case 'readTimes-asc':
        return sortedMangas.sort(
          (a, b) => (a.readTimes || 0) - (b.readTimes || 0)
        );
      case 'nbTomes':
        return sortedMangas.sort((a, b) => (b.nbTomes || 0) - (a.nbTomes || 0));
      case 'nbTomes-asc':
        return sortedMangas.sort((a, b) => (a.nbTomes || 0) - (b.nbTomes || 0));
      case 'genre':
        return sortedMangas.sort((a, b) => a.genre.localeCompare(b.genre));
      case 'genre-desc':
        return sortedMangas.sort((a, b) => b.genre.localeCompare(a.genre));
      default:
        return sortedMangas.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  });

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

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  async ngOnInit() {
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

  private matchesSearch(manga: Book, term: string): boolean {
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
    const userId = this.getActiveUserId();
    const [mangas, readlist] = await Promise.all([
      getAllMangas(userId),
      getAllReadlistMangas(userId),
    ]);
    this.mangasList.set(mangas);
    this.readlistMangasList.set(readlist);
  }

  openEditMangaDialog(manga: Manga): void {
    const dialogRef = this.dialog.open(EditMangaComponent, {
      data: {
        manga,
        userId: this.getActiveUserId(),
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
}
