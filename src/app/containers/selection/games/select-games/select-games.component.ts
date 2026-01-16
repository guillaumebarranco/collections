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
import { isLocalhost } from '../../../../core/config';

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
  private isLoading = false;

  userGames = signal<Game[]>([]);
  allGamesMergedList = signal<Game[]>([]);

  watchedGames = computed<Set<string>>(() => {
    if (!this.isAddMode()) {
      return new Set();
    }
    const userGames = this.userGames();
    return new Set(
      userGames.map((game) => `${game.title}-${game.releaseDate}`)
    );
  });

  allGames = computed<Game[]>(() => {
    const allGamesList = this.allGamesMergedList();
    if (this.isAddMode()) {
      return allGamesList.filter(
        (game) => !this.watchedGames().has(`${game.title}-${game.releaseDate}`)
      );
    }
    return allGamesList;
  });

  selectedGames = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedGames().size);

  isAdding = signal<boolean>(false);
  addErrorMessage = signal<string>('');

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

  selectAll(): void {
    const allKeys = new Set(
      this.allGames().map((game) => this.getGameKey(game))
    );
    this.selectedGames.set(allKeys);
  }

  deselectAll(): void {
    this.selectedGames.set(new Set());
  }

  openAddGameDialog(): void {
    const dialogRef = this.dialog.open(AddGameComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        void this.loadGamesData();
      }
    });
  }

  async addSelectedGames(): Promise<void> {
    const selected = this.selectedGames();
    if (selected.size === 0) return;

    this.isAdding.set(true);
    this.addErrorMessage.set('');

    try {
      const games = this.allGames()
        .filter((game) => selected.has(this.getGameKey(game)))
        .map((game) => ({
          title: game.title,
          editor: game.editor,
        }));

      const response = await fetch(`${this.getApiUrl()}/games/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          games,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        this.addErrorMessage.set(payload?.error || "Erreur lors de l'ajout.");
        return;
      }

      this.selectedGames.set(new Set());
      await this.loadGamesData();
    } catch (error) {
      this.addErrorMessage.set("Erreur reseau lors de l'ajout.");
    } finally {
      this.isAdding.set(false);
    }
  }

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
      alert('Aucun jeu selectionne !');
      return;
    }

    const jsonContent = JSON.stringify(selectedGamesList, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-games-selection-${new Date().getTime()}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  ngOnInit() {
    void this.loadGamesData();
  }

  private async loadGamesData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const userId = this.userId();
    const games = await getGamesByUser(userId);
    const allGames = await this.getAllGamesForSelection(userId);
    this.userGames.set(games);
    this.allGamesMergedList.set(allGames);
    this.isLoading = false;
  }

  private async getAllGamesForSelection(userId: string): Promise<Game[]> {
    if (isLocalhost()) {
      return getAllGamesMerged(userId);
    }
    try {
      const response = await fetch(`${this.getApiUrl()}/games/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private getApiUrl(): string {
    return document.location.origin.includes('localhost')
      ? `http://localhost:3001/api`
      : 'https://makya.webarranco.fr/api';
  }
}
