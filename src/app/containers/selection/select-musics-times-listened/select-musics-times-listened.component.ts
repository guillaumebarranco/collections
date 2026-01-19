import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Music } from '../../../models/music-model';
import { getMusicsByUser } from '../../../facades/musics/musics.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { getApiBaseUrl } from '../../../core/config';

@Component({
  selector: 'app-select-musics-times-listened',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-musics-times-listened.component.html',
  styleUrls: [
    './select-musics-times-listened.component.scss',
    '../select-base.scss',
  ],
})
export class SelectMusicsTimesListenedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  musicsList = signal<Music[]>([]);

  allMusics = computed<Music[]>(() => {
    return this.musicsList();
  });

  musicsTimesListened = signal<Map<string, number>>(new Map());

  readonly timesListenedOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  private getMusicKey(music: Music): string {
    return `${music.title}-${music.artist}`;
  }

  getTimesListened(music: Music): number {
    const key = this.getMusicKey(music);
    const updatedValue = this.musicsTimesListened().get(key);
    return updatedValue !== undefined ? updatedValue : music.timesListened;
  }

  updateTimesListened(music: Music, timesListened: number): void {
    const key = this.getMusicKey(music);
    const updated = new Map(this.musicsTimesListened());
    updated.set(key, timesListened);
    this.musicsTimesListened.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allMusics().filter((music) => {
      const key = this.getMusicKey(music);
      return this.musicsTimesListened().has(key);
    }).length;
  });

  async saveMusicsTimesListened(): Promise<void> {
    if (this.isSaving()) return;

    const musicsToUpdate = this.allMusics().map((music) => ({
      title: music.title,
      artist: music.artist,
      timesListened: this.getTimesListened(music),
    }));

    if (musicsToUpdate.length === 0) {
      alert('Aucune musique à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/musics/batch-times-listened`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.userId(),
            musics: musicsToUpdate,
          }),
        }
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('musics:batch-times-listened:error', payload);
        alert("La mise à jour des écoutes a échoué.");
        return;
      }

      this.navigateToEntityList('musics');
    } catch (error) {
      console.warn('musics:batch-times-listened:error', error);
      alert("La mise à jour des écoutes a échoué.");
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
