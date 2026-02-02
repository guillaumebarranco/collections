import {
  Component,
  computed,
  inject,
  signal,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerieComponent } from '../../../components/serie/serie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  ViewToggleComponent,
  ViewToggleOption,
} from '../../../components/view-toggle/view-toggle.component';
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
  SerieView,
  getSortedSeries,
  serieViewOptions,
  seriesSortOptions,
} from './series.utils';
import { formatTimeStats } from '../../../utils/stats.utils';
import {
  getSerieTotalLengthMinutes,
  getSerieWatchedLengthMinutes,
} from '../../../utils/series.utils';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import {
  getAllSeries,
  getAllWatchlistSeries,
} from '../../../facades/series/series.facade';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-series',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    SerieComponent,
    MenuComponent,
    ViewToggleComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly localStorageService = inject(LocalStorageService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'series_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<SerieView>('finished');
  searchTerm = signal<string>('');

  sortOptions = signal<SortOption[]>(seriesSortOptions);

  viewOptions: ViewToggleOption[] = serieViewOptions;

  seriesList = signal<{ [key: string]: Serie[] }>({});
  watchingSeriesList = signal<{ [key: string]: Serie[] }>({});

  constructor() {
    effect(() => {
      if (this.isLoadingPreferences) return;
      const preferences = {
        view: this.selectedView(),
        sort: this.selectedSort(),
      };
      this.localStorageService.setItem(
        this.viewPreferencesStorageKey,
        preferences
      );
    });
  }

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
    if (this.selectedView() === 'watchlist') {
      series = this.allWatchlistSeries();
    } else if (this.selectedView() === 'owned') {
      series = this.allSeries().filter((serie) => serie.owned);
    } else {
      series = this.allSeries();
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return series;
    }

    return series.filter((serie) => this.matchesSearch(serie, term));
  });

  sortedSeries = computed<Serie[]>(() =>
    getSortedSeries([...this.filteredSeries()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    const seriesToUse = this.filteredSeries();

    console.log('seriesToUse', seriesToUse);

    const totalDurationMinutes = seriesToUse.reduce(
      (sum, serie) => sum + getSerieTotalLengthMinutes(serie),
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

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        view: SerieView;
        sort: string;
      }>
    >(this.viewPreferencesStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingPreferences = true;
    if (
      parsed.view &&
      ['finished', 'watchlist', 'owned'].includes(parsed.view)
    ) {
      this.selectedView.set(parsed.view);
    }
    if (
      parsed.sort &&
      this.sortOptions().some((opt) => opt.value === parsed.sort)
    ) {
      this.selectedSort.set(parsed.sort);
    }
    this.isLoadingPreferences = false;
  }

  ngOnInit() {
    this.loadViewPreferencesFromStorage();
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

  getSelectSeriesOwnedRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? `/${params['id']}/select-series-owned`
      : '/select-series-owned';
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
