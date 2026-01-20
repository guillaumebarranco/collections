import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Comic } from '../../../models/comic-model';
import { getComicsByUser } from '../../../facades/comics/comics.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { getApiBaseUrl } from '../../../core/config';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-select-comics-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-comics-rating.component.html',
  styleUrls: ['./select-comics-rating.component.scss', '../select-base.scss'],
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

  comicsRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  private getComicKey(comic: Comic): string {
    return `${comic.title}-${comic.designer}`;
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

  modifiedCount = computed(() => {
    return this.allComics().filter((comic) => {
      const key = this.getComicKey(comic);
      return this.comicsRatings().has(key);
    }).length;
  });

  getRatingStars(rating: number): StarInfo[] {
    const stars: StarInfo[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push({ type: 'full', value: i });
      } else if (rating >= i - 0.5) {
        stars.push({ type: 'half', value: i });
      } else {
        stars.push({ type: 'empty', value: i });
      }
    }
    return stars;
  }

  async saveComicsRatings(): Promise<void> {
    if (this.isSaving()) return;

    const comicsToUpdate = this.allComics().map((comic) => ({
      title: comic.title,
      designer: comic.designer,
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
        alert("La mise à jour des notes a échoué.");
        return;
      }

      this.navigateToEntityList('comics');
    } catch (error) {
      console.warn('comics:batch-rating:error', error);
      alert("La mise à jour des notes a échoué.");
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
