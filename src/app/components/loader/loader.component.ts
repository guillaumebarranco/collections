import {
  Component,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Loader réutilisable pour indiquer un chargement en cours.
 * Affiche un spinner et un message optionnel.
 */
@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  /** Message affiché sous le spinner (optionnel). */
  message = input<string>('');
}
