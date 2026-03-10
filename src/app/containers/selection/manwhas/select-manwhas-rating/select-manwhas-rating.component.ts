import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Manwha } from '../../../../models/manwha-model';
import { getManwhasByUser } from '../../../../facades/manwhas/manwhas.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptionsSelectPages } from '../../../../utils/constants';

@Component({
  selector: 'app-select-manwhas-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-manwhas-rating.component.html',
  styleUrls: [
    './select-manwhas-rating.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectManwhasRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  manwhasList = signal<Manwha[]>([]);

  allManwhas = computed<Manwha[]>(() => {
    return this.manwhasList();
  });

  manwhasRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = ratingOptionsSelectPages;

  private getManwhaKey(manwha: Manwha): string {
    return `${manwha.title}-${manwha.author}`;
  }

  getRating(manwha: Manwha): number {
    const key = this.getManwhaKey(manwha);
    const updatedValue = this.manwhasRatings().get(key);
    return updatedValue !== undefined ? updatedValue : manwha.rating;
  }

  updateRating(manwha: Manwha, rating: number): void {
    const key = this.getManwhaKey(manwha);
    const updated = new Map(this.manwhasRatings());
    updated.set(key, rating);
    this.manwhasRatings.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allManwhas().filter((manwha) => {
      const key = this.getManwhaKey(manwha);
      return this.manwhasRatings().has(key);
    }).length;
  });

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  async saveManwhasRatings(): Promise<void> {
    if (this.isSaving()) return;

    const manwhasToUpdate = this.allManwhas().map((manwha) => ({
      title: manwha.title,
      author: manwha.author,
      rating: this.getRating(manwha),
    }));

    if (manwhasToUpdate.length === 0) {
      alert('Aucun manwha à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/manwhas/batch-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          manwhas: manwhasToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('manwhas:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('manwhas');
    } catch (error) {
      console.warn('manwhas:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadManwhasData();
  }

  private async loadManwhasData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const manwhas = await getManwhasByUser(this.userId());
    this.manwhasList.set(manwhas);
    this.isLoading = false;
  }
}
