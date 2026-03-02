import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/shared/view-toggle/view-toggle.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddSerieComponent } from '../../../add/add-serie/add-serie.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SerieView } from '../../../collections/series/series.utils';

@Component({
  selector: 'app-admin-series-header',
  imports: [RouterModule, FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './series-header.component.html',
  styleUrls: ['./series-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSeriesHeaderComponent {
  onViewChange = output<SerieView>();
  onSearchChange = output<string>();

  selectedView = input<SerieView>('finished');
  searchTermInput = input<string>('');
  filteredSeriesCount = input<number>(0);
  viewOptions = input<
    {
      value: SerieView;
      label: string;
    }[]
  >([]);

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  searchTerm = signal<string>('');

  constructor() {
    effect(() => {
      this.searchTerm.set(this.searchTermInput());
    });
  }

  openAddSerieAdminDialog(): void {
    const dialogRef = this.dialog.open(AddSerieComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate(['/admin/series']);
      }
    });
  }
}
