import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Comic } from '../../../../models/comic-model';
import { getComicsByUser } from '../../../../facades/comics/comics.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-comics-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-comics-owned.component.html',
  styleUrls: ['./select-comics-owned.component.scss', '../../select-base.scss'],
})
export class SelectComicsOwnedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  comicsList = signal<Comic[]>([]);

  allComics = computed<Comic[]>(() => {
    return this.comicsList();
  });

  // Filtre : afficher uniquement les comics non possédés
  showOnlyNotOwned = signal<boolean>(false);

  // Recherche textuelle (titre / scénariste)
  searchQuery = signal<string>('');

  // Comics affichés selon les filtres actifs. Le filtre "non possédé" se
  // base sur la valeur d'origine pour éviter qu'un comic ne disparaisse
  // dès qu'on le marque comme possédé pendant la session.
  displayedComics = computed<Comic[]>(() => {
    let comics = this.allComics();

    if (this.showOnlyNotOwned()) {
      comics = comics.filter((comic) => !comic.owned);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      comics = comics.filter((comic) => {
        if (comic.title?.toLowerCase().includes(query)) return true;
        if (comic.writer?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return comics;
  });

  comicsOwned = signal<Map<string, boolean>>(new Map());

  private getComicKey(comic: Comic): string {
    return `${comic.title}-${comic.writer}`;
  }

  getOwned(comic: Comic): boolean {
    const key = this.getComicKey(comic);
    const updatedValue = this.comicsOwned().get(key);
    return updatedValue !== undefined ? updatedValue : comic.owned;
  }

  updateOwned(comic: Comic, owned: boolean): void {
    const key = this.getComicKey(comic);
    const updated = new Map(this.comicsOwned());
    updated.set(key, owned);
    this.comicsOwned.set(updated);
  }

  // Basculer le filtre des comics non possédés
  toggleShowOnlyNotOwned(checked: boolean): void {
    this.showOnlyNotOwned.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allComics().filter((comic) => {
      const key = this.getComicKey(comic);
      return this.comicsOwned().has(key);
    }).length;
  });

  async saveComicsOwned(): Promise<void> {
    if (this.isSaving()) return;

    const comicsToUpdate = this.allComics().map((comic) => ({
      title: comic.title,
      writer: comic.writer,
      owned: this.getOwned(comic),
    }));

    if (comicsToUpdate.length === 0) {
      alert('Aucun comic à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/comics/batch-owned`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          comics: comicsToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('comics:batch-owned:error', payload);
        alert('La mise à jour des possessions a échoué.');
        return;
      }

      this.navigateToEntityList('comics');
    } catch (error) {
      console.warn('comics:batch-owned:error', error);
      alert('La mise à jour des possessions a échoué.');
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadComicsData();
  }

  private async loadComicsData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const comics = await getComicsByUser(this.userId());
    this.comicsList.set(comics);
    this.isLoading = false;
  }
}
