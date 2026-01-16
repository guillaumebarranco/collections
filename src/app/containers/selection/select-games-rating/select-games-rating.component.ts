import { Component, signal, computed, OnInit } from '@angular/core';
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
export class SelectGamesRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  allGames = signal<Game[]>([]);

  gamesRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  private getGameKey(game: Game): string {
    return `${game.title}-${game.editor}`;
  }

  getRating(game: Game): number {
    const key = this.getGameKey(game);
    const updatedValue = this.gamesRatings().get(key);
    return updatedValue !== undefined ? updatedValue : game.rating;
  }

  updateRating(game: Game, rating: number): void {
    const key = this.getGameKey(game);
    const updated = new Map(this.gamesRatings());
    updated.set(key, rating);
    this.gamesRatings.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allGames().filter((game) => {
      const key = this.getGameKey(game);
      return this.gamesRatings().has(key);
    }).length;
  });

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

  async exportGamesRatings(): Promise<void> {
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
      alert('Aucun jeu a exporter !');
      return;
    }

    if (this.isLocalhost()) {
      this.exportJson(gamesToExport, 'my-games-rating');
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

  private isLocalhost(): boolean {
    return document.location.origin.includes('localhost');
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

    this.gamesRatings.set(new Map());
    await this.refreshGames();
  }
}
