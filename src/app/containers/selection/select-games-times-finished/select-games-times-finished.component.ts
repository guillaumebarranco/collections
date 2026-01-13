import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Game } from '../../../models/game-model';
import { getGamesByUser } from '../../../facades/games.facade';
import { SelectEntitiesComponent } from '../select-base.component';

@Component({
  selector: 'app-select-games-times-finished',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-games-times-finished.component.html',
  styleUrls: [
    './select-games-times-finished.component.scss',
    '../select-base.scss',
  ],
})
export class SelectGamesTimesFinishedComponent extends SelectEntitiesComponent {
  // Tous les jeux de l'utilisateur
  allGames = computed<Game[]>(() => {
    return getGamesByUser(this.userId());
  });

  // Map pour stocker les timesFinished mis à jour (clé: title-editor, valeur: timesFinished)
  gamesTimesFinished = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour timesFinished
  readonly timesFinishedOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  // Générer une clé unique pour un jeu
  private getGameKey(game: Game): string {
    return `${game.title}-${game.editor}`;
  }

  // Obtenir le timesFinished actuel d'un jeu (depuis la map ou depuis le jeu original)
  getTimesFinished(game: Game): number {
    const key = this.getGameKey(game);
    const updatedValue = this.gamesTimesFinished().get(key);
    return updatedValue !== undefined ? updatedValue : game.timesFinished;
  }

  // Mettre à jour le timesFinished d'un jeu
  updateTimesFinished(game: Game, timesFinished: number): void {
    const key = this.getGameKey(game);
    const updated = new Map(this.gamesTimesFinished());
    updated.set(key, timesFinished);
    this.gamesTimesFinished.set(updated);
  }

  // Compter le nombre de jeux modifiés
  modifiedCount = computed(() => {
    return this.allGames().filter((game) => {
      const key = this.getGameKey(game);
      return this.gamesTimesFinished().has(key);
    }).length;
  });

  // Exporter les jeux avec leur timesFinished mis à jour
  exportGamesTimesFinished(): void {
    const gamesToExport = this.allGames().map((game) => {
      const key = this.getGameKey(game);
      const updatedTimesFinished = this.gamesTimesFinished().get(key);

      return {
        title: game.title,
        editor: game.editor,
        timesFinished:
          updatedTimesFinished !== undefined
            ? updatedTimesFinished
            : game.timesFinished,
      };
    });

    if (gamesToExport.length === 0) {
      alert('Aucun jeu à exporter !');
      return;
    }

    const jsonContent = JSON.stringify(gamesToExport, null, 2);
    const fileName = `my-games-times-finished-${this.userId()}-${new Date().getTime()}.json`;

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
