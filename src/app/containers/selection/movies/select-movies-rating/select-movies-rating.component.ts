import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Movie } from '../../../../models/movie-model';
import { getMoviesByUser } from '../../../../facades/movies/movies.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptions } from '../../../../utils/constants';

@Component({
  selector: 'app-select-movies-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-movies-rating.component.html',
  styleUrls: [
    './select-movies-rating.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectMoviesRatingComponent
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

  // Map pour stocker les ratings mis à jour (clé: title-director, valeur: rating)
  moviesRatings = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour rating (0 à 5 avec incréments de 0.5)
  readonly ratingOptions = ratingOptions;

  // Générer une clé unique pour un film
  private getMovieKey(movie: Movie): string {
    return `${movie.title}-${movie.director}`;
  }

  // Obtenir le rating actuel d'un film (depuis la map ou depuis le film original)
  getRating(movie: Movie): number {
    const key = this.getMovieKey(movie);
    const updatedValue = this.moviesRatings().get(key);
    return updatedValue !== undefined ? updatedValue : movie.rating;
  }

  // Mettre à jour le rating d'un film
  updateRating(movie: Movie, rating: number): void {
    const key = this.getMovieKey(movie);
    const updated = new Map(this.moviesRatings());
    updated.set(key, rating);
    this.moviesRatings.set(updated);
  }

  // Compter le nombre de films modifiés
  modifiedCount = computed(() => {
    return this.allMovies().filter((movie) => {
      const key = this.getMovieKey(movie);
      return this.moviesRatings().has(key);
    }).length;
  });

  // Obtenir les étoiles pour un rating (similaire au codebase)
  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  // Enregistrer les ratings modifiés via l'API
  async saveMoviesRatings(): Promise<void> {
    if (this.isSaving()) return;

    const moviesToUpdate = this.allMovies().map((movie) => ({
      title: movie.title,
      director: movie.director,
      rating: this.getRating(movie),
    }));

    if (moviesToUpdate.length === 0) {
      alert('Aucun film à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/movies/batch-rating`, {
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
        console.warn('movies:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('movies');
    } catch (error) {
      console.warn('movies:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
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
