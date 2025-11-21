import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Game } from '../../../models/game-model';
import { games1, games2, games3, games4 } from '../../../utils/guillaume/games';

@Component({
  selector: 'app-select-games',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-games.component.html',
  styleUrls: ['./select-games.component.scss'],
})
export class SelectGamesComponent {
  // Tous les jeux de tous les utilisateurs
  allGames = signal<Game[]>([
    // Guillaume
    ...games1,
    ...games2,
    ...games3,
    ...games4,
  ]);

  // Jeux sélectionnés
  selectedGames = signal<Set<string>>(new Set());

  // Nombre de jeux sélectionnés
  selectedCount = computed(() => this.selectedGames().size);

  // Vérifier si un jeu est sélectionné
  isSelected(game: Game): boolean {
    return this.selectedGames().has(this.getGameKey(game));
  }

  // Générer une clé unique pour un jeu
  private getGameKey(game: Game): string {
    return `${game.title}-${game.releaseDate}`;
  }

  // Basculer la sélection d'un jeu
  toggleSelection(game: Game): void {
    const key = this.getGameKey(game);
    const selected = new Set(this.selectedGames());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedGames.set(selected);
  }

  // Sélectionner tous les jeux
  selectAll(): void {
    const allKeys = new Set(
      this.allGames().map((game) => this.getGameKey(game))
    );
    this.selectedGames.set(allKeys);
  }

  // Désélectionner tous les jeux
  deselectAll(): void {
    this.selectedGames.set(new Set());
  }

  // Exporter les jeux sélectionnés en JSON
  exportSelectedGames(): void {
    const selectedGamesList = this.allGames()
      .filter((game) => this.isSelected(game))
      .map((game) => {
        return {
          ...game,
          timesFinished: 1,
          rating: 0,
        };
      });

    if (selectedGamesList.length === 0) {
      alert('Aucun jeu sélectionné !');
      return;
    }

    // Créer le JSON
    const jsonContent = JSON.stringify(selectedGamesList, null, 2);

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-games-selection-${new Date().getTime()}.json`;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

