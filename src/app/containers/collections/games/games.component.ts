import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from '../../../components/game/game.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
} from '../../../components/stats-display/stats-display.component';
import { Game } from '../../../models/game-model';
import { games1, games2, games3, games4 } from '../../../utils/guillaume/games';
import {
  formatTimeStats,
  ItemWithGameLength,
  TimeStats,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

export function getTotalDuration(items: ItemWithGameLength[]): TimeStats {
  let totalHours = 0;
  for (const item of items) {
    const length = item.averageTimeToFinish;
    totalHours += length;
  }
  return formatTimeStats(totalHours * 60);
}

export function getTotalPlayedTime(items: ItemWithGameLength[]): TimeStats {
  let totalHours = 0;
  for (const item of items) {
    const length =
      item.averageTimeToFinish * item.timesFinished +
      item.additionnalEstimatedTime;
    if (length) {
      totalHours += length;
    } else {
      console.log(`Missing data for: ${item.title}`);
    }
  }
  return formatTimeStats(totalHours * 60);
}

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    GameComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent {
  activatedRoute = inject(ActivatedRoute);

  selectedSort = signal<string>('rating');

  sortOptions = signal<SortOption[]>([
    { value: 'title', label: 'Titre (A-Z)' },
    { value: 'title-desc', label: 'Titre (Z-A)' },
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

  gamesList = signal<{ [key: string]: Game[] }>({
    guillaume: [...games1, ...games2, ...games3, ...games4],
    william: [],
    kevin: [],
  });

  allGames = computed<Game[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.gamesList()[params['id']]
      : this.gamesList()['guillaume'];
  });

  sortedGames = computed<Game[]>(() => {
    switch (this.selectedSort()) {
      case 'title':
        return this.allGames().sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return this.allGames().sort((a, b) => b.title.localeCompare(a.title));
      case 'releaseDate':
        return this.allGames().sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
      case 'releaseDate-asc':
        return this.allGames().sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
        );
      case 'rating':
        return this.allGames().sort((a, b) => {
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
        return this.allGames().sort((a, b) => {
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
        return this.allGames().sort(
          (a, b) => b.timesFinished - a.timesFinished
        );
      case 'timesFinished-asc':
        return this.allGames().sort(
          (a, b) => a.timesFinished - b.timesFinished
        );
      case 'averageTimeToFinish':
        return this.allGames().sort(
          (a, b) => b.averageTimeToFinish - a.averageTimeToFinish
        );
      case 'averageTimeToFinish-asc':
        return this.allGames().sort(
          (a, b) => a.averageTimeToFinish - b.averageTimeToFinish
        );
      case 'totalPlayedTime':
        return this.allGames().sort((a, b) => {
          const totalTimeA =
            a.averageTimeToFinish * a.timesFinished +
            a.additionnalEstimatedTime;
          const totalTimeB =
            b.averageTimeToFinish * b.timesFinished +
            b.additionnalEstimatedTime;
          return totalTimeB - totalTimeA;
        });
      case 'totalPlayedTime-asc':
        return this.allGames().sort((a, b) => {
          const totalTimeA =
            a.averageTimeToFinish * a.timesFinished +
            a.additionnalEstimatedTime;
          const totalTimeB =
            b.averageTimeToFinish * b.timesFinished +
            b.additionnalEstimatedTime;
          return totalTimeA - totalTimeB;
        });
      default:
        return this.allGames().sort((a, b) => a.title.localeCompare(b.title));
    }
  });

  stats = computed<StatItem[]>(() => {
    const totalTime = getTotalDuration(this.allGames());
    const totalPlayTime = getTotalPlayedTime(this.allGames());

    return [
      {
        label: 'Temps total pour terminer tous les jeux',
        value: totalTime.formatted,
        icon: '🎮',
        color: 'success',
      },
      {
        label: 'Temps total passé à jouer',
        value: totalPlayTime.formatted,
        icon: '⏱️',
        color: 'primary',
      },
    ];
  });

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  getSelectGamesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-games` : '/select-games';
  }
}
