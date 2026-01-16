import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Book } from '../../../models/book-model';
import { getBooksByUser } from '../../../facades/books/books.facade';
import { SelectEntitiesComponent } from '../select-base.component';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-select-books-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-books-rating.component.html',
  styleUrls: ['./select-books-rating.component.scss', '../select-base.scss'],
})
export class SelectBooksRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;

  booksList = signal<Book[]>([]);

  // Tous les livres de l'utilisateur
  allBooks = computed<Book[]>(() => {
    return this.booksList();
  });

  // Map pour stocker les ratings mis à jour (clé: title-author, valeur: rating)
  booksRatings = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour rating (0 à 5 avec incréments de 0.5)
  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

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

  // Compter le nombre de livres modifiés
  modifiedCount = computed(() => {
    return this.allBooks().filter((book) => {
      const key = this.getBookKey(book);
      return this.booksRatings().has(key);
    }).length;
  });

  // Obtenir les étoiles pour un rating (similaire au codebase)
  getRatingStars(rating: number): StarInfo[] {
    const stars: StarInfo[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push({ type: 'full', value: i });
      } else if (rating >= i - 0.5) {
        stars.push({ type: 'half', value: i });
      } else {
        stars.push({ type: 'empty', value: i });
      }
    }
    return stars;
  }

  // Exporter les livres avec leur rating mis à jour
  exportBooksRatings(): void {
    const booksToExport = this.allBooks().map((book) => {
      const key = this.getBookKey(book);
      const updatedRating = this.booksRatings().get(key);

      return {
        title: book.title,
        author: book.author,
        rating: updatedRating !== undefined ? updatedRating : book.rating,
      };
    });

    if (booksToExport.length === 0) {
      alert('Aucun livre à exporter !');
      return;
    }

    const jsonContent = JSON.stringify(booksToExport, null, 2);
    const fileName = `my-books-rating-${this.userId()}-${new Date().getTime()}.json`;

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
