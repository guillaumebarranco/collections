import { Component, input } from '@angular/core';
import { Music } from '../../models/music-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-music',
  imports: [CommonModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent {
  music = input.required<Music>();

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 0.5 : 0;
    let stars = '⭐'.repeat(fullStars);
    if (halfStar) stars += '½';
    return stars || '☆';
  }
}

