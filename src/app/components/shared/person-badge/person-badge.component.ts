import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { isCancelledPerson } from '../../../utils/cancelled-people.utils';

export type PersonBadgeVariant =
  | 'director'
  | 'actor'
  | 'author'
  | 'musician'
  | 'producer';

export function personBadgeVariantForCategory(
  categoryId: string
): PersonBadgeVariant {
  switch (categoryId) {
    case 'directors':
      return 'director';
    case 'actors':
      return 'actor';
    case 'musicians':
      return 'musician';
    case 'producers':
      return 'producer';
    default:
      return 'author';
  }
}

@Component({
  selector: 'app-person-badge',
  standalone: true,
  templateUrl: './person-badge.component.html',
  styleUrls: ['./person-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.title]': 'cancelled() ? "Personne cancelled" : null',
  },
})
export class PersonBadgeComponent {
  readonly name = input.required<string>();
  readonly variant = input<PersonBadgeVariant>('author');

  readonly cancelled = computed(() => isCancelledPerson(this.name()));

  readonly hostClass = computed(() => {
    const classes = [
      'person-badge',
      `person-badge--${this.variant()}`,
    ];
    if (this.cancelled()) {
      classes.push('person-badge--cancelled');
    }
    return classes.join(' ');
  });
}
