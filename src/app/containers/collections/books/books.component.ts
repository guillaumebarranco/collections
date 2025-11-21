import { Component, OnInit, signal, computed, inject } from '@angular/core';
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
} from '../../../components/stats-display/stats-display.component';
import { Book } from '../../../models/book-model';
import {
  books,
  booksFantasySaga,
  booksSaga,
} from '../../../utils/guillaume/books';
import {
  getTotalPages,
  getTotalPagesRead,
  getEstimatedReadingTime,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { kevinBooks1, kevinBooks2 } from '../../../utils/kevin/books';

@Component({
  selector: 'app-books',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    BookComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent {
  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
  selectedGroupBy = signal<string>('none');

  activatedRoute = inject(ActivatedRoute);

  sortOptions: SortOption[] = [
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
    { value: 'pages', label: 'Pages (élevé)' },
    { value: 'pages-asc', label: 'Pages (faible)' },
    { value: 'genre', label: 'Genre (A-Z)' },
    { value: 'genre-desc', label: 'Genre (Z-A)' },
  ];

  yearFilterOptions = [
    { value: 'all', label: 'Toutes' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: 'before2024', label: 'Avant 2024' },
  ];

  groupByOptions = [
    { value: 'none', label: 'Aucun' },
    { value: 'author', label: 'Auteur' },
    { value: 'genre', label: 'Genre' },
  ];

  booksList = signal<{ [key: string]: Book[] }>({
    guillaume: [...books, ...booksFantasySaga, ...booksSaga],
    kevin: [...kevinBooks1, ...kevinBooks2],
    william: [],
  });

  allBooks = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.booksList()[params['id']]
      : this.booksList()['guillaume'];
  });

  currentUser = computed(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? this.capitalizeFirstLetter(params['id']) : '';
  });

  filteredBooks = computed(() => {
    let filteredBooks = [...this.allBooks()];

    // Filtrage par année
    if (this.selectedYearFilter() === '2025') {
      filteredBooks = filteredBooks.filter((b) =>
        b.readDate.startsWith('2025')
      );
    } else if (this.selectedYearFilter() === '2024') {
      filteredBooks = filteredBooks.filter((b) =>
        b.readDate.startsWith('2024')
      );
    } else if (this.selectedYearFilter() === 'before2024') {
      filteredBooks = filteredBooks.filter((b) => {
        const year = parseInt(b.readDate.substring(0, 4));
        return year < 2024;
      });
    }

    return filteredBooks;
  });

  sortedBooks = computed(() => {
    const sortedBooks = [...this.filteredBooks()];

    switch (this.selectedSort()) {
      case 'title':
        return sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
      case 'author':
        return sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
      case 'author-desc':
        return sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
      case 'readDate':
        return sortedBooks.sort(
          (a, b) =>
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
        );
      case 'readDate-asc':
        return sortedBooks.sort(
          (a, b) =>
            new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
        );
      case 'rating':
        return sortedBooks.sort((a, b) => {
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
        return sortedBooks.sort((a, b) => {
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
        return sortedBooks.sort(
          (a, b) => (b.readTimes || 0) - (a.readTimes || 0)
        );
      case 'readTimes-asc':
        return sortedBooks.sort(
          (a, b) => (a.readTimes || 0) - (b.readTimes || 0)
        );
      case 'pages':
        return sortedBooks.sort((a, b) => (b.pages || 0) - (a.pages || 0));
      case 'pages-asc':
        return sortedBooks.sort((a, b) => (a.pages || 0) - (b.pages || 0));
      case 'genre':
        return sortedBooks.sort((a, b) => a.genre.localeCompare(b.genre));
      case 'genre-desc':
        return sortedBooks.sort((a, b) => b.genre.localeCompare(a.genre));
      default:
        return sortedBooks.sort(
          (a, b) =>
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
        );
    }
  });

  groupedBooks = computed(() => {
    if (this.selectedGroupBy() === 'none') {
      return null;
    }
    const groups: { key: string; books: Book[] }[] = [];
    const map = new Map<string, Book[]>();
    for (const book of this.filteredBooks()) {
      let key = '';
      if (this.selectedGroupBy() === 'author') key = book.author;
      else if (this.selectedGroupBy() === 'genre') key = book.genre;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(book);
    }
    for (const [key, books] of map.entries()) {
      groups.push({ key, books });
    }
    // Tri des groupes par nombre de livres
    groups.sort((a, b) => b.books.length - a.books.length);
    return groups;
  });

  stats = computed<StatItem[]>(() => {
    const totalPages = getTotalPages(this.allBooks());
    const totalPagesRead = getTotalPagesRead(this.allBooks());
    const estimatedReadingTime = getEstimatedReadingTime(this.allBooks());

    return [
      {
        label: 'Pages totales de tous les livres',
        value: `${totalPages.toLocaleString()} pages`,
        icon: '📚',
        color: 'success',
      },
      {
        label: 'Pages totales lues (avec relectures)',
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

  capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onYearFilterChange(year: string) {
    this.selectedYearFilter.set(year);
  }

  onGroupByChange(groupBy: string) {
    this.selectedGroupBy.set(groupBy);
  }

  getSelectBooksRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-books` : '/select-books';
  }
}
