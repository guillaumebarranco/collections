import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { MobileViewCover } from '../../../utils/mobile-view-previews';

@Component({
  selector: 'app-mobile-collection-picker',
  templateUrl: './mobile-collection-picker.component.html',
  styleUrls: ['./mobile-collection-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileCollectionPickerComponent {
  title = input.required<string>();
  ariaLabel = input.required<string>();
  emptyIcon = input<string>('📚');
  options = input.required<readonly { value: string; label: string }[]>();
  previews = input<ReadonlyMap<string, MobileViewCover>>(new Map());
  selected = output<string>();
}
