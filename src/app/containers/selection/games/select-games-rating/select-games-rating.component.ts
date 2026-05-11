import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Game } from '../../../../models/game-model';
import { getGamesByUser } from '../../../../facades/games/games.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { StarInfo } from '../../../../models/various-model';
import { getRatingStars, ratingOptionsSelectPages } from '../../../../utils/constants';

@Component({
  selector: 'app-select-games-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-games-rating.component.html',
  styleUrls: ['./select-games-rating.component.scss', '../../select-base.scss'],
})
export class SelectGamesRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  isSaving = signal(false);
  allGames = signal<Game[]>([]);

  // Filtre : afficher uniquement les jeux sans note
  showOnlyUnrated = signal<boolean>(false);

  // Recherche textuelle (titre / éditeur)
  searchQuery = signal<string>('');

  // Jeux affichés selon les filtres actifs. Le filtre "sans note" se base
  // sur la note d'origine pour éviter qu'un jeu ne disparaisse de la liste
  // dès qu'il vient d'être noté pendant la session.
  displayedGames = computed<Game[]>(() => {
    let games = this.allGames();

    if (this.showOnlyUnrated()) {
      games = games.filter((game) => !game.rating);
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

  gamesRatings = signal<Map<string, number>>(new Map());

  readonly ratingOptions = ratingOptionsSelectPages;

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

  // Basculer le filtre des jeux sans note
  toggleShowOnlyUnrated(checked: boolean): void {
    this.showOnlyUnrated.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allGames().filter((game) => {
      const key = this.getGameKey(game);
      return this.gamesRatings().has(key);
    }).length;
  });

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }

  async saveGamesRatings(): Promise<void> {
    if (this.isSaving()) return;

    const gamesToUpdate = this.allGames().map((game) => ({
      title: game.title,
      editor: game.editor,
      rating: this.getRating(game),
    }));

    if (gamesToUpdate.length === 0) {
      alert('Aucun jeu à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/games/batch-rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId(),
          games: gamesToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('games:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('games');
    } catch (error) {
      console.warn('games:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
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

  // sauvegarde centralisée dans saveGamesRatings
}
