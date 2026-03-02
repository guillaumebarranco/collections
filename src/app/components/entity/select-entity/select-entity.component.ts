import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-select-entity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-entity.component.html',
  styleUrls: ['./select-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SelectEntityComponent {}
