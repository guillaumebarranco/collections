import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Game } from '../../../models/game-model';
import { getGamesByUser } from '../../../facades/games.facade';
import { SelectEntitiesComponent } from '../select-base.component';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-select-games-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-games-rating.component.html',
  styleUrls: ['./select-games-rating.component.scss', '../select-base.scss'],
})
export class SelectGamesRatingComponent extends SelectEntitiesComponent {
  // Tous les jeux de l'utilisateur
  allGames = computed<Game[]>(() => {
    return getGamesByUser(this.userId());
  });

  // Map pour stocker les ratings mis à jour (clé: title-editor, valeur: rating)
  gamesRatings = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour rating (0 à 5 avec incréments de 0.5)
  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  // Générer une clé unique pour un jeu
  private getGameKey(game: Game): string {
    return `${game.title}-${game.editor}`;
  }

  // Obtenir le rating actuel d'un jeu (depuis la map ou depuis le jeu original)
  getRating(game: Game): number {
    const key = this.getGameKey(game);
    const updatedValue = this.gamesRatings().get(key);
    return updatedValue !== undefined ? updatedValue : game.rating;
  }

  // Mettre à jour le rating d'un jeu
  updateRating(game: Game, rating: number): void {
    const key = this.getGameKey(game);
    const updated = new Map(this.gamesRatings());
    updated.set(key, rating);
    this.gamesRatings.set(updated);
  }

  // Compter le nombre de jeux modifiés
  modifiedCount = computed(() => {
    return this.allGames().filter((game) => {
      const key = this.getGameKey(game);
      return this.gamesRatings().has(key);
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

  // Exporter les jeux avec leur rating mis à jour
  exportGamesRatings(): void {
    const gamesToExport = this.allGames().map((game) => {
      const key = this.getGameKey(game);
      const updatedRating = this.gamesRatings().get(key);

      return {
        title: game.title,
        editor: game.editor,
        rating: updatedRating !== undefined ? updatedRating : game.rating,
      };
    });

    if (gamesToExport.length === 0) {
      alert('Aucun jeu à exporter !');
      return;
    }

    const jsonContent = JSON.stringify(gamesToExport, null, 2);
    const fileName = `my-games-rating-${this.userId()}-${new Date().getTime()}.json`;

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
