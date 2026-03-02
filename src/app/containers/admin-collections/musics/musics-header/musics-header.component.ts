import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/shared/view-toggle/view-toggle.component';
import { FormsModule } from '@angular/forms';

const ADMIN_VIEW_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Voir tout' },
];

@Component({
  selector: 'app-admin-musics-header',
  imports: [FormsModule, ViewToggleComponent],
  templateUrl: './musics-header.component.html',
  styleUrls: ['./musics-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMusicsHeaderComponent {
  onSearchChange = output<string>();

  allMusicsCount = input<number>(0);
  searchTermInput = input<string>('');

  viewOptions = ADMIN_VIEW_OPTIONS;
}
