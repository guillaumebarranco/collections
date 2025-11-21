import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Book } from '../../../models/book-model';
import {
  books,
  booksFantasySaga,
  booksSaga,
} from '../../../utils/guillaume/books';
import { kevinBooks1, kevinBooks2 } from '../../../utils/kevin/books';

@Component({
  selector: 'app-select-books',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-books.component.html',
  styleUrls: ['./select-books.component.scss'],
})
export class SelectBooksComponent {
  // Tous les livres de tous les utilisateurs
  allBooks = signal<Book[]>([
    // Guillaume
    ...books,
    ...booksFantasySaga,
    ...booksSaga,
    // Kevin
    ...kevinBooks1,
    ...kevinBooks2,
  ]);

  // Livres sélectionnés
  selectedBooks = signal<Set<string>>(new Set());

  // Nombre de livres sélectionnés
  selectedCount = computed(() => this.selectedBooks().size);

  // Vérifier si un livre est sélectionné
  isSelected(book: Book): boolean {
    return this.selectedBooks().has(this.getBookKey(book));
  }

  // Générer une clé unique pour un livre
  private getBookKey(book: Book): string {
    return `${book.title}-${book.author}`;
  }

  // Basculer la sélection d'un livre
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

  // Sélectionner tous les livres
  selectAll(): void {
    const allKeys = new Set(
      this.allBooks().map((book) => this.getBookKey(book))
    );
    this.selectedBooks.set(allKeys);
  }

  // Désélectionner tous les livres
  deselectAll(): void {
    this.selectedBooks.set(new Set());
  }

  // Exporter les livres sélectionnés en JSON
  exportSelectedBooks(): void {
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

    if (selectedBooksList.length === 0) {
      alert('Aucun livre sélectionné !');
      return;
    }

    // Créer le JSON
    const jsonContent = JSON.stringify(selectedBooksList, null, 2);

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-books-selection-${new Date().getTime()}.json`;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
