import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Bd } from '../../../../models/bd-model';
import { getBdsByUser } from '../../../../facades/bds/bds.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptionsSelectPages } from '../../../../utils/constants';

@Component({
  selector: 'app-select-bds-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-bds-rating.component.html',
  styleUrls: ['./select-bds-rating.component.scss', '../../select-base.scss'],
})
export class SelectBdsRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  bdsList = signal<Bd[]>([]);

  allBds = computed<Bd[]>(() => {
    return this.bdsList();
  });

  bdsRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = ratingOptionsSelectPages;

  private getBdKey(bd: Bd): string {
    return `${bd.title}-${bd.writer}`;
  }

  getRating(bd: Bd): number {
    const key = this.getBdKey(bd);
    const updatedValue = this.bdsRatings().get(key);
    return updatedValue !== undefined ? updatedValue : bd.rating;
  }

  updateRating(bd: Bd, rating: number): void {
    const key = this.getBdKey(bd);
    const updated = new Map(this.bdsRatings());
    updated.set(key, rating);
    this.bdsRatings.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allBds().filter((bd) => {
      const key = this.getBdKey(bd);
      return this.bdsRatings().has(key);
    }).length;
  });

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  async saveBdsRatings(): Promise<void> {
    if (this.isSaving()) return;

    const bdsToUpdate = this.allBds().map((bd) => ({
      title: bd.title,
      writer: bd.writer,
      rating: this.getRating(bd),
    }));

    if (bdsToUpdate.length === 0) {
      alert('Aucune BD à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/bds/batch-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          bds: bdsToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('bds:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('bds');
    } catch (error) {
      console.warn('bds:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadBdsData();
  }

  private async loadBdsData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const bds = await getBdsByUser(this.userId());
    this.bdsList.set(bds);
    this.isLoading = false;
  }
}
