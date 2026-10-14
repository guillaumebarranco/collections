import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-collection-mobile-back',
  templateUrl: './collection-mobile-back.component.html',
  styleUrls: ['./collection-mobile-back.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionMobileBackComponent {
  back = output<void>();
}
