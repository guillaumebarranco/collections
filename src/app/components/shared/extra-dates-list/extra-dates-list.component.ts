import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { normalizeActivityExtraDates } from '../../../utils/activity-extra-dates.utils';

@Component({
  selector: 'app-extra-dates-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extra-dates-list.component.html',
  styleUrls: ['./extra-dates-list.component.scss'],
})
export class ExtraDatesListComponent {
  readonly label = input.required<string>();
  readonly hint = input<string>('');

  readonly dates = model<string[]>([]);

  addDate(): void {
    this.dates.set([...this.dates(), '']);
  }

  updateDate(index: number, value: string): void {
    const next = [...this.dates()];
    next[index] = value;
    this.dates.set(next);
  }

  removeDate(index: number): void {
    const next = this.dates().filter((_, i) => i !== index);
    this.dates.set(next);
  }

  /** Appelé avant envoi API pour retirer les lignes vides. */
  commitDates(): void {
    this.dates.set(normalizeActivityExtraDates(this.dates()));
  }
}
