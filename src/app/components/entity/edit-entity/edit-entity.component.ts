import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { isBaseEntityView } from '../../../core/config';

@Component({
  selector: 'app-edit-entity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditEntityComponent {
  isBaseEntityView = isBaseEntityView();
}
