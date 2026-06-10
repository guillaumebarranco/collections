import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { ChildrenBook } from '../../../../models/children-book-model';
import { getChildrenBooksByUser } from '../../../../facades/children-books/children-books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-children-books-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-children-books-owned.component.html',
  styleUrls: [
    './select-children-books-owned.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectChildrenBooksOwnedComponent
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

  // Filtre : afficher uniquement les livres non possédés
  showOnlyNotOwned = signal<boolean>(false);

  // Recherche textuelle (titre / auteur)
  searchQuery = signal<string>('');

  // Livres pour enfants affichés selon les filtres actifs. Le filtre "non possédé" se base
  // sur la valeur d'origine pour éviter qu'un livre ne disparaisse dès qu'on
  // le marque comme possédé pendant la session.
  displayedChildrenBooks = computed<ChildrenBook[]>(() => {
    let childrenBooks = this.allChildrenBooks();

    if (this.showOnlyNotOwned()) {
      childrenBooks = childrenBooks.filter((childrenBook) => !childrenBook.owned);
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

  // Map pour stocker les owned mis à jour (clé: title-author, valeur: owned)
  childrenBooksOwned = signal<Map<string, boolean>>(new Map());

  // Générer une clé unique pour un livre
  private getChildrenBookKey(childrenBook: ChildrenBook): string {
    return `${childrenBook.title}-${childrenBook.author}`;
  }

  // Obtenir le statut owned actuel d'un livre
  getOwned(childrenBook: ChildrenBook): boolean {
    const key = this.getChildrenBookKey(childrenBook);
    const updatedValue = this.childrenBooksOwned().get(key);
    return updatedValue !== undefined ? updatedValue : childrenBook.owned;
  }

  // Mettre à jour le owned d'un livre
  updateOwned(childrenBook: ChildrenBook, owned: boolean): void {
    const key = this.getChildrenBookKey(childrenBook);
    const updated = new Map(this.childrenBooksOwned());
    updated.set(key, owned);
    this.childrenBooksOwned.set(updated);
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
    return this.allChildrenBooks().filter((childrenBook) => {
      const key = this.getChildrenBookKey(childrenBook);
      return this.childrenBooksOwned().has(key);
    }).length;
  });

  async saveChildrenBooksOwned(): Promise<void> {
    if (this.isSaving()) return;

    const childrenBooksToUpdate = this.allChildrenBooks().map((childrenBook) => ({
      title: childrenBook.title,
      author: childrenBook.author,
      owned: this.getOwned(childrenBook),
    }));

    if (childrenBooksToUpdate.length === 0) {
      alert('Aucun livre à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/children-books/batch-owned`, {
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
        console.warn('children-books:batch-owned:error', payload);
        alert("La mise à jour des possessions a échoué.");
        return;
      }

      this.navigateToEntityList('children-books');
    } catch (error) {
      console.warn('children-books:batch-owned:error', error);
      alert("La mise à jour des possessions a échoué.");
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
