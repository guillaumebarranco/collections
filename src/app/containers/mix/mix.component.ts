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
import { BdComponent } from '../../components/collections/bd/bd.component';
import { BookComponent } from '../../components/collections/book/book.component';
import { ComicComponent } from '../../components/collections/comic/comic.component';
import { GameComponent } from '../../components/collections/game/game.component';
import { MangaComponent } from '../../components/collections/manga/manga.component';
import { ManwhaComponent } from '../../components/collections/manwha/manwha.component';
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
import {
  getFullBd,
  getFullBook,
  getFullComic,
  getFullGame,
  getFullManwha,
  getFullManga,
  getFullMovie,
  getFullSerie,
} from '../../helpers/full-entities-helper';
import { BaseBd } from '../../models/bd-model';
import { BaseBook } from '../../models/book-model';
import { BaseComic } from '../../models/comic-model';
import { BaseGame } from '../../models/game-model';
import { BaseManwha } from '../../models/manwha-model';
import { BaseManga } from '../../models/manga-model';
import { BaseMovie } from '../../models/movie-model';
import { BaseSerie } from '../../models/serie-model';
import type { MovieFromEntityType } from '../../models/from-entity.model';
import { Bd } from '../../models/bd-model';
import { Book } from '../../models/book-model';
import { Comic } from '../../models/comic-model';
import { Game } from '../../models/game-model';
import { Manwha } from '../../models/manwha-model';
import { Manga } from '../../models/manga-model';
import { Movie } from '../../models/movie-model';
import { Serie } from '../../models/serie-model';
import { MixBaseWorksGalaxyComponent } from './mix-base-works-galaxy/mix-base-works-galaxy.component';

/** Premier niveau de navigation (peu d’onglets). */
export type MixPrimary =
  | 'sagasFilmsSeries'
  | 'worksWithMovieAdaptations'
  | 'moviesGroupedBySource'
  | 'gamesFromFilms'
  | 'baseWorksGalaxy';

/** Type d’œuvre source pour les vues « adaptations film » (second niveau). */
export type MixAdaptationSource =
  | 'book'
  | 'bd'
  | 'comic'
  | 'manga'
  | 'manwha'
  | 'game'
  | 'serie';

export const mixPrimaryOptions: ViewToggleOption[] = [
  { value: 'baseWorksGalaxy', label: 'Galaxie des œuvres' },
  { value: 'sagasFilmsSeries', label: 'Sagas films / séries' },
  { value: 'worksWithMovieAdaptations', label: 'Œuvres → leurs films' },
  { value: 'moviesGroupedBySource', label: 'Films par origine' },
  { value: 'gamesFromFilms', label: 'Jeux d’après un film' },
];

export const mixAdaptationSourceOptions: ViewToggleOption[] = [
  { value: 'book', label: 'Livre' },
  { value: 'bd', label: 'BD franco' },
  { value: 'comic', label: 'Comic US' },
  { value: 'manga', label: 'Manga' },
  { value: 'manwha', label: 'Manhwa' },
  { value: 'game', label: 'Jeu vidéo' },
  { value: 'serie', label: 'Série TV' },
];

export type BookWithAdaptations = {
  book: Book;
  movies: Movie[];
};

export type GameWithAdaptations = {
  game: Game;
  movies: Movie[];
};

export type BdWithAdaptations = {
  bd: Bd;
  movies: Movie[];
};

export type ComicWithAdaptations = {
  comic: Comic;
  movies: Movie[];
};

export type MangaWithAdaptations = {
  manga: Manga;
  movies: Movie[];
};

export type ManwhaWithAdaptations = {
  manwha: Manwha;
  movies: Movie[];
};

export type SerieWithFilmAdaptations = {
  serie: Serie;
  movies: Movie[];
};

export type MoviesBySource = {
  sourceKey: string;
  sourceLabel: string;
  movies: Movie[];
};

export type SagaFilmsSeries = {
  sagaName: string;
  sagaKey: string;
  movies: Movie[];
  series: Serie[];
};

export type GameFromFilmRow = {
  game: Game;
  sourceMovie: Movie | null;
};

@Component({
  selector: 'app-mix',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ViewToggleComponent,
    MixBaseWorksGalaxyComponent,
    BdComponent,
    BookComponent,
    ComicComponent,
    GameComponent,
    MangaComponent,
    ManwhaComponent,
    MovieComponent,
    SerieComponent,
  ],
  templateUrl: './mix.component.html',
  styleUrls: ['./mix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixComponent implements OnInit {
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

  readonly selectedPrimary = signal<MixPrimary>('baseWorksGalaxy');
  readonly selectedAdaptationSource = signal<MixAdaptationSource>('book');
  readonly isLoading = signal<boolean>(true);

  readonly primaryViewOptions = mixPrimaryOptions;
  readonly adaptationSourceOptions = mixAdaptationSourceOptions;

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
    () =>
      this.selectedPrimary() === 'worksWithMovieAdaptations' ||
      this.selectedPrimary() === 'moviesGroupedBySource'
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

  private groupMoviesBySourceFromMovies(
    list: Movie[],
    options?: { titleOnlyLabel?: boolean }
  ): MoviesBySource[] {
    const titleOnly = options?.titleOnlyLabel === true;
    const map = new Map<string, Movie[]>();
    for (const m of list) {
      if (!m.fromEntity) continue;
      const key = `${m.fromEntity.title}|${m.fromEntity.secondEntityKey}`;
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([sourceKey, movies]) => {
      const fe = movies[0]?.fromEntity;
      const title = fe?.title?.trim() ?? '';
      const second = fe?.secondEntityKey?.trim() ?? '';
      const sourceLabel = titleOnly || !second ? title : `${title} — ${second}`;
      return { sourceKey, sourceLabel, movies };
    });
  }

  readonly booksAdapted = computed<BookWithAdaptations[]>(() => {
    const books = this.baseBooks();
    const withFromEntityBook = this.baseMovies().filter(
      (m) => m.fromEntity != null && m.fromEntity.entityType === 'book'
    );
    const result: BookWithAdaptations[] = [];
    for (const baseBook of books) {
      const adaptations = withFromEntityBook.filter(
        (m) =>
          m.fromEntity!.title === baseBook.title &&
          m.fromEntity!.secondEntityKey === baseBook.author
      );
      if (adaptations.length > 0) {
        result.push({
          book: getFullBook(baseBook),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly moviesFromBooksBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('book'))
  );

  readonly moviesFromGamesBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('game'))
  );

  readonly moviesFromMangaBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('manga'), {
      titleOnlyLabel: true,
    })
  );

  readonly moviesFromManwhaBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('manwha'), {
      titleOnlyLabel: true,
    })
  );

  readonly moviesFromSeriesBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFullByEntityType('serie'))
  );

  readonly moviesFromBdsBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFromBdCatalogFull())
  );

  readonly moviesFromComicBooksBySource = computed(() =>
    this.groupMoviesBySourceFromMovies(this.moviesFromComicBooksFull(), {
      titleOnlyLabel: true,
    })
  );

  readonly gamesAdapted = computed<GameWithAdaptations[]>(() => {
    const games = this.baseGames();
    const movies = this.baseMovies();
    const withFromEntityGame = movies.filter(
      (m) => m.fromEntity != null && m.fromEntity.entityType === 'game'
    );
    const result: GameWithAdaptations[] = [];
    for (const baseGame of games) {
      const adaptations = withFromEntityGame.filter(
        (m) =>
          m.fromEntity!.title === baseGame.title &&
          m.fromEntity!.secondEntityKey === baseGame.editor
      );
      if (adaptations.length > 0) {
        result.push({
          game: getFullGame(baseGame),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly bdsAdapted = computed<BdWithAdaptations[]>(() => {
    const bds = this.baseBds();
    const movies = this.baseMovies();
    const result: BdWithAdaptations[] = [];
    for (const baseBd of bds) {
      const adaptations = movies.filter((m) => {
        const fe = m.fromEntity;
        if (!fe) return false;
        if (fe.entityType !== 'comic' && fe.entityType !== 'bd') return false;
        return (
          fe.title === baseBd.title && fe.secondEntityKey === baseBd.writer
        );
      });
      if (adaptations.length > 0) {
        result.push({
          bd: getFullBd(baseBd),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly comicBooksAdapted = computed<ComicWithAdaptations[]>(() => {
    const comics = this.baseComics();
    const movies = this.baseMovies();
    const withFromEntityComic = movies.filter(
      (m) => m.fromEntity != null && m.fromEntity.entityType === 'comic'
    );
    const result: ComicWithAdaptations[] = [];
    for (const baseComic of comics) {
      const adaptations = withFromEntityComic.filter(
        (m) =>
          m.fromEntity!.title === baseComic.title &&
          m.fromEntity!.secondEntityKey === baseComic.writer
      );
      if (adaptations.length > 0) {
        result.push({
          comic: getFullComic(baseComic),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly mangasAdapted = computed<MangaWithAdaptations[]>(() => {
    const mangas = this.baseMangas();
    const movies = this.baseMovies().filter(
      (m) => m.fromEntity?.entityType === 'manga'
    );
    const result: MangaWithAdaptations[] = [];
    for (const base of mangas) {
      const adaptations = movies.filter(
        (m) =>
          m.fromEntity!.title === base.title &&
          m.fromEntity!.secondEntityKey === base.author
      );
      if (adaptations.length > 0) {
        result.push({
          manga: getFullManga(base),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly manwhasAdapted = computed<ManwhaWithAdaptations[]>(() => {
    const manwhas = this.baseManwhas();
    const movies = this.baseMovies().filter(
      (m) => m.fromEntity?.entityType === 'manwha'
    );
    const result: ManwhaWithAdaptations[] = [];
    for (const base of manwhas) {
      const adaptations = movies.filter(
        (m) =>
          m.fromEntity!.title === base.title &&
          m.fromEntity!.secondEntityKey === base.author
      );
      if (adaptations.length > 0) {
        result.push({
          manwha: getFullManwha(base),
          movies: adaptations.map((m) => getFullMovie(m)),
        });
      }
    }
    return result;
  });

  readonly seriesWithFilmAdaptations = computed<SerieWithFilmAdaptations[]>(
    () => {
      const series = this.baseSeries();
      const movies = this.baseMovies().filter(
        (m) => m.fromEntity?.entityType === 'serie'
      );
      const result: SerieWithFilmAdaptations[] = [];
      for (const base of series) {
        const adaptations = movies.filter(
          (m) =>
            m.fromEntity!.title === base.title &&
            m.fromEntity!.secondEntityKey === base.director
        );
        if (adaptations.length > 0) {
          result.push({
            serie: getFullSerie(base),
            movies: adaptations.map((m) => getFullMovie(m)),
          });
        }
      }
      return result;
    }
  );

  /** Jeux dont l’œuvre source déclarée est un film (catalogue). */
  readonly gamesFromFilmsDetail = computed<GameFromFilmRow[]>(() => {
    const games = this.baseGames()
      .map((g) => getFullGame(g))
      .filter((g) => g.fromEntity?.entityType === 'movie');
    const movies = this.baseMovies().map((m) => getFullMovie(m));
    return games.map((game) => {
      const fe = game.fromEntity!;
      const sourceMovie =
        movies.find(
          (m) => m.title === fe.title && m.director === fe.secondEntityKey
        ) ?? null;
      return { game, sourceMovie };
    });
  });

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
    this.selectedPrimary.set(value as MixPrimary);
  }

  onAdaptationSourceChange(value: string): void {
    this.selectedAdaptationSource.set(value as MixAdaptationSource);
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
