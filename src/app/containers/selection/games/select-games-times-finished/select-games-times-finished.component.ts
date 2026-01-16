import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Game } from '../../../../models/game-model';
import { getGamesByUser } from '../../../../facades/games/games.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { isLocalhost } from '../../../../core/config';

@Component({
  selector: 'app-select-games-times-finished',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-games-times-finished.component.html',
  styleUrls: [
    './select-games-times-finished.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectGamesTimesFinishedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  allGames = signal<Game[]>([]);

  gamesTimesFinished = signal<Map<string, number>>(new Map());

  readonly timesFinishedOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  private getGameKey(game: Game): string {
    return `${game.title}-${game.editor}`;
  }

  getTimesFinished(game: Game): number {
    const key = this.getGameKey(game);
    const updatedValue = this.gamesTimesFinished().get(key);
    return updatedValue !== undefined ? updatedValue : game.timesFinished;
  }

  updateTimesFinished(game: Game, timesFinished: number): void {
    const key = this.getGameKey(game);
    const updated = new Map(this.gamesTimesFinished());
    updated.set(key, timesFinished);
    this.gamesTimesFinished.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allGames().filter((game) => {
      const key = this.getGameKey(game);
      return this.gamesTimesFinished().has(key);
    }).length;
  });

  async exportGamesTimesFinished(): Promise<void> {
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
      alert('Aucun jeu a exporter !');
      return;
    }

    if (isLocalhost()) {
      this.exportJson(gamesToExport, 'my-games-times-finished');
      return;
    }

    await this.saveGamesPayload(gamesToExport);
  }

  ngOnInit() {
    void this.refreshGames();
  }

  private async refreshGames() {
    const games = await getGamesByUser(this.userId());
    this.allGames.set(games);
  }

  private getApiUrl(): string {
    return document.location.origin.includes('localhost')
      ? `http://localhost:3001/api`
      : 'https://makya.webarranco.fr/api';
  }

  private exportJson(payload: object[], prefix: string) {
    const jsonContent = JSON.stringify(payload, null, 2);
    const fileName = `${prefix}-${this.userId()}-${new Date().getTime()}.json`;
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private async saveGamesPayload(payload: object[]) {
    const response = await fetch(`${this.getApiUrl()}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId(),
        games: payload,
      }),
    });

    if (!response.ok) {
      alert("Erreur lors de l'enregistrement.");
      return;
    }

    this.gamesTimesFinished.set(new Map());
    await this.refreshGames();
  }
}
