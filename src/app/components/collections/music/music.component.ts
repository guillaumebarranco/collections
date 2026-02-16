import { Component, input } from '@angular/core';
import { Music } from '../../../models/music-model';
import { CommonModule } from '@angular/common';
import { isBaseEntityView } from '../../../core/config';
import { StarInfo } from '../../../models/various-model';
import { getRatingStars } from '../../../utils/constants';

@Component({
  selector: 'app-music',
  imports: [CommonModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent {
  music = input.required<Music>();
  isBaseEntityView = isBaseEntityView();

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }
}
