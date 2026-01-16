import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Movie } from '../../../models/movie-model';
import { getMoviesByUser } from '../../../facades/movies/movies.facade';
import { SelectEntitiesComponent } from '../select-base.component';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-select-movies-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-movies-rating.component.html',
  styleUrls: ['./select-movies-rating.component.scss', '../select-base.scss'],
})
export class SelectMoviesRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;

  moviesList = signal<Movie[]>([]);

  // Tous les films de l'utilisateur
  allMovies = computed<Movie[]>(() => {
    return this.moviesList();
  });

  // Map pour stocker les ratings mis à jour (clé: title-director, valeur: rating)
  moviesRatings = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour rating (0 à 5 avec incréments de 0.5)
  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

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
    const stars: StarInfo[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push({ type: 'full', value: i });
      } else if (rating >= i - 0.5) {
        stars.push({ type: 'half', value: i });
      } else {
        stars.push({ type: 'empty', value: i });
      }
    }
    return stars;
  }

  // Exporter les films avec leur rating mis à jour
  exportMoviesRatings(): void {
    const moviesToExport = this.allMovies().map((movie) => {
      const key = this.getMovieKey(movie);
      const updatedRating = this.moviesRatings().get(key);

      return {
        title: movie.title,
        director: movie.director,
        rating: updatedRating !== undefined ? updatedRating : movie.rating,
      };
    });

    if (moviesToExport.length === 0) {
      alert('Aucun film à exporter !');
      return;
    }

    const jsonContent = JSON.stringify(moviesToExport, null, 2);
    const fileName = `my-movies-rating-${this.userId()}-${new Date().getTime()}.json`;

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
    const movies = await getMoviesByUser(this.userId());
    this.moviesList.set(movies);
    this.isLoading = false;
  }
}
