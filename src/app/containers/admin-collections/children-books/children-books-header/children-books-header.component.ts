import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/shared/view-toggle/view-toggle.component';
import { RouterModule } from '@angular/router';
import { ChildrenBookView } from '../../../collections/children-books/children-books.utils';
import { FormsModule } from '@angular/forms';
import { AddChildrenBookComponent } from '../../../add/add-children-book/add-children-book.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

export type AdminChildrenBookView = 'read' | 'authors' | 'sagas' | 'countries';

const ADMIN_VIEW_OPTIONS: { value: ChildrenBookView; label: string }[] = [
  { value: 'read', label: 'Voir tout' },
  { value: 'authors', label: 'Voir par auteurs' },
  { value: 'sagas', label: 'Voir par sagas' },
  { value: 'countries', label: 'Voir par pays' },
];

@Component({
  selector: 'app-admin-children-books-header',
  imports: [RouterModule, FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './children-books-header.component.html',
  styleUrls: ['./children-books-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminChildrenBooksHeaderComponent {
  onViewChange = output<ChildrenBookView>();
  onSearchChange = output<string>();

  selectedView = input<ChildrenBookView>('read');
  searchTermInput = input<string>('');
  filteredChildrenBooksCount = input<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  searchTerm = signal<string>('');

  viewOptions = ADMIN_VIEW_OPTIONS;

  constructor() {
    effect(() => {
      this.searchTerm.set(this.searchTermInput());
    });
  }

  pageTitle = computed(() => `Livres pour enfants (${this.filteredChildrenBooksCount()})`);

  openAddChildrenBookAdminDialog(): void {
    const dialogRef = this.dialog.open(AddChildrenBookComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate(['/admin/children-books']);
      }
    });
  }
}
