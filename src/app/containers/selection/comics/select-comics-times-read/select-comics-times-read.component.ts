import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Comic } from '../../../../models/comic-model';
import { getComicsByUser } from '../../../../facades/comics/comics.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-comics-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-comics-times-read.component.html',
  styleUrls: [
    './select-comics-times-read.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectComicsTimesReadComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  comicsList = signal<Comic[]>([]);

  allComics = computed<Comic[]>(() => {
    return this.comicsList();
  });

  comicsTimesRead = signal<Map<string, number>>(new Map());

  readonly timesReadOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  private getComicKey(comic: Comic): string {
    return `${comic.title}-${comic.designer}`;
  }

  getTimesRead(comic: Comic): number {
    const key = this.getComicKey(comic);
    const updatedValue = this.comicsTimesRead().get(key);
    const original = comic.readTimes ?? 0;
    return updatedValue !== undefined ? updatedValue : original;
  }

  updateTimesRead(comic: Comic, timesRead: number): void {
    const key = this.getComicKey(comic);
    const updated = new Map(this.comicsTimesRead());
    updated.set(key, timesRead);
    this.comicsTimesRead.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allComics().filter((comic) => {
      const key = this.getComicKey(comic);
      return this.comicsTimesRead().has(key);
    }).length;
  });

  async saveComicsTimesRead(): Promise<void> {
    if (this.isSaving()) return;

    const comicsToUpdate = this.allComics().map((comic) => ({
      title: comic.title,
      designer: comic.designer,
      readTimes: this.getTimesRead(comic),
    }));

    if (comicsToUpdate.length === 0) {
      alert('Aucun comic à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/comics/batch-times-read`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.userId(),
            comics: comicsToUpdate,
          }),
        }
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('comics:batch-times-read:error', payload);
        alert('La mise à jour des lectures a échoué.');
        return;
      }

      this.navigateToEntityList('comics');
    } catch (error) {
      console.warn('comics:batch-times-read:error', error);
      alert('La mise à jour des lectures a échoué.');
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
