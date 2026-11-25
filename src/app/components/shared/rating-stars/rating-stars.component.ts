import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { getRatingStars } from '../../../utils/constants';

@Component({
  selector: 'app-rating-stars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss'],
})
export class RatingStarsComponent {
  rating = input(0);
  editable = input(false);
  disabled = input(false);
  label = input('Note');
  ratingChange = output<number>();

  readonly stars = computed(() => getRatingStars(this.rating()));

  choose(event: MouseEvent, value: number): void {
    if (!this.editable() || this.disabled()) {
      return;
    }
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const half = event.clientX - rect.left < rect.width / 2;
    const next = half ? value - 0.5 : value;
    this.ratingChange.emit(next === this.rating() ? 0 : next);
  }
}
