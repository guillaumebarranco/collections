import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Book } from '../../../../models/book-model';
import { getBooksByUser } from '../../../../facades/books/books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptionsSelectPages } from '../../../../utils/constants';

@Component({
  selector: 'app-select-books-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-books-rating.component.html',
  styleUrls: ['./select-books-rating.component.scss', '../../select-base.scss'],
})
export class SelectBooksRatingComponent
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

  // Filtre : afficher uniquement les livres sans note
  showOnlyUnrated = signal<boolean>(false);

  // Recherche textuelle (titre / auteur)
  searchQuery = signal<string>('');

  // Livres affichés selon les filtres actifs. Le filtre "sans note" se base
  // sur la note d'origine pour éviter qu'un livre ne disparaisse de la liste
  // dès qu'il vient d'être noté pendant la session.
  displayedBooks = computed<Book[]>(() => {
    let books = this.allBooks();

    if (this.showOnlyUnrated()) {
      books = books.filter((book) => !book.rating);
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

  // Map pour stocker les ratings mis à jour (clé: title-author, valeur: rating)
  booksRatings = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour rating (0 à 5 avec incréments de 0.5)
  readonly ratingOptions = ratingOptionsSelectPages;

  // Générer une clé unique pour un livre
  private getBookKey(book: Book): string {
    return `${book.title}-${book.author}`;
  }

  // Obtenir le rating actuel d'un livre (depuis la map ou depuis le livre original)
  getRating(book: Book): number {
    const key = this.getBookKey(book);
    const updatedValue = this.booksRatings().get(key);
    return updatedValue !== undefined ? updatedValue : book.rating;
  }

  // Mettre à jour le rating d'un livre
  updateRating(book: Book, rating: number): void {
    const key = this.getBookKey(book);
    const updated = new Map(this.booksRatings());
    updated.set(key, rating);
    this.booksRatings.set(updated);
  }

  // Basculer le filtre des livres sans note
  toggleShowOnlyUnrated(checked: boolean): void {
    this.showOnlyUnrated.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  // Compter le nombre de livres modifiés
  modifiedCount = computed(() => {
    return this.allBooks().filter((book) => {
      const key = this.getBookKey(book);
      return this.booksRatings().has(key);
    }).length;
  });

  // Obtenir les étoiles pour un rating (similaire au codebase)
  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  // Enregistrer les ratings modifiés via l'API
  async saveBooksRatings(): Promise<void> {
    if (this.isSaving()) return;

    const booksToUpdate = this.allBooks().map((book) => ({
      title: book.title,
      author: book.author,
      rating: this.getRating(book),
    }));

    if (booksToUpdate.length === 0) {
      alert('Aucun livre à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/books/batch-rating`, {
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
        console.warn('books:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('books');
    } catch (error) {
      console.warn('books:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
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
