import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { BaseBook, Book } from '../../../../models/book-model';
import {
  getAllBooksMerged,
  getBooksByUser,
  getCurrentReadlistBooksByUser,
  getAllBaseBooks,
} from '../../../../facades/books/books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddBookComponent } from '../../../add/add-book/add-book.component';

import { isLocalhost } from '../../../../core/config';
import { Router } from '@angular/router';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-books',
  imports: [CommonModule, MenuComponent, MatDialogModule],
  templateUrl: './select-books.component.html',
  styleUrls: ['./select-books.component.scss', '../../select-base.scss'],
})
export class SelectBooksComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);
  private router = inject(Router);

  baseBooks = signal<BaseBook[]>([]);
  userBooks = signal<Book[]>([]);
  readlistBooks = signal<Book[]>([]);
  allBooksMergedList = signal<Book[]>([]);

  // Livres déjà lus par l'utilisateur (pour les exclure en mode readlist)
  readBooks = computed<Set<string>>(() => {
    const userBooks = this.userBooks();
    return new Set(userBooks.map((book) => this.getBookKey(book)));
  });

  alreadyInReadlistBooks = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode()) {
      return new Set();
    }
    const readlistBooks = this.readlistBooks();
    return new Set(readlistBooks.map((book) => this.getBookKey(book)));
  });

  // Tous les livres de tous les utilisateurs, filtrés si mode readlist ou ajout
  allBooks = computed<Book[]>(() => {
    const allBooksList = this.baseBooks().map((book) => ({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      genre: book.genre,
      saga: book.saga,
      sagaOrder: book.sagaOrder,
      readDate: '',
      rating: 0,
    }));

    if (!this.isWatchOrReadlistMode()) {
      return allBooksList.filter(
        (book) =>
          !this.readBooks().has(this.getBookKey(book)) &&
          !this.alreadyInReadlistBooks().has(this.getBookKey(book))
      );
    }

    return allBooksList.filter(
      (book) => !this.readBooks().has(this.getBookKey(book))
    );
  });

  selectedBooks = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedBooks().size);

  async ngOnInit() {
    const userId = this.userId();
    const [baseBooks, books, readlist] = await Promise.all([
      getAllBaseBooks(),
      getBooksByUser(userId),
      getCurrentReadlistBooksByUser(userId),
    ]);

    this.baseBooks.set(baseBooks);
    const allBooks = await this.getAllBooksForSelection(userId);
    this.userBooks.set(books);
    this.readlistBooks.set(readlist);
    this.allBooksMergedList.set(allBooks);
  }

  isSelected(book: Book): boolean {
    return this.selectedBooks().has(this.getBookKey(book));
  }

  private getBookKey(book: Book): string {
    return `${book.title}-${book.author}`;
  }

  toggleSelection(book: Book): void {
    const key = this.getBookKey(book);
    const selected = new Set(this.selectedBooks());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedBooks.set(selected);
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(AddBookComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/books`]);
      }
    });
  }

  private async getAllBooksForSelection(userId: string): Promise<Book[]> {
    if (isLocalhost()) {
      return getAllBooksMerged(userId);
    }
    try {
      const response = await fetch(`${getApiBaseUrl()}/books/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  protected async addSelectedBooks(): Promise<void> {
    const selectedBooksList = this.allBooks()
      .filter((book) => this.isSelected(book))
      .map((book) => {
        return {
          ...book,
          readTimes: 1,
          rating: 0,
          readDate: '',
        };
      });

    const books = selectedBooksList.map((book) => ({
      title: book.title,
      author: book.author,
    }));

    if (books.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/books/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          books,
          readlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des livres :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/books`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des livres.", error);
    }
  }
}
