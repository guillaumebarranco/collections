import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Serie } from '../../models/serie-model';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-serie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.scss'],
})
export class SerieComponent {
  @Input() serie!: Serie;

  getRatingStars(rating: number): StarInfo[] {
    const stars: StarInfo[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push({ type: 'full', value: i });
      } else if (rating >= i - 0.5) {
        stars.push({ type: 'half', value: i });
      } else {
        stars.push({ type: 'empty', value: i });
      }
    }
    return stars;
  }
}
