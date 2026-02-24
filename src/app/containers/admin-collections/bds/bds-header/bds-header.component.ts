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
import { AddBdComponent } from '../../../add/add-bd/add-bd.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-bds-header',
  imports: [FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './bds-header.component.html',
  styleUrls: ['./bds-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBdsHeaderComponent {
  onViewChange = output<'read'>();
  onSearchChange = output<string>();

  selectedView = input<'read'>('read');
  allCount = input<number>(0);
  filteredCount = input<number>(0);
  visibleViewOptions = input<{ value: 'read'; label: string }[]>([]);

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  searchTerm = signal<string>('');

  openAddBdAdminDialog(): void {
    const dialogRef = this.dialog.open(AddBdComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) this.router.navigate(['/admin/bds']);
    });
  }
}
