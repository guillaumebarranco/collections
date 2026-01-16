import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Book } from '../../../models/book-model';
import {
  getAllBooksMerged,
  getBooksByUser,
  getCurrentReadlistBooksByUser,
} from '../../../facades/books/books.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddBookComponent } from '../../add/add-book/add-book.component';

@Component({
  selector: 'app-select-books',
  imports: [CommonModule, MenuComponent, MatDialogModule],
  templateUrl: './select-books.component.html',
  styleUrls: ['./select-books.component.scss', '../select-base.scss'],
})
export class SelectBooksComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);
  private isLoading = false;

  userBooks = signal<Book[]>([]);
  readlistBooks = signal<Book[]>([]);
  allBooksMergedList = signal<Book[]>([]);

  // Livres déjà lus par l'utilisateur (pour les exclure en mode readlist)
  readBooks = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode() && !this.isAddMode()) {
      return new Set();
    }
    const userBooks = this.userBooks();
    return new Set(userBooks.map((book) => `${book.title}-${book.author}`));
  });

  alreadyInReadlistBooks = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode()) {
      return new Set();
    }
    const readlistBooks = this.readlistBooks();
    return new Set(readlistBooks.map((book) => `${book.title}-${book.author}`));
  });

  // Tous les livres de tous les utilisateurs, filtrés si mode readlist ou ajout
  allBooks = computed<Book[]>(() => {
    const allBooksList = this.allBooksMergedList();

    if (this.isAddMode()) {
      return allBooksList.filter(
        (book) => !this.readBooks().has(`${book.title}-${book.author}`)
      );
    }

    if (!this.isWatchOrReadlistMode()) {
      return allBooksList;
    }

    return allBooksList.filter(
      (book) =>
        !this.readBooks().has(`${book.title}-${book.author}`) &&
        !this.alreadyInReadlistBooks().has(`${book.title}-${book.author}`)
    );
  });

  // Livres sélectionnés
  selectedBooks = signal<Set<string>>(new Set());

  // Nombre de livres sélectionnés
  selectedCount = computed(() => this.selectedBooks().size);

  isAdding = signal<boolean>(false);
  addErrorMessage = signal<string>('');

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

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(AddBookComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        void this.loadBooksData();
      }
    });
  }

  async addSelectedBooks(): Promise<void> {
    const selected = this.selectedBooks();
    if (selected.size === 0) return;

    this.isAdding.set(true);
    this.addErrorMessage.set('');

    try {
      const books = this.allBooks()
        .filter((book) => selected.has(this.getBookKey(book)))
        .map((book) => ({
          title: book.title,
          author: book.author,
        }));

      const response = await fetch(`${this.getApiUrl()}/books/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          books,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        this.addErrorMessage.set(payload?.error || "Erreur lors de l'ajout.");
        return;
      }

      this.selectedBooks.set(new Set());
      await this.loadBooksData();
    } catch (error) {
      this.addErrorMessage.set("Erreur réseau lors de l'ajout.");
    } finally {
      this.isAdding.set(false);
    }
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

  ngOnInit() {
    void this.loadBooksData();
  }

  private async loadBooksData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const userId = this.userId();
    const [books, readlist] = await Promise.all([
      getBooksByUser(userId),
      getCurrentReadlistBooksByUser(userId),
    ]);
    const allBooks = await this.getAllBooksForSelection(userId);
    this.userBooks.set(books);
    this.readlistBooks.set(readlist);
    this.allBooksMergedList.set(allBooks);
    this.isLoading = false;
  }

  private async getAllBooksForSelection(userId: string): Promise<Book[]> {
    if (this.isLocalhost()) {
      return getAllBooksMerged(userId);
    }
    try {
      const response = await fetch(`${this.getApiUrl()}/books/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private isLocalhost(): boolean {
    return document.location.origin.includes('localhost');
  }

  private getApiUrl(): string {
    return document.location.origin.includes('localhost')
      ? `http://localhost:3001/api`
      : 'https://makya.webarranco.fr/api';
  }
}
