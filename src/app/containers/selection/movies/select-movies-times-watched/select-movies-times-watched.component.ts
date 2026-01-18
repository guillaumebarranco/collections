import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Movie } from '../../../../models/movie-model';
import { Params, ActivatedRoute } from '@angular/router';
import { getMoviesByUser } from '../../../../facades/movies/movies.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-movies-times-watched',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-movies-times-watched.component.html',
  styleUrls: [
    './select-movies-times-watched.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectMoviesTimesWatchedComponent
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

  // Map pour stocker les timesWatched mis à jour (clé: title-director, valeur: timesWatched)
  moviesTimesWatched = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour timesWatched
  readonly timesWatchedOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  // Générer une clé unique pour un film
  private getMovieKey(movie: Movie): string {
    return `${movie.title}-${movie.director}`;
  }

  // Obtenir le timesWatched actuel d'un film (depuis la map ou depuis le film original)
  getTimesWatched(movie: Movie): number {
    const key = this.getMovieKey(movie);
    const updatedValue = this.moviesTimesWatched().get(key);
    return updatedValue !== undefined ? updatedValue : movie.timesWatched;
  }

  // Mettre à jour le timesWatched d'un film
  updateTimesWatched(movie: Movie, timesWatched: number): void {
    const key = this.getMovieKey(movie);
    const updated = new Map(this.moviesTimesWatched());
    updated.set(key, timesWatched);
    this.moviesTimesWatched.set(updated);
  }

  // Compter le nombre de films modifiés
  modifiedCount = computed(() => {
    return this.allMovies().filter((movie) => {
      const key = this.getMovieKey(movie);
      return this.moviesTimesWatched().has(key);
    }).length;
  });

  async saveMoviesTimesWatched(): Promise<void> {
    if (this.isSaving()) return;

    const moviesToUpdate = this.allMovies().map((movie) => ({
      title: movie.title,
      director: movie.director,
      timesWatched: this.getTimesWatched(movie),
    }));

    if (moviesToUpdate.length === 0) {
      alert('Aucun film à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/movies/batch-times-watched`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.userId(),
            movies: moviesToUpdate,
          }),
        }
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('movies:batch-times-watched:error', payload);
        alert("La mise à jour des visionnages a échoué.");
        return;
      }

      this.navigateToEntityList('movies');
    } catch (error) {
      console.warn('movies:batch-times-watched:error', error);
      alert("La mise à jour des visionnages a échoué.");
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
