import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Manga } from '../../../../models/manga-model';
import { getMangasByUser } from '../../../../facades/mangas/mangas.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptionsSelectPages } from '../../../../utils/constants';

@Component({
  selector: 'app-select-mangas-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-mangas-rating.component.html',
  styleUrls: [
    './select-mangas-rating.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectMangasRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  mangasList = signal<Manga[]>([]);

  allMangas = computed<Manga[]>(() => {
    return this.mangasList();
  });

  // Filtre : afficher uniquement les mangas sans note
  showOnlyUnrated = signal<boolean>(false);

  // Recherche textuelle (titre / auteur)
  searchQuery = signal<string>('');

  // Mangas affichés selon les filtres actifs. Le filtre "sans note" se base
  // sur la note d'origine pour éviter qu'un manga ne disparaisse de la liste
  // dès qu'il vient d'être noté pendant la session.
  displayedMangas = computed<Manga[]>(() => {
    let mangas = this.allMangas();

    if (this.showOnlyUnrated()) {
      mangas = mangas.filter((manga) => !manga.rating);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      mangas = mangas.filter((manga) => {
        if (manga.title?.toLowerCase().includes(query)) return true;
        if (manga.author?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return mangas;
  });

  mangasRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = ratingOptionsSelectPages;

  private getMangaKey(manga: Manga): string {
    return `${manga.title}-${manga.author}`;
  }

  getRating(manga: Manga): number {
    const key = this.getMangaKey(manga);
    const updatedValue = this.mangasRatings().get(key);
    return updatedValue !== undefined ? updatedValue : manga.rating;
  }

  updateRating(manga: Manga, rating: number): void {
    const key = this.getMangaKey(manga);
    const updated = new Map(this.mangasRatings());
    updated.set(key, rating);
    this.mangasRatings.set(updated);
  }

  // Basculer le filtre des mangas sans note
  toggleShowOnlyUnrated(checked: boolean): void {
    this.showOnlyUnrated.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allMangas().filter((manga) => {
      const key = this.getMangaKey(manga);
      return this.mangasRatings().has(key);
    }).length;
  });

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  async saveMangasRatings(): Promise<void> {
    if (this.isSaving()) return;

    const mangasToUpdate = this.allMangas().map((manga) => ({
      title: manga.title,
      author: manga.author,
      rating: this.getRating(manga),
    }));

    if (mangasToUpdate.length === 0) {
      alert('Aucun manga à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/mangas/batch-rating`, {
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
        console.warn('mangas:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('mangas');
    } catch (error) {
      console.warn('mangas:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
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
