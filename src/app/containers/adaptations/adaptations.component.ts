import {
  Component,
  OnInit,
  computed,
  signal,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MenuComponent } from '../../components/menu/menu.component';
import {
  ViewToggleComponent,
  type ViewToggleOption,
} from '../../components/shared/view-toggle/view-toggle.component';
import { MovieComponent } from '../../components/collections/movie/movie.component';
import { SerieComponent } from '../../components/collections/serie/serie.component';
import { getAllBaseBds } from '../../facades/bds/bds.facade';
import { getAllBaseBooks } from '../../facades/books/books.facade';
import { getAllBaseComics } from '../../facades/comics/comics.facade';
import { getAllBaseGames } from '../../facades/games/games.facade';
import { getAllBaseManwhas } from '../../facades/manwhas/manwhas.facade';
import { getAllBaseMangas } from '../../facades/mangas/mangas.facade';
import { getAllBaseMovies } from '../../facades/movies/movies.facade';
import { getAllBaseSeries } from '../../facades/series/series.facade';
import { AuthService } from '../../core/auth.service';
import { ImpersonateService } from '../../services/impersonate.service';
import { DEFAULT_USER_ID } from '../../utils/constants';
import { getFullMovie, getFullSerie } from '../../helpers/full-entities-helper';
import { BaseBd } from '../../models/bd-model';
import { BaseBook } from '../../models/book-model';
import { BaseComic } from '../../models/comic-model';
import { BaseGame } from '../../models/game-model';
import { BaseManwha } from '../../models/manwha-model';
import { BaseManga } from '../../models/manga-model';
import { BaseMovie } from '../../models/movie-model';
import { BaseSerie } from '../../models/serie-model';
import type { MovieFromEntityType } from '../../models/from-entity.model';
import { Movie } from '../../models/movie-model';
import { Serie } from '../../models/serie-model';
import { AdaptationsBaseWorksGalaxyComponent } from './adaptations-base-works-galaxy/adaptations-base-works-galaxy.component';

/** Premier niveau de navigation (peu d’onglets). */
export type AdaptationsPrimary =
  | 'sagasFilmsSeries'
  | 'moviesGroupedBySource'
  | 'baseWorksGalaxy';

/** Type d’œuvre source pour les vues « adaptations film » (second niveau). */
export type AdaptationsAdaptationSource =
  | 'book'
  | 'bd'
  | 'comic'
  | 'manga'
  | 'manwha'
  | 'game'
  | 'serie';

export const adaptationsPrimaryOptions: ViewToggleOption[] = [
  { value: 'baseWorksGalaxy', label: 'Galaxie des licences' },
  { value: 'sagasFilmsSeries', label: 'Sagas films / séries' },
  { value: 'moviesGroupedBySource', label: 'Films par origine' },
];

export const adaptationsAdaptationSourceOptions: ViewToggleOption[] = [
  { value: 'book', label: 'Livre' },
  { value: 'bd', label: 'BD' },
  { value: 'comic', label: 'Comics' },
  { value: 'manga', label: 'Manga' },
  { value: 'manwha', label: 'Manhwa' },
  { value: 'game', label: 'Jeu vidéo' },
  { value: 'serie', label: 'Série TV' },
];

export type SagaFilmsSeries = {
  sagaName: string;
  sagaKey: string;
  movies: Movie[];
  series: Serie[];
};

@Component({
  selector: 'app-adaptations',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ViewToggleComponent,
    AdaptationsBaseWorksGalaxyComponent,
    MovieComponent,
    SerieComponent,
  ],
  templateUrl: './adaptations.component.html',
  styleUrls: ['./adaptations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdaptationsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly impersonateService = inject(ImpersonateService);

  /** Incrémenté à chaque navigation pour recalculer l’utilisateur depuis l’URL (`/:id/...`). */
  private readonly routeUserRefreshNonce = signal(0);

  readonly baseBooks = signal<BaseBook[]>([]);
  readonly baseBds = signal<BaseBd[]>([]);
  readonly baseComics = signal<BaseComic[]>([]);
  readonly baseGames = signal<BaseGame[]>([]);
  readonly baseMangas = signal<BaseManga[]>([]);
  readonly baseManwhas = signal<BaseManwha[]>([]);
  readonly baseMovies = signal<BaseMovie[]>([]);
  readonly baseSeries = signal<BaseSerie[]>([]);

  readonly selectedPrimary = signal<AdaptationsPrimary>('baseWorksGalaxy');
  readonly selectedAdaptationSource =
    signal<AdaptationsAdaptationSource>('book');
  readonly isLoading = signal<boolean>(true);

  readonly primaryViewOptions = adaptationsPrimaryOptions;
  readonly adaptationSourceOptions = adaptationsAdaptationSourceOptions;

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.routeUserRefreshNonce.update((n) => n + 1));
  }

  /** Utilisateur dont on applique les collections (impersonation, route, auth, défaut). */
  readonly effectiveUserIdLower = computed(() => {
    this.routeUserRefreshNonce();
    this.impersonateService.impersonatedUserId();
    this.authService.userId();
    const imp = this.impersonateService.impersonatedUserId();
    if (imp) {
      return imp;
    }
    const routeId = this.getRouteUserIdFromRouter();
    if (routeId) {
      return routeId.toLowerCase();
    }
    const auth = this.authService.getAuthenticatedUserId();
    return auth ? auth.toLowerCase() : DEFAULT_USER_ID;
  });

  readonly showAdaptationSourceTabs = computed(
    () => this.selectedPrimary() === 'moviesGroupedBySource'
  );

  /** Sagas présentes à la fois dans les films et les séries. */
  readonly sagasFilmsSeries = computed<SagaFilmsSeries[]>(() => {
    const movies = this.baseMovies().map((m) => getFullMovie(m));
    const series = this.baseSeries().map((s) => getFullSerie(s));
    const movieSagaKeys = new Map<string, string>();
    for (const m of movies) {
      const trimmed = m.saga?.trim() ?? '';
      if (trimmed && !movieSagaKeys.has(trimmed.toLowerCase())) {
        movieSagaKeys.set(trimmed.toLowerCase(), trimmed);
      }
    }
    const seriesSagaKeys = new Set<string>();
    for (const s of series) {
      const trimmed = (s.saga?.trim() ?? '').toLowerCase();
      if (trimmed) seriesSagaKeys.add(trimmed);
    }
    const commonKeys = new Set<string>();
    for (const key of movieSagaKeys.keys()) {
      if (seriesSagaKeys.has(key)) commonKeys.add(key);
    }
    const result: SagaFilmsSeries[] = [];
    for (const key of commonKeys) {
      const displayName = movieSagaKeys.get(key) ?? key;
      const sagaMovies = movies.filter(
        (m) => (m.saga?.trim() ?? '').toLowerCase() === key
      );
      const sagaSeries = series.filter(
        (s) => (s.saga?.trim() ?? '').toLowerCase() === key
      );
      result.push({
        sagaName: displayName,
        sagaKey: key,
        movies: sagaMovies,
        series: sagaSeries,
      });
    }
    return result.sort((a, b) => {
      const totalA = a.movies.length + a.series.length;
      const totalB = b.movies.length + b.series.length;
      return totalB - totalA;
    });
  });

  private moviesFullByEntityType(t: MovieFromEntityType): Movie[] {
    return this.baseMovies()
      .filter((m) => m.fromEntity?.entityType === t)
      .map((m) => getFullMovie(m));
  }

  /** Films dont la source est une BD du catalogue (entityType bd ou comic assorti au catalogue BD). */
  private moviesFromBdCatalogFull(): Movie[] {
    const bdKeys = new Set(this.baseBds().map((b) => `${b.title}|${b.writer}`));
    return this.baseMovies()
      .filter((m) => {
        const fe = m.fromEntity;
        if (!fe) return false;
        if (fe.entityType !== 'comic' && fe.entityType !== 'bd') return false;
        return bdKeys.has(`${fe.title}|${fe.secondEntityKey}`);
      })
      .map((m) => getFullMovie(m));
  }

  /** Films dont la source est un comic US (catalogue comics). */
  private moviesFromComicBooksFull(): Movie[] {
    const comicKeys = new Set(
      this.baseComics().map((c) => `${c.title}|${c.writer}`)
    );
    return this.baseMovies()
      .filter((m) => {
        const fe = m.fromEntity;
        if (!fe || fe.entityType !== 'comic') return false;
        return comicKeys.has(`${fe.title}|${fe.secondEntityKey}`);
      })
      .map((m) => getFullMovie(m));
  }

  private sortMoviesByTitle(movies: Movie[]): Movie[] {
    return [...movies].sort((a, b) =>
      a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
    );
  }

  /** Liste plate des films dont la source déclarée est un livre (vue « par origine »). */
  readonly moviesAdaptedFromBooksFlat = computed(() =>
    this.sortMoviesByTitle(this.moviesFullByEntityType('book'))
  );

  readonly moviesAdaptedFromBdsFlat = computed(() =>
    this.sortMoviesByTitle(this.moviesFromBdCatalogFull())
  );

  readonly moviesAdaptedFromComicsFlat = computed(() =>
    this.sortMoviesByTitle(this.moviesFromComicBooksFull())
  );

  readonly moviesAdaptedFromMangasFlat = computed(() =>
    this.sortMoviesByTitle(this.moviesFullByEntityType('manga'))
  );

  readonly moviesAdaptedFromManwhasFlat = computed(() =>
    this.sortMoviesByTitle(this.moviesFullByEntityType('manwha'))
  );

  readonly moviesAdaptedFromGamesFlat = computed(() =>
    this.sortMoviesByTitle(this.moviesFullByEntityType('game'))
  );

  readonly moviesAdaptedFromSeriesFlat = computed(() =>
    this.sortMoviesByTitle(this.moviesFullByEntityType('serie'))
  );

  /**
   * Somme des effectifs affichés dans chaque onglet « Films par origine »
   * (livre, BD, comics, manga, manhwa, jeu, série TV).
   */
  readonly totalFilmsFromAdaptationSources = computed(
    () =>
      this.moviesAdaptedFromBooksFlat().length +
      this.moviesAdaptedFromBdsFlat().length +
      this.moviesAdaptedFromComicsFlat().length +
      this.moviesAdaptedFromMangasFlat().length +
      this.moviesAdaptedFromManwhasFlat().length +
      this.moviesAdaptedFromGamesFlat().length +
      this.moviesAdaptedFromSeriesFlat().length
  );

  /**
   * Texte d’info-bulle (attribut `title`) pour la source d’adaptation d’un film.
   */
  adaptationSourceTooltip(movie: Movie): string {
    const fe = movie.fromEntity;
    if (!fe) return '';
    const title = (fe.title ?? '').trim() || 'œuvre';
    const second = (fe.secondEntityKey ?? '').trim();
    switch (fe.entityType) {
      case 'book':
        return second
          ? `Adapté du livre ${title} écrit par ${second}`
          : `Adapté du livre ${title}`;
      case 'bd':
        return second
          ? `Adapté de la BD ${title} (${second})`
          : `Adapté de la BD ${title}`;
      case 'comic':
        return second
          ? `Adapté du comic ${title} (${second})`
          : `Adapté du comic ${title}`;
      case 'manga':
        return second
          ? `Adapté du manga ${title} de ${second}`
          : `Adapté du manga ${title}`;
      case 'manwha':
        return second
          ? `Adapté du manhwa ${title} de ${second}`
          : `Adapté du manhwa ${title}`;
      case 'game':
        return second
          ? `Adapté du jeu ${title} (${second})`
          : `Adapté du jeu ${title}`;
      case 'serie':
        return second
          ? `Adapté de la série ${title} (${second})`
          : `Adapté de la série ${title}`;
      default:
        return second ? `${title} — ${second}` : title;
    }
  }

  readonly collapsedSections = signal<Record<string, boolean>>({});

  toggleSection(key: string): void {
    this.collapsedSections.update((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  isSectionCollapsed(key: string): boolean {
    return Boolean(this.collapsedSections()[key]);
  }

  private getRouteUserIdFromRouter(): string | null {
    let route: ActivatedRoute | null = this.router.routerState.root;
    while (route) {
      const id = route.snapshot.params['id'];
      if (id) {
        return String(id);
      }
      route = route.firstChild;
    }
    return null;
  }

  ngOnInit(): void {
    void this.loadData();
  }

  onPrimaryChange(value: string): void {
    this.selectedPrimary.set(value as AdaptationsPrimary);
  }

  onAdaptationSourceChange(value: string): void {
    this.selectedAdaptationSource.set(value as AdaptationsAdaptationSource);
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [books, bds, comics, games, mangas, manwhas, movies, series] =
        await Promise.all([
          getAllBaseBooks(),
          getAllBaseBds(),
          getAllBaseComics(),
          getAllBaseGames(),
          getAllBaseMangas(),
          getAllBaseManwhas(),
          getAllBaseMovies(),
          getAllBaseSeries(),
        ]);
      this.baseBooks.set(books);
      this.baseBds.set(bds);
      this.baseComics.set(comics);
      this.baseGames.set(games);
      this.baseMangas.set(mangas);
      this.baseManwhas.set(manwhas);
      this.baseMovies.set(movies);
      this.baseSeries.set(series);
    } finally {
      this.isLoading.set(false);
    }
  }
}
