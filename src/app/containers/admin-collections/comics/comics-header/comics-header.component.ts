import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/view-toggle/view-toggle.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddComicComponent } from '../../../add/add-comic/add-comic.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-comics-header',
  imports: [FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './comics-header.component.html',
  styleUrls: ['./comics-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComicsHeaderComponent {
  onViewChange = output<'read'>();
  onSearchChange = output<string>();

  selectedView = input<'read'>('read');
  allCount = input<number>(0);
  filteredCount = input<number>(0);
  visibleViewOptions = input<{ value: 'read'; label: string }[]>([]);

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  searchTerm = signal<string>('');

  openAddComicAdminDialog(): void {
    const dialogRef = this.dialog.open(AddComicComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) this.router.navigate(['/admin/comics']);
    });
  }
}
