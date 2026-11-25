import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { ViewToggleComponent } from '../../../../components/shared/view-toggle/view-toggle.component';
import { Music } from '../../../../models/music-model';
import {
  getAllBaseMusics,
  getUserMusicsRaw,
} from '../../../../facades/musics/musics.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';
import { sortAlbumTracks } from '../../../collections/musics/musics.utils';
import {
  AlbumPreviewModalComponent,
  AlbumPreviewModel,
  AlbumPreviewTrack,
} from '../../../../components/modals/album-preview-modal/album-preview-modal.component';

interface SelectableAlbum {
  key: string;
  album: string;
  artist: string;
  coverUrl: string;
  musics: Music[];
}

@Component({
  selector: 'app-select-musics',
  imports: [
    CommonModule,
    MenuComponent,
    ViewToggleComponent,
    AlbumPreviewModalComponent,
  ],
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
  readonly viewModeOptions = [
    { value: 'tracks', label: 'Par musique' },
    { value: 'albums', label: 'Par album' },
  ];
  viewMode = signal<'tracks' | 'albums'>('albums');
  searchTerm = signal('');
  openedAlbumKey = signal<string | null>(null);
  tracklistOpen = signal(false);

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
      .filter((album) => album.musics.length >= 8);

    return albums.sort((a, b) => {
      const artistCompare = a.artist.localeCompare(b.artist);
      if (artistCompare !== 0) return artistCompare;
      return a.album.localeCompare(b.album);
    });
  });

  filteredMusics = computed(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.availableMusics();
    if (!normalizedTerm) return list;
    return list.filter((music) => {
      const title = normalizeSearchText(music.title ?? '');
      const artist = normalizeSearchText(music.artist ?? '');
      const album = normalizeSearchText(music.album ?? '');
      return (
        title.includes(normalizedTerm) ||
        artist.includes(normalizedTerm) ||
        album.includes(normalizedTerm)
      );
    });
  });

  filteredAlbums = computed(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.albumGroups();
    if (!normalizedTerm) return list;
    return list.filter((album) => {
      const title = normalizeSearchText(album.album ?? '');
      const artist = normalizeSearchText(album.artist ?? '');
      return title.includes(normalizedTerm) || artist.includes(normalizedTerm);
    });
  });

  totalCount = computed(() =>
    this.viewMode() === 'albums'
      ? this.filteredAlbums().length
      : this.filteredMusics().length
  );

  openedAlbum = computed((): SelectableAlbum | null => {
    const key = this.openedAlbumKey();
    if (!key) return null;
    const album = this.albumGroups().find((group) => group.key === key);
    if (!album) return null;
    return {
      ...album,
      musics: sortAlbumTracks(album.musics),
    };
  });

  previewModel = computed((): AlbumPreviewModel | null => {
    const album = this.openedAlbum();
    if (!album) return null;
    return {
      album: album.album,
      artist: album.artist,
      coverUrl: album.coverUrl,
      tracks: album.musics.map((music) => ({
        title: music.title,
        artist: music.artist,
        selected: this.isSelected(music),
        disabled: false,
      })),
    };
  });

  previewPrimaryLabel = computed(() => {
    const album = this.openedAlbum();
    if (!album) return "Sélectionner tout l'album";
    return this.isAlbumSelected(album.key)
      ? "Désélectionner tout l'album"
      : "Sélectionner tout l'album";
  });

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

  openAlbumPreview(albumKey: string): void {
    this.openedAlbumKey.set(albumKey);
    this.tracklistOpen.set(false);
  }

  closeAlbumPreview(): void {
    this.openedAlbumKey.set(null);
    this.tracklistOpen.set(false);
  }

  toggleTracklist(): void {
    this.tracklistOpen.update((open) => !open);
  }

  selectOpenedAlbum(): void {
    const album = this.openedAlbum();
    if (!album) return;
    this.toggleAlbumSelection(album.key);
    this.closeAlbumPreview();
  }

  onPreviewTrackToggle(track: AlbumPreviewTrack): void {
    const music = this.openedAlbum()?.musics.find(
      (item) => item.title === track.title && item.artist === track.artist
    );
    if (music) {
      this.toggleSelection(music);
    }
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

  goBackToMusics(): void {
    this.navigateToEntityList('musics');
  }

  setViewMode(mode: string): void {
    if (mode === 'tracks' || mode === 'albums') {
      this.viewMode.set(mode);
    }
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
    const userMusics = await getUserMusicsRaw(userId);
    this.userMusics.set(userMusics as Music[]);
    const baseMusics = await getAllBaseMusics();
    this.allMusics.set(
      baseMusics.map((music) => ({
        ...music,
        rating: 0,
        timesListened: 0,
        byHeart: false,
        quotes: [],
      }))
    );
  }
}
