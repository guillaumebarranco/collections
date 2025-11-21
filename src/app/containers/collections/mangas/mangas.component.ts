import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from '../../../components/book/book.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
} from '../../../components/stats-display/stats-display.component';
import { Book } from '../../../models/book-model';
import { mangas } from '../../../utils/guillaume/mangas/mangas';
import {
  getTotalMangaPages,
  getTotalMangaTomesRead,
  getEstimatedMangaReadingTime,
  PAGES_PER_MANGA_TOME,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

interface SagaGroup {
  saga: string;
  books: Book[];
}

@Component({
  selector: 'app-mangas',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    BookComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './mangas.component.html',
  styleUrls: ['./mangas.component.scss'],
})
export class MangasComponent {
  activatedRoute = inject(ActivatedRoute);

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
    { value: 'nbTomes', label: 'Nombre de tomes (élevé)' },
    { value: 'nbTomes-asc', label: 'Nombre de tomes (faible)' },
    { value: 'genre', label: 'Genre (A-Z)' },
    { value: 'genre-desc', label: 'Genre (Z-A)' },
  ]);

  mangasList = signal<{ [key: string]: any[] }>({
    guillaume: [...mangas],
    kevin: [],
    william: [],
  });

  allMangas = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    const mangas = hasNameParam
      ? this.mangasList()[params['id']]
      : this.mangasList()['guillaume'];

    return mangas.map((manga: any) => {
      return {
        title: manga._source.manga.frenchName || manga._source.manga.name,
        author: manga._source.manga.authors[0].name,
        coverUrl: manga._source.manga.france.logo || '',
        readDate: manga._source.manga.lastUpdate || '',
        rating: manga._score || 0,
        genre: manga._source.manga.type || '',
        saga: manga._source.manga.name,
        sagaOrder: 0,
        nbTomes: manga._source.manga.france.nbBooks || 0,
        isFinished: manga._source.manga.isFinished || false,
        readTimes: manga._readTimes || 1,
      };
    });
  });

  sortedMangas = computed<Book[]>(() => {
    switch (this.selectedSort()) {
      case 'title':
        return this.allMangas().sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return this.allMangas().sort((a, b) => b.title.localeCompare(a.title));
      case 'author':
        return this.allMangas().sort((a, b) =>
          a.author.localeCompare(b.author)
        );
      case 'author-desc':
        return this.allMangas().sort((a, b) =>
          b.author.localeCompare(a.author)
        );
      case 'readDate':
        return this.allMangas().sort(
          (a, b) =>
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
        );
      case 'readDate-asc':
        return this.allMangas().sort(
          (a, b) =>
            new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
        );
      case 'rating':
        return this.allMangas().sort((a, b) => {
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
        return this.allMangas().sort((a, b) => {
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
        return this.allMangas().sort(
          (a, b) => (b.readTimes || 0) - (a.readTimes || 0)
        );
      case 'readTimes-asc':
        return this.allMangas().sort(
          (a, b) => (a.readTimes || 0) - (b.readTimes || 0)
        );
      case 'nbTomes':
        return this.allMangas().sort(
          (a, b) => (b.nbTomes || 0) - (a.nbTomes || 0)
        );
      case 'nbTomes-asc':
        return this.allMangas().sort(
          (a, b) => (a.nbTomes || 0) - (b.nbTomes || 0)
        );
      case 'genre':
        return this.allMangas().sort((a, b) => a.genre.localeCompare(b.genre));
      case 'genre-desc':
        return this.allMangas().sort((a, b) => b.genre.localeCompare(a.genre));
      default:
        return this.allMangas().sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
    }
  });

  stats = computed<StatItem[]>(() => {
    const totalTomes = this.calculateTotalTomes();
    const totalPages = this.calculateTotalPages();
    const totalTomesRead = getTotalMangaTomesRead(this.allMangas());
    const totalPagesRead = getTotalMangaPages(this.allMangas());
    const estimatedReadingTime = getEstimatedMangaReadingTime(this.allMangas());

    return [
      {
        label: 'Total des tomes',
        value: `${totalTomes.toLocaleString()} tomes`,
        icon: '📚',
        color: 'success',
      },
      {
        label: 'Total des pages',
        value: `${totalPages.toLocaleString()} pages`,
        icon: '📖',
        color: 'info',
      },
      {
        label: 'Total des tomes lus (avec relectures)',
        value: `${totalTomesRead.toLocaleString()} tomes`,
        icon: '📚',
        color: 'success',
      },
      {
        label: 'Total des pages lues (avec relectures)',
        value: `${totalPagesRead.toLocaleString()} pages`,
        icon: '📖',
        color: 'info',
      },
      {
        label: 'Temps estimé de lecture',
        value: estimatedReadingTime.formatted,
        icon: '⏱️',
        color: 'primary',
      },
    ];
  });

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  getSelectMangasRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-mangas` : '/select-mangas';
  }

  private calculateTotalTomes(): number {
    let total = 0;
    for (const manga of this.allMangas()) {
      if (manga.nbTomes) {
        total += manga.nbTomes;
      }
    }
    return total;
  }

  private calculateTotalPages(): number {
    let total = 0;
    for (const manga of this.allMangas()) {
      if (manga.nbTomes) {
        total += manga.nbTomes * PAGES_PER_MANGA_TOME;
      }
    }
    return total;
  }
}
