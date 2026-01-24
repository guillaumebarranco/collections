import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Music } from '../../../../models/music-model';
import { getMusicsByUser } from '../../../../facades/musics/musics.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-select-musics-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-musics-rating.component.html',
  styleUrls: [
    './select-musics-rating.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectMusicsRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  musicsList = signal<Music[]>([]);

  allMusics = computed<Music[]>(() => {
    return this.musicsList();
  });

  musicsRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  private getMusicKey(music: Music): string {
    return `${music.title}-${music.artist}`;
  }

  getRating(music: Music): number {
    const key = this.getMusicKey(music);
    const updatedValue = this.musicsRatings().get(key);
    return updatedValue !== undefined ? updatedValue : music.rating;
  }

  updateRating(music: Music, rating: number): void {
    const key = this.getMusicKey(music);
    const updated = new Map(this.musicsRatings());
    updated.set(key, rating);
    this.musicsRatings.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allMusics().filter((music) => {
      const key = this.getMusicKey(music);
      return this.musicsRatings().has(key);
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

  async saveMusicsRatings(): Promise<void> {
    if (this.isSaving()) return;

    const musicsToUpdate = this.allMusics().map((music) => ({
      title: music.title,
      artist: music.artist,
      rating: this.getRating(music),
    }));

    if (musicsToUpdate.length === 0) {
      alert('Aucune musique à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/musics/batch-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          musics: musicsToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('musics:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('musics');
    } catch (error) {
      console.warn('musics:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadMusicsData();
  }

  private async loadMusicsData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const musics = await getMusicsByUser(this.userId());
    this.musicsList.set(musics);
    this.isLoading = false;
  }
}
