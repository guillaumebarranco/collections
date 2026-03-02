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
import { BookView } from '../../../collections/books/books.utils';
import { FormsModule } from '@angular/forms';
import { AddBookComponent } from '../../../add/add-book/add-book.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

export type AdminBookView = 'read' | 'authors' | 'sagas' | 'countries';

const ADMIN_VIEW_OPTIONS: { value: BookView; label: string }[] = [
  { value: 'read', label: 'Voir tout' },
  { value: 'authors', label: 'Voir par auteurs' },
  { value: 'sagas', label: 'Voir par sagas' },
  { value: 'countries', label: 'Voir par pays' },
];

@Component({
  selector: 'app-admin-books-header',
  imports: [RouterModule, FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './books-header.component.html',
  styleUrls: ['./books-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBooksHeaderComponent {
  onViewChange = output<BookView>();
  onSearchChange = output<string>();

  selectedView = input<BookView>('read');
  searchTermInput = input<string>('');
  filteredBooksCount = input<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  searchTerm = signal<string>('');

  viewOptions = ADMIN_VIEW_OPTIONS;

  constructor() {
    effect(() => {
      this.searchTerm.set(this.searchTermInput());
    });
  }

  pageTitle = computed(() => `Livres (${this.filteredBooksCount()})`);

  openAddBookAdminDialog(): void {
    const dialogRef = this.dialog.open(AddBookComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate(['/admin/books']);
      }
    });
  }
}
