import { Component, effect, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Music } from '../../../models/music-model';
import {
  addExistingMusics,
  saveAlbumNote,
  saveMusicDetails,
} from '../../../facades/musics/api-musics.facade';
import { RatingStarsComponent } from '../../shared/rating-stars/rating-stars.component';
import { EntityQuotesComponent } from '../../shared/entity-quotes/entity-quotes.component';
import {
  MusicQuotesModalComponent,
  MusicQuotesModalResult,
} from '../music-quotes-modal/music-quotes-modal.component';

export interface Album {
  name: string;
  artist: string;
  coverUrl: string;
  musics: Music[];
  totalDuration: number;
  rating: number;
  favorite: boolean;
}

export interface MusicDetailsUpdate {
  title: string;
  artist: string;
  timesListened?: number;
  byHeart?: boolean;
  rating?: number;
  favorite?: boolean;
}

export interface AlbumRatingUpdate {
  artist: string;
  album: string;
  rating?: number;
  favorite?: boolean;
}

/** Morceau de la modale : `music` est renseigné seulement s'il est déjà dans la collection. */
export interface AlbumTrackRow {
  key: string;
  title: string;
  artist: string;
  duration: number;
  number: number;
  music: Music | null;
}

@Component({
  selector: 'app-album-modal',
  imports: [CommonModule, EntityQuotesComponent, RatingStarsComponent],
  templateUrl: './album-modal.component.html',
  styleUrls: ['./album-modal.component.scss'],
})
export class AlbumModalComponent {
  private readonly dialog = inject(MatDialog);

  album = input.required<Album | null>();
  tracks = input<AlbumTrackRow[]>([]);
  isOpen = input.required<boolean>();
  userId = input<string>('');
  canEditQuotes = input(false);
  close = output<void>();
  quotesUpdated = output<MusicQuotesModalResult & { title: string; artist: string }>();
  musicUpdated = output<MusicDetailsUpdate>();
  albumRatingUpdated = output<AlbumRatingUpdate>();
  tracksAdded = output<void>();

  readonly savingKey = signal<string | null>(null);
  readonly saveErrorKey = signal<string | null>(null);
  readonly albumSaving = signal(false);
  readonly albumSaveError = signal(false);
  readonly selectedMissing = signal<ReadonlySet<string>>(new Set());
  readonly adding = signal(false);
  readonly addError = signal(false);
  private saveQueue: Promise<void> = Promise.resolve();
  private albumIdentity = '';

  readonly ownedTracks = computed(() =>
    this.tracks().filter((track) => track.music !== null)
  );
  readonly missingTracks = computed(() =>
    this.tracks().filter((track) => track.music === null)
  );
  readonly ownedDuration = computed(() =>
    this.ownedTracks().reduce((sum, track) => sum + track.duration, 0)
  );
  readonly addLabel = computed(() => {
    const missing = this.missingTracks();
    const chosen = missing.filter((track) =>
      this.selectedMissing().has(track.key)
    );
    if (chosen.length > 0 && chosen.length < missing.length) {
      return `Ajouter la sélection (${chosen.length})`;
    }
    return 'Ajouter les morceaux manquants';
  });

  constructor() {
    effect(() => {
      const album = this.album();
      const identity = album ? `${album.name}|${album.artist}` : '';
      if (identity === this.albumIdentity) {
        return;
      }
      this.albumIdentity = identity;
      this.selectedMissing.set(new Set());
      this.addError.set(false);
    });
  }

  onOverlayClick() {
    this.close.emit();
  }

  onModalContentClick(event: Event) {
    event.stopPropagation();
  }

  formatAlbumDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  musicKey(music: Music): string {
    return `${music.title}|${music.artist}`;
  }

  onAlbumRatingChange(rating: number): void {
    const album = this.album();
    if (!album || rating === album.rating) {
      return;
    }
    void this.persistAlbumNote(album, { rating }, () => undefined);
  }

  onFavoriteToggle(): void {
    const album = this.album();
    if (!album || !this.canEditQuotes() || this.albumSaving()) {
      return;
    }
    void this.persistAlbumNote(
      album,
      { favorite: !album.favorite },
      () => undefined
    );
  }

  onTrackRatingChange(music: Music, rating: number): void {
    if (rating === music.rating) {
      return;
    }
    void this.persistMusic(music, { rating }, () => undefined);
  }

  onTimesListenedChange(music: Music, event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.trim();
    if (!/^\d+$/.test(raw)) {
      input.value = String(music.timesListened);
      return;
    }
    const timesListened = Number(raw);
    if (timesListened === music.timesListened) {
      return;
    }
    void this.persistMusic(music, { timesListened }, () => {
      input.value = String(music.timesListened);
    });
  }

  onMissingToggle(track: AlbumTrackRow): void {
    if (track.music || this.adding() || !this.canEditQuotes()) {
      return;
    }
    this.selectedMissing.update((current) => {
      const next = new Set(current);
      if (next.has(track.key)) {
        next.delete(track.key);
      } else {
        next.add(track.key);
      }
      return next;
    });
  }

  async addMissing(): Promise<void> {
    const missing = this.missingTracks();
    const userId = this.userId();
    if (
      !userId ||
      !this.canEditQuotes() ||
      this.adding() ||
      missing.length === 0
    ) {
      return;
    }
    const chosen = missing.filter((track) =>
      this.selectedMissing().has(track.key)
    );
    const toAdd = (
      chosen.length > 0 && chosen.length < missing.length ? chosen : missing
    ).map((track) => ({ title: track.title, artist: track.artist }));
    this.adding.set(true);
    this.addError.set(false);
    const saved = await addExistingMusics({ userId, musics: toAdd });
    this.adding.set(false);
    if (!saved) {
      this.addError.set(true);
      return;
    }
    this.selectedMissing.set(new Set());
    this.tracksAdded.emit();
  }

  onByHeartChange(music: Music, event: Event): void {
    const input = event.target as HTMLInputElement;
    const byHeart = input.checked;
    if (byHeart === music.byHeart) {
      return;
    }
    void this.persistMusic(music, { byHeart }, () => {
      input.checked = music.byHeart;
    });
  }

  onTrackFavoriteToggle(music: Music): void {
    if (!this.canEditQuotes() || this.savingKey() === this.musicKey(music)) {
      return;
    }
    void this.persistMusic(music, { favorite: music.favorite !== true }, () => undefined);
  }

  private persistMusic(
    music: Music,
    patch: Pick<MusicDetailsUpdate, 'timesListened' | 'byHeart' | 'rating' | 'favorite'>,
    revert: () => void
  ): Promise<void> {
    const userId = this.userId();
    const key = this.musicKey(music);
    if (!userId || !this.canEditQuotes()) {
      revert();
      return Promise.resolve();
    }

    const run = this.saveQueue.then(async () => {
      this.savingKey.set(key);
      this.saveErrorKey.set(null);
      try {
        const saved = await saveMusicDetails({
          userId,
          title: music.title,
          artist: music.artist,
          ...patch,
        });
        if (!saved) {
          revert();
          this.saveErrorKey.set(key);
          return;
        }
        this.musicUpdated.emit({
          title: music.title,
          artist: music.artist,
          ...patch,
        });
      } catch {
        revert();
        this.saveErrorKey.set(key);
      } finally {
        this.savingKey.set(null);
      }
    });
    this.saveQueue = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  private persistAlbumNote(
    album: Album,
    patch: { rating?: number; favorite?: boolean },
    revert: () => void
  ): Promise<void> {
    const userId = this.userId();
    if (!userId || !this.canEditQuotes()) {
      revert();
      return Promise.resolve();
    }
    const run = this.saveQueue.then(async () => {
      this.albumSaving.set(true);
      this.albumSaveError.set(false);
      try {
        const saved = await saveAlbumNote({
          userId,
          artist: album.artist,
          album: album.name,
          ...patch,
        });
        if (!saved) {
          revert();
          this.albumSaveError.set(true);
          return;
        }
        this.albumRatingUpdated.emit({
          artist: album.artist,
          album: album.name,
          ...patch,
        });
      } catch {
        revert();
        this.albumSaveError.set(true);
      } finally {
        this.albumSaving.set(false);
      }
    });
    this.saveQueue = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  openQuotesEditor(music: Music): void {
    const userId = this.userId();
    if (!userId || !this.canEditQuotes()) {
      return;
    }
    const dialogRef = this.dialog.open(MusicQuotesModalComponent, {
      data: {
        title: music.title,
        artist: music.artist,
        quotes: music.quotes ?? [],
        userId,
      },
      width: 'min(560px, 95vw)',
    });
    dialogRef.afterClosed().subscribe((result?: MusicQuotesModalResult) => {
      if (!result) {
        return;
      }
      this.quotesUpdated.emit({
        title: music.title,
        artist: music.artist,
        quotes: result.quotes,
      });
    });
  }
}
