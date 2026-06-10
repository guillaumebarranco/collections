import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { ChildrenBook } from '../../../../models/children-book-model';
import { getChildrenBooksByUser } from '../../../../facades/children-books/children-books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-children-books-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-children-books-times-read.component.html',
  styleUrls: [
    './select-children-books-times-read.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectChildrenBooksTimesReadComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  childrenBooksList = signal<ChildrenBook[]>([]);

  // Tous les livres de l'utilisateur
  allChildrenBooks = computed<ChildrenBook[]>(() => {
    return this.childrenBooksList();
  });

  // Filtre : afficher uniquement les livres non lus
  showOnlyNotRead = signal<boolean>(false);

  // Recherche textuelle (titre / auteur)
  searchQuery = signal<string>('');

  // Livres pour enfants affichés selon les filtres actifs. Le filtre "non lu" se base
  // sur la valeur d'origine pour éviter qu'un livre ne disparaisse dès
  // qu'on lui attribue un nombre de lectures pendant la session.
  displayedChildrenBooks = computed<ChildrenBook[]>(() => {
    let childrenBooks = this.allChildrenBooks();

    if (this.showOnlyNotRead()) {
      childrenBooks = childrenBooks.filter((childrenBook) => !childrenBook.readTimes);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      childrenBooks = childrenBooks.filter((childrenBook) => {
        if (childrenBook.title?.toLowerCase().includes(query)) return true;
        if (childrenBook.author?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return childrenBooks;
  });

  // Map pour stocker les readTimes mis à jour (clé: title-author, valeur: readTimes)
  childrenBooksTimesRead = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour readTimes (même logique que timesWatched)
  readonly timesReadOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  // Générer une clé unique pour un livre
  private getChildrenBookKey(childrenBook: ChildrenBook): string {
    return `${childrenBook.title}-${childrenBook.author}`;
  }

  // Obtenir le readTimes actuel d'un livre (depuis la map ou depuis le livre original)
  getTimesRead(childrenBook: ChildrenBook): number {
    const key = this.getChildrenBookKey(childrenBook);
    const updatedValue = this.childrenBooksTimesRead().get(key);
    const original = childrenBook.readTimes ?? 0;
    return updatedValue !== undefined ? updatedValue : original;
  }

  // Mettre à jour le readTimes d'un livre
  updateTimesRead(childrenBook: ChildrenBook, timesRead: number): void {
    const key = this.getChildrenBookKey(childrenBook);
    const updated = new Map(this.childrenBooksTimesRead());
    updated.set(key, timesRead);
    this.childrenBooksTimesRead.set(updated);
  }

  // Basculer le filtre des livres non lus
  toggleShowOnlyNotRead(checked: boolean): void {
    this.showOnlyNotRead.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  // Compter le nombre de livres modifiés
  modifiedCount = computed(() => {
    return this.allChildrenBooks().filter((childrenBook) => {
      const key = this.getChildrenBookKey(childrenBook);
      return this.childrenBooksTimesRead().has(key);
    }).length;
  });

  async saveChildrenBooksTimesRead(): Promise<void> {
    if (this.isSaving()) return;

    const childrenBooksToUpdate = this.allChildrenBooks().map((childrenBook) => ({
      title: childrenBook.title,
      author: childrenBook.author,
      readTimes: this.getTimesRead(childrenBook),
    }));

    if (childrenBooksToUpdate.length === 0) {
      alert('Aucun livre à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/children-books/batch-times-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          'children-books': childrenBooksToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('children-books:batch-times-read:error', payload);
        alert("La mise à jour du nombre de lectures a échoué.");
        return;
      }

      this.navigateToEntityList('children-books');
    } catch (error) {
      console.warn('children-books:batch-times-read:error', error);
      alert("La mise à jour du nombre de lectures a échoué.");
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadChildrenBooksData();
  }

  private async loadChildrenBooksData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const childrenBooks = await getChildrenBooksByUser(this.userId());
    this.childrenBooksList.set(childrenBooks);
    this.isLoading = false;
  }
}
