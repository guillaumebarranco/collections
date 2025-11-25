import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Movie } from '../../../models/movie-model';
import { Params, ActivatedRoute } from '@angular/router';
import {
  getAllMoviesMerged,
  getMoviesByUser,
} from '../../../facades/movies.facade';

@Component({
  selector: 'app-select-movies',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-movies.component.html',
  styleUrls: ['./select-movies.component.scss'],
})
export class SelectMoviesComponent {
  activatedRoute = inject(ActivatedRoute);

  // Mode watchlist détecté depuis query params
  isWatchlistMode = computed<boolean>(() => {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    return queryParams['watchlist'] === 'true';
  });

  // ID de l'utilisateur depuis les params
  userId = computed<string>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? params['id'] : 'guillaume';
  });

  username = computed<string>(() => {
    return this.userId().charAt(0).toUpperCase() + this.userId().slice(1);
  });

  // Films déjà vus par l'utilisateur (pour les exclure en mode watchlist)
  watchedMovies = computed<Set<string>>(() => {
    if (!this.isWatchlistMode()) {
      return new Set();
    }
    const userMovies = getMoviesByUser(this.userId());
    return new Set(
      userMovies.map((movie) => `${movie.title}-${movie.releaseDate}`)
    );
  });

  // Tous les films de tous les utilisateurs, filtrés si mode watchlist
  allMovies = computed<Movie[]>(() => {
    const allMoviesList = getAllMoviesMerged();

    if (!this.isWatchlistMode()) {
      return allMoviesList;
    }

    // En mode watchlist, exclure les films déjà vus
    const watchedKeys = this.watchedMovies();
    return allMoviesList.filter(
      (movie) => !watchedKeys.has(`${movie.title}-${movie.releaseDate}`)
    );
  });

  // Films sélectionnés
  selectedMovies = signal<Set<string>>(new Set());

  // Nombre de films sélectionnés
  selectedCount = computed(() => this.selectedMovies().size);

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

    if (this.isWatchlistMode()) {
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
}
