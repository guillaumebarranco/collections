import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Movie } from '../../models/movie-model';
import { Serie } from '../../models/serie-model';
import { Book } from '../../models/book-model';
import { Game } from '../../models/game-model';
import { Music } from '../../models/music-model';
import { getAllMovies } from '../../facades/movies/movies.facade';
import { getAllSeries } from '../../facades/series/series.facade';
import { getAllBooks } from '../../facades/books/books.facade';
import { getAllGames } from '../../facades/games/games.facade';
import { musics } from '../../utils/users/guillaume/musics';

export type EntityType = 'movies' | 'series' | 'books' | 'games' | 'musics';

interface TopStat {
  name: string;
  count: number;
}

interface EntityStats {
  topActors?: TopStat[];
  topDirectors?: TopStat[];
  topGenres?: TopStat[];
  topAuthors?: TopStat[];
  topSagas?: TopStat[];
  topEditors?: TopStat[];
  topPlatforms?: TopStat[];
  topArtists?: TopStat[];
}

@Component({
  selector: 'app-dashboard-entities-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-entities-stats.component.html',
  styleUrls: ['./dashboard-entities-stats.component.scss'],
})
export class DashboardEntitiesStatsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);

  selectedEntity = signal<EntityType>('movies');
  entities: EntityType[] = ['movies', 'series', 'books', 'games', 'musics'];

  moviesList = signal<{ [key: string]: Movie[] }>({});
  seriesList = signal<{ [key: string]: Serie[] }>({});
  booksList = signal<{ [key: string]: Book[] }>({});
  gamesList = signal<{ [key: string]: Game[] }>({});
  musicsList = signal<{ [key: string]: Music[] }>({
    guillaume: [...musics],
  });

  userId = computed<string>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'];
  });

  allMovies = computed<Movie[]>(() => {
    return this.moviesList()[this.userId()] || [];
  });

  allSeries = computed<Serie[]>(() => {
    return this.seriesList()[this.userId()] || [];
  });

  allBooks = computed<Book[]>(() => {
    return this.booksList()[this.userId()] || [];
  });

  allGames = computed<Game[]>(() => {
    return this.gamesList()[this.userId()] || [];
  });

  allMusics = computed<Music[]>(() => {
    return this.musicsList()[this.userId()] || [];
  });

  stats = computed<EntityStats>(() => {
    const entity = this.selectedEntity();

    switch (entity) {
      case 'movies':
        return this.getMoviesStats();
      case 'series':
        return this.getSeriesStats();
      case 'books':
        return this.getBooksStats();
      case 'games':
        return this.getGamesStats();
      case 'musics':
        return this.getMusicsStats();
      default:
        return {};
    }
  });

  private getMoviesStats(): EntityStats {
    const movies = this.allMovies();
    const uniqueMovies = Array.from(
      new Set(movies.map((m) => `${m.title}|${m.director}`))
    ).map((key) => {
      const [title, director] = key.split('|');
      return movies.find((m) => m.title === title && m.director === director)!;
    });

    // Acteurs les plus représentés
    const actorsCount: { [key: string]: number } = {};
    uniqueMovies.forEach((movie) => {
      movie.actors?.forEach((actor) => {
        if (actor.name && actor.name !== 'Inconnu') {
          actorsCount[actor.name] = (actorsCount[actor.name] || 0) + 1;
        }
      });
    });

    // Réalisateurs les plus représentés
    const directorsCount: { [key: string]: number } = {};
    uniqueMovies.forEach((movie) => {
      if (movie.director) {
        directorsCount[movie.director] =
          (directorsCount[movie.director] || 0) + 1;
      }
    });

    // Genres les plus représentés
    const genresCount: { [key: string]: number } = {};
    uniqueMovies.forEach((movie) => {
      if (movie.genre) {
        const genres = movie.genre.split(',').map((g) => g.trim());
        genres.forEach((genre) => {
          genresCount[genre] = (genresCount[genre] || 0) + 1;
        });
      }
    });

    return {
      topActors: this.sortAndLimit(actorsCount, 10),
      topDirectors: this.sortAndLimit(directorsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private getSeriesStats(): EntityStats {
    const series = this.allSeries();
    const uniqueSeries = Array.from(
      new Set(series.map((s) => `${s.title}|${s.director}`))
    ).map((key) => {
      const [title, director] = key.split('|');
      return series.find((s) => s.title === title && s.director === director)!;
    });

    // Acteurs les plus représentés
    const actorsCount: { [key: string]: number } = {};
    uniqueSeries.forEach((serie) => {
      serie.actors?.forEach((actor) => {
        if (actor.name && actor.name !== 'Inconnu') {
          actorsCount[actor.name] = (actorsCount[actor.name] || 0) + 1;
        }
      });
    });

    // Réalisateurs les plus représentés
    const directorsCount: { [key: string]: number } = {};
    uniqueSeries.forEach((serie) => {
      if (serie.director) {
        directorsCount[serie.director] =
          (directorsCount[serie.director] || 0) + 1;
      }
    });

    // Genres les plus représentés
    const genresCount: { [key: string]: number } = {};
    uniqueSeries.forEach((serie) => {
      if (serie.genre) {
        genresCount[serie.genre] = (genresCount[serie.genre] || 0) + 1;
      }
    });

    return {
      topActors: this.sortAndLimit(actorsCount, 10),
      topDirectors: this.sortAndLimit(directorsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private getBooksStats(): EntityStats {
    const books = this.allBooks();
    const uniqueBooks = Array.from(
      new Set(books.map((b) => `${b.title}|${b.author}`))
    ).map((key) => {
      const [title, author] = key.split('|');
      return books.find((b) => b.title === title && b.author === author)!;
    });

    // Auteurs les plus lus
    const authorsCount: { [key: string]: number } = {};
    uniqueBooks.forEach((book) => {
      if (book.author) {
        authorsCount[book.author] = (authorsCount[book.author] || 0) + 1;
      }
    });

    // Genres les plus représentés
    const genresCount: { [key: string]: number } = {};
    uniqueBooks.forEach((book) => {
      if (book.genre) {
        genresCount[book.genre] = (genresCount[book.genre] || 0) + 1;
      }
    });

    // Sagas les plus représentées
    const sagasCount: { [key: string]: number } = {};
    uniqueBooks.forEach((book) => {
      if (book.saga && book.saga !== '') {
        sagasCount[book.saga] = (sagasCount[book.saga] || 0) + 1;
      }
    });

    return {
      topAuthors: this.sortAndLimit(authorsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
      topSagas: this.sortAndLimit(sagasCount, 10),
    };
  }

  private getGamesStats(): EntityStats {
    const games = this.allGames();
    const uniqueGames = Array.from(
      new Set(games.map((g) => `${g.title}|${g.editor}`))
    ).map((key) => {
      const [title, editor] = key.split('|');
      return games.find((g) => g.title === title && g.editor === editor)!;
    });

    // Éditeurs les plus représentés
    const editorsCount: { [key: string]: number } = {};
    uniqueGames.forEach((game) => {
      if (game.editor) {
        editorsCount[game.editor] = (editorsCount[game.editor] || 0) + 1;
      }
    });

    // Plateformes les plus représentées
    const platformsCount: { [key: string]: number } = {};
    uniqueGames.forEach((game) => {
      if (game.platform) {
        platformsCount[game.platform] =
          (platformsCount[game.platform] || 0) + 1;
      }
    });

    // Sagas les plus représentées
    const sagasCount: { [key: string]: number } = {};
    uniqueGames.forEach((game) => {
      if (game.saga && game.saga !== '') {
        sagasCount[game.saga] = (sagasCount[game.saga] || 0) + 1;
      }
    });

    return {
      topEditors: this.sortAndLimit(editorsCount, 10),
      topPlatforms: this.sortAndLimit(platformsCount, 10),
      topSagas: this.sortAndLimit(sagasCount, 10),
    };
  }

  private getMusicsStats(): EntityStats {
    const musics = this.allMusics();
    const uniqueMusics = Array.from(
      new Set(musics.map((m) => `${m.title}|${m.artist}`))
    ).map((key) => {
      const [title, artist] = key.split('|');
      return musics.find((m) => m.title === title && m.artist === artist)!;
    });

    // Artistes les plus écoutés
    const artistsCount: { [key: string]: number } = {};
    uniqueMusics.forEach((music) => {
      if (music.artist) {
        artistsCount[music.artist] = (artistsCount[music.artist] || 0) + 1;
      }
    });

    // Genres les plus représentés
    const genresCount: { [key: string]: number } = {};
    uniqueMusics.forEach((music) => {
      if (music.genre) {
        genresCount[music.genre] = (genresCount[music.genre] || 0) + 1;
      }
    });

    return {
      topArtists: this.sortAndLimit(artistsCount, 10),
      topGenres: this.sortAndLimit(genresCount, 10),
    };
  }

  private sortAndLimit(
    counts: { [key: string]: number },
    limit: number
  ): TopStat[] {
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  }

  selectEntity(entity: EntityType): void {
    this.selectedEntity.set(entity);
  }

  getEntityLabel(entity: EntityType): string {
    const labels: { [key in EntityType]: string } = {
      movies: '🎬 Films',
      series: '📺 Séries',
      books: '📖 Livres',
      games: '🎮 Jeux',
      musics: '🎵 Musiques',
    };
    return labels[entity];
  }

  getStatsLabel(key: keyof EntityStats): string {
    const labels: { [key in keyof EntityStats]: string } = {
      topActors: 'Acteurs les plus représentés',
      topDirectors: 'Réalisateurs les plus représentés',
      topGenres: 'Genres les plus représentés',
      topAuthors: 'Auteurs les plus lus',
      topSagas: 'Sagas les plus représentées',
      topEditors: 'Éditeurs les plus représentés',
      topPlatforms: 'Plateformes les plus représentées',
      topArtists: 'Artistes les plus écoutés',
    };
    return labels[key] || key;
  }

  ngOnInit() {
    void this.loadGamesData();
    void this.loadMoviesData();
    void this.loadBooksData();
    void this.loadSeriesData();
  }

  private async loadMoviesData() {
    const userId = this.userId() || 'guillaume';
    const movies = await getAllMovies(userId);
    this.moviesList.set(movies);
  }

  private async loadBooksData() {
    const userId = this.userId() || 'guillaume';
    const books = await getAllBooks(userId);
    this.booksList.set(books);
  }

  private async loadSeriesData() {
    const userId = this.userId() || 'guillaume';
    const series = await getAllSeries(userId);
    this.seriesList.set(series);
  }

  private async loadGamesData() {
    const userId = this.userId() || 'guillaume';
    const games = await getAllGames(userId);
    this.gamesList.set(games);
  }
}
