import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BaseMovie, Movie } from '../../../models/movie-model';
import { getMoviesInspiredByBook } from '../../../utils/book-movie-adaptations.utils';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import {
  getCurrentWatchlistMoviesByUser,
  getMoviesByUser,
} from '../../../facades/movies/movies.facade';
import {
  addMovieAsWatched,
  addMovieToWatchlist,
} from '../../../containers/collections/movies/movies.controller';
import { getEmptyMovie } from '../../../helpers/empty-entities-helper';

export interface BookInspiredMoviesModalData {
  bookTitle: string;
  bookAuthor: string;
  userId: string | null;
}

export type InspiredMovieStatus = 'none' | 'watchlist' | 'watched';

export interface InspiredMovieRow {
  movie: BaseMovie;
  status: InspiredMovieStatus;
}

function movieMatchKey(title: string, director: string): string {
  return `${normalizeSearchText(title.trim())}|${normalizeSearchText(
    director.trim()
  )}`;
}

function findUserMovie(
  movies: Movie[],
  title: string,
  director: string
): Movie | undefined {
  const key = movieMatchKey(title, director);
  return movies.find((movie) => movieMatchKey(movie.title, movie.director) === key);
}

function sortByReleaseDate(movies: BaseMovie[]): BaseMovie[] {
  return [...movies].sort((a, b) =>
    (a.releaseDate || '').localeCompare(b.releaseDate || '')
  );
}

@Component({
  selector: 'app-book-inspired-movies-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './book-inspired-movies-modal.component.html',
  styleUrls: ['./book-inspired-movies-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookInspiredMoviesModalComponent implements OnInit {
  private readonly dialogRef =
    inject(MatDialogRef<BookInspiredMoviesModalComponent>);
  readonly data = inject<BookInspiredMoviesModalData>(MAT_DIALOG_DATA);

  readonly loading = signal(true);
  readonly savingKey = signal('');
  readonly errorMessage = signal('');
  readonly rows = signal<InspiredMovieRow[]>([]);

  readonly modalTitle = computed(() =>
    this.rows().length > 1 ? 'Films inspirés' : 'Film inspiré'
  );

  ngOnInit(): void {
    void this.load();
  }

  close(): void {
    this.dialogRef.close();
  }

  movieKey(movie: BaseMovie): string {
    return movieMatchKey(movie.title, movie.director);
  }

  async addToWatchlist(row: InspiredMovieRow): Promise<void> {
    await this.addMovie(row, true);
  }

  async addAsWatched(row: InspiredMovieRow): Promise<void> {
    await this.addMovie(row, false);
  }

  private async addMovie(
    row: InspiredMovieRow,
    watchlist: boolean
  ): Promise<void> {
    const userId = this.data.userId;
    if (!userId || this.savingKey()) return;
    const key = this.movieKey(row.movie);
    this.savingKey.set(key);
    this.errorMessage.set('');
    const payload = getEmptyMovie(row.movie);
    const ok = watchlist
      ? await addMovieToWatchlist(payload, userId)
      : await addMovieAsWatched(payload, userId);
    this.savingKey.set('');
    if (!ok) {
      this.errorMessage.set("Impossible d'ajouter le film pour le moment.");
      return;
    }
    this.rows.update((current) =>
      current.map((item) =>
        this.movieKey(item.movie) === key
          ? { ...item, status: watchlist ? 'watchlist' : 'watched' }
          : item
      )
    );
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const inspired = sortByReleaseDate(
        await getMoviesInspiredByBook(this.data.bookTitle, this.data.bookAuthor)
      );
      const userId = this.data.userId;
      if (!userId || inspired.length === 0) {
        this.rows.set(inspired.map((movie) => ({ movie, status: 'none' })));
        return;
      }
      const [watched, watchlist] = await Promise.all([
        getMoviesByUser(userId),
        getCurrentWatchlistMoviesByUser(userId),
      ]);
      this.rows.set(
        inspired.map((movie) => {
          if (findUserMovie(watched, movie.title, movie.director)) {
            return { movie, status: 'watched' as const };
          }
          if (findUserMovie(watchlist, movie.title, movie.director)) {
            return { movie, status: 'watchlist' as const };
          }
          return { movie, status: 'none' as const };
        })
      );
    } catch {
      this.rows.set([]);
      this.errorMessage.set(
        'Impossible de charger les films inspirés par ce livre.'
      );
    } finally {
      this.loading.set(false);
    }
  }
}
