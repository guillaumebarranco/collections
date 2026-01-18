import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Game } from '../../../../models/game-model';
import { getGamesByUser } from '../../../../facades/games/games.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

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
  isSaving = signal(false);

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

  async saveGamesTimesFinished(): Promise<void> {
    if (this.isSaving()) return;

    const gamesToUpdate = this.allGames().map((game) => ({
      title: game.title,
      editor: game.editor,
      timesFinished: this.getTimesFinished(game),
    }));

    if (gamesToUpdate.length === 0) {
      alert('Aucun jeu à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/games/batch-times-finished`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: this.userId(),
            games: gamesToUpdate,
          }),
        }
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('games:batch-times-finished:error', payload);
        alert("La mise à jour des jeux a échoué.");
        return;
      }

      this.navigateToEntityList('games');
    } catch (error) {
      console.warn('games:batch-times-finished:error', error);
      alert("La mise à jour des jeux a échoué.");
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.refreshGames();
  }

  private async refreshGames() {
    const games = await getGamesByUser(this.userId());
    this.allGames.set(games);
  }

}
