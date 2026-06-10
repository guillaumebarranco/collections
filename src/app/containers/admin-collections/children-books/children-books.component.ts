import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChildrenBookComponent } from '../../../components/collections/children-book/children-book.component';
import { AdminChildrenBooksHeaderComponent } from './children-books-header/children-books-header.component';

import { ChildrenBook } from '../../../models/children-book-model';
import {
  ChildrenBookView,
  getChildrenBooksByAuthor,
  getChildrenBooksByCountry,
  getChildrenBooksBySaga,
  getSortedChildrenBooks,
} from '../../collections/children-books/children-books.utils';
import { getAllBaseChildrenBooks } from '../../../facades/children-books/children-books.facade';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditChildrenBookComponent } from '../../edit/edit-children-book/edit-children-book.component';

import { getFullChildrenBook } from '../../../helpers/full-entities-helper';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

@Component({
  selector: 'app-admin-children-books',
  imports: [
    CommonModule,
    FormsModule,
    ChildrenBookComponent,
    MatDialogModule,
    AdminChildrenBooksHeaderComponent,
  ],
  templateUrl: './children-books.component.html',
  styleUrls: ['./children-books.component.scss'],
})
export class AdminChildrenBooksComponent implements OnInit {
  selectedView = signal<ChildrenBookView>('read');
  searchTerm = signal<string>('');

  collapsedCountries = signal<Record<string, boolean>>({});

  private readonly dialog = inject(MatDialog);

  adminChildrenBooksList = signal<ChildrenBook[]>([]);

  ngOnInit() {
    this.refreshChildrenBooks();
  }

  async refreshChildrenBooks() {
    const baseChildrenBooks = await getAllBaseChildrenBooks();
    const childrenBooks = baseChildrenBooks.map(getFullChildrenBook);
    this.adminChildrenBooksList.set(childrenBooks);
  }

  allChildrenBooks = computed<ChildrenBook[]>(() => this.adminChildrenBooksList());

  filteredChildrenBooks = computed<ChildrenBook[]>(() => {
    const childrenBooks = this.allChildrenBooks();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return childrenBooks;
    return childrenBooks.filter((childrenBook) => this.matchesSearch(childrenBook, term));
  });

  sortedChildrenBooks = computed(() =>
    getSortedChildrenBooks([...this.filteredChildrenBooks()], 'readDate')
  );

  childrenBooksByAuthor = computed(() => {
    if (this.selectedView() !== 'authors') return [];
    return getChildrenBooksByAuthor({
      sortedChildrenBooks: this.allChildrenBooks(),
      allChildrenBooks: this.allChildrenBooks(),
      baseChildrenBooks: this.adminChildrenBooksList(),
      selectedSort: 'readDate',
    });
  });

  childrenBooksBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getChildrenBooksBySaga({
      sortedChildrenBooks: this.allChildrenBooks(),
      allChildrenBooks: this.allChildrenBooks(),
      baseChildrenBooks: this.adminChildrenBooksList(),
      selectedSort: 'readDate',
    });
  });

  childrenBooksByCountry = computed(() => {
    if (this.selectedView() !== 'countries') return [];
    return getChildrenBooksByCountry({
      sortedChildrenBooks: this.sortedChildrenBooks(),
      allChildrenBooks: this.allChildrenBooks(),
      baseChildrenBooks: this.adminChildrenBooksList(),
      selectedSort: 'readDate',
    });
  });

  onViewChange(view: ChildrenBookView) {
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

  openEditChildrenBookDialog(childrenBook: ChildrenBook): void {
    const childrenBooks = this.sortedChildrenBooks();
    const index = childrenBooks.findIndex(
      (item) => item.title === childrenBook.title && item.author === childrenBook.author
    );
    const dialogRef = this.dialog.open(EditChildrenBookComponent, {
      data: {
        childrenBook,
        userId: 'admin',
        list: childrenBooks,
        index,
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        void this.refreshChildrenBooks();
      }
    });
  }

  private matchesSearch(childrenBook: ChildrenBook, term: string): boolean {
    const haystack = [childrenBook.title, childrenBook.author, ...childrenBook.genre, childrenBook.saga]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }
}
