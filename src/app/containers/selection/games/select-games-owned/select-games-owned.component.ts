import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Game } from '../../../../models/game-model';
import { getGamesByUser } from '../../../../facades/games/games.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-games-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-games-owned.component.html',
  styleUrls: [
    './select-games-owned.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectGamesOwnedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  allGames = signal<Game[]>([]);
  isSaving = signal(false);

  // Filtre : afficher uniquement les jeux non possédés
  showOnlyNotOwned = signal<boolean>(false);

  // Recherche textuelle (titre / éditeur)
  searchQuery = signal<string>('');

  // Jeux affichés selon les filtres actifs. Le filtre "non possédé" se base
  // sur la valeur d'origine pour éviter qu'un jeu ne disparaisse dès qu'on
  // le marque comme possédé pendant la session.
  displayedGames = computed<Game[]>(() => {
    let games = this.allGames();

    if (this.showOnlyNotOwned()) {
      games = games.filter((game) => !game.owned);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      games = games.filter((game) => {
        if (game.title?.toLowerCase().includes(query)) return true;
        if (game.editor?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return games;
  });

  gamesOwned = signal<Map<string, boolean>>(new Map());

  private getGameKey(game: Game): string {
    return `${game.title}-${game.editor}`;
  }

  getOwned(game: Game): boolean {
    const key = this.getGameKey(game);
    const updatedValue = this.gamesOwned().get(key);
    return updatedValue !== undefined ? updatedValue : game.owned;
  }

  updateOwned(game: Game, owned: boolean): void {
    const key = this.getGameKey(game);
    const updated = new Map(this.gamesOwned());
    updated.set(key, owned);
    this.gamesOwned.set(updated);
  }

  // Basculer le filtre des jeux non possédés
  toggleShowOnlyNotOwned(checked: boolean): void {
    this.showOnlyNotOwned.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allGames().filter((game) => {
      const key = this.getGameKey(game);
      return this.gamesOwned().has(key);
    }).length;
  });

  async saveGamesOwned(): Promise<void> {
    if (this.isSaving()) return;

    const gamesToUpdate = this.allGames().map((game) => ({
      title: game.title,
      editor: game.editor,
      owned: this.getOwned(game),
    }));

    if (gamesToUpdate.length === 0) {
      alert('Aucun jeu à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/games/batch-owned`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId(),
          games: gamesToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('games:batch-owned:error', payload);
        alert("La mise à jour des possessions a échoué.");
        return;
      }

      this.navigateToEntityList('games');
    } catch (error) {
      console.warn('games:batch-owned:error', error);
      alert("La mise à jour des possessions a échoué.");
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
