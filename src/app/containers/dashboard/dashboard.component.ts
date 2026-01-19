import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
} from '../../components/stats-display/stats-display.component';
import { DashboardEntitiesStatsComponent } from '../../components/dashboard-entities-stats/dashboard-entities-stats.component';
import { DashboardUserTodosComponent } from '../../components/dashboard-user-todos/dashboard-user-todos.component';

import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Book } from '../../models/book-model';
import { Movie } from '../../models/movie-model';
import { Music } from '../../models/music-model';
import { Game } from '../../models/game-model';
import { Serie } from '../../models/serie-model';
import {
  getTotalManwhasChaptersRead,
  getTotalPagesRead,
  MINUTES_PER_MANWHA_CHAPTER,
  MINUTES_PER_PAGE,
} from '../../utils/stats.utils';
import {
  getAllMovies,
  getAllWatchlistMovies,
} from '../../facades/movies/movies.facade';
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
import { Manwha } from '../../models/manwha-model';
import {
  getAllManwhas,
  getAllReadlistManwhas,
} from '../../facades/manwhas/manwhas.facade';

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
}

interface TopMusic extends Music {
  formattedListeningTime: string;
}

interface TopManga extends Manga {
  formattedReadingTime: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MenuComponent,
    StatsDisplayComponent,
    DashboardEntitiesStatsComponent,
    DashboardUserTodosComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  filledUserId = signal<string>('');
  selectedTab = signal<'overview' | 'entities' | 'top5'>('overview');

  booksList = signal<{ [key: string]: Book[] }>({});
  mangasList = signal<{ [key: string]: Manga[] }>({});
  moviesList = signal<{ [key: string]: Movie[] }>({});
  watchlistMoviesList = signal<{ [key: string]: Movie[] }>({});
  seriesList = signal<{ [key: string]: Serie[] }>({});
  watchlistSeriesList = signal<{ [key: string]: Serie[] }>({});
  gamesList = signal<{ [key: string]: Game[] }>({});

  manwhasList = signal<{ [key: string]: Manwha[] }>({});
  readlistManwhasList = signal<{ [key: string]: Manwha[] }>({});

  readlistBooksList = signal<{ [key: string]: Book[] }>({});
  musicsList = signal<{ [key: string]: Music[] }>({});
  readlistMangasList = signal<{ [key: string]: Manga[] }>({});

  userId = computed<string>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'];
  });

  allBooks = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? Boolean(this.booksList()[this.userId()])
        ? this.booksList()[this.userId()]
        : []
      : [];
  });

  allMovies = computed<Movie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.moviesList()[this.userId()])
        ? this.moviesList()[this.userId()]
        : []
      : [];
  });

  allWatchlistMovies = computed<Movie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.watchlistMoviesList()[this.userId()])
        ? this.watchlistMoviesList()[this.userId()]
        : []
      : [];
  });

  allSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.seriesList()[this.userId()])
        ? this.seriesList()[this.userId()]
        : []
      : [];
  });

  allWatchlistSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.watchlistSeriesList()[this.userId()])
        ? this.watchlistSeriesList()[this.userId()]
        : []
      : [];
  });

  allGames = computed<Game[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.gamesList()[this.userId()])
        ? this.gamesList()[this.userId()]
        : []
      : [];
  });

  allMangas = computed<Manga[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? Boolean(this.mangasList()[this.userId()])
        ? this.mangasList()[this.userId()]
        : []
      : [];
  });

  allReadlistMangas = computed<Manga[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.readlistMangasList()[this.userId()])
        ? this.readlistMangasList()[this.userId()]
        : []
      : [];
  });

  allManwhas = computed<Manwha[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.manwhasList()[this.userId()])
        ? this.manwhasList()[this.userId()]
        : []
      : [];
  });

  allReadlistManwhas = computed<Manwha[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.readlistManwhasList()[this.userId()])
        ? this.readlistManwhasList()[this.userId()]
        : []
      : [];
  });

  allMusics = computed<Music[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.musicsList()[this.userId()])
        ? this.musicsList()[this.userId()]
        : []
      : [];
  });

  allReadlistBooks = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? Boolean(this.readlistBooksList()[this.userId()])
        ? this.readlistBooksList()[this.userId()]
        : []
      : [];
  });

  userHasData = computed<boolean>(() => {
    return (
      this.allBooks().length > 0 ||
      this.allMangas().length > 0 ||
      this.allManwhas().length > 0 ||
      this.allMovies().length > 0 ||
      this.allSeries().length > 0 ||
      this.allGames().length > 0 ||
      this.allMusics().length > 0
    );
  });

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
        totalPlayedTime:
          game.averageTimeToFinish * game.timesFinished +
          game.additionnalEstimatedTime,
        formattedPlayedTime: this.formatTime(
          game.averageTimeToFinish * game.timesFinished +
            game.additionnalEstimatedTime
        ),
      }))
      .sort((a, b) => b.totalPlayedTime - a.totalPlayedTime)
      .slice(0, 5);
  });

  topSeries = computed<TopSerie[]>(() => {
    return this.allSeries()
      .filter((serie) => serie.timesWatched > 1)
      .map((serie) => {
        const effectiveLength = this.getEffectiveSerieLength(serie);
        return {
          ...serie,
          totalWatchingTime: (effectiveLength / 60) * serie.timesWatched, // Convertir minutes en heures
          formattedWatchingTime: this.formatTime(
            (effectiveLength / 60) * serie.timesWatched
          ),
        };
      })
      .sort((a, b) => b.timesWatched - a.timesWatched)
      .slice(0, 5);
  });

  topMangas = computed<TopManga[]>(() => {
    console.log(this.allMangas());
    return this.allMangas()
      .filter((manga) => manga.readTimes && manga.readTimes > 1)
      .map((manga) => ({
        ...manga,
        totalReadingTime:
          ((manga.nbTomes || 0) * 30 * (manga.readTimes || 1)) / 60, // 30 minutes par tome, converti en heures
        formattedReadingTime: this.formatTime(
          ((manga.nbTomes || 0) * 30 * (manga.readTimes || 1)) / 60
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

  stats = computed<StatItem[]>(() => {
    const booksTotalReadingTime =
      this.allBooks().length > 0
        ? (getTotalPagesRead(this.allBooks()) * MINUTES_PER_PAGE) / 60
        : 0;

    const mangasTotalTomes = this.allMangas().reduce(
      (sum, manga) => sum + (manga.nbTomes || 0) * (manga.readTimes || 1),
      0
    );
    const mangasTotalReadingTime = (mangasTotalTomes * 30) / 60; // 30 minutes par tome, converti en heures

    const manwhasTotalChapters = getTotalManwhasChaptersRead(this.allManwhas());
    const manwhasTotalReadingTime =
      (manwhasTotalChapters * MINUTES_PER_MANWHA_CHAPTER) / 60;

    const totalWatchingTime =
      this.allMovies().reduce(
        (sum, movie) => sum + (movie.length / 60) * movie.timesWatched,
        0
      ) +
      this.allSeries().reduce((sum, serie) => {
        const effectiveLength = this.getEffectiveSerieLength(serie);
        return sum + (effectiveLength / 60) * serie.timesWatched;
      }, 0);

    const gamesTotalTime = this.allGames().reduce(
      (sum, game) =>
        sum +
        game.averageTimeToFinish * game.timesFinished +
        game.additionnalEstimatedTime,
      0
    );

    const musicsTotalTime = this.allMusics().reduce(
      (sum, music) => sum + (music.duration / 3600) * music.timesListened,
      0
    );

    const totalCumulativeTime =
      booksTotalReadingTime +
      mangasTotalReadingTime +
      manwhasTotalReadingTime +
      totalWatchingTime +
      gamesTotalTime +
      musicsTotalTime;

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
      {
        label: 'Temps total passé à lire (livres + mangas + manwhas)',
        value: this.formatTime(
          booksTotalReadingTime +
            mangasTotalReadingTime +
            manwhasTotalReadingTime
        ),
        icon: '📖',
        color: StatItemColor.PRIMARY,
      },
      {
        label: 'Temps total passé à regarder (films + séries)',
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
        color: StatItemColor.DANGER,
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

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filledUserId.set(input.value);
  }

  onSubmit(): void {
    this.router.navigate([this.filledUserId().toLowerCase()]);
  }

  onTabChange(tab: 'overview' | 'entities' | 'top5'): void {
    this.selectedTab.set(tab);
  }

  ngOnInit() {
    this.loadMoviesData();
    this.loadWatchlistMoviesData();
    this.loadBooksData();
    this.loadReadlistBooksData();
    this.loadMangasData();
    this.loadReadlistMangasData();
    this.loadManwhasData();
    this.loadReadlistManwhasData();
    this.loadSeriesData();
    this.loadWatchlistSeriesData();
    this.loadGamesData();
    this.loadMusicsData();
  }

  private async loadMoviesData() {
    const userId = this.userId() || 'guillaume';
    const movies = await getAllMovies(userId);
    this.moviesList.set(movies);
  }

  private async loadWatchlistMoviesData() {
    const userId = this.userId() || 'guillaume';
    const movies = await getAllWatchlistMovies(userId);
    this.watchlistMoviesList.set(movies);
  }

  private async loadBooksData() {
    const userId = this.userId() || 'guillaume';
    const books = await getAllBooks(userId);
    this.booksList.set(books);
  }

  private async loadReadlistBooksData() {
    const userId = this.userId() || 'guillaume';
    const books = await getAllReadlistBooks(userId);
    this.readlistBooksList.set(books);
  }

  private async loadMangasData() {
    const userId = this.userId() || 'guillaume';
    const mangas = await getAllMangas(userId);
    this.mangasList.set(mangas);
  }

  private async loadReadlistMangasData() {
    const userId = this.userId() || 'guillaume';
    const mangas = await getAllReadlistMangas(userId);
    this.readlistMangasList.set(mangas);
  }

  private async loadManwhasData() {
    const userId = this.userId() || 'guillaume';
    const manwhas = await getAllManwhas(userId);
    this.manwhasList.set(manwhas);
  }

  private async loadReadlistManwhasData() {
    const userId = this.userId() || 'guillaume';
    const manwhas = await getAllReadlistManwhas(userId);
    this.readlistManwhasList.set(manwhas);
  }

  private async loadSeriesData() {
    const userId = this.userId() || 'guillaume';
    const series = await getAllSeries(userId);
    this.seriesList.set(series);
  }

  private async loadWatchlistSeriesData() {
    const userId = this.userId() || 'guillaume';
    const series = await getAllWatchlistSeries(userId);
    this.watchlistSeriesList.set(series);
  }

  private async loadGamesData() {
    const userId = this.userId() || 'guillaume';
    const games = await getAllGames(userId);
    this.gamesList.set(games);
  }

  private async loadMusicsData() {
    const userId = this.userId() || 'guillaume';
    const musics = await getAllMusics(userId);
    this.musicsList.set(musics);
  }
}
