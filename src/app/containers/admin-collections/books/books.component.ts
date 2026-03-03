import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookComponent } from '../../../components/collections/book/book.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { AdminBooksHeaderComponent } from './books-header/books-header.component';
import { QuizzModalComponent } from '../../../components/modals/quizz-modal/quizz-modal.component';
import { Book } from '../../../models/book-model';
import {
  BookView,
  getBooksByAuthor,
  getBooksByCountry,
  getBooksBySaga,
  getSortedBooks,
} from '../../collections/books/books.utils';
import { getAllBaseBooks } from '../../../facades/books/books.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditBookComponent } from '../../edit/edit-book/edit-book.component';

import { Quizz } from '../../../models/quizz-model';
import { getFullBook } from '../../../helpers/full-entities-helper';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

@Component({
  selector: 'app-admin-books',
  imports: [
    CommonModule,
    FormsModule,
    BookComponent,
    MenuComponent,
    MatDialogModule,
    QuizzModalComponent,
    AdminBooksHeaderComponent,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class AdminBooksComponent implements OnInit {
  selectedView = signal<BookView>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);
  collapsedCountries = signal<Record<string, boolean>>({});

  private readonly dialog = inject(MatDialog);

  adminBooksList = signal<Book[]>([]);

  ngOnInit() {
    this.refreshBooks();
  }

  async refreshBooks() {
    const baseBooks = await getAllBaseBooks();
    const books = baseBooks.map(getFullBook);
    this.adminBooksList.set(books);
  }

  allBooks = computed<Book[]>(() => this.adminBooksList());

  filteredBooks = computed<Book[]>(() => {
    const books = this.allBooks();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return books;
    return books.filter((book) => this.matchesSearch(book, term));
  });

  sortedBooks = computed(() =>
    getSortedBooks([...this.filteredBooks()], 'readDate')
  );

  booksByAuthor = computed(() => {
    if (this.selectedView() !== 'authors') return [];
    return getBooksByAuthor({
      sortedBooks: this.allBooks(),
      allBooks: this.allBooks(),
      baseBooks: this.adminBooksList(),
      selectedSort: 'readDate',
    });
  });

  booksBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getBooksBySaga({
      sortedBooks: this.allBooks(),
      allBooks: this.allBooks(),
      baseBooks: this.adminBooksList(),
      selectedSort: 'readDate',
    });
  });

  booksByCountry = computed(() => {
    if (this.selectedView() !== 'countries') return [];
    return getBooksByCountry({
      sortedBooks: this.sortedBooks(),
      allBooks: this.allBooks(),
      baseBooks: this.adminBooksList(),
      selectedSort: 'readDate',
    });
  });

  onViewChange(view: BookView) {
    this.selectedView.set(view);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  toggleCountry(country: string): void {
    this.collapsedCountries.update((prev) => ({
      ...prev,
      [country]: !prev[country],
    }));
  }

  isCountryCollapsed(country: string): boolean {
    return !!this.collapsedCountries()[country];
  }

  openEditBookDialog(book: Book): void {
    const books = this.sortedBooks();
    const index = books.findIndex(
      (item) => item.title === book.title && item.author === book.author
    );
    const dialogRef = this.dialog.open(EditBookComponent, {
      data: {
        book,
        userId: 'admin',
        list: books,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        void this.refreshBooks();
      }
    });
  }

  private matchesSearch(book: Book, term: string): boolean {
    const haystack = [book.title, book.author, book.genre, book.saga]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

}
