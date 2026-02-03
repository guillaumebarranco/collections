import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { isBaseEntityView } from '../../core/config';

@Component({
  selector: 'app-entity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entity-card.component.html',
  styleUrls: ['./entity-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EntityCardComponent {
  isBaseEntityView = isBaseEntityView();
}
