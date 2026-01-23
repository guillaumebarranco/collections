import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Movie } from '../../../../models/movie-model';
import { Params, ActivatedRoute } from '@angular/router';
import { getMoviesByUser } from '../../../../facades/movies/movies.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-movies-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-movies-owned.component.html',
  styleUrls: [
    './select-movies-owned.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectMoviesOwnedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  moviesList = signal<Movie[]>([]);

  // Tous les films de l'utilisateur
  allMovies = computed<Movie[]>(() => {
    return this.moviesList();
  });

  // Map pour stocker les owned mis à jour (clé: title-director, valeur: owned)
  moviesOwned = signal<Map<string, boolean>>(new Map());

  // Générer une clé unique pour un film
  private getMovieKey(movie: Movie): string {
    return `${movie.title}-${movie.director}`;
  }

  // Obtenir le owned actuel d'un film
  getOwned(movie: Movie): boolean {
    const key = this.getMovieKey(movie);
    const updatedValue = this.moviesOwned().get(key);
    return updatedValue !== undefined ? updatedValue : movie.owned;
  }

  // Mettre à jour le owned d'un film
  updateOwned(movie: Movie, owned: boolean): void {
    const key = this.getMovieKey(movie);
    const updated = new Map(this.moviesOwned());
    updated.set(key, owned);
    this.moviesOwned.set(updated);
  }

  // Compter le nombre de films modifiés
  modifiedCount = computed(() => {
    return this.allMovies().filter((movie) => {
      const key = this.getMovieKey(movie);
      return this.moviesOwned().has(key);
    }).length;
  });

  async saveMoviesOwned(): Promise<void> {
    if (this.isSaving()) return;

    const moviesToUpdate = this.allMovies().map((movie) => ({
      title: movie.title,
      director: movie.director,
      owned: this.getOwned(movie),
    }));

    if (moviesToUpdate.length === 0) {
      alert('Aucun film à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/movies/batch-owned`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          movies: moviesToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('movies:batch-owned:error', payload);
        alert("La mise à jour des possessions a échoué.");
        return;
      }

      this.navigateToEntityList('movies');
    } catch (error) {
      console.warn('movies:batch-owned:error', error);
      alert("La mise à jour des possessions a échoué.");
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadMoviesData();
  }

  private async loadMoviesData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const movies = await getMoviesByUser(this.userId());
    this.moviesList.set(movies);
    this.isLoading = false;
  }
}
