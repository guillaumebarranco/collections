import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from '../../../components/game/game.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { Game } from '../../../models/game-model';
import {
  formatTimeStats,
  ItemWithGameLength,
  TimeStats,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import {
  getAllGames,
  getAllGamelistGames,
} from '../../../facades/games/games.facade';

import {
  getTotalTimeToFinishGames,
  getTotalPlayedTime,
  getTotalTimeToFinishGamesAtHundredPercent,
} from '../../../utils/games.utils';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    GameComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);

  selectedSort = signal<string>('rating');
  selectedView = signal<'played' | 'platined' | 'gamelist'>('played');
  searchTerm = signal<string>('');

  sortOptions = signal<SortOption[]>([
    { value: 'title', label: 'Titre (A-Z)' },
    { value: 'title-desc', label: 'Titre (Z-A)' },
    { value: 'platform', label: 'Plateforme (A-Z)' },
    { value: 'platform-desc', label: 'Plateforme (Z-A)' },
    { value: 'releaseDate', label: 'Date de sortie (récent)' },
    { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
    { value: 'rating', label: 'Note (élevée)' },
    { value: 'rating-asc', label: 'Note (faible)' },
    { value: 'timesFinished', label: 'Terminés (élevé)' },
    { value: 'timesFinished-asc', label: 'Terminés (faible)' },
    { value: 'averageTimeToFinish', label: 'Temps (long)' },
    { value: 'averageTimeToFinish-asc', label: 'Temps (court)' },
    { value: 'totalPlayedTime', label: 'Temps passé (élevé)' },
    { value: 'totalPlayedTime-asc', label: 'Temps passé (faible)' },
  ]);

  gamesList = signal<{ [key: string]: Game[] }>({});
  gamelistGamesList = signal<{ [key: string]: Game[] }>({});

  allGames = computed<Game[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamesList()[params['id']] || []
      : this.gamesList()['guillaume'];
  });

  allGamelistGames = computed<Game[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamelistGamesList()[params['id']] || []
      : this.gamelistGamesList()['guillaume'];
  });

  filteredGames = computed<Game[]>(() => {
    let games = this.allGames();
    if (this.selectedView() === 'gamelist') {
      games = this.allGamelistGames();
    } else if (this.selectedView() === 'platined') {
      games = this.allGames().filter((game) => game.platined);
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return games;
    }

    return games.filter((game) => this.matchesSearch(game, term));
  });

  platinedGames = computed<Game[]>(() => {
    return this.allGames().filter((game) => game.platined);
  });

  sortedGames = computed<Game[]>(() => {
    switch (this.selectedSort()) {
      case 'title':
        return this.filteredGames().sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      case 'title-desc':
        return this.filteredGames().sort((a, b) =>
          b.title.localeCompare(a.title)
        );
      case 'platform':
        return this.filteredGames().sort((a, b) => {
          const platformCompare = a.platform.localeCompare(b.platform);
          if (platformCompare !== 0) return platformCompare;
          return a.title.localeCompare(b.title);
        });
      case 'platform-desc':
        return this.filteredGames().sort((a, b) => {
          const platformCompare = b.platform.localeCompare(a.platform);
          if (platformCompare !== 0) return platformCompare;
          return a.title.localeCompare(b.title);
        });
      case 'releaseDate':
        return this.filteredGames().sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
      case 'releaseDate-asc':
        return this.filteredGames().sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
        );
      case 'rating':
        return this.filteredGames().sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          const totalTimeA =
            a.averageTimeToFinish * a.timesFinished +
            a.additionnalEstimatedTime;
          const totalTimeB =
            b.averageTimeToFinish * b.timesFinished +
            b.additionnalEstimatedTime;
          return totalTimeB - totalTimeA;
        });
      case 'rating-asc':
        return this.filteredGames().sort((a, b) => {
          if (a.rating !== b.rating) {
            return a.rating - b.rating;
          }
          const totalTimeA =
            a.averageTimeToFinish * a.timesFinished +
            a.additionnalEstimatedTime;
          const totalTimeB =
            b.averageTimeToFinish * b.timesFinished +
            b.additionnalEstimatedTime;
          return totalTimeB - totalTimeA;
        });
      case 'timesFinished':
        return this.filteredGames().sort(
          (a, b) => b.timesFinished - a.timesFinished
        );
      case 'timesFinished-asc':
        return this.filteredGames().sort(
          (a, b) => a.timesFinished - b.timesFinished
        );
      case 'averageTimeToFinish':
        return this.filteredGames().sort(
          (a, b) => b.averageTimeToFinish - a.averageTimeToFinish
        );
      case 'averageTimeToFinish-asc':
        return this.filteredGames().sort(
          (a, b) => a.averageTimeToFinish - b.averageTimeToFinish
        );
      case 'totalPlayedTime':
        return this.filteredGames().sort((a, b) => {
          const totalTimeA =
            a.averageTimeToFinish * a.timesFinished +
            a.additionnalEstimatedTime;
          const totalTimeB =
            b.averageTimeToFinish * b.timesFinished +
            b.additionnalEstimatedTime;
          return totalTimeB - totalTimeA;
        });
      case 'totalPlayedTime-asc':
        return this.filteredGames().sort((a, b) => {
          const totalTimeA =
            a.averageTimeToFinish * a.timesFinished +
            a.additionnalEstimatedTime;
          const totalTimeB =
            b.averageTimeToFinish * b.timesFinished +
            b.additionnalEstimatedTime;
          return totalTimeA - totalTimeB;
        });
      default:
        return this.filteredGames().sort((a, b) =>
          a.title.localeCompare(b.title)
        );
    }
  });

  stats = computed<StatItem[]>(() => {
    const totalTimeToFinishGames = getTotalTimeToFinishGames(
      this.filteredGames()
    );
    const totalTimeToFinishGamesAtHundredPercent =
      getTotalTimeToFinishGamesAtHundredPercent(this.filteredGames());
    const totalPlayTime = getTotalPlayedTime(this.filteredGames());
    const totalPlatines = this.filteredGames().filter(
      (game) => game.platined
    ).length;

    return [
      {
        label: 'Temps total pour terminer tous les jeux',
        value: totalTimeToFinishGames.formatted,
        icon: '🎮',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total pour platiner/100% tous les jeux',
        value: totalTimeToFinishGamesAtHundredPercent.formatted,
        icon: '🎮',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé à jouer',
        value: totalPlayTime.formatted,
        icon: '⏱️',
        color: StatItemColor.PRIMARY,
      },
      {
        label: 'Nombre de trophées platines (PlayStation)',
        value: `${totalPlatines}`,
        icon: '🏆',
        color: StatItemColor.WARNING,
      },
    ];
  });

  ngOnInit() {
    void this.refreshGames();
  }

  async refreshGames() {
    const userId = this.getActiveUserId();
    const [games, gamelist] = await Promise.all([
      getAllGames(userId),
      getAllGamelistGames(userId),
    ]);
    this.gamesList.set(games);
    this.gamelistGamesList.set(gamelist);
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: 'played' | 'platined' | 'gamelist') {
    this.selectedView.set(view);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  getSelectGamesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-games` : '/select-games';
  }

  getSelectGamesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-games-rating`
      : '/select-games-rating';
  }

  getSelectGamesTimesFinishedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-games-times-finished`
      : '/select-games-times-finished';
  }

  private matchesSearch(game: Game, term: string): boolean {
    const haystack = [
      game.title,
      game.editor,
      game.platform,
      game.saga,
      game.hero,
    ]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = this.normalizeSearchText(haystack);
    const normalizedTerm = this.normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
