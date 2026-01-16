import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Game } from '../../../../models/game-model';
import {
  getAllGamesMerged,
  getGamesByUser,
} from '../../../../facades/games/games.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddGameComponent } from '../../../add/add-game/add-game.component';
import { isLocalhost, getApiBaseUrl } from '../../../../core/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-games',
  imports: [CommonModule, MenuComponent, MatDialogModule],
  templateUrl: './select-games.component.html',
  styleUrls: ['./select-games.component.scss', '../../select-base.scss'],
})
export class SelectGamesComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);
  private router = inject(Router);

  userGames = signal<Game[]>([]);
  allGamesMergedList = signal<Game[]>([]);

  // Jeux déjà terminés par l'utilisateur (pour les exclure en mode ajout)
  finishedGames = computed<Set<string>>(() => {
    const userGames = this.userGames();
    return new Set(
      userGames.map((game) => this.getGameKey(game))
    );
  });

  // Tous les jeux, filtrés en mode ajout
  allGames = computed<Game[]>(() => {
    const allGamesList = this.allGamesMergedList();

    if (!this.isWatchOrReadlistMode()) {
      return allGamesList.filter(
        (game) => !this.finishedGames().has(this.getGameKey(game))
      );
    }

    return allGamesList.filter(
      (game) => !this.finishedGames().has(this.getGameKey(game))
    );
  });

  selectedGames = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedGames().size);

  isSelected(game: Game): boolean {
    return this.selectedGames().has(this.getGameKey(game));
  }

  private getGameKey(game: Game): string {
    return `${game.title}-${game.releaseDate}`;
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

  openAddGameDialog(): void {
    const dialogRef = this.dialog.open(AddGameComponent, {
      data: { userId: this.userId() },
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
    const games = await getGamesByUser(userId);
    const allGames = await this.getAllGamesForSelection(userId);
    this.userGames.set(games);
    this.allGamesMergedList.set(allGames);
  }

  private async getAllGamesForSelection(userId: string): Promise<Game[]> {
    if (isLocalhost()) {
      return getAllGamesMerged(userId);
    }
    try {
      const response = await fetch(`${getApiBaseUrl()}/games/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  protected async addSelectedGames(): Promise<void> {
    const selectedGamesList = this.allGames()
      .filter((game) => this.isSelected(game))
      .map((game) => {
        return {
          ...game,
          timesFinished: 1,
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
