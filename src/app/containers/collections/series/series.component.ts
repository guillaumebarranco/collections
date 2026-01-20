import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerieComponent } from '../../../components/serie/serie.component';
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
import { Serie } from '../../../models/serie-model';
import {
  formatTimeStats,
} from '../../../utils/stats.utils';
import {
  getSerieLengthUntilSeason,
  getSerieAverageRating,
  getSerieTotalEpisodes,
  getSerieTotalLengthMinutes,
  getSerieSeasonsCount,
  getSerieTotalTimesWatched,
  getSerieWatchedLengthMinutes,
} from '../../../utils/series.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import {
  getAllSeries,
  getAllWatchlistSeries,
} from '../../../facades/series/series.facade';

type SerieView = 'finished' | 'stopped' | 'watchlist';

@Component({
  selector: 'app-series',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    SerieComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);

  selectedSort = signal<string>('rating');
  selectedView = signal<SerieView>('finished');
  searchTerm = signal<string>('');

  sortOptions = signal<SortOption[]>([
    { value: 'title', label: 'Titre (A-Z)' },
    { value: 'title-desc', label: 'Titre (Z-A)' },
    { value: 'releaseDate', label: 'Date de sortie (récent)' },
    { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
    { value: 'rating', label: 'Note (élevée)' },
    { value: 'rating-asc', label: 'Note (faible)' },
    { value: 'timesWatched', label: 'Visionnages (élevé)' },
    { value: 'timesWatched-asc', label: 'Visionnages (faible)' },
    { value: 'totalLength', label: 'Durée (long)' },
    { value: 'totalLength-asc', label: 'Durée (court)' },
    { value: 'nbSeasons', label: 'Saisons (élevé)' },
    { value: 'nbSeasons-asc', label: 'Saisons (faible)' },
    { value: 'nbEpisodesTotal', label: 'Épisodes (élevé)' },
    { value: 'nbEpisodesTotal-asc', label: 'Épisodes (faible)' },
  ]);

  seriesList = signal<{ [key: string]: Serie[] }>({});
  watchingSeriesList = signal<{ [key: string]: Serie[] }>({});

  allSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.seriesList()[params['id']] || []
      : this.seriesList()['guillaume'];
  });

  allWatchlistSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.watchingSeriesList()[params['id']] || []
      : this.watchingSeriesList()['guillaume'];
  });

  filteredSeries = computed<Serie[]>(() => {
    let series: Serie[] = [];
    if (this.selectedView() === 'stopped') {
      series = this.allSeries().filter(
        (serie) => serie.stoppedAtSeason && serie.stoppedAtSeason > 0
      );
    } else if (this.selectedView() === 'watchlist') {
      series = this.allWatchlistSeries();
    } else {
      // 'finished' - séries avec stoppedAtSeason === 0 ou non défini
      series = this.allSeries().filter(
        (serie) => !serie.stoppedAtSeason || serie.stoppedAtSeason === 0
      );
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return series;
    }

    return series.filter((serie) => this.matchesSearch(serie, term));
  });

  sortedSeries = computed<Serie[]>(() => {
    const seriesToSort = [...this.filteredSeries()];
    switch (this.selectedSort()) {
      case 'title':
        return seriesToSort.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return seriesToSort.sort((a, b) => b.title.localeCompare(a.title));
      case 'releaseDate':
        return seriesToSort.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
      case 'releaseDate-asc':
        return seriesToSort.sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
        );
      case 'rating':
        return seriesToSort.sort((a, b) => {
          const ratingA = getSerieAverageRating(a);
          const ratingB = getSerieAverageRating(b);
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return getSerieTotalTimesWatched(b) - getSerieTotalTimesWatched(a);
        });
      case 'rating-asc':
        return seriesToSort.sort((a, b) => {
          const ratingA = getSerieAverageRating(a);
          const ratingB = getSerieAverageRating(b);
          if (ratingA !== ratingB) {
            return ratingA - ratingB;
          }
          return getSerieTotalTimesWatched(b) - getSerieTotalTimesWatched(a);
        });
      case 'timesWatched':
        return seriesToSort.sort(
          (a, b) => getSerieTotalTimesWatched(b) - getSerieTotalTimesWatched(a)
        );
      case 'timesWatched-asc':
        return seriesToSort.sort(
          (a, b) => getSerieTotalTimesWatched(a) - getSerieTotalTimesWatched(b)
        );
      case 'totalLength':
        return seriesToSort.sort(
          (a, b) =>
            getSerieTotalLengthMinutes(b) - getSerieTotalLengthMinutes(a)
        );
      case 'totalLength-asc':
        return seriesToSort.sort(
          (a, b) =>
            getSerieTotalLengthMinutes(a) - getSerieTotalLengthMinutes(b)
        );
      case 'nbSeasons':
        return seriesToSort.sort(
          (a, b) => getSerieSeasonsCount(b) - getSerieSeasonsCount(a)
        );
      case 'nbSeasons-asc':
        return seriesToSort.sort(
          (a, b) => getSerieSeasonsCount(a) - getSerieSeasonsCount(b)
        );
      case 'nbEpisodesTotal':
        return seriesToSort.sort(
          (a, b) => getSerieTotalEpisodes(b) - getSerieTotalEpisodes(a)
        );
      case 'nbEpisodesTotal-asc':
        return seriesToSort.sort(
          (a, b) => getSerieTotalEpisodes(a) - getSerieTotalEpisodes(b)
        );
      default:
        return seriesToSort.sort((a, b) => a.title.localeCompare(b.title));
    }
  });


  stats = computed<StatItem[]>(() => {
    const seriesToUse = this.filteredSeries();
    const totalDurationMinutes = seriesToUse.reduce(
      (sum, serie) =>
        sum + getSerieLengthUntilSeason(serie, serie.stoppedAtSeason),
      0
    );
    const totalWatchingMinutes = seriesToUse.reduce(
      (sum, serie) => sum + getSerieWatchedLengthMinutes(serie),
      0
    );
    const totalDuration = formatTimeStats(totalDurationMinutes);
    const totalWatchingTime = formatTimeStats(totalWatchingMinutes);

    return [
      {
        label: 'Durée totale de toutes les séries',
        value: totalDuration.formatted,
        icon: '📺',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé devant des séries',
        value: totalWatchingTime.formatted,
        icon: '⏱️',
        color: StatItemColor.PRIMARY,
      },
    ];
  });

  ngOnInit() {
    void this.refreshSeries();
  }

  async refreshSeries() {
    const userId = this.getActiveUserId();
    const [series, watchlist] = await Promise.all([
      getAllSeries(userId),
      getAllWatchlistSeries(userId),
    ]);
    this.seriesList.set(series);
    this.watchingSeriesList.set(watchlist);
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: SerieView) {
    this.selectedView.set(view);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }


  getSelectSeriesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-series` : '/select-series';
  }

  getSelectSeriesRatingRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-rating`
      : '/select-series-rating';
  }

  getSelectSeriesTimesWatchedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-times-watched`
      : '/select-series-times-watched';
  }

  private matchesSearch(serie: Serie, term: string): boolean {
    const actors = serie.actors?.map((actor) => actor.name).join(' ') || '';
    const haystack = [serie.title, serie.director, actors, serie.genre]
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
