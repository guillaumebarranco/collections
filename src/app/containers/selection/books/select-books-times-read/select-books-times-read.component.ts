import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Book } from '../../../../models/book-model';
import { getBooksByUser } from '../../../../facades/books/books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-books-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-books-times-read.component.html',
  styleUrls: [
    './select-books-times-read.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectBooksTimesReadComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  booksList = signal<Book[]>([]);

  // Tous les livres de l'utilisateur
  allBooks = computed<Book[]>(() => {
    return this.booksList();
  });

  // Map pour stocker les readTimes mis à jour (clé: title-author, valeur: readTimes)
  booksTimesRead = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour readTimes (même logique que timesWatched)
  readonly timesReadOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  // Générer une clé unique pour un livre
  private getBookKey(book: Book): string {
    return `${book.title}-${book.author}`;
  }

  // Obtenir le readTimes actuel d'un livre (depuis la map ou depuis le livre original)
  getTimesRead(book: Book): number {
    const key = this.getBookKey(book);
    const updatedValue = this.booksTimesRead().get(key);
    const original = book.readTimes ?? 0;
    return updatedValue !== undefined ? updatedValue : original;
  }

  // Mettre à jour le readTimes d'un livre
  updateTimesRead(book: Book, timesRead: number): void {
    const key = this.getBookKey(book);
    const updated = new Map(this.booksTimesRead());
    updated.set(key, timesRead);
    this.booksTimesRead.set(updated);
  }

  // Compter le nombre de livres modifiés
  modifiedCount = computed(() => {
    return this.allBooks().filter((book) => {
      const key = this.getBookKey(book);
      return this.booksTimesRead().has(key);
    }).length;
  });

  async saveBooksTimesRead(): Promise<void> {
    if (this.isSaving()) return;

    const booksToUpdate = this.allBooks().map((book) => ({
      title: book.title,
      author: book.author,
      readTimes: this.getTimesRead(book),
    }));

    if (booksToUpdate.length === 0) {
      alert('Aucun livre à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/books/batch-times-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          books: booksToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('books:batch-times-read:error', payload);
        alert("La mise à jour du nombre de lectures a échoué.");
        return;
      }

      this.navigateToEntityList('books');
    } catch (error) {
      console.warn('books:batch-times-read:error', error);
      alert("La mise à jour du nombre de lectures a échoué.");
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadBooksData();
  }

  private async loadBooksData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const books = await getBooksByUser(this.userId());
    this.booksList.set(books);
    this.isLoading = false;
  }
}
