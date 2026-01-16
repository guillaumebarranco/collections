import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Movie } from '../../../models/movie-model';
import { Params, ActivatedRoute } from '@angular/router';
import {
  getAllMoviesMerged,
  getCurrentWatchlistMoviesByUser,
  getMoviesByUser,
} from '../../../facades/movies/movies.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddMovieComponent } from '../../add/add-movie/add-movie.component';

@Component({
  selector: 'app-select-movies',
  imports: [CommonModule, MenuComponent, MatDialogModule],
  templateUrl: './select-movies.component.html',
  styleUrls: ['./select-movies.component.scss', '../select-base.scss'],
})
export class SelectMoviesComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);
  private isLoading = false;

  userMovies = signal<Movie[]>([]);
  watchlistMovies = signal<Movie[]>([]);
  allMoviesMergedList = signal<Movie[]>([]);

  // Films déjà vus par l'utilisateur (pour les exclure en mode watchlist)
  watchedMovies = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode() && !this.isAddMode()) {
      return new Set();
    }
    const userMovies = this.userMovies();
    return new Set(
      userMovies.map((movie) => `${movie.title}-${movie.releaseDate}`)
    );
  });

  alreadyInWatchlistMovies = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode()) {
      return new Set();
    }
    const userMovies = this.watchlistMovies();
    return new Set(
      userMovies.map((movie) => `${movie.title}-${movie.releaseDate}`)
    );
  });

  // Tous les films de tous les utilisateurs, filtrés si mode watchlist ou cinema
  allMovies = computed<Movie[]>(() => {
    // En mode cinema, afficher uniquement les films vus par l'utilisateur
    if (this.isCinemaMode()) {
      return this.userMovies();
    }

    const allMoviesList = this.allMoviesMergedList();

    if (this.isAddMode()) {
      return allMoviesList.filter(
        (movie) =>
          !this.watchedMovies().has(`${movie.title}-${movie.releaseDate}`)
      );
    }

    if (!this.isWatchOrReadlistMode()) {
      return allMoviesList;
    }

    // En mode watchlist, exclure les films déjà vus + ceux déjà présents dans la watchlist
    return allMoviesList.filter(
      (movie) =>
        !this.watchedMovies().has(`${movie.title}-${movie.releaseDate}`) &&
        !this.alreadyInWatchlistMovies().has(
          `${movie.title}-${movie.releaseDate}`
        )
    );
  });

  // Films sélectionnés
  selectedMovies = signal<Set<string>>(new Set());

  // Nombre de films sélectionnés
  selectedCount = computed(() => this.selectedMovies().size);

  isAdding = signal<boolean>(false);
  addErrorMessage = signal<string>('');

  // Vérifier si un film est sélectionné
  isSelected(movie: Movie): boolean {
    return this.selectedMovies().has(this.getMovieKey(movie));
  }

  // Générer une clé unique pour un film
  private getMovieKey(movie: Movie): string {
    return `${movie.title}-${movie.releaseDate}`;
  }

  // Basculer la sélection d'un film
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

  // Sélectionner tous les films
  selectAll(): void {
    const allKeys = new Set(
      this.allMovies().map((movie) => this.getMovieKey(movie))
    );
    this.selectedMovies.set(allKeys);
  }

  // Désélectionner tous les films
  deselectAll(): void {
    this.selectedMovies.set(new Set());
  }

  openAddMovieDialog(): void {
    const dialogRef = this.dialog.open(AddMovieComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        void this.loadMoviesData();
      }
    });
  }

  async addSelectedMovies(): Promise<void> {
    const selected = this.selectedMovies();
    if (selected.size === 0) return;

    this.isAdding.set(true);
    this.addErrorMessage.set('');

    try {
      const movies = this.allMovies()
        .filter((movie) => selected.has(this.getMovieKey(movie)))
        .map((movie) => ({
          title: movie.title,
          director: movie.director,
        }));

      const response = await fetch(`${this.getApiUrl()}/movies/add-existing`, {
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
        this.addErrorMessage.set(payload?.error || "Erreur lors de l'ajout.");
        return;
      }

      this.selectedMovies.set(new Set());
      await this.loadMoviesData();
    } catch (error) {
      this.addErrorMessage.set("Erreur réseau lors de l'ajout.");
    } finally {
      this.isAdding.set(false);
    }
  }

  // Exporter les films sélectionnés en JSON
  exportSelectedMovies(): void {
    const selectedMovies = this.allMovies().filter((movie) =>
      this.isSelected(movie)
    );

    if (selectedMovies.length === 0) {
      alert('Aucun film sélectionné !');
      return;
    }

    let jsonContent: string;
    let fileName: string;

    if (this.isWatchOrReadlistMode()) {
      // Format watchlist : UserMovie avec rating: 0, timesWatched: 0
      const watchlistMovies = selectedMovies.map((movie) => ({
        title: movie.title,
        director: movie.director,
        rating: 0,
        timesWatched: 0,
        firstViewedDate: '',
        lastViewedDate: '',
      }));
      jsonContent = JSON.stringify(watchlistMovies, null, 2);
      fileName = `my-watchlist-${this.userId()}-${new Date().getTime()}.json`;
    } else if (this.isCinemaMode()) {
      // Format cinema : conserver toutes les propriétés du film mais mettre seenAtCinema à true
      const cinemaMovies = selectedMovies.map((movie) => {
        return {
          title: movie.title,
          director: movie.director,
          rating: movie.rating,
          timesWatched: movie.timesWatched,
          firstViewedDate: movie.firstViewedDate,
          lastViewedDate: movie.lastViewedDate,
          seenAtCinema: true,
        };
      });
      jsonContent = JSON.stringify(cinemaMovies, null, 2);
      fileName = `my-cinema-movies-${this.userId()}-${new Date().getTime()}.json`;
    } else {
      // Format normal : Movie complet
      const moviesList = selectedMovies.map((movie) => {
        return {
          ...movie,
          timesWatched: 1,
          rating: 0,
          lastViewedDate: '',
        };
      });
      jsonContent = JSON.stringify(moviesList, null, 2);
      fileName = `my-movies-selection-${new Date().getTime()}.json`;
    }

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  ngOnInit() {
    void this.loadMoviesData();
  }

  private async loadMoviesData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const userId = this.userId();
    const [movies, watchlist] = await Promise.all([
      getMoviesByUser(userId),
      getCurrentWatchlistMoviesByUser(userId),
    ]);
    const allMovies = await this.getAllMoviesForSelection(userId);
    this.userMovies.set(movies);
    this.watchlistMovies.set(watchlist);
    this.allMoviesMergedList.set(allMovies);
    this.isLoading = false;
  }

  private async getAllMoviesForSelection(userId: string): Promise<Movie[]> {
    if (this.isLocalhost()) {
      return getAllMoviesMerged(userId);
    }
    try {
      const response = await fetch(`${this.getApiUrl()}/movies/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private isLocalhost(): boolean {
    return document.location.origin.includes('localhost');
  }

  private getApiUrl(): string {
    return document.location.origin.includes('localhost')
      ? `http://localhost:3001/api`
      : 'https://makya.webarranco.fr/api';
  }
}
