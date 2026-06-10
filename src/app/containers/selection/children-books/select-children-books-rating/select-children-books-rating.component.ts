import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { ChildrenBook } from '../../../../models/children-book-model';
import { getChildrenBooksByUser } from '../../../../facades/children-books/children-books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptionsSelectPages } from '../../../../utils/constants';

@Component({
  selector: 'app-select-children-books-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-children-books-rating.component.html',
  styleUrls: ['./select-children-books-rating.component.scss', '../../select-base.scss'],
})
export class SelectChildrenBooksRatingComponent
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

  // Filtre : afficher uniquement les livres sans note
  showOnlyUnrated = signal<boolean>(false);

  // Recherche textuelle (titre / auteur)
  searchQuery = signal<string>('');

  // Livres pour enfants affichés selon les filtres actifs. Le filtre "sans note" se base
  // sur la note d'origine pour éviter qu'un livre ne disparaisse de la liste
  // dès qu'il vient d'être noté pendant la session.
  displayedChildrenBooks = computed<ChildrenBook[]>(() => {
    let childrenBooks = this.allChildrenBooks();

    if (this.showOnlyUnrated()) {
      childrenBooks = childrenBooks.filter((childrenBook) => !childrenBook.rating);
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

  // Map pour stocker les ratings mis à jour (clé: title-author, valeur: rating)
  childrenBooksRatings = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour rating (0 à 5 avec incréments de 0.5)
  readonly ratingOptions = ratingOptionsSelectPages;

  // Générer une clé unique pour un livre
  private getChildrenBookKey(childrenBook: ChildrenBook): string {
    return `${childrenBook.title}-${childrenBook.author}`;
  }

  // Obtenir le rating actuel d'un livre (depuis la map ou depuis le livre original)
  getRating(childrenBook: ChildrenBook): number {
    const key = this.getChildrenBookKey(childrenBook);
    const updatedValue = this.childrenBooksRatings().get(key);
    return updatedValue !== undefined ? updatedValue : childrenBook.rating;
  }

  // Mettre à jour le rating d'un livre
  updateRating(childrenBook: ChildrenBook, rating: number): void {
    const key = this.getChildrenBookKey(childrenBook);
    const updated = new Map(this.childrenBooksRatings());
    updated.set(key, rating);
    this.childrenBooksRatings.set(updated);
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
    return this.allChildrenBooks().filter((childrenBook) => {
      const key = this.getChildrenBookKey(childrenBook);
      return this.childrenBooksRatings().has(key);
    }).length;
  });

  // Obtenir les étoiles pour un rating (similaire au codebase)
  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  // Enregistrer les ratings modifiés via l'API
  async saveChildrenBooksRatings(): Promise<void> {
    if (this.isSaving()) return;

    const childrenBooksToUpdate = this.allChildrenBooks().map((childrenBook) => ({
      title: childrenBook.title,
      author: childrenBook.author,
      rating: this.getRating(childrenBook),
    }));

    if (childrenBooksToUpdate.length === 0) {
      alert('Aucun livre à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/children-books/batch-rating`, {
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
        console.warn('children-books:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('children-books');
    } catch (error) {
      console.warn('children-books:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
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
