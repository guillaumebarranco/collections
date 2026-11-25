import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Music } from '../../../models/music-model';
import {
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
}

export interface MusicDetailsUpdate {
  title: string;
  artist: string;
  timesListened?: number;
  byHeart?: boolean;
  rating?: number;
}

export interface AlbumRatingUpdate {
  artist: string;
  album: string;
  rating: number;
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
  isOpen = input.required<boolean>();
  userId = input<string>('');
  canEditQuotes = input(false);
  close = output<void>();
  quotesUpdated = output<MusicQuotesModalResult & { title: string; artist: string }>();
  musicUpdated = output<MusicDetailsUpdate>();
  albumRatingUpdated = output<AlbumRatingUpdate>();

  readonly savingKey = signal<string | null>(null);
  readonly saveErrorKey = signal<string | null>(null);
  readonly albumSaving = signal(false);
  readonly albumSaveError = signal(false);
  private saveQueue: Promise<void> = Promise.resolve();

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
    void this.persistAlbumRating(album, rating, () => undefined);
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

  private persistMusic(
    music: Music,
    patch: Pick<MusicDetailsUpdate, 'timesListened' | 'byHeart' | 'rating'>,
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

  private persistAlbumRating(
    album: Album,
    rating: number,
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
          rating,
        });
        if (!saved) {
          revert();
          this.albumSaveError.set(true);
          return;
        }
        this.albumRatingUpdated.emit({
          artist: album.artist,
          album: album.name,
          rating,
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
