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
import { SelectEntityComponent } from '../../../../components/entity/select-entity/select-entity.component';

import { getApiBaseUrl } from '../../../../core/config';
import { getEmptyBook } from '../../../../helpers/empty-entities-helper';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';

@Component({
  selector: 'app-select-books',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-books.component.html',
  styleUrls: ['./select-books.component.scss', '../../select-base.scss'],
})
export class SelectBooksComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  baseBooks = signal<BaseBook[]>([]);
  userBooks = signal<Book[]>([]);
  readlistBooks = signal<Book[]>([]);
  allBooksMergedList = signal<Book[]>([]);
  searchTerm = signal('');

  // Livres déjà lus par l'utilisateur (pour les exclure en mode readlist)
  readBooks = computed<Set<string>>(() => {
    const userBooks = this.userBooks();
    return new Set(userBooks.map((book) => this.getBookKey(book)));
  });

  /** Au moins un livre lu issu du catalogue (entités existantes) — pour afficher l’ajout manuel. */
  hasReadBooksFromExistingCatalog = computed(() => {
    const baseKeys = new Set(
      this.baseBooks().map((b) => `${b.title}-${b.author}`)
    );
    return this.userBooks().some((book) => baseKeys.has(this.getBookKey(book)));
  });

  // Livres déjà en readlist (toujours exclus de la liste pour éviter les doublons)
  alreadyInReadlistBooks = computed<Set<string>>(() => {
    const readlistBooks = this.readlistBooks();
    return new Set(readlistBooks.map((book) => this.getBookKey(book)));
  });

  // Tous les livres proposés : ni déjà lus, ni déjà en readlist.
  // Tri par selectDisplayOrder décroissant ; à égalité, ordre inchangé (sort stable).
  allBooks = computed<Book[]>(() => {
    const allBooksList = this.baseBooks().map(getEmptyBook);
    const filtered = allBooksList.filter(
      (book) =>
        !this.readBooks().has(this.getBookKey(book)) &&
        !this.alreadyInReadlistBooks().has(this.getBookKey(book))
    );
    return [...filtered].sort(
      (a, b) =>
        (b.selectDisplayOrder ?? 0) - (a.selectDisplayOrder ?? 0)
    );
  });

  filteredBooks = computed<Book[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allBooks();
    if (!normalizedTerm) return list;
    return list.filter((book) => {
      const title = normalizeSearchText(book.title ?? '');
      const author = normalizeSearchText(book.author ?? '');
      const saga = normalizeSearchText(book.saga ?? '');
      return (
        title.includes(normalizedTerm) ||
        author.includes(normalizedTerm) ||
        saga.includes(normalizedTerm)
      );
    });
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

  private async getAllBooksForSelection(_userId: string): Promise<Book[]> {
    return (await getAllBaseBooks()).map(getEmptyBook);
  }

  protected async addSelectedBooks(): Promise<void> {
    const selectedBooksList = this.allBooks()
      .filter((book) => this.isSelected(book))
      .map((book) => {
        return {
          ...book,
          readTimes: 1,
          rating: 0,
          firstReadDate: '',
          lastReadDate: '',
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
