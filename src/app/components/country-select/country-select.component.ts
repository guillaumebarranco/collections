import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Country, COUNTRY_SELECT_OPTIONS } from '../../models/countries.enum';

@Component({
  selector: 'app-country-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
})
export class CountrySelectComponent {
  /** Valeur sélectionnée (pays). */
  readonly value = input<Country | string>('');
  /** Id du select (pour associer au label). */
  readonly inputId = input<string>('countryOrigin');
  /** Attribut name du select. */
  readonly name = input<string>('countryOrigin');

  readonly valueChange = output<Country | string>();

  readonly options = COUNTRY_SELECT_OPTIONS;

  onSelectChange(val: string): void {
    this.valueChange.emit(val as Country);
  }
}
