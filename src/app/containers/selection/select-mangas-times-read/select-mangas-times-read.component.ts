import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Manga } from '../../../models/manga-model';
import { getMangasByUser } from '../../../facades/mangas/mangas.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { getApiBaseUrl } from '../../../core/config';

@Component({
  selector: 'app-select-mangas-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-mangas-times-read.component.html',
  styleUrls: ['./select-mangas-times-read.component.scss', '../select-base.scss'],
})
export class SelectMangasTimesReadComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  mangasList = signal<Manga[]>([]);

  allMangas = computed<Manga[]>(() => {
    return this.mangasList();
  });

  mangasTimesRead = signal<Map<string, number>>(new Map());

  readonly timesReadOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  private getMangaKey(manga: Manga): string {
    return `${manga.title}-${manga.author}`;
  }

  getTimesRead(manga: Manga): number {
    const key = this.getMangaKey(manga);
    const updatedValue = this.mangasTimesRead().get(key);
    const original = manga.readTimes ?? 0;
    return updatedValue !== undefined ? updatedValue : original;
  }

  updateTimesRead(manga: Manga, timesRead: number): void {
    const key = this.getMangaKey(manga);
    const updated = new Map(this.mangasTimesRead());
    updated.set(key, timesRead);
    this.mangasTimesRead.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allMangas().filter((manga) => {
      const key = this.getMangaKey(manga);
      return this.mangasTimesRead().has(key);
    }).length;
  });

  async saveMangasTimesRead(): Promise<void> {
    if (this.isSaving()) return;

    const mangasToUpdate = this.allMangas().map((manga) => ({
      title: manga.title,
      author: manga.author,
      readTimes: this.getTimesRead(manga),
    }));

    if (mangasToUpdate.length === 0) {
      alert('Aucun manga à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/mangas/batch-times-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          mangas: mangasToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('mangas:batch-times-read:error', payload);
        alert("La mise à jour des lectures a échoué.");
        return;
      }

      this.navigateToEntityList('mangas');
    } catch (error) {
      console.warn('mangas:batch-times-read:error', error);
      alert("La mise à jour des lectures a échoué.");
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadMangasData();
  }

  private async loadMangasData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const mangas = await getMangasByUser(this.userId());
    this.mangasList.set(mangas);
    this.isLoading = false;
  }
}
