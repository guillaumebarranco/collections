import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Movie } from '../../../models/movie-model';
import { UserMovieListItem } from '../../../models/movie-list.model';

export interface MovieListsModalData {
  movie: Movie;
  userLists: UserMovieListItem[];
}

export type MovieListsModalResult =
  | { listName: string }
  | { createNew: true }
  | undefined;

@Component({
  selector: 'app-movie-lists-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './movie-lists-modal.component.html',
  styleUrls: ['./movie-lists-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListsModalComponent {
  private readonly dialogRef =
    inject<MatDialogRef<MovieListsModalComponent, MovieListsModalResult>>(
      MatDialogRef
    );
  readonly data = inject<MovieListsModalData>(MAT_DIALOG_DATA);

  get movieInList(): string[] {
    return this.data.movie?.inList ?? [];
  }

  isInList(listName: string): boolean {
    return this.movieInList.includes(listName);
  }

  selectList(listName: string): void {
    this.dialogRef.close({ listName });
  }

  createNew(): void {
    this.dialogRef.close({ createNew: true });
  }

  close(): void {
    this.dialogRef.close();
  }
}
