import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from '../../../components/book/book.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import { Manwha } from '../../../models/manwha-model';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { getAllManwhas } from '../../../facades/manwhas/manwhas.facade';
import {
  getEstimatedMangaReadingTime,
  getTotalManwhasPages,
  getTotalManwhasChaptersRead,
  PAGES_PER_MANGA_TOME,
  getEstimatedManwhaReadingTime,
  PAGES_PER_MANWHA_CHAPTER,
} from '../../../utils/stats.utils';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditManwhaComponent } from '../../edit/edit-manwha/edit-manwha.component';
@Component({
  selector: 'app-manwhas',
  imports: [
    RouterLink,
    CommonModule,
    BookComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
    MatDialogModule,
  ],
  templateUrl: './manwhas.component.html',
  styleUrls: ['./manwhas.component.scss'],
})
export class ManwhasComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  selectedSort = signal<string>('rating');

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
    { value: 'nbChapters', label: 'Nombre de tomes (élevé)' },
    { value: 'nbChapters-asc', label: 'Nombre de tomes (faible)' },
    { value: 'genre', label: 'Genre (A-Z)' },
    { value: 'genre-desc', label: 'Genre (Z-A)' },
  ]);

  manwhasList = signal<{ [key: string]: Manwha[] }>({});

  allManwhas = computed<Manwha[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const manwhas = hasNameParam
      ? this.manwhasList()[params['id']] || []
      : this.manwhasList()['guillaume'];

    return manwhas;
  });

  sortedManwhas = computed<Manwha[]>(() => {
    const sortedManwhas = [...this.allManwhas()];
    switch (this.selectedSort()) {
      case 'title':
        return sortedManwhas.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sortedManwhas.sort((a, b) => b.title.localeCompare(a.title));
      case 'author':
        return sortedManwhas.sort((a, b) => a.author.localeCompare(b.author));
      case 'author-desc':
        return sortedManwhas.sort((a, b) => b.author.localeCompare(a.author));
      case 'readDate':
        return sortedManwhas.sort(
          (a, b) =>
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
        );
      case 'readDate-asc':
        return sortedManwhas.sort(
          (a, b) =>
            new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
        );
      case 'rating':
        return sortedManwhas.sort((a, b) => {
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
        return sortedManwhas.sort((a, b) => {
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
        return sortedManwhas.sort(
          (a, b) => (b.readTimes || 0) - (a.readTimes || 0)
        );
      case 'readTimes-asc':
        return sortedManwhas.sort(
          (a, b) => (a.readTimes || 0) - (b.readTimes || 0)
        );
      case 'nbChapters':
        return sortedManwhas.sort(
          (a, b) => (b.nbChapters || 0) - (a.nbChapters || 0)
        );
      case 'nbChapters-asc':
        return sortedManwhas.sort(
          (a, b) => (a.nbChapters || 0) - (b.nbChapters || 0)
        );
      case 'genre':
        return sortedManwhas.sort((a, b) => a.genre.localeCompare(b.genre));
      case 'genre-desc':
        return sortedManwhas.sort((a, b) => b.genre.localeCompare(a.genre));
      default:
        return sortedManwhas.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  });

  stats = computed<StatItem[]>(() => {
    console.log(this.allManwhas());
    const totalChapters = this.calculateTotalChapters();
    const totalPages = this.calculateTotalManwhasPages();
    const totalChaptersRead = getTotalManwhasChaptersRead(this.allManwhas());
    const totalPagesRead = getTotalManwhasPages(this.allManwhas());
    const estimatedReadingTime = getEstimatedManwhaReadingTime(
      this.allManwhas()
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

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  async ngOnInit() {
    await this.refreshManwhas();
  }

  getSelectManwhasRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-manwhas` : '/select-manwhas';
  }

  getSelectManwhasRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-manwhas-rating`
      : '/select-manwhas-rating';
  }

  getSelectManwhasTimesReadRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-manwhas-times-read`
      : '/select-manwhas-times-read';
  }

  private calculateTotalChapters(): number {
    let total = 0;
    for (const manwha of this.allManwhas()) {
      if (manwha.nbChapters) {
        total += manwha.nbChapters;
      }
    }
    return total;
  }

  private calculateTotalManwhasPages(): number {
    let total = 0;
    for (const manwha of this.allManwhas()) {
      if (manwha.nbChapters) {
        total += manwha.nbChapters * PAGES_PER_MANWHA_CHAPTER;
      }
    }
    return total;
  }

  openEditManwhaDialog(manwha: Manwha): void {
    const dialogRef = this.dialog.open(EditManwhaComponent, {
      data: {
        manwha,
        userId: this.getActiveUserId(),
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
    const userId = this.getActiveUserId();
    const manwhas = await getAllManwhas(userId);
    this.manwhasList.set(manwhas);
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }
}
