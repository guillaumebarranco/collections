import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Movie } from '../../../models/movie-model';
import {
  moviesPage1,
  moviesPage2,
  moviesPage3,
  moviesPage4,
  moviesPage5,
  moviesPage6,
  moviesPage7,
  moviesPage8,
  moviesPage9,
  moviesMcu,
  moviesDc,
  moviesOtherSuperheroes,
  moviesLove1,
  moviesLove2,
  moviesAnimated1,
  moviesAnimated2,
  moviesSagaPage1,
  moviesSagaPage2,
  moviesSagaPage3,
  moviesSagaPage4,
  moviesSagaPage5,
} from '../../../utils/guillaume/movies';
import { williamMovies } from '../../../utils/william/movies';

@Component({
  selector: 'app-select-movies',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-movies.component.html',
  styleUrls: ['./select-movies.component.scss'],
})
export class SelectMoviesComponent {
  // Tous les films de tous les utilisateurs
  allMovies = signal<Movie[]>([
    // Guillaume
    ...moviesPage1,
    ...moviesPage2,
    ...moviesPage3,
    ...moviesPage4,
    ...moviesPage5,
    ...moviesPage6,
    ...moviesPage7,
    ...moviesPage8,
    ...moviesPage9,
    ...moviesSagaPage1,
    ...moviesSagaPage2,
    ...moviesSagaPage3,
    ...moviesSagaPage4,
    ...moviesSagaPage5,
    ...moviesLove1,
    ...moviesLove2,
    ...moviesMcu,
    ...moviesDc,
    ...moviesOtherSuperheroes,
    ...moviesAnimated1,
    ...moviesAnimated2,
    // William
    ...williamMovies,
    // Kevin - à ajouter quand disponible
  ]);

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
    const selectedMoviesList = this.allMovies()
      .filter((movie) => this.isSelected(movie))
      .map((movie) => {
        return {
          ...movie,
          timesWatched: 1,
          rating: 0,
          lastViewedDate: '',
        };
      });

    if (selectedMoviesList.length === 0) {
      alert('Aucun film sélectionné !');
      return;
    }

    // Créer le JSON
    const jsonContent = JSON.stringify(selectedMoviesList, null, 2);

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-movies-selection-${new Date().getTime()}.json`;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
