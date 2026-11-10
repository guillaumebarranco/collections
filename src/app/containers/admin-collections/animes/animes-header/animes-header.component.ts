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
import { AddAnimeComponent } from '../../../add/add-anime/add-anime.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AnimeView } from '../../../collections/animes/animes.utils';

@Component({
  selector: 'app-admin-animes-header',
  imports: [RouterModule, FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './animes-header.component.html',
  styleUrls: ['./animes-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAnimesHeaderComponent {
  onViewChange = output<AnimeView>();
  onSearchChange = output<string>();

  selectedView = input<AnimeView>('finished');
  searchTermInput = input<string>('');
  filteredAnimesCount = input<number>(0);
  viewOptions = input<
    {
      value: AnimeView;
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

  openAddAnimeAdminDialog(): void {
    const dialogRef = this.dialog.open(AddAnimeComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate(['/admin/animes']);
      }
    });
  }
}
