import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import {
  StatsDisplayComponent,
  StatItem,
} from '../../components/stats-display/stats-display.component';

import { mangas } from '../../utils/guillaume/mangas/mangas';
import { manwhas } from '../../utils/guillaume/mangas/manwhas';

import { series1, series2 } from '../../utils/guillaume/series';
import { games1, games2, games3, games4 } from '../../utils/guillaume/games';

import {
  books,
  booksFantasySaga,
  booksSaga,
} from '../../utils/guillaume/books';

import {
  moviesPage1,
  moviesPage2,
  moviesPage3,
  moviesPage4,
  moviesPage5,
  moviesPage6,
  moviesPage7,
  moviesPage8,
  moviesPage9,
  moviesMcu,
  moviesDc,
  moviesOtherSuperheroes,
  moviesLove1,
  moviesLove2,
  moviesAnimated1,
  moviesAnimated2,
  moviesSagaPage1,
  moviesSagaPage2,
  moviesSagaPage3,
  moviesSagaPage4,
  moviesSagaPage5,
} from '../../utils/guillaume/movies';
import { musics } from '../../utils/guillaume/musics';
import { ActivatedRoute, Params } from '@angular/router';
import { Book } from '../../models/book-model';
import { kevinBooks1, kevinBooks2 } from '../../utils/kevin/books';
import { Movie } from '../../models/movie-model';
import { Music } from '../../models/music-model';
import { williamMovies } from '../../utils/william/movies';
import { Game } from '../../models/game-model';
import { Serie } from '../../models/serie-model';
import { getTotalPagesRead, MINUTES_PER_PAGE } from '../../utils/stats.utils';

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MenuComponent, StatsDisplayComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  activatedRoute = inject(ActivatedRoute);

  booksList = signal<{ [key: string]: Book[] }>({
    guillaume: [...books, ...booksFantasySaga, ...booksSaga],
    kevin: [...kevinBooks1, ...kevinBooks2],
    william: [],
  });

  allBooks = computed<Book[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    return hasNameParam
      ? this.booksList()[params['id']]
      : this.booksList()['guillaume'];
  });

  moviesList = signal<{ [key: string]: Movie[] }>({
    guillaume: [
      ...moviesPage1,
      ...moviesPage2,
      ...moviesPage3,
      ...moviesPage4,
      ...moviesPage5,
      ...moviesPage6,
      ...moviesPage7,
      ...moviesPage8,
      ...moviesPage9,
      ...moviesSagaPage1,
      ...moviesSagaPage2,
      ...moviesSagaPage3,
      ...moviesSagaPage4,
      ...moviesSagaPage5,
      ...moviesLove1,
      ...moviesLove2,
      ...moviesMcu,
      ...moviesDc,
      ...moviesOtherSuperheroes,
      ...moviesAnimated1,
      ...moviesAnimated2,
    ],
    william: [...williamMovies],
    kevin: [],
  });

  allMovies = computed<Movie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.moviesList()[params['id']]
      : this.moviesList()['guillaume'];
  });

  seriesList = signal<{ [key: string]: Serie[] }>({
    guillaume: [...series1, ...series2],
    william: [],
    kevin: [],
  });

  allSeries = computed<Serie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.seriesList()[params['id']]
      : this.seriesList()['guillaume'];
  });

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

  mangasList = signal<{ [key: string]: any[] }>({
    guillaume: [...mangas],
    william: [],
    kevin: [],
  });

  allMangas = computed<any[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    const mangas = hasNameParam
      ? this.mangasList()[params['id']]
      : this.mangasList()['guillaume'];

    return mangas.map((manga) => ({
      title: manga._source.manga.frenchName || manga._source.manga.name,
      readTimes: manga._readTimes || 1,
      nbTomes: manga._source.manga.france.nbBooks || 0,
    }));
  });

  manwhasList = signal<{ [key: string]: any[] }>({
    guillaume: [...manwhas],
    william: [],
    kevin: [],
  });

  allManwhas = computed<any[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    const manwhas = hasNameParam
      ? this.manwhasList()[params['id']]
      : this.manwhasList()['guillaume'];

    return manwhas.map((manwha) => ({
      title: manwha._source.manga.frenchName || manwha._source.manga.name,
      readTimes: manwha._readTimes || 1,
      nbTomes: manwha._source.manga.france.nbBooks || 0,
    }));
  });

  musicsList = signal<{ [key: string]: Music[] }>({
    guillaume: [...musics],
    william: [],
    kevin: [],
  });

  allMusics = computed<Music[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.musicsList()[params['id']]
      : this.musicsList()['guillaume'];
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
      .map((serie) => ({
        ...serie,
        totalWatchingTime: (serie.totalLength / 60) * serie.timesWatched, // Convertir minutes en heures
        formattedWatchingTime: this.formatTime(
          (serie.totalLength / 60) * serie.timesWatched
        ),
      }))
      .sort((a, b) => b.timesWatched - a.timesWatched)
      .slice(0, 5);
  });

  topMangas = computed<any[]>(() => {
    return this.allMangas()
      .filter((manga) => manga.readTimes > 1)
      .map((manga) => ({
        ...manga,
        totalReadingTime: (manga.nbTomes * 30 * manga.readTimes) / 60, // 30 minutes par tome, converti en heures
        formattedReadingTime: this.formatTime(
          (manga.nbTomes * 30 * manga.readTimes) / 60
        ),
      }))
      .sort((a, b) => b.readTimes - a.readTimes)
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

    const manwhasTotalTomes = this.allManwhas().reduce(
      (sum, manwha) => sum + (manwha.nbTomes || 0) * (manwha.readTimes || 1),
      0
    );
    const manwhasTotalReadingTime = (manwhasTotalTomes * 30) / 60; // 30 minutes par tome, converti en heures

    const totalWatchingTime =
      this.allMovies().reduce(
        (sum, movie) => sum + (movie.length / 60) * movie.timesWatched,
        0
      ) +
      this.allSeries().reduce(
        (sum, serie) => sum + (serie.totalLength / 60) * serie.timesWatched,
        0
      );

    const gamesTotalTime = this.allGames().reduce(
      (sum, game) =>
        sum +
        game.averageTimeToFinish * game.timesFinished +
        game.additionnalEstimatedTime,
      0
    );

    const musicsTotalTime =
      this.allMusics().reduce(
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
        color: 'primary',
      },
      {
        label: 'Mangas lus',
        value: this.allMangas().length.toString(),
        icon: '📚',
        color: 'secondary',
      },
      {
        label: 'Manwhas lus',
        value: this.allManwhas().length.toString(),
        icon: '📖',
        color: 'info',
      },
      {
        label: 'Films vus',
        value: this.allMovies().length.toString(),
        icon: '🎬',
        color: 'warning',
      },
      {
        label: 'Séries vues',
        value: this.allSeries().length.toString(),
        icon: '📺',
        color: 'info',
      },
      {
        label: 'Jeux joués',
        value: this.allGames().length.toString(),
        icon: '🎮',
        color: 'success',
      },
      {
        label: 'Musiques écoutées',
        value: this.allMusics().length.toString(),
        icon: '🎵',
        color: 'warning',
      },
      {
        label: 'Temps total passé à lire (livres + mangas + manwhas)',
        value: this.formatTime(
          booksTotalReadingTime +
            mangasTotalReadingTime +
            manwhasTotalReadingTime
        ),
        icon: '📖',
        color: 'primary',
      },
      {
        label: 'Temps total passé à regarder (films + séries)',
        value: this.formatTime(totalWatchingTime),
        icon: '📺',
        color: 'success',
      },
      {
        label: 'Temps total passé à jouer',
        value: this.formatTime(gamesTotalTime),
        icon: '🎮',
        color: 'secondary',
      },
      {
        label: 'Temps total passé à écouter de la musique',
        value: this.formatTime(musicsTotalTime),
        icon: '🎵',
        color: 'warning',
      },
      {
        label: 'TEMPS TOTAL CUMULÉ (toutes activités)',
        value: this.formatTime(totalCumulativeTime),
        icon: '⏱️',
        color: 'danger',
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
}
