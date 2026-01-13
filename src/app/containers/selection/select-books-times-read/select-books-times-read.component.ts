import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Book } from '../../../models/book-model';
import { getBooksByUser } from '../../../facades/books.facade';
import { SelectEntitiesComponent } from '../select-base.component';

@Component({
  selector: 'app-select-books-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-books-times-read.component.html',
  styleUrls: [
    './select-books-times-read.component.scss',
    '../select-base.scss',
  ],
})
export class SelectBooksTimesReadComponent extends SelectEntitiesComponent {
  // Tous les livres de l'utilisateur
  allBooks = computed<Book[]>(() => {
    return getBooksByUser(this.userId());
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

  // Exporter les livres avec leur readTimes mis à jour
  exportBooksTimesRead(): void {
    const booksToExport = this.allBooks().map((book) => {
      const key = this.getBookKey(book);
      const updatedTimesRead = this.booksTimesRead().get(key);
      const original = book.readTimes ?? 0;

      return {
        title: book.title,
        author: book.author,
        readTimes:
          updatedTimesRead !== undefined ? updatedTimesRead : original,
      };
    });

    if (booksToExport.length === 0) {
      alert('Aucun livre à exporter !');
      return;
    }

    const jsonContent = JSON.stringify(booksToExport, null, 2);
    const fileName = `my-books-times-read-${this.userId()}-${new Date().getTime()}.json`;

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
}
