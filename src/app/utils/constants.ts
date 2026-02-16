import { StarInfo } from '../models/various-model';

export const ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function getRatingStars(rating: number): StarInfo[] {
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
