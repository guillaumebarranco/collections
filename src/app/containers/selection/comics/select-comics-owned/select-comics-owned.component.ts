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

  comicsOwned = signal<Map<string, boolean>>(new Map());

  private getComicKey(comic: Comic): string {
    return `${comic.title}-${comic.designer}`;
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
      designer: comic.designer,
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
