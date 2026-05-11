import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Book } from '../../../../models/book-model';
import { getBooksByUser } from '../../../../facades/books/books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-books-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-books-owned.component.html',
  styleUrls: [
    './select-books-owned.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectBooksOwnedComponent
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

  // Filtre : afficher uniquement les livres non possédés
  showOnlyNotOwned = signal<boolean>(false);

  // Recherche textuelle (titre / auteur)
  searchQuery = signal<string>('');

  // Livres affichés selon les filtres actifs. Le filtre "non possédé" se base
  // sur la valeur d'origine pour éviter qu'un livre ne disparaisse dès qu'on
  // le marque comme possédé pendant la session.
  displayedBooks = computed<Book[]>(() => {
    let books = this.allBooks();

    if (this.showOnlyNotOwned()) {
      books = books.filter((book) => !book.owned);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      books = books.filter((book) => {
        if (book.title?.toLowerCase().includes(query)) return true;
        if (book.author?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return books;
  });

  // Map pour stocker les owned mis à jour (clé: title-author, valeur: owned)
  booksOwned = signal<Map<string, boolean>>(new Map());

  // Générer une clé unique pour un livre
  private getBookKey(book: Book): string {
    return `${book.title}-${book.author}`;
  }

  // Obtenir le statut owned actuel d'un livre
  getOwned(book: Book): boolean {
    const key = this.getBookKey(book);
    const updatedValue = this.booksOwned().get(key);
    return updatedValue !== undefined ? updatedValue : book.owned;
  }

  // Mettre à jour le owned d'un livre
  updateOwned(book: Book, owned: boolean): void {
    const key = this.getBookKey(book);
    const updated = new Map(this.booksOwned());
    updated.set(key, owned);
    this.booksOwned.set(updated);
  }

  // Basculer le filtre des livres non possédés
  toggleShowOnlyNotOwned(checked: boolean): void {
    this.showOnlyNotOwned.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  // Compter le nombre de livres modifiés
  modifiedCount = computed(() => {
    return this.allBooks().filter((book) => {
      const key = this.getBookKey(book);
      return this.booksOwned().has(key);
    }).length;
  });

  async saveBooksOwned(): Promise<void> {
    if (this.isSaving()) return;

    const booksToUpdate = this.allBooks().map((book) => ({
      title: book.title,
      author: book.author,
      owned: this.getOwned(book),
    }));

    if (booksToUpdate.length === 0) {
      alert('Aucun livre à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/books/batch-owned`, {
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
        console.warn('books:batch-owned:error', payload);
        alert("La mise à jour des possessions a échoué.");
        return;
      }

      this.navigateToEntityList('books');
    } catch (error) {
      console.warn('books:batch-owned:error', error);
      alert("La mise à jour des possessions a échoué.");
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
