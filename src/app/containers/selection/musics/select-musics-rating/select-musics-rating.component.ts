import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Music } from '../../../../models/music-model';
import { getMusicsByUser } from '../../../../facades/musics/musics.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptionsSelectPages } from '../../../../utils/constants';

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

  // Filtre : afficher uniquement les musiques sans note
  showOnlyUnrated = signal<boolean>(false);

  // Recherche textuelle (titre / artiste)
  searchQuery = signal<string>('');

  // Musiques affichées selon les filtres actifs. Le filtre "sans note" se
  // base sur la note d'origine pour éviter qu'une musique ne disparaisse de
  // la liste dès qu'elle vient d'être notée pendant la session.
  displayedMusics = computed<Music[]>(() => {
    let musics = this.allMusics();

    if (this.showOnlyUnrated()) {
      musics = musics.filter((music) => !music.rating);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      musics = musics.filter((music) => {
        if (music.title?.toLowerCase().includes(query)) return true;
        if (music.artist?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return musics;
  });

  musicsRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = ratingOptionsSelectPages;

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

  // Basculer le filtre des musiques sans note
  toggleShowOnlyUnrated(checked: boolean): void {
    this.showOnlyUnrated.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allMusics().filter((music) => {
      const key = this.getMusicKey(music);
      return this.musicsRatings().has(key);
    }).length;
  });

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
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
