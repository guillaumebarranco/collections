import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Game } from '../../../../models/game-model';
import {
  getAllBaseGamesLight,
  getUserGamesRaw,
  getGamelistGamesRaw,
} from '../../../../facades/games/games.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddGameComponent } from '../../../add/add-game/add-game.component';
import { RequestEntityAddModalComponent } from '../../../../components/modals/request-entity-add-modal/request-entity-add-modal.component';
import { SelectEntityComponent } from '../../../../components/entity/select-entity/select-entity.component';
import { Router } from '@angular/router';
import { getApiBaseUrl } from '../../../../core/config';
import { getEmptyGame } from '../../../../helpers/empty-entities-helper';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';

@Component({
  selector: 'app-select-games',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-games.component.html',
  styleUrls: ['./select-games.component.scss', '../../select-base.scss'],
})
export class SelectGamesComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  userGames = signal<Game[]>([]);
  gamelistGames = signal<Game[]>([]);
  allGamesMergedList = signal<Game[]>([]);
  searchTerm = signal('');

  // Jeux déjà terminés par l'utilisateur (pour les exclure en mode ajout)
  finishedGames = computed<Set<string>>(() => {
    const userGames = this.userGames();
    return new Set(userGames.map((game) => this.getGameKey(game)));
  });

  /** Au moins un jeu terminé issu du catalogue — pour afficher l’ajout manuel. */
  hasPlayedGamesFromExistingCatalog = computed(() => {
    const catalogKeys = new Set(
      this.allGamesMergedList().map((g) => this.getGameKey(g))
    );
    return this.userGames().some((g) =>
      catalogKeys.has(this.getGameKey(g))
    );
  });

  alreadyInGamelistGames = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode()) {
      return new Set();
    }
    const gamelistGames = this.gamelistGames();
    return new Set(gamelistGames.map((game) => this.getGameKey(game)));
  });

  // Tous les jeux, filtrés en mode ajout
  allGames = computed<Game[]>(() => {
    const allGamesList = this.allGamesMergedList();

    if (!this.isWatchOrReadlistMode()) {
      return allGamesList.filter(
        (game) =>
          !this.finishedGames().has(this.getGameKey(game)) &&
          !this.alreadyInGamelistGames().has(this.getGameKey(game))
      );
    }

    return allGamesList.filter(
      (game) =>
        !this.finishedGames().has(this.getGameKey(game)) &&
        !this.alreadyInGamelistGames().has(this.getGameKey(game))
    );
  });

  filteredGames = computed<Game[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allGames();
    if (!normalizedTerm) return list;
    return list.filter((game) => {
      const title = normalizeSearchText(game.title ?? '');
      const editor = normalizeSearchText(game.editor ?? '');
      return title.includes(normalizedTerm) || editor.includes(normalizedTerm);
    });
  });

  selectedGames = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedGames().size);

  isSelected(game: Game): boolean {
    return this.selectedGames().has(this.getGameKey(game));
  }

  private getGameKey(game: Game): string {
    return `${game.title}-${game.editor}`;
  }

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

  openRequestEntityAddDialog(): void {
    this.dialog.open(RequestEntityAddModalComponent, {
      data: { entityType: 'game', userId: this.userId() },
      width: '480px',
      maxWidth: '95vw',
    });
  }

  openAddGameDialog(): void {
    const dialogRef = this.dialog.open(AddGameComponent, {
      data: { userId: this.userId(), listMode: this.listModeFlag() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/games`]);
      }
    });
  }

  async ngOnInit() {
    const userId = this.userId();
    const [games, gamelist, allGames] = await Promise.all([
      getUserGamesRaw(userId),
      getGamelistGamesRaw(userId),
      this.getAllGamesForSelection(userId),
    ]);
    this.userGames.set(games as Game[]);
    this.gamelistGames.set(gamelist as Game[]);
    this.allGamesMergedList.set(allGames);
  }

  private async getAllGamesForSelection(_userId: string): Promise<Game[]> {
    return (await getAllBaseGamesLight()).map(getEmptyGame);
  }

  protected async addSelectedGames(): Promise<void> {
    const selectedGamesList = this.allGames()
      .filter((game) => this.isSelected(game))
      .map((game) => {
        return {
          ...game,
          timesFinished: this.isWatchOrReadlistMode() ? 0 : 1,
          rating: 0,
          additionnalEstimatedTime: 0,
        };
      });

    const games = selectedGamesList.map((game) => ({
      title: game.title,
      editor: game.editor,
    }));

    if (games.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/games/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          games,
          gamelist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des jeux :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/games`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des jeux.", error);
    }
  }
}
