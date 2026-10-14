import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/** Champ de recherche des pages de collection (films, livres, etc.). */
@Component({
  selector: 'app-entity-search-field',
  imports: [FormsModule],
  templateUrl: './entity-search-field.component.html',
  styleUrls: ['./entity-search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitySearchFieldComponent {
  placeholder = input.required<string>();
  value = input<string>('');
  valueChange = output<string>();
}
