import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerieComponent } from '../../../components/serie/serie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
} from '../../../components/stats-display/stats-display.component';
import { Serie } from '../../../models/serie-model';
import {
  getTotalWatchingTime,
  getTotalDuration,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { getAllSeries } from '../../../facades/series.facade';

@Component({
  selector: 'app-series',
  imports: [
    RouterLink,
    CommonModule,
    SerieComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent {
  activatedRoute = inject(ActivatedRoute);

  selectedSort = signal<string>('rating');

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

  seriesList = signal<{ [key: string]: Serie[] }>(getAllSeries());

  allSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.seriesList()[params['id']]
      : this.seriesList()['guillaume'];
  });

  sortedSeries = computed<Serie[]>(() => {
    switch (this.selectedSort()) {
      case 'title':
        return this.allSeries().sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return this.allSeries().sort((a, b) => b.title.localeCompare(a.title));
      case 'releaseDate':
        return this.allSeries().sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
      case 'releaseDate-asc':
        return this.allSeries().sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
        );
      case 'rating':
        return this.allSeries().sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.timesWatched - a.timesWatched;
        });
      case 'rating-asc':
        return this.allSeries().sort((a, b) => {
          if (a.rating !== b.rating) {
            return a.rating - b.rating;
          }
          return b.timesWatched - a.timesWatched;
        });
      case 'timesWatched':
        return this.allSeries().sort((a, b) => b.timesWatched - a.timesWatched);
      case 'timesWatched-asc':
        return this.allSeries().sort((a, b) => a.timesWatched - b.timesWatched);
      case 'totalLength':
        return this.allSeries().sort((a, b) => b.totalLength - a.totalLength);
      case 'totalLength-asc':
        return this.allSeries().sort((a, b) => a.totalLength - b.totalLength);
      case 'nbSeasons':
        return this.allSeries().sort((a, b) => b.nbSeasons - a.nbSeasons);
      case 'nbSeasons-asc':
        return this.allSeries().sort((a, b) => a.nbSeasons - b.nbSeasons);
      case 'nbEpisodesTotal':
        return this.allSeries().sort(
          (a, b) => b.nbEpisodesTotal - a.nbEpisodesTotal
        );
      case 'nbEpisodesTotal-asc':
        return this.allSeries().sort(
          (a, b) => a.nbEpisodesTotal - b.nbEpisodesTotal
        );
      default:
        return this.allSeries().sort((a, b) => a.title.localeCompare(b.title));
    }
  });

  stats = computed<StatItem[]>(() => {
    const totalDuration = getTotalDuration(this.allSeries());
    const totalWatchingTime = getTotalWatchingTime(this.allSeries());

    return [
      {
        label: 'Durée totale de toutes les séries',
        value: totalDuration.formatted,
        icon: '📺',
        color: 'success',
      },
      {
        label: 'Temps total passé devant des séries',
        value: totalWatchingTime.formatted,
        icon: '⏱️',
        color: 'primary',
      },
    ];
  });

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  getSelectSeriesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-series` : '/select-series';
  }
}
