import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Comic } from '../../../../models/comic-model';
import { getComicsByUser } from '../../../../facades/comics/comics.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptionsSelectPages } from '../../../../utils/constants';

@Component({
  selector: 'app-select-comics-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-comics-rating.component.html',
  styleUrls: [
    './select-comics-rating.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectComicsRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  comicsList = signal<Comic[]>([]);

  allComics = computed<Comic[]>(() => {
    return this.comicsList();
  });

  // Filtre : afficher uniquement les comics sans note
  showOnlyUnrated = signal<boolean>(false);

  // Recherche textuelle (titre / scénariste)
  searchQuery = signal<string>('');

  // Comics affichés selon les filtres actifs. Le filtre "sans note" se base
  // sur la note d'origine pour éviter qu'un comic ne disparaisse de la liste
  // dès qu'il vient d'être noté pendant la session.
  displayedComics = computed<Comic[]>(() => {
    let comics = this.allComics();

    if (this.showOnlyUnrated()) {
      comics = comics.filter((comic) => !comic.rating);
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

  comicsRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = ratingOptionsSelectPages;

  private getComicKey(comic: Comic): string {
    return `${comic.title}-${comic.writer}`;
  }

  getRating(comic: Comic): number {
    const key = this.getComicKey(comic);
    const updatedValue = this.comicsRatings().get(key);
    return updatedValue !== undefined ? updatedValue : comic.rating;
  }

  updateRating(comic: Comic, rating: number): void {
    const key = this.getComicKey(comic);
    const updated = new Map(this.comicsRatings());
    updated.set(key, rating);
    this.comicsRatings.set(updated);
  }

  // Basculer le filtre des comics sans note
  toggleShowOnlyUnrated(checked: boolean): void {
    this.showOnlyUnrated.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allComics().filter((comic) => {
      const key = this.getComicKey(comic);
      return this.comicsRatings().has(key);
    }).length;
  });

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  async saveComicsRatings(): Promise<void> {
    if (this.isSaving()) return;

    const comicsToUpdate = this.allComics().map((comic) => ({
      title: comic.title,
      writer: comic.writer,
      rating: this.getRating(comic),
    }));

    if (comicsToUpdate.length === 0) {
      alert('Aucun comic à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/comics/batch-rating`, {
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
        console.warn('comics:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('comics');
    } catch (error) {
      console.warn('comics:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
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
