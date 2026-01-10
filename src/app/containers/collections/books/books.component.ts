import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
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

import {
  getTotalPages,
  getTotalPagesRead,
  getEstimatedReadingTime,
  formatTimeStats,
  MINUTES_PER_PAGE,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllBooks,
  getAllReadlistBooks,
} from '../../../facades/books.facade';

type BookView = 'read' | 'readlist';

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
export class BooksComponent implements OnInit {
  selectedSort = signal<string>('readDate');
  selectedYearFilter = signal<string>('all');
  selectedGroupBy = signal<string>('none');
  selectedView = signal<BookView>('read');

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private isInitializing = false;

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
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: 'before2024', label: 'Avant 2024' },
  ];

  groupByOptions = [
    { value: 'none', label: 'Aucun' },
    { value: 'author', label: 'Auteur' },
    { value: 'genre', label: 'Genre' },
  ];

  booksList = signal<{ [key: string]: Book[] }>(getAllBooks());
  readlistBooksList = signal<{ [key: string]: Book[] }>(getAllReadlistBooks());

  constructor() {
    // Synchroniser les changements de filtres/tri avec l'URL
    effect(() => {
      if (this.isInitializing) return;

      const queryParams: any = {};

      if (this.selectedView() !== 'read') {
        queryParams.view = this.selectedView();
      }

      if (this.selectedSort() !== 'readDate') {
        queryParams.sort = this.selectedSort();
      }

      if (this.selectedYearFilter() !== 'all') {
        queryParams.year = this.selectedYearFilter();
      }

      if (this.selectedGroupBy() !== 'none') {
        queryParams.groupBy = this.selectedGroupBy();
      }

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : {},
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  ngOnInit() {
    // Lire les paramètres de l'URL au démarrage
    this.loadParamsFromUrl(this.activatedRoute.snapshot.queryParams);

    // Écouter les changements de query params (navigation avant/arrière)
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.isInitializing = true;
      this.loadParamsFromUrl(queryParams);
      this.isInitializing = false;
    });
  }

  private loadParamsFromUrl(queryParams: Params) {
    if (queryParams['view'] === 'readlist' || queryParams['view'] === 'read') {
      this.selectedView.set(queryParams['view'] as BookView);
    }

    if (queryParams['sort']) {
      const validSort = this.sortOptions.find(
        (opt) => opt.value === queryParams['sort']
      );
      if (validSort) {
        this.selectedSort.set(queryParams['sort']);
      }
    }

    if (queryParams['year']) {
      const validYear = this.yearFilterOptions.find(
        (opt) => opt.value === queryParams['year']
      );
      if (validYear) {
        this.selectedYearFilter.set(queryParams['year']);
      }
    }

    if (queryParams['groupBy']) {
      const validGroupBy = this.groupByOptions.find(
        (opt) => opt.value === queryParams['groupBy']
      );
      if (validGroupBy) {
        this.selectedGroupBy.set(queryParams['groupBy']);
      }
    }
  }

  allBooks = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.booksList()[params['id']] || []
      : this.booksList()['guillaume'];
  });

  allReadlistBooks = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.readlistBooksList()[params['id']] || []
      : this.readlistBooksList()['guillaume'];
  });

  filteredBooks = computed<Book[]>(() => {
    return this.selectedView() === 'readlist'
      ? this.allReadlistBooks()
      : this.allBooks();
  });

  currentUser = computed(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? this.capitalizeFirstLetter(params['id']) : '';
  });

  filteredBooksByYear = computed(() => {
    let filteredBooks = [...this.filteredBooks()];

    // Filtrage par année (seulement pour les livres lus)
    if (this.selectedView() === 'read') {
      if (this.selectedYearFilter() === '2026') {
        filteredBooks = filteredBooks.filter((b) =>
          b.readDate.startsWith('2026')
        );
      } else if (this.selectedYearFilter() === '2025') {
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
    }

    return filteredBooks;
  });

  sortedBooks = computed(() => {
    const sortedBooks = [...this.filteredBooksByYear()];

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
        return sortedBooks.sort((a, b) => {
          if (!a.readDate && !b.readDate) return 0;
          if (!a.readDate) return 1;
          if (!b.readDate) return -1;
          return (
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
          );
        });
      case 'readDate-asc':
        return sortedBooks.sort((a, b) => {
          if (!a.readDate && !b.readDate) return 0;
          if (!a.readDate) return 1;
          if (!b.readDate) return -1;
          return (
            new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
          );
        });
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
        return sortedBooks.sort((a, b) => {
          if (!a.readDate && !b.readDate) return 0;
          if (!a.readDate) return 1;
          if (!b.readDate) return -1;
          return (
            new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
          );
        });
    }
  });

  groupedBooks = computed(() => {
    if (this.selectedGroupBy() === 'none') {
      return null;
    }
    const groups: { key: string; books: Book[] }[] = [];
    const map = new Map<string, Book[]>();
    for (const book of this.filteredBooksByYear()) {
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
    // Utiliser les livres filtrés pour les stats
    const booksToUse = this.filteredBooksByYear();
    const totalPages = getTotalPages(booksToUse);
    const totalPagesRead = getTotalPagesRead(booksToUse);

    const estimatedReadingTime =
      this.selectedView() === 'readlist'
        ? formatTimeStats(totalPages * MINUTES_PER_PAGE)
        : getEstimatedReadingTime(booksToUse);

    const stats = [
      {
        label: 'Pages totales de tous les livres',
        value: `${totalPages.toLocaleString()} pages`,
        icon: '📚',
        color: StatItemColor.SUCCESS,
      },
    ];

    if (this.selectedView() !== 'readlist') {
      return [
        ...stats,
        {
          label: 'Pages totales lues (avec relectures)',
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
    }

    return [
      ...stats,
      {
        label: 'Temps estimé de lecture',
        value: estimatedReadingTime.formatted,
        icon: '⏱️',
        color: StatItemColor.PRIMARY,
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

  onViewChange(view: BookView) {
    this.selectedView.set(view);
  }

  getSelectBooksRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-books` : '/select-books';
  }
}
