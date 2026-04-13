import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Movie } from '../../../../models/movie-model';
import {
  getAllBaseMovies,
  getCurrentWatchlistMoviesByUser,
  getMoviesByUser,
} from '../../../../facades/movies/movies.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddMovieComponent } from '../../../add/add-movie/add-movie.component';
import { SelectEntityComponent } from '../../../../components/entity/select-entity/select-entity.component';
import { Router } from '@angular/router';
import { getApiBaseUrl } from '../../../../core/config';
import { getEmptyMovie } from '../../../../helpers/empty-entities-helper';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';

@Component({
  selector: 'app-select-movies',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-movies.component.html',
  styleUrls: ['./select-movies.component.scss', '../../select-base.scss'],
})
export class SelectMoviesComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  userMovies = signal<Movie[]>([]);
  watchlistMovies = signal<Movie[]>([]);
  allMoviesMergedList = signal<Movie[]>([]);
  searchTerm = signal('');

  // Films déjà vus par l'utilisateur (pour les exclure en mode watchlist)
  watchedMovies = computed<Set<string>>(() => {
    const userMovies = this.userMovies();
    return new Set(userMovies.map((movie) => this.getMovieKey(movie)));
  });

  /** Au moins un film vu issu du catalogue — pour afficher l’ajout manuel. */
  hasWatchedMoviesFromExistingCatalog = computed(() => {
    const catalogKeys = new Set(
      this.allMoviesMergedList().map((m) => this.getMovieKey(m))
    );
    return this.userMovies().some((m) =>
      catalogKeys.has(this.getMovieKey(m))
    );
  });

  // Films déjà en watchlist (toujours exclus de la liste pour éviter les doublons)
  alreadyInWatchlistMovies = computed<Set<string>>(() => {
    const watchlistMovies = this.watchlistMovies();
    return new Set(watchlistMovies.map((movie) => this.getMovieKey(movie)));
  });

  // Tous les films proposés : ni déjà vus, ni déjà en watchlist.
  // Tri par selectDisplayOrder décroissant ; à égalité, ordre inchangé (sort stable).
  allMovies = computed<Movie[]>(() => {
    if (this.isCinemaMode()) {
      return this.userMovies();
    }
    const allMoviesList = this.allMoviesMergedList();
    const filtered = allMoviesList.filter(
      (movie) =>
        !this.watchedMovies().has(this.getMovieKey(movie)) &&
        !this.alreadyInWatchlistMovies().has(this.getMovieKey(movie))
    );
    return [...filtered].sort(
      (a, b) =>
        (b.selectDisplayOrder ?? 0) - (a.selectDisplayOrder ?? 0)
    );
  });

  filteredMovies = computed<Movie[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allMovies();
    if (!normalizedTerm) return list;
    return list.filter((movie) => {
      const title = normalizeSearchText(movie.title ?? '');
      const director = normalizeSearchText(movie.director ?? '');
      return title.includes(normalizedTerm) || director.includes(normalizedTerm);
    });
  });

  selectedMovies = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedMovies().size);

  isSelected(movie: Movie): boolean {
    return this.selectedMovies().has(this.getMovieKey(movie));
  }

  private getMovieKey(movie: Movie): string {
    return `${movie.title}-${movie.releaseDate}`;
  }

  toggleSelection(movie: Movie): void {
    const key = this.getMovieKey(movie);
    const selected = new Set(this.selectedMovies());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedMovies.set(selected);
  }

  openAddMovieDialog(): void {
    const dialogRef = this.dialog.open(AddMovieComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/movies`]);
      }
    });
  }

  async ngOnInit() {
    const userId = this.userId();
    const [movies, watchlist] = await Promise.all([
      getMoviesByUser(userId),
      getCurrentWatchlistMoviesByUser(userId),
    ]);
    const allMovies = await this.getAllMoviesForSelection(userId);
    this.userMovies.set(movies);
    this.watchlistMovies.set(watchlist);
    this.allMoviesMergedList.set(allMovies);
    if (this.isCinemaMode()) {
      const selected = new Set(
        movies
          .filter((movie) => movie.seenAtCinema === true)
          .map((movie) => this.getMovieKey(movie))
      );
      this.selectedMovies.set(selected);
    }
  }

  private async getAllMoviesForSelection(userId: string): Promise<Movie[]> {
    const baseMovies = await getAllBaseMovies();
    return baseMovies.map(getEmptyMovie);
  }

  protected async addSelectedMovies(): Promise<void> {
    if (this.isCinemaMode()) {
      await this.updateCinemaSelection();
      return;
    }
    const selectedMoviesList = this.allMovies()
      .filter((movie) => this.isSelected(movie))
      .map((movie) => {
        return {
          ...movie,
          timesWatched: 1,
          rating: 0,
          firstViewedDate: '',
          lastViewedDate: '',
        };
      });

    const movies = selectedMoviesList.map((movie) => ({
      title: movie.title,
      director: movie.director,
    }));

    if (movies.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/movies/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          movies,
          watchlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des films :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/movies`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des films.", error);
    }
  }

  private async updateCinemaSelection(): Promise<void> {
    const selected = this.selectedMovies();
    const movies = this.userMovies().map((movie) => ({
      title: movie.title,
      director: movie.director,
      seenAtCinema: selected.has(this.getMovieKey(movie)),
    }));

    if (movies.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/movies/batch-cinema`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          movies,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('movies:batch-cinema:error', payload);
        alert('La mise à jour des films vus au cinema a échoué.');
        return;
      }

      this.navigateToEntityList('movies');
    } catch (error) {
      console.warn('movies:batch-cinema:error', error);
      alert('La mise à jour des films vus au cinema a échoué.');
    }
  }
}
