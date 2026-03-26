import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  effect,
  signal,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/shared/view-toggle/view-toggle.component';
import { Router, RouterModule } from '@angular/router';
import { MovieView } from '../../../collections/movies/movies.utils';
import { FormsModule } from '@angular/forms';
import { AddMovieComponent } from '../../../add/add-movie/add-movie.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-movies-header',
  imports: [RouterModule, FormsModule, ViewToggleComponent, MatDialogModule],
  templateUrl: './movies-header.component.html',
  styleUrls: ['./movies-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMoviesHeaderComponent {
  onViewChange = output<MovieView>();
  onSearchChange = output<string>();

  selectedView = input<MovieView>('watched');
  allMoviesCount = input<number>(0);
  filteredMoviesByYearCount = input<number>(0);
  visibleMovieViewOptions = input<
    {
      value: MovieView;
      label: string;
    }[]
  >([]);

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  searchTerm = signal<string>('');

  constructor() {
    effect(() => {
      // On évite d'afficher un texte obsolète quand on change de vue.
      this.selectedView();
      this.searchTerm.set('');
    });
  }

  handleSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.onSearchChange.emit(value);
  }

  moviesPageTitle = computed(() => {
    const view = this.selectedView();
    if (view === 'sagas') return 'Films par saga';
    if (view === 'actors') return 'Films par acteur';
    if (view === 'directors') return 'Films par réalisateur';
    if (view === 'countries') return 'Films par pays';
    return 'Films';
  });

  openAddMovieAdminDialog(): void {
    const dialogRef = this.dialog.open(AddMovieComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate(['/admin/movies']);
      }
    });
  }
}
