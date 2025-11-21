import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Music } from '../../models/music-model';

export interface Album {
  name: string;
  artist: string;
  coverUrl: string;
  musics: Music[];
  totalDuration: number;
}

@Component({
  selector: 'app-album-modal',
  imports: [CommonModule],
  templateUrl: './album-modal.component.html',
  styleUrls: ['./album-modal.component.scss'],
})
export class AlbumModalComponent {
  album = input.required<Album | null>();
  isOpen = input.required<boolean>();
  close = output<void>();

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
}

