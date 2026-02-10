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
import { SerieComponent } from '../../../components/collections/serie/serie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { SeriesHeaderComponent } from './series-header/series-header.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Serie } from '../../../models/serie-model';
import { Quizz } from '../../../models/quizz-model';
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
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  getAllBaseSeries,
  getAllSeries,
  getAllWatchlistSeries,
  getOtherUsersSeriesRated,
} from '../../../facades/series/series.facade';
import { LocalStorageService } from '../../../services/local-storage.service';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { AuthService } from '../../../core/auth.service';
import { capitalizeFirstLetter } from '../../../utils/stats.utils';
import { getApiBaseUrl } from '../../../core/config';
import { getFullSerie } from '../../../helpers/full-entities-helper';

type RecommendationDetail = { userId: string; rating: number };
type RecommendedSerie = Serie & {
  recommendationDetails: RecommendationDetail[];
};

@Component({
  selector: 'app-series',
  imports: [
    CommonModule,
    FormsModule,
    SerieComponent,
    MenuComponent,
    QuizzModalComponent,
    SeriesHeaderComponent,
  ],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly authService = inject(AuthService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'series_view_preferences';

  selectedSort = signal<string>('rating');
  selectedView = signal<SerieView>('finished');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  sortOptions = signal<SortOption[]>(seriesSortOptions);

  viewOptions: { value: SerieView; label: string }[] = serieViewOptions;

  seriesList = signal<{ [key: string]: Serie[] }>({});
  watchingSeriesList = signal<{ [key: string]: Serie[] }>({});
  adminSeriesList = signal<Serie[]>([]);
  baseSeriesList = signal<Serie[]>([]);
  recommendations = signal<RecommendedSerie[]>([]);
  isLoadingRecommendations = signal<boolean>(false);
  recommendationsUserId = signal<string>('');

  constructor() {
    effect(() => {
      if (this.isLoadingPreferences || this.isAdminView()) return;
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
    if (this.isAdminView()) {
      return this.adminSeriesList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.seriesList()[params['id']] || []
      : this.seriesList()['guillaume'];
  });

  allWatchlistSeries = computed<Serie[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.watchingSeriesList()[params['id']] || []
      : this.watchingSeriesList()['guillaume'];
  });

  filteredSeries = computed<Serie[]>(() => {
    let series: Serie[] = [];
    if (this.isAdminView()) {
      series = this.allSeries();
    } else if (this.selectedView() === 'watchlist') {
      series = this.allWatchlistSeries();
    } else if (this.selectedView() === 'owned') {
      series = this.allSeries().filter((serie) => serie.owned);
    } else if (this.selectedView() === 'toReWatch') {
      series = this.allSeries().filter((serie) => serie.wantToWatchAgain === true);
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
    this.selectedView() === 'watchlist'
      ? getSortedSeries([...this.filteredSeries()], 'watchPriority')
      : getSortedSeries([...this.filteredSeries()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const seriesToUse = this.filteredSeries();

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
      this.viewOptions.some((opt) => opt.value === parsed.view)
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
    if (this.isAdminView()) {
      this.selectedView.set('finished');
    }
    void this.refreshQuizzs();
    this.loadViewPreferencesFromStorage();
    void this.refreshSeries();
  }

  async refreshSeries() {
    if (this.isAdminView()) {
      const baseSeries = await getAllBaseSeries();
      const series = baseSeries.map(getFullSerie);
      this.adminSeriesList.set(series);
      this.baseSeriesList.set(series);
      return;
    }

    const userId = this.getActiveUserId();
    const [series, watchlist, baseSeries] = await Promise.all([
      getAllSeries(userId),
      getAllWatchlistSeries(userId),
      getAllBaseSeries(),
    ]);
    this.seriesList.set(series);
    this.watchingSeriesList.set(watchlist);
    this.baseSeriesList.set(baseSeries.map(getFullSerie));
  }

  private async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  public isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: SerieView) {
    this.selectedView.set(view);
    if (view === 'recommendations') {
      void this.loadRecommendations();
    }
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  openQuizzModal(quizzs: Quizz[]) {
    if (!quizzs || quizzs.length === 0) return;
    this.activeQuizzs.set(quizzs);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal() {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
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

  async loadRecommendations() {
    if (this.isAdminView()) return;
    if (this.isLoadingRecommendations()) return;

    const userId = this.getActiveUserId();
    if (
      this.recommendationsUserId() === userId &&
      this.recommendations().length
    ) {
      return;
    }

    // S'assurer que baseSeriesList est chargé
    if (this.baseSeriesList().length === 0) {
      await this.refreshSeries();
    }

    this.isLoadingRecommendations.set(true);
    try {
      const othersRated = await getOtherUsersSeriesRated(userId, 4);

      const detailsMap = new Map<string, Map<string, number>>();
      for (const serie of othersRated) {
        const key = `${serie.title}|${serie.director}`;
        const userMap = detailsMap.get(key) ?? new Map<string, number>();
        const prev = userMap.get(serie.userId) ?? 0;
        if (serie.rating > prev) {
          userMap.set(serie.userId, serie.rating);
        }
        detailsMap.set(key, userMap);
      }

      const seenKeys = new Set(
        this.allSeries().map((serie) => this.getSerieIdentityKey(serie))
      );

      const recommended = this.baseSeriesList()
        .filter((serie) => {
          const key = this.getSerieIdentityKey(serie);
          return !seenKeys.has(key) && detailsMap.has(key);
        })
        .map((serie) => {
          const details = detailsMap.get(this.getSerieIdentityKey(serie));
          const recommendationDetails = details
            ? Array.from(details.entries()).map(([userId, rating]) => ({
                userId,
                rating,
              }))
            : [];
          return {
            ...serie,
            recommendationDetails,
          };
        })
        .sort((a, b) => {
          const detailsA = detailsMap.get(this.getSerieIdentityKey(a));
          const detailsB = detailsMap.get(this.getSerieIdentityKey(b));
          const countA = detailsA?.size ?? 0;
          const countB = detailsB?.size ?? 0;
          if (countB !== countA) return countB - countA;
          const maxA = detailsA ? Math.max(...detailsA.values()) : 0;
          const maxB = detailsB ? Math.max(...detailsB.values()) : 0;
          if (maxB !== maxA) return maxB - maxA;
          return a.title.localeCompare(b.title);
        });

      this.recommendations.set(recommended);
      this.recommendationsUserId.set(userId);
    } catch (error) {
      console.warn('series:recommendations:error', error);
    } finally {
      this.isLoadingRecommendations.set(false);
    }
  }

  recommendedSeries = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.recommendations();
    if (!term) return list;
    return list.filter((serie) => this.matchesSearch(serie, term));
  });

  getSerieIdentityKey(serie: Serie): string {
    return `${serie.title}|${serie.director}`;
  }

  getSerieRecommendationText(serie: Serie): string {
    const recommendationDetails =
      (serie as RecommendedSerie).recommendationDetails || [];
    if (recommendationDetails.length === 0) return '';

    const parts = recommendationDetails.map(
      (detail) =>
        `${capitalizeFirstLetter(detail.userId)} a donné ${detail.rating}★`
    );
    if (parts.length === 1) {
      return `${parts[0]} à cette série`;
    }
    return `${parts.slice(0, -1).join(', ')} et ${
      parts[parts.length - 1]
    } à cette série`;
  }

  serieAlreadyInUserWatchlist(serie: Serie): boolean {
    const watchlist = this.allWatchlistSeries();
    return watchlist.some(
      (s) => s.title === serie.title && s.director === serie.director
    );
  }

  addSerieToWatchlist(serie: Serie) {
    this.router.navigate(['/select-series'], {
      queryParams: {
        watchlist: 'true',
        title: serie.title,
        director: serie.director,
      },
    });
  }

  async updateWatchPriority(data: {
    serie: Serie;
    priority: number;
  }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/series`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: data.serie.title,
          director: data.serie.director,
          seasons: data.serie.seasons,
          owned: data.serie.owned,
          watchPriority: data.priority,
          wantToWatchAgain: data.serie.wantToWatchAgain ?? false,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          'Échec de la mise à jour de la priorité :',
          payload?.error || response.statusText
        );
        return;
      }

      await this.refreshSeries();
    } catch (error) {
      console.warn(
        'Erreur réseau lors de la mise à jour de la priorité.',
        error
      );
    }
  }

  async markSerieAsWantToReWatch(serie: Serie): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/series`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: serie.title,
          director: serie.director,
          seasons: serie.seasons,
          owned: serie.owned,
          watchPriority: serie.watchPriority ?? 1,
          wantToWatchAgain: true,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn('Échec marquer à revoir:', payload?.error || response.statusText);
        return;
      }
      await this.refreshSeries();
    } catch (error) {
      console.warn('Erreur réseau marquer série à revoir.', error);
    }
  }

  async markSerieAsReWatched(serie: Serie): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/series`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.getActiveUserId(),
          title: serie.title,
          director: serie.director,
          seasons: serie.seasons,
          owned: serie.owned,
          watchPriority: serie.watchPriority ?? 1,
          wantToWatchAgain: false,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn('Échec marquer revu:', payload?.error || response.statusText);
        return;
      }
      await this.refreshSeries();
    } catch (error) {
      console.warn('Erreur réseau marquer série revue.', error);
    }
  }
}
