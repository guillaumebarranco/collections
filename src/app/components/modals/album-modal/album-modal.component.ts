import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Music } from '../../../models/music-model';
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
}

@Component({
  selector: 'app-album-modal',
  imports: [CommonModule, EntityQuotesComponent],
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
