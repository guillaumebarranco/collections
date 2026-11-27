import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { ViewToggleComponent } from '../../../../components/shared/view-toggle/view-toggle.component';
import { Music, UserAlbumToListen } from '../../../../models/music-model';
import {
  getAllBaseMusics,
  getUserMusicsRaw,
} from '../../../../facades/musics/musics.facade';
import {
  addAlbumsToListen,
  fetchUserAlbumsToListen,
} from '../../../../facades/musics/api-musics.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';
import {
  albumReleaseYear,
  ownsAlbumMajority,
  sortAlbumTracks,
} from '../../../collections/musics/musics.utils';
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
  releaseYear: number | null;
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
  albumsToListen = signal<UserAlbumToListen[]>([]);
  selectedAlbumKeys = signal<Set<string>>(new Set());

  // Musiques sélectionnées
  selectedMusics = signal<Set<string>>(new Set());

  isListenlistMode(): boolean {
    return this.activatedRoute.snapshot.queryParams['listenlist'] === 'true';
  }

  // Nombre de musiques sélectionnées
  selectedCount = computed(() =>
    this.isListenlistMode()
      ? this.selectedAlbumKeys().size
      : this.selectedMusics().size
  );

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
          releaseYear: albumReleaseYear(
            musics.map((music) => music.releaseDate)
          ),
          musics,
        };
      })
      .filter((album) => album.musics.length >= 8);

    return albums.sort((a, b) => {
      const artistCompare = a.artist.localeCompare(b.artist);
      if (artistCompare !== 0) return artistCompare;
      const dateCompare =
        this.albumReleaseTime(a.musics) - this.albumReleaseTime(b.musics);
      if (dateCompare !== 0) return dateCompare;
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

  listenlistAlbums = computed(() => {
    const ownedKeys = new Set(
      this.userMusics().map((music) => this.getMusicKey(music))
    );
    const listed = new Set(
      this.albumsToListen().map((album) => `${album.album}|${album.artist}`)
    );
    const albumsMap = new Map<string, Music[]>();
    this.allMusics().forEach((music) => {
      if (!music.album || music.album === 'Unknown') return;
      const key = this.getAlbumKey(music);
      if (!albumsMap.has(key)) {
        albumsMap.set(key, []);
      }
      albumsMap.get(key)!.push(music);
    });

    return Array.from(albumsMap.entries())
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
          releaseYear: albumReleaseYear(
            musics.map((music) => music.releaseDate)
          ),
          musics,
        };
      })
      .filter((album) => {
        if (album.musics.length < 8 || listed.has(album.key)) return false;
        const owned = album.musics.filter((music) =>
          ownedKeys.has(this.getMusicKey(music))
        ).length;
        return !ownsAlbumMajority(owned, album.musics.length);
      })
      .sort((a, b) => {
        const artistCompare = a.artist.localeCompare(b.artist);
        if (artistCompare !== 0) return artistCompare;
        const dateCompare =
          this.albumReleaseTime(a.musics) - this.albumReleaseTime(b.musics);
        if (dateCompare !== 0) return dateCompare;
        return a.album.localeCompare(b.album);
      });
  });

  filteredAlbums = computed(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.isListenlistMode()
      ? this.listenlistAlbums()
      : this.albumGroups();
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
    const source = this.isListenlistMode()
      ? this.listenlistAlbums()
      : this.albumGroups();
    const album = source.find((group) => group.key === key);
    if (!album) return null;
    return {
      ...album,
      musics: sortAlbumTracks(album.musics),
    };
  });

  previewModel = computed((): AlbumPreviewModel | null => {
    const album = this.openedAlbum();
    if (!album) return null;
    const ownedKeys = new Set(
      this.userMusics().map((music) => this.getMusicKey(music))
    );
    const tracks = sortAlbumTracks(
      this.allMusics().filter((music) => this.getAlbumKey(music) === album.key)
    );
    return {
      album: album.album,
      artist: album.artist,
      coverUrl: album.coverUrl,
      releaseYear: album.releaseYear,
      tracks: tracks.map((music) => {
        const alreadyAdded = ownedKeys.has(this.getMusicKey(music));
        return {
          title: music.title,
          artist: music.artist,
          selected: alreadyAdded || this.isSelected(music),
          disabled: alreadyAdded,
        };
      }),
    };
  });

  previewPrimaryLabel = computed(() => {
    const album = this.openedAlbum();
    const selected = album ? this.isAlbumSelected(album.key) : false;
    if (this.isListenlistMode()) {
      return selected ? "Désélectionner l'album" : "Sélectionner l'album";
    }
    return selected ? "Désélectionner tout l'album" : "Sélectionner tout l'album";
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

  private albumReleaseTime(musics: Music[]): number {
    let earliest = Number.POSITIVE_INFINITY;
    for (const music of musics) {
      const time = new Date(music.releaseDate).getTime();
      if (!Number.isNaN(time) && time < earliest) earliest = time;
    }
    return earliest;
  }

  private hasValidCoverUrl(coverUrl: string): boolean {
    if (!coverUrl) return false;
    const normalized = coverUrl.toLowerCase();
    if (normalized.includes('default')) return false;
    if (normalized.includes('placeholder')) return false;
    return true;
  }

  isAlbumSelected(albumKey: string): boolean {
    if (this.isListenlistMode()) {
      return this.selectedAlbumKeys().has(albumKey);
    }
    const group = this.albumGroups().find((album) => album.key === albumKey);
    if (!group || group.musics.length === 0) return false;
    return group.musics.every((music) => this.isSelected(music));
  }

  openAlbumPreview(albumKey: string): void {
    this.openedAlbumKey.set(albumKey);
    this.tracklistOpen.set(true);
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
    if (this.isListenlistMode()) {
      this.toggleListenAlbum(album.key);
    } else {
      this.toggleAlbumSelection(album.key);
    }
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

  toggleListenAlbum(albumKey: string): void {
    const selected = new Set(this.selectedAlbumKeys());
    if (selected.has(albumKey)) {
      selected.delete(albumKey);
    } else {
      selected.add(albumKey);
    }
    this.selectedAlbumKeys.set(selected);
  }

  goBackToMusics(): void {
    if (this.isListenlistMode()) {
      this.router.navigate(this.getEntityListRoute('musics'), {
        queryParams: { view: 'toListen' },
      });
      return;
    }
    this.navigateToEntityList('musics');
  }

  setViewMode(mode: string): void {
    if (mode === 'tracks' || mode === 'albums') {
      this.viewMode.set(mode);
    }
  }

  async addSelectedMusics(): Promise<void> {
    if (this.isListenlistMode()) {
      await this.addSelectedAlbumsToListen();
      return;
    }
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

  private async addSelectedAlbumsToListen(): Promise<void> {
    const selectedKeys = this.selectedAlbumKeys();
    const albums = this.listenlistAlbums()
      .filter((album) => selectedKeys.has(album.key))
      .map((album) => ({ artist: album.artist, album: album.album }));
    if (albums.length === 0) return;

    const added = await addAlbumsToListen({
      userId: this.userId(),
      albums,
    });
    if (!added) {
      console.warn("Échec de l'ajout des albums à écouter.");
      return;
    }
    this.router.navigate(this.getEntityListRoute('musics'), {
      queryParams: { view: 'toListen' },
    });
  }

  async ngOnInit() {
    if (this.isListenlistMode()) {
      this.viewMode.set('albums');
    }
    const userId = this.userId();
    const [userMusics, toListen] = await Promise.all([
      getUserMusicsRaw(userId),
      this.isListenlistMode()
        ? fetchUserAlbumsToListen(userId).catch(() => [] as UserAlbumToListen[])
        : Promise.resolve([] as UserAlbumToListen[]),
    ]);
    this.albumsToListen.set(toListen);
    this.userMusics.set(userMusics as Music[]);
    const baseMusics = await getAllBaseMusics();
    this.allMusics.set(
      baseMusics.map((music) => ({
        ...music,
        rating: 0,
        timesListened: 0,
        byHeart: false,
        favorite: false,
        quotes: [],
      }))
    );
  }
}
