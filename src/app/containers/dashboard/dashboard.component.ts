import {
  Component,
  computed,
  effect,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import {
  ViewToggleComponent,
  ViewToggleOption,
} from '../../components/shared/view-toggle/view-toggle.component';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
} from '../../components/shared/stats-display/stats-display.component';
import { DashboardEntitiesStatsComponent } from '../../components/dashboard/dashboard-entities-stats/dashboard-entities-stats.component';
import { DashboardEntityChartsComponent } from '../../components/dashboard/dashboard-entity-charts/dashboard-entity-charts.component';
import { DashboardUserTodosComponent } from '../../components/dashboard/dashboard-user-todos/dashboard-user-todos.component';
import { DashboardFeedComponent } from '../../components/dashboard/dashboard-feed/dashboard-feed.component';
import {
  DashboardRecordsComponent,
  type RecordsData,
} from '../../components/dashboard/dashboard-records/dashboard-records.component';
import { LoginComponent } from '../../components/login/login.component';
import { getAdminRecords } from '../../facades/admin/admin.facade';

import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { DEFAULT_USER_ID } from '../../utils/constants';
import { Book } from '../../models/book-model';
import { Movie } from '../../models/movie-model';
import { Music } from '../../models/music-model';
import { Game } from '../../models/game-model';
import { Serie } from '../../models/serie-model';
import { Comic } from '../../models/comic-model';
import { Bd } from '../../models/bd-model';
import {
  getTotalManwhasChaptersRead,
  getTotalPagesRead,
  MINUTES_PER_MANGA_TOME,
  MINUTES_PER_MANWHA_CHAPTER,
  MINUTES_PER_PAGE,
  getEstimatedBdReadingTime,
  getEstimatedComicsReadingTime,
} from '../../utils/stats.utils';
import {
  getSerieTotalTimesWatched,
  getSerieWatchedLengthMinutes,
} from '../../utils/series.utils';
import { buildBadgeThresholdStatsFromCollections } from '../../utils/badge-threshold-stats.collections';
import {
  getAllMovies,
  getAllWatchlistMovies,
} from '../../facades/movies/movies.facade';
import { allBaseMovies } from '../../facades/movies/local-movies.facade';
import {
  getAllSeries,
  getAllWatchlistSeries,
} from '../../facades/series/series.facade';
import {
  getAllBooks,
  getAllReadlistBooks,
} from '../../facades/books/books.facade';
import { getAllGames } from '../../facades/games/games.facade';
import { getAllMusics } from '../../facades/musics/musics.facade';
import { Manga } from '../../models/manga-model';
import {
  getAllMangas,
  getAllReadlistMangas,
} from '../../facades/mangas/mangas.facade';
import {
  getAllComics,
  getAllReadlistComics,
} from '../../facades/comics/comics.facade';
import { getAllBds, getAllReadlistBds } from '../../facades/bds/bds.facade';
import { Manwha } from '../../models/manwha-model';
import {
  getAllManwhas,
  getAllReadlistManwhas,
} from '../../facades/manwhas/manwhas.facade';
import { AuthService } from '../../core/auth.service';
import { getGameTimePlayed } from '../../utils/games.utils';
import { TopFiveService } from '../../services/top-five.service';
import { MatDialog } from '@angular/material/dialog';
import {
  FollowsModalComponent,
  type FollowsModalData,
} from '../../components/modals/follows-modal/follows-modal.component';
import { FeaturesModalComponent } from '../../components/modals/features-modal/features-modal.component';
import {
  ProfileBadgeModalComponent,
  type ProfileBadgeModalData,
} from '../../components/modals/profile-badge-modal/profile-badge-modal.component';
import { FollowsService } from '../../services/follows.service';
import { FeedService } from '../../services/feed.service';
import { ImpersonateService } from '../../services/impersonate.service';
import type { TopFiveEntityType } from '../../models/top-five-model';
import {
  findEntityByKey,
  getEntityDisplayLabel,
  type Entity,
} from '../../utils/top-five.utils';
import {
  fillBadgeProgressFromDefinitions,
  getBadgesDisplay,
  getBadgeDashboardTabKey,
  type BadgeDisplay,
  type BadgeDashboardTabKey,
  type BadgeThresholdStats,
} from '../../utils/users/badges';
import { BadgesService } from '../../services/badges.service';
import { ProfileBadgeService } from '../../services/profile-badge.service';

interface TopBook extends Book {
  formattedReadingTime: string;
}

interface TopMovie extends Movie {
  formattedWatchingTime: string;
}

interface TopGame extends Game {
  formattedPlayedTime: string;
}

interface TopSerie extends Serie {
  formattedWatchingTime: string;
  totalTimesWatched: number;
}

interface TopMusic extends Music {
  formattedListeningTime: string;
}

interface TopManga extends Manga {
  formattedReadingTime: string;
}

type BadgeGroup = {
  key: BadgeDashboardTabKey;
  label: string;
  badges: BadgeDisplay[];
};

@Component({
  selector: 'app-daloard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MenuComponent,
    ViewToggleComponent,
    StatsDisplayComponent,
    DashboardEntitiesStatsComponent,
    DashboardEntityChartsComponent,
    DashboardUserTodosComponent,
    DashboardFeedComponent,
    DashboardRecordsComponent,
    LoginComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  topFiveService = inject(TopFiveService);
  badgesService = inject(BadgesService);
  profileBadgeService = inject(ProfileBadgeService);
  private readonly dialog = inject(MatDialog);
  private readonly followsService = inject(FollowsService);
  private readonly feedService = inject(FeedService);
  private readonly impersonateService = inject(ImpersonateService);

  filledUserId = signal<string>('');
  selectedTab = signal<
    | 'overview'
    | 'entities'
    | 'charts'
    | 'top5stats'
    | 'top5personal'
    | 'badges'
    | 'records'
  >('overview');
  selectedBadgeEntity = signal<BadgeDashboardTabKey>('books');
  isAuthenticated = computed<boolean>(() => this.authService.isAuthenticated());
  isAdmin = computed<boolean>(() => this.authService.isAdmin());

  /** True si l'utilisateur connecté regarde son propre dashboard (peut gérer les comptes suivis). */
  isOwnUserDashboard = computed<boolean>(() => {
    const uid = this.userId();
    const auth = this.authService.getAuthenticatedUserId();
    return Boolean(uid && auth && uid.toLowerCase() === auth.toLowerCase());
  });

  tabOptions: ViewToggleOption[] = [
    { value: 'overview', label: "Vue d'ensemble" },
    { value: 'entities', label: 'Statistiques par entité' },
    { value: 'charts', label: 'Graphiques par entité' },
    { value: 'top5stats', label: 'Top 5 (statistiques)' },
    { value: 'top5personal', label: 'Top 5 personnel' },
    { value: 'badges', label: 'Badges' },
    { value: 'records', label: 'Records' },
  ];

  booksList = signal<{ [key: string]: Book[] }>({});
  mangasList = signal<{ [key: string]: Manga[] }>({});
  comicsList = signal<{ [key: string]: Comic[] }>({});
  bdsList = signal<{ [key: string]: Bd[] }>({});
  moviesList = signal<{ [key: string]: Movie[] }>({});
  watchlistMoviesList = signal<{ [key: string]: Movie[] }>({});
  seriesList = signal<{ [key: string]: Serie[] }>({});
  watchlistSeriesList = signal<{ [key: string]: Serie[] }>({});
  gamesList = signal<{ [key: string]: Game[] }>({});

  manwhasList = signal<{ [key: string]: Manwha[] }>({});
  readlistManwhasList = signal<{ [key: string]: Manwha[] }>({});

  readlistBooksList = signal<{ [key: string]: Book[] }>({});
  readlistComicsList = signal<{ [key: string]: Comic[] }>({});
  readlistBdsList = signal<{ [key: string]: Bd[] }>({});

  /** Données des records (top 3 par catégorie), chargées pour les admins. */
  recordsData = signal<RecordsData | null>(null);
  recordsLoading = signal<boolean>(false);
  musicsList = signal<{ [key: string]: Music[] }>({});
  readlistMangasList = signal<{ [key: string]: Manga[] }>({});

  /** Paramètres de la route en réactif pour que le contenu se mette à jour au changement d'URL (ex. clic "voir le profil"). */
  private routeParams = toSignal(this.activatedRoute.params, {
    initialValue: this.activatedRoute.snapshot.params as Params,
  });

  userId = computed<string>(() => {
    const params = this.routeParams();

    if (params['id']) {
      return params['id'];
    }

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/', this.authService.getAuthenticatedUserId()]);
      return '';
    }

    return '';
  });

  allBooks = computed<Book[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? Boolean(this.booksList()[this.userId()])
        ? this.booksList()[this.userId()]
        : []
      : [];
  });

  allMovies = computed<Movie[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.moviesList()[this.userId()])
        ? this.moviesList()[this.userId()]
        : []
      : [];
  });

  allWatchlistMovies = computed<Movie[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.watchlistMoviesList()[this.userId()])
        ? this.watchlistMoviesList()[this.userId()]
        : []
      : [];
  });

  allSeries = computed<Serie[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.seriesList()[this.userId()])
        ? this.seriesList()[this.userId()]
        : []
      : [];
  });

  allWatchlistSeries = computed<Serie[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.watchlistSeriesList()[this.userId()])
        ? this.watchlistSeriesList()[this.userId()]
        : []
      : [];
  });

  allGames = computed<Game[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.gamesList()[this.userId()])
        ? this.gamesList()[this.userId()]
        : []
      : [];
  });

  allMangas = computed<Manga[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? Boolean(this.mangasList()[this.userId()])
        ? this.mangasList()[this.userId()]
        : []
      : [];
  });

  allComics = computed<Comic[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.comicsList()[this.userId()])
        ? this.comicsList()[this.userId()]
        : []
      : [];
  });

  allBds = computed<Bd[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.bdsList()[this.userId()])
        ? this.bdsList()[this.userId()]
        : []
      : [];
  });

  allReadlistMangas = computed<Manga[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.readlistMangasList()[this.userId()])
        ? this.readlistMangasList()[this.userId()]
        : []
      : [];
  });

  allManwhas = computed<Manwha[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.manwhasList()[this.userId()])
        ? this.manwhasList()[this.userId()]
        : []
      : [];
  });

  allReadlistManwhas = computed<Manwha[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.readlistManwhasList()[this.userId()])
        ? this.readlistManwhasList()[this.userId()]
        : []
      : [];
  });

  allMusics = computed<Music[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.musicsList()[this.userId()])
        ? this.musicsList()[this.userId()]
        : []
      : [];
  });

  allReadlistBooks = computed<Book[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.readlistBooksList()[this.userId()])
        ? this.readlistBooksList()[this.userId()]
        : []
      : [];
  });

  allReadlistComics = computed<Comic[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.readlistComicsList()[this.userId()])
        ? this.readlistComicsList()[this.userId()]
        : []
      : [];
  });

  allReadlistBds = computed<Bd[]>(() => {
    const params: Params = this.routeParams();
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.readlistBdsList()[this.userId()])
        ? this.readlistBdsList()[this.userId()]
        : []
      : [];
  });

  userHasData = computed<boolean>(() => {
    return (
      this.allBooks().length > 0 ||
      this.allMangas().length > 0 ||
      this.allComics().length > 0 ||
      this.allBds().length > 0 ||
      this.allManwhas().length > 0 ||
      this.allMovies().length > 0 ||
      this.allSeries().length > 0 ||
      this.allGames().length > 0 ||
      this.allMusics().length > 0
    );
  });

  /** Feed des utilisateurs suivis (films/livres/séries des 30 derniers jours, max 5 par catégorie). */
  feedData = computed(() => {
    this.feedService.cache();
    return this.feedService.getFeed(this.userId() || DEFAULT_USER_ID);
  });

  /** Badges de l'utilisateur (débloqués et non débloqués), récupérés via l'API comme les Top 5. */
  userBadges = computed<BadgeDisplay[]>(() => {
    this.badgesService.cache();
    return getBadgesDisplay(
      this.badgesService.getBadges(this.userId() || DEFAULT_USER_ID)
    );
  });

  badgeEntityTabOptions = computed<ViewToggleOption[]>(() =>
    this.groupedUserBadges().map((g) => ({ value: g.key, label: g.label })),
  );

  groupedUserBadges = computed<BadgeGroup[]>(() => {
    const groups: Record<BadgeDashboardTabKey, BadgeDisplay[]> = {
      books: [],
      mangas: [],
      manwhas: [],
      comics: [],
      bds: [],
      movies: [],
      series: [],
      games: [],
      other: [],
    };
    for (const badge of this.userBadges()) {
      const tab = getBadgeDashboardTabKey(badge.id, badge.image);
      groups[tab].push(badge);
    }

    const orderedGroups: BadgeGroup[] = [
      { key: 'books', label: '📖 Livres', badges: groups.books },
      { key: 'movies', label: '🎬 Films', badges: groups.movies },
      { key: 'series', label: '📺 Séries', badges: groups.series },
      { key: 'games', label: '🎮 Jeux', badges: groups.games },
      { key: 'mangas', label: '📗 Mangas', badges: groups.mangas },
      { key: 'bds', label: '🎨 BDs', badges: groups.bds },
      { key: 'comics', label: '💬 Comics', badges: groups.comics },
      { key: 'manwhas', label: '📘 Manwhas', badges: groups.manwhas },
      { key: 'other', label: '✨ Autres', badges: groups.other },
    ];
    return orderedGroups.filter((g) => g.badges.length > 0);
  });

  activeBadgeGroup = computed<BadgeGroup | null>(() => {
    const groups = this.groupedUserBadges();
    if (groups.length === 0) return null;
    return (
      groups.find((g) => g.key === this.selectedBadgeEntity()) ?? groups[0]
    );
  });

  selectBadgeEntity(entity: BadgeDashboardTabKey | string): void {
    this.selectedBadgeEntity.set(entity as BadgeDashboardTabKey);
  }

  private getWatchedSagaCount(sagaName: string): number {
    const watched = new Set(
      this.allMovies().map((m) => `${m.title}|${m.director}`)
    );
    const sagaMovies = allBaseMovies.filter(
      (m) => (m.saga || '').trim() === sagaName
    );
    if (sagaMovies.length === 0) {
      return 0;
    }
    return sagaMovies.filter((m) => watched.has(`${m.title}|${m.director}`))
      .length;
  }

  badgeProgressById = computed<Record<string, string>>(() => {
    const stats: BadgeThresholdStats = buildBadgeThresholdStatsFromCollections({
      books: this.allBooks(),
      movies: this.allMovies(),
      games: this.allGames(),
      series: this.allSeries(),
      mangas: this.allMangas(),
      manwhas: this.allManwhas(),
      comics: this.allComics(),
      bds: this.allBds(),
    });

    const progress: Record<string, string> = {
      'vengeurs-de-la-terre': `${this.getWatchedSagaCount(
        'Marvel Cinematic Universe'
      )}/${
        allBaseMovies.filter(
          (m) => (m.saga || '').trim() === 'Marvel Cinematic Universe'
        ).length
      }`,
      'badges-des-trois-sorciers': `${this.getWatchedSagaCount(
        'Wizarding World'
      )}/${
        allBaseMovies.filter((m) => (m.saga || '').trim() === 'Wizarding World')
          .length
      }`,
      'guerrier-de-la-terre-du-milieu': `${this.getWatchedSagaCount(
        'Tolkien'
      )}/${
        allBaseMovies.filter((m) => (m.saga || '').trim() === 'Tolkien').length
      }`,
      'membre-de-l-ordre': `${this.getWatchedSagaCount('Star Wars')}/${
        allBaseMovies.filter((m) => (m.saga || '').trim() === 'Star Wars')
          .length
      }`,
    };

    fillBadgeProgressFromDefinitions(progress, stats);

    return progress;
  });

  getBadgeProgressText(badgeId: string): string {
    return this.badgeProgressById()[badgeId] ?? 'Progression indisponible';
  }

  private parseBadgeProgress(
    badgeId: string
  ): { current: number; target: number } | null {
    const raw = this.badgeProgressById()[badgeId] ?? '';
    const match = raw.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
    if (!match) {
      return null;
    }
    const current = Number(match[1]);
    const target = Number(match[2]);
    if (!Number.isFinite(current) || !Number.isFinite(target) || target <= 0) {
      return null;
    }
    return { current, target };
  }

  getBadgeProgressPercent(badgeId: string): number {
    const parsed = this.parseBadgeProgress(badgeId);
    if (!parsed) return 0;
    return Math.max(
      0,
      Math.min(100, Math.round((parsed.current / parsed.target) * 100))
    );
  }

  topBooks = computed<TopBook[]>(() => {
    return this.allBooks()
      .filter((book) => book.readTimes && book.readTimes > 1)
      .map((book) => ({
        ...book,
        totalReadingTime: ((book.pages || 0) * 2 * (book.readTimes || 1)) / 60, // 2 minutes par page, converti en heures
        formattedReadingTime: this.formatTime(
          ((book.pages || 0) * 2 * (book.readTimes || 1)) / 60
        ),
      }))
      .sort((a, b) => (b.readTimes || 0) - (a.readTimes || 0))
      .slice(0, 5);
  });

  topMovies = computed<TopMovie[]>(() => {
    return this.allMovies()
      .filter((movie) => movie.timesWatched > 1)
      .map((movie) => ({
        ...movie,
        totalWatchingTime: (movie.length / 60) * movie.timesWatched,
        formattedWatchingTime: this.formatTime(
          (movie.length / 60) * movie.timesWatched
        ),
      }))
      .sort((a, b) => b.timesWatched - a.timesWatched)
      .slice(0, 5);
  });

  topGames = computed<TopGame[]>(() => {
    return this.allGames()
      .map((game) => ({
        ...game,
        totalPlayedTime: getGameTimePlayed(game),
        formattedPlayedTime: this.formatTime(getGameTimePlayed(game)),
      }))
      .sort((a, b) => b.totalPlayedTime - a.totalPlayedTime)
      .slice(0, 5);
  });

  topSeries = computed<TopSerie[]>(() => {
    return this.allSeries()
      .filter((serie) => getSerieTotalTimesWatched(serie) > 1)
      .map((serie) => {
        const totalTimesWatched = getSerieTotalTimesWatched(serie);
        const watchedMinutes = getSerieWatchedLengthMinutes(serie);
        return {
          ...serie,
          totalWatchingTime: watchedMinutes / 60, // minutes -> heures
          formattedWatchingTime: this.formatTime(watchedMinutes / 60),
          totalTimesWatched,
        };
      })
      .sort((a, b) => b.totalTimesWatched - a.totalTimesWatched)
      .slice(0, 5);
  });

  topMangas = computed<TopManga[]>(() => {
    return this.allMangas()
      .filter((manga) => manga.readTimes && manga.readTimes > 1)
      .map((manga) => ({
        ...manga,
        totalReadingTime:
          ((manga.nbTomes || 0) *
            MINUTES_PER_MANGA_TOME *
            (manga.readTimes || 1)) /
          60, // 30 minutes par tome, converti en heures
        formattedReadingTime: this.formatTime(
          ((manga.nbTomes || 0) *
            MINUTES_PER_MANGA_TOME *
            (manga.readTimes || 1)) /
            60
        ),
      }))
      .sort((a, b) => (b.readTimes || 0) - (a.readTimes || 0))
      .slice(0, 5);
  });

  topMusics = computed<TopMusic[]>(() => {
    return this.allMusics()
      .filter((music) => music.timesListened > 1)
      .map((music) => ({
        ...music,
        totalListeningTime: (music.duration / 3600) * music.timesListened, // durée en secondes, converti en heures
        formattedListeningTime: this.formatTime(
          (music.duration / 3600) * music.timesListened
        ),
      }))
      .sort((a, b) => b.timesListened - a.timesListened)
      .slice(0, 5);
  });

  /** Top 5 personnel : récupération réactive depuis le service */
  topFive = computed(() => {
    this.topFiveService.cache();
    return this.topFiveService.getTopFive(this.userId() || DEFAULT_USER_ID);
  });

  /** Pour l’affichage du Top 5 personnel : chaque slot a un rang et un libellé (résolu depuis les listes) */
  personalTopFiveDisplay = computed<
    Record<TopFiveEntityType, { rank: number; label: string }[]>
  >(() => {
    const uid = this.userId() || DEFAULT_USER_ID;
    const tf = this.topFive();
    const resolve = (
      entityType: TopFiveEntityType,
      list: Entity[],
      keys: string[]
    ) =>
      keys.map((key, i) => {
        if (!key) return { rank: i + 1, label: '' };
        const entity = findEntityByKey(list, entityType, key);
        return {
          rank: i + 1,
          label: entity
            ? getEntityDisplayLabel(entityType, entity)
            : '(entrée supprimée)',
        };
      });

    return {
      books: resolve('books', this.allBooks() as Entity[], tf.books ?? []),
      movies: resolve('movies', this.allMovies() as Entity[], tf.movies ?? []),
      series: resolve('series', this.allSeries() as Entity[], tf.series ?? []),
      games: resolve('games', this.allGames() as Entity[], tf.games ?? []),
      mangas: resolve('mangas', this.allMangas() as Entity[], tf.mangas ?? []),
      manwhas: resolve(
        'manwhas',
        this.allManwhas() as Entity[],
        tf.manwhas ?? []
      ),
      bds: resolve('bds', this.allBds() as Entity[], tf.bds ?? []),
      comics: resolve('comics', this.allComics() as Entity[], tf.comics ?? []),
      musics: resolve('musics', this.allMusics() as Entity[], tf.musics ?? []),
    };
  });

  personalTopFiveLabels: Record<TopFiveEntityType, string> = {
    books: '📖 Livres',
    movies: '🎬 Films',
    series: '📺 Séries',
    games: '🎮 Jeux',
    mangas: '📚 Mangas',
    manwhas: '📖 Manwhas',
    comics: '🦸 Comics',
    bds: '📗 BD',
    musics: '🎵 Musiques',
  };

  personalTopFiveEntityTypes: TopFiveEntityType[] = [
    'books',
    'movies',
    'series',
    'games',
    'mangas',
    'manwhas',
    'comics',
    'bds',
    'musics',
  ];

  timeEntitiesStats = computed<StatItem[]>(() => {
    const booksTotalReadingTime =
      this.allBooks().length > 0
        ? (getTotalPagesRead(this.allBooks()) * MINUTES_PER_PAGE) / 60
        : 0;

    const mangasTotalTomes = this.allMangas().reduce(
      (sum, manga) => sum + (manga.nbTomes || 0) * (manga.readTimes || 1),
      0
    );
    const mangasTotalReadingTime = (mangasTotalTomes * 30) / 60; // 30 minutes par tome, converti en heures

    const comicsTotalReadingTime = getEstimatedComicsReadingTime(
      this.allComics()
    ).minutes;

    const bdsTotalReadingTime = getEstimatedBdReadingTime(
      this.allBds()
    ).minutes;

    const manwhasTotalChapters = getTotalManwhasChaptersRead(this.allManwhas());
    const manwhasTotalReadingTime =
      (manwhasTotalChapters * MINUTES_PER_MANWHA_CHAPTER) / 60;

    const totalWatchingTime =
      this.allMovies().reduce(
        (sum, movie) => sum + (movie.length / 60) * movie.timesWatched,
        0
      ) +
      this.allSeries().reduce((sum, serie) => {
        return sum + getSerieWatchedLengthMinutes(serie) / 60;
      }, 0);

    const gamesTotalTime = this.allGames().reduce(
      (sum, game) => sum + getGameTimePlayed(game),
      0
    );

    const musicsTotalTime = this.allMusics().reduce(
      (sum, music) => sum + (music.duration / 3600) * music.timesListened,
      0
    );

    const totalCumulativeTime =
      booksTotalReadingTime +
      mangasTotalReadingTime +
      comicsTotalReadingTime +
      bdsTotalReadingTime +
      manwhasTotalReadingTime +
      totalWatchingTime +
      gamesTotalTime +
      musicsTotalTime;

    return [
      {
        label: 'Temps total passé à lire',
        value: this.formatTime(
          booksTotalReadingTime +
            mangasTotalReadingTime +
            comicsTotalReadingTime +
            bdsTotalReadingTime +
            manwhasTotalReadingTime
        ),
        icon: '📖',
        color: StatItemColor.PRIMARY,
      },
      {
        label: 'Temps total passé en visionnage',
        value: this.formatTime(totalWatchingTime),
        icon: '📺',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé à jouer',
        value: this.formatTime(gamesTotalTime),
        icon: '🎮',
        color: StatItemColor.SECONDARY,
      },
      {
        label: 'Temps total passé à écouter de la musique',
        value: this.formatTime(musicsTotalTime),
        icon: '🎵',
        color: StatItemColor.WARNING,
      },
      {
        label: 'TEMPS TOTAL CUMULÉ (toutes activités)',
        value: this.formatTime(totalCumulativeTime),
        icon: '⏱️',
        color: StatItemColor.INFO,
      },
    ];
  });

  entitiesStats = computed<StatItem[]>(() => {
    return [
      {
        label: 'Livres lus',
        value: this.allBooks().length.toString(),
        icon: '📖',
        color: StatItemColor.PRIMARY,
      },
      {
        label: 'Mangas lus',
        value: this.allMangas().length.toString(),
        icon: '📚',
        color: StatItemColor.SECONDARY,
      },
      {
        label: 'Comics lus',
        value: this.allComics().length.toString(),
        icon: '🦸',
        color: StatItemColor.SECONDARY,
      },
      {
        label: 'BD lues',
        value: this.allBds().length.toString(),
        icon: '📗',
        color: StatItemColor.SECONDARY,
      },
      {
        label: 'Manwhas lus',
        value: this.allManwhas().length.toString(),
        icon: '📖',
        color: StatItemColor.INFO,
      },
      {
        label: 'Films vus',
        value: this.allMovies().length.toString(),
        icon: '🎬',
        color: StatItemColor.WARNING,
      },
      {
        label: 'Séries vues',
        value: this.allSeries().length.toString(),
        icon: '📺',
        color: StatItemColor.INFO,
      },
      {
        label: 'Jeux joués',
        value: this.allGames().length.toString(),
        icon: '🎮',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Musiques écoutées',
        value: this.allMusics().length.toString(),
        icon: '🎵',
        color: StatItemColor.WARNING,
      },
    ];
  });

  private formatTime(hours: number): string {
    if (hours >= 200) {
      const days = hours / 24;
      return `${days.toFixed(1)}j`;
    }
    return `${hours.toFixed(1)}h`;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filledUserId.set(input.value);
  }

  onSubmit(): void {
    const normalized = this.filledUserId().toLowerCase();
    this.authService.setAuthenticatedUserId(normalized);
    this.router.navigate([normalized]);
  }

  onTabChange(
    tab:
      | 'overview'
      | 'entities'
      | 'charts'
      | 'top5stats'
      | 'top5personal'
      | 'badges'
      | 'records'
  ): void {
    this.selectedTab.set(tab);
    if (tab === 'records' && this.isAdmin()) {
      void this.loadRecords();
    }
  }

  /** Charge les records (top 3 par nombre et par temps) via l'API dédiée /admin/records. */
  async loadRecords(): Promise<void> {
    if (!this.isAdmin()) return;
    this.recordsLoading.set(true);
    this.recordsData.set(null);
    try {
      const adminId =
        this.authService.getAuthenticatedUserId() || DEFAULT_USER_ID;
      const data = await getAdminRecords(adminId);
      this.recordsData.set(data);
    } finally {
      this.recordsLoading.set(false);
    }
  }

  openFollowsModal(): void {
    const uid = this.userId();
    if (!uid) return;
    this.dialog.open(FollowsModalComponent, {
      data: { userId: uid } satisfies FollowsModalData,
      width: '420px',
    });
  }

  openFeaturesModal(): void {
    this.dialog.open(FeaturesModalComponent, {
      width: '1024px',
    });
  }

  openProfileBadgeModal(): void {
    const uid = this.authService.getAuthenticatedUserId();
    if (!uid) return;
    this.dialog.open(ProfileBadgeModalComponent, {
      width: '480px',
      maxWidth: '95vw',
      data: { userId: uid } satisfies ProfileBadgeModalData,
    });
  }

  goToOwnDashboard(): void {
    this.impersonateService.clearImpersonation();
    const ownId = this.authService.getAuthenticatedUserId();
    if (ownId) {
      this.router.navigate([`/${ownId.toLowerCase()}/dashboard`]);
    }
  }

  constructor() {
    // Recharger les données à chaque changement d'utilisateur (navigation "voir le profil" ou premier chargement).
    effect(() => {
      const uid = this.userId();
      if (!uid) return;
      this.topFiveService.loadFromApi(uid);
      this.badgesService.loadFromApi(uid);
      if (this.isOwnUserDashboard()) {
        void this.followsService.loadFromApi(uid);
        void this.feedService.loadFromApi(uid);
      }
      void this.loadAllDashboardData();
    });

    effect(() => {
      const groups = this.groupedUserBadges();
      const selected = this.selectedBadgeEntity();
      if (groups.length === 0) return;
      if (!groups.some((g) => g.key === selected)) {
        this.selectedBadgeEntity.set(groups[0].key);
      }
    });
  }

  ngOnInit() {
    this.topFiveService.loadFromStorage();
    this.badgesService.loadFromStorage();
    this.profileBadgeService.loadFromStorage();
  }

  private loadAllDashboardData(): void {
    this.loadMoviesData();
    this.loadWatchlistMoviesData();
    this.loadBooksData();
    this.loadReadlistBooksData();
    this.loadMangasData();
    this.loadReadlistMangasData();
    this.loadComicsData();
    this.loadReadlistComicsData();
    this.loadBdsData();
    this.loadReadlistBdsData();
    this.loadManwhasData();
    this.loadReadlistManwhasData();
    this.loadSeriesData();
    this.loadWatchlistSeriesData();
    this.loadGamesData();
    this.loadMusicsData();
  }

  private async loadMoviesData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const movies = await getAllMovies(userId);
    this.moviesList.set(movies);
  }

  private async loadWatchlistMoviesData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const movies = await getAllWatchlistMovies(userId);
    this.watchlistMoviesList.set(movies);
  }

  private async loadBooksData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const books = await getAllBooks(userId);
    this.booksList.set(books);
  }

  private async loadReadlistBooksData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const books = await getAllReadlistBooks(userId);
    this.readlistBooksList.set(books);
  }

  private async loadMangasData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const mangas = await getAllMangas(userId);
    this.mangasList.set(mangas);
  }

  private async loadComicsData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const comics = await getAllComics(userId);
    this.comicsList.set(comics);
  }

  private async loadReadlistComicsData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const comics = await getAllReadlistComics(userId);
    this.readlistComicsList.set(comics);
  }

  private async loadBdsData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const bds = await getAllBds(userId);
    this.bdsList.set(bds);
  }

  private async loadReadlistBdsData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const bds = await getAllReadlistBds(userId);
    this.readlistBdsList.set(bds);
  }

  private async loadReadlistMangasData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const mangas = await getAllReadlistMangas(userId);
    this.readlistMangasList.set(mangas);
  }

  private async loadManwhasData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const manwhas = await getAllManwhas(userId);
    this.manwhasList.set(manwhas);
  }

  private async loadReadlistManwhasData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const manwhas = await getAllReadlistManwhas(userId);
    this.readlistManwhasList.set(manwhas);
  }

  private async loadSeriesData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const series = await getAllSeries(userId);
    this.seriesList.set(series);
  }

  private async loadWatchlistSeriesData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const series = await getAllWatchlistSeries(userId);
    this.watchlistSeriesList.set(series);
  }

  private async loadGamesData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const games = await getAllGames(userId);
    this.gamesList.set(games);
  }

  private async loadMusicsData() {
    const userId = this.userId() || DEFAULT_USER_ID;
    const musics = await getAllMusics(userId);
    this.musicsList.set(musics);
  }

  goToMoviesPage(): void {
    this.router.navigate([`/${this.userId()}/movies`]);
  }

  goToSeriesPage(): void {
    this.router.navigate([`/${this.userId()}/series`]);
  }

  goToBooksPage(): void {
    this.router.navigate([`/${this.userId()}/books`]);
  }

  goToGamesPage(): void {
    this.router.navigate([`/${this.userId()}/games`]);
  }
}
