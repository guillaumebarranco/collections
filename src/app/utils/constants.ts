import { StarInfo } from '../models/various-model';

/** Options de note de 0 à 5 par pas de 0,25 (ex. 3.25, 2.75). Utilisé dans les modals d’édition/ajout. */
export const ratingOptions: number[] = (() => {
  const opts: number[] = [];
  for (let v = 0; v <= 5; v += 0.25) {
    opts.push(Math.round(v * 100) / 100);
  }
  return opts;
})();

/** Options de note pour les pages « Mettre à jour les notes » : 0, 0.5, 1, … 5 (sans 0.25 ni 0.75). */
export const ratingOptionsSelectPages: number[] = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function getRatingStars(rating: number): StarInfo[] {
  const stars: StarInfo[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push({ type: 'full', value: i });
    } else if (rating >= i - 0.25) {
      stars.push({ type: 'threeQuarter', value: i });
    } else if (rating >= i - 0.5) {
      stars.push({ type: 'half', value: i });
    } else if (rating >= i - 0.75) {
      stars.push({ type: 'quarter', value: i });
    } else {
      stars.push({ type: 'empty', value: i });
    }
  }
  return stars;
}

export const DEFAULT_USER_ID = 'guillaume';
