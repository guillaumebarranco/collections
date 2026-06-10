import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { BaseChildrenBook, ChildrenBook } from '../../../../models/children-book-model';
import {
  getAllChildrenBooksMerged,
  getChildrenBooksByUser,
  getCurrentReadlistChildrenBooksByUser,
  getAllBaseChildrenBooks,
} from '../../../../facades/children-books/children-books.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddChildrenBookComponent } from '../../../add/add-children-book/add-children-book.component';
import { SelectEntityComponent } from '../../../../components/entity/select-entity/select-entity.component';

import { getApiBaseUrl } from '../../../../core/config';
import { getEmptyChildrenBook } from '../../../../helpers/empty-entities-helper';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';

@Component({
  selector: 'app-select-children-books',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-children-books.component.html',
  styleUrls: ['./select-children-books.component.scss', '../../select-base.scss'],
})
export class SelectChildrenBooksComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  baseChildrenBooks = signal<BaseChildrenBook[]>([]);
  userChildrenBooks = signal<ChildrenBook[]>([]);
  readlistChildrenBooks = signal<ChildrenBook[]>([]);
  allChildrenBooksMergedList = signal<ChildrenBook[]>([]);
  searchTerm = signal('');

  // Livres pour enfants déjà lus par l'utilisateur (pour les exclure en mode readlist)
  readChildrenBooks = computed<Set<string>>(() => {
    const userChildrenBooks = this.userChildrenBooks();
    return new Set(userChildrenBooks.map((childrenBook) => this.getChildrenBookKey(childrenBook)));
  });

  /** Au moins un livre lu issu du catalogue (entités existantes) — pour afficher l’ajout manuel. */
  hasReadChildrenBooksFromExistingCatalog = computed(() => {
    const baseKeys = new Set(
      this.baseChildrenBooks().map((b) => `${b.title}-${b.author}`)
    );
    return this.userChildrenBooks().some((childrenBook) => baseKeys.has(this.getChildrenBookKey(childrenBook)));
  });

  // Livres pour enfants déjà en readlist (toujours exclus de la liste pour éviter les doublons)
  alreadyInReadlistChildrenBooks = computed<Set<string>>(() => {
    const readlistChildrenBooks = this.readlistChildrenBooks();
    return new Set(readlistChildrenBooks.map((childrenBook) => this.getChildrenBookKey(childrenBook)));
  });

  // Tous les livres proposés : ni déjà lus, ni déjà en readlist.
  // Tri par selectDisplayOrder décroissant ; à égalité, ordre inchangé (sort stable).
  allChildrenBooks = computed<ChildrenBook[]>(() => {
    const allChildrenBooksList = this.baseChildrenBooks().map(getEmptyChildrenBook);
    const filtered = allChildrenBooksList.filter(
      (childrenBook) =>
        !this.readChildrenBooks().has(this.getChildrenBookKey(childrenBook)) &&
        !this.alreadyInReadlistChildrenBooks().has(this.getChildrenBookKey(childrenBook))
    );
    return [...filtered].sort(
      (a, b) =>
        (b.selectDisplayOrder ?? 0) - (a.selectDisplayOrder ?? 0)
    );
  });

  filteredChildrenBooks = computed<ChildrenBook[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allChildrenBooks();
    if (!normalizedTerm) return list;
    return list.filter((childrenBook) => {
      const title = normalizeSearchText(childrenBook.title ?? '');
      const author = normalizeSearchText(childrenBook.author ?? '');
      const saga = normalizeSearchText(childrenBook.saga ?? '');
      return (
        title.includes(normalizedTerm) ||
        author.includes(normalizedTerm) ||
        saga.includes(normalizedTerm)
      );
    });
  });

  selectedChildrenBooks = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedChildrenBooks().size);

  async ngOnInit() {
    const userId = this.userId();
    const [baseChildrenBooks, childrenBooks, readlist] = await Promise.all([
      getAllBaseChildrenBooks(),
      getChildrenBooksByUser(userId),
      getCurrentReadlistChildrenBooksByUser(userId),
    ]);

    this.baseChildrenBooks.set(baseChildrenBooks);
    const allChildrenBooks = await this.getAllChildrenBooksForSelection(userId);
    this.userChildrenBooks.set(childrenBooks);
    this.readlistChildrenBooks.set(readlist);
    this.allChildrenBooksMergedList.set(allChildrenBooks);
  }

  isSelected(childrenBook: ChildrenBook): boolean {
    return this.selectedChildrenBooks().has(this.getChildrenBookKey(childrenBook));
  }

  private getChildrenBookKey(childrenBook: ChildrenBook): string {
    return `${childrenBook.title}-${childrenBook.author}`;
  }

  toggleSelection(childrenBook: ChildrenBook): void {
    const key = this.getChildrenBookKey(childrenBook);
    const selected = new Set(this.selectedChildrenBooks());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedChildrenBooks.set(selected);
  }

  openAddChildrenBookDialog(): void {
    const dialogRef = this.dialog.open(AddChildrenBookComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/children-books`]);
      }
    });
  }

  private async getAllChildrenBooksForSelection(_userId: string): Promise<ChildrenBook[]> {
    return (await getAllBaseChildrenBooks()).map(getEmptyChildrenBook);
  }

  protected async addSelectedChildrenBooks(): Promise<void> {
    const selectedChildrenBooksList = this.allChildrenBooks()
      .filter((childrenBook) => this.isSelected(childrenBook))
      .map((childrenBook) => {
        return {
          ...childrenBook,
          readTimes: 1,
          rating: 0,
          firstReadDate: '',
          lastReadDate: '',
        };
      });

    const childrenBooks = selectedChildrenBooksList.map((childrenBook) => ({
      title: childrenBook.title,
      author: childrenBook.author,
    }));

    if (childrenBooks.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/children-books/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          'children-books': childrenBooks,
          readlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des livres :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/children-books`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des livres.", error);
    }
  }
}
