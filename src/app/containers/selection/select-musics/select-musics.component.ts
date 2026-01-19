import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Music } from '../../../models/music-model';
import {
  getAllBaseMusics,
  getMusicsByUser,
} from '../../../facades/musics/musics.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { getApiBaseUrl } from '../../../core/config';

@Component({
  selector: 'app-select-musics',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-musics.component.html',
  styleUrls: ['./select-musics.component.scss'],
})
export class SelectMusicsComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  // Toutes les musiques de tous les utilisateurs
  allMusics = signal<Music[]>([]);
  userMusics = signal<Music[]>([]);
  viewMode = signal<'tracks' | 'albums'>('tracks');

  // Musiques sélectionnées
  selectedMusics = signal<Set<string>>(new Set());

  // Nombre de musiques sélectionnées
  selectedCount = computed(() => this.selectedMusics().size);

  availableMusics = computed(() => {
    const userKeys = new Set(
      this.userMusics().map((music) => this.getMusicKey(music))
    );
    return this.allMusics().filter(
      (music) => !userKeys.has(this.getMusicKey(music))
    );
  });

  albumGroups = computed(() => {
    const albumsMap = new Map<string, Music[]>();
    this.availableMusics().forEach((music) => {
      const key = this.getAlbumKey(music);
      if (!albumsMap.has(key)) {
        albumsMap.set(key, []);
      }
      albumsMap.get(key)!.push(music);
    });

    const albums = Array.from(albumsMap.entries())
      .map(([key, musics]) => {
        const [album, artist] = key.split('|');
        const coverUrl =
          musics.find((music) => this.hasValidCoverUrl(music.coverUrl))
            ?.coverUrl || '';
        return {
          key,
          album,
          artist,
          coverUrl,
          musics,
        };
      })
      .filter(
        (album) =>
          album.musics.length >= 8 && this.hasValidCoverUrl(album.coverUrl)
      );

    return albums.sort((a, b) => {
      const artistCompare = a.artist.localeCompare(b.artist);
      if (artistCompare !== 0) return artistCompare;
      return a.album.localeCompare(b.album);
    });
  });

  totalCount = computed(() =>
    this.viewMode() === 'albums'
      ? this.albumGroups().length
      : this.availableMusics().length
  );

  // Vérifier si une musique est sélectionnée
  isSelected(music: Music): boolean {
    return this.selectedMusics().has(this.getMusicKey(music));
  }

  // Générer une clé unique pour une musique
  private getMusicKey(music: Music): string {
    return `${music.title}-${music.artist}`;
  }

  private getAlbumKey(music: Music): string {
    return `${music.album}|${music.artist}`;
  }

  private hasValidCoverUrl(coverUrl: string): boolean {
    if (!coverUrl) return false;
    const normalized = coverUrl.toLowerCase();
    if (normalized.includes('default')) return false;
    if (normalized.includes('placeholder')) return false;
    return true;
  }

  isAlbumSelected(albumKey: string): boolean {
    const group = this.albumGroups().find((album) => album.key === albumKey);
    if (!group || group.musics.length === 0) return false;
    return group.musics.every((music) => this.isSelected(music));
  }

  toggleAlbumSelection(albumKey: string): void {
    const group = this.albumGroups().find((album) => album.key === albumKey);
    if (!group) return;

    const selected = new Set(this.selectedMusics());
    const shouldSelect = !this.isAlbumSelected(albumKey);

    group.musics.forEach((music) => {
      const key = this.getMusicKey(music);
      if (shouldSelect) {
        selected.add(key);
      } else {
        selected.delete(key);
      }
    });

    this.selectedMusics.set(selected);
  }

  // Basculer la sélection d'une musique
  toggleSelection(music: Music): void {
    const key = this.getMusicKey(music);
    const selected = new Set(this.selectedMusics());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedMusics.set(selected);
  }

  // Sélectionner toutes les musiques
  selectAll(): void {
    const allKeys = new Set(
      this.availableMusics().map((music) => this.getMusicKey(music))
    );
    this.selectedMusics.set(allKeys);
  }

  // Désélectionner toutes les musiques
  deselectAll(): void {
    this.selectedMusics.set(new Set());
  }

  setViewMode(mode: 'tracks' | 'albums'): void {
    this.viewMode.set(mode);
  }

  async addSelectedMusics(): Promise<void> {
    const selected = this.availableMusics().filter((music) =>
      this.isSelected(music)
    );
    if (selected.length === 0) {
      alert('Aucune musique sélectionnée !');
      return;
    }

    const musics = selected.map((music) => ({
      title: music.title,
      artist: music.artist,
    }));

    try {
      const response = await fetch(`${getApiBaseUrl()}/musics/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          musics,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des musiques :",
          payload?.error || response.statusText
        );
        return;
      }

      this.navigateToEntityList('musics');
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des musiques.", error);
    }
  }

  async ngOnInit() {
    const userId = this.userId();
    const userMusics = await getMusicsByUser(userId);
    this.userMusics.set(userMusics);
    const baseMusics = await getAllBaseMusics();
    this.allMusics.set(
      baseMusics.map((music) => ({
        ...music,
        rating: 0,
        timesListened: 0,
      }))
    );
  }
}
