import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/shared/view-toggle/view-toggle.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddMangaComponent } from '../../../add/add-manga/add-manga.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-mangas-header',
  imports: [FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './mangas-header.component.html',
  styleUrls: ['./mangas-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMangasHeaderComponent {
  onViewChange = output<'read'>();
  onSearchChange = output<string>();

  selectedView = input<'read'>('read');
  allCount = input<number>(0);
  filteredCount = input<number>(0);
  visibleViewOptions = input<{ value: 'read'; label: string }[]>([]);

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  searchTerm = signal<string>('');

  openAddMangaAdminDialog(): void {
    const dialogRef = this.dialog.open(AddMangaComponent, {
      data: { baseMangaOnly: true },
      width: '760px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) this.router.navigate(['/admin/mangas']);
    });
  }
}
