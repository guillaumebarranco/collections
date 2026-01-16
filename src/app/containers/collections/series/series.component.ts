import { Component, computed, inject, signal, OnInit } from '@angular/core';
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
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { Serie } from '../../../models/serie-model';
import {
  getTotalWatchingTime,
  getTotalDuration,
} from '../../../utils/stats.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { getAllSeries } from '../../../facades/series.facade';

type SerieView = 'finished' | 'stopped';

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
export class SeriesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);

  selectedSort = signal<string>('rating');
  selectedView = signal<SerieView>('finished');

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

  allSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.seriesList()[params['id']] || []
      : this.seriesList()['guillaume'];
  });

  filteredSeries = computed<Serie[]>(() => {
    if (this.selectedView() === 'stopped') {
      return this.allSeries().filter(
        (serie) => serie.stoppedAtSeason && serie.stoppedAtSeason > 0
      );
    }
    // 'finished' - séries avec stoppedAtSeason === 0 ou non défini
    return this.allSeries().filter(
      (serie) => !serie.stoppedAtSeason || serie.stoppedAtSeason === 0
    );
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
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.timesWatched - a.timesWatched;
        });
      case 'rating-asc':
        return seriesToSort.sort((a, b) => {
          if (a.rating !== b.rating) {
            return a.rating - b.rating;
          }
          return b.timesWatched - a.timesWatched;
        });
      case 'timesWatched':
        return seriesToSort.sort((a, b) => b.timesWatched - a.timesWatched);
      case 'timesWatched-asc':
        return seriesToSort.sort((a, b) => a.timesWatched - b.timesWatched);
      case 'totalLength':
        return seriesToSort.sort((a, b) => b.totalLength - a.totalLength);
      case 'totalLength-asc':
        return seriesToSort.sort((a, b) => a.totalLength - b.totalLength);
      case 'nbSeasons':
        return seriesToSort.sort((a, b) => b.nbSeasons - a.nbSeasons);
      case 'nbSeasons-asc':
        return seriesToSort.sort((a, b) => a.nbSeasons - b.nbSeasons);
      case 'nbEpisodesTotal':
        return seriesToSort.sort(
          (a, b) => b.nbEpisodesTotal - a.nbEpisodesTotal
        );
      case 'nbEpisodesTotal-asc':
        return seriesToSort.sort(
          (a, b) => a.nbEpisodesTotal - b.nbEpisodesTotal
        );
      default:
        return seriesToSort.sort((a, b) => a.title.localeCompare(b.title));
    }
  });

  stats = computed<StatItem[]>(() => {
    // Utiliser les séries filtrées pour les stats avec longueur effective
    const seriesToUse = this.filteredSeries();
    const seriesWithEffectiveLength = seriesToUse.map((serie) => ({
      ...serie,
      totalLength: Math.round(this.getEffectiveSerieLength(serie)),
    }));
    const totalDuration = getTotalDuration(seriesWithEffectiveLength);
    const totalWatchingTime = getTotalWatchingTime(seriesWithEffectiveLength);

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

  private getEffectiveSerieLength(serie: Serie): number {
    // Si stoppedAtSeason est 0, on utilise la longueur totale
    if (!serie.stoppedAtSeason || serie.stoppedAtSeason === 0) {
      return serie.totalLength;
    }
    // Sinon, on calcule proportionnellement : (stoppedAtSeason / nbSeasons) * totalLength
    if (serie.nbSeasons > 0) {
      return (serie.stoppedAtSeason / serie.nbSeasons) * serie.totalLength;
    }
    // Fallback si nbSeasons est 0 ou invalide
    return serie.totalLength;
  }

  ngOnInit() {
    void this.refreshSeries();
  }

  async refreshSeries() {
    const userId = this.getActiveUserId();
    const series = await getAllSeries(userId);
    this.seriesList.set(series);
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
}
