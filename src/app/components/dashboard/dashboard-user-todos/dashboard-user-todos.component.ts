import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/book-model';
import { Manga } from '../../../models/manga-model';
import { Comic } from '../../../models/comic-model';
import { Bd } from '../../../models/bd-model';
import { Manwha } from '../../../models/manwha-model';
import { Movie } from '../../../models/movie-model';
import { Serie } from '../../../models/serie-model';
import { Game } from '../../../models/game-model';
import { Music } from '../../../models/music-model';

interface TodoItem {
  label: string;
  count: number;
}

interface TodoSection {
  title: string;
  items: TodoItem[];
}

interface EmptySection {
  title: string;
  message: string;
}

@Component({
  selector: 'app-dashboard-user-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-user-todos.component.html',
  styleUrls: ['./dashboard-user-todos.component.scss'],
})
export class DashboardUserTodosComponent {
  @Input() books: Book[] = [];
  @Input() mangas: Manga[] = [];
  @Input() comics: Comic[] = [];
  @Input() bds: Bd[] = [];
  @Input() manwhas: Manwha[] = [];
  @Input() movies: Movie[] = [];
  @Input() series: Serie[] = [];
  @Input() games: Game[] = [];
  @Input() musics: Music[] = [];
  @Input() watchlistMovies: Movie[] = [];
  @Input() watchlistSeries: Serie[] = [];
  @Input() readlistBooks: Book[] = [];
  @Input() readlistMangas: Manga[] = [];
  @Input() readlistComics: Comic[] = [];
  @Input() readlistBds: Bd[] = [];
  @Input() readlistManwhas: Manwha[] = [];

  get todoSections(): TodoSection[] {
    const sections: TodoSection[] = [];

    const movieItems: TodoItem[] = [];

    const missingMovieRatings = this.countMissing(this.movies, (m) => m.rating);
    const missingMovieTimes = this.countMissing(
      this.movies,
      (m) => m.timesWatched
    );
    if (missingMovieRatings > 0) {
      movieItems.push({ label: 'Films sans note', count: missingMovieRatings });
    }
    if (missingMovieTimes > 0) {
      movieItems.push({
        label: 'Films sans nombre de visionnages',
        count: missingMovieTimes,
      });
    }
    if (this.movies.length > 0 && this.watchlistMovies.length === 0) {
      movieItems.push({ label: 'Films sans watchlist', count: 1 });
    }
    if (movieItems.length > 0) {
      sections.push({ title: '🎬 Films', items: movieItems });
    }

    const seriesItems: TodoItem[] = [];

    const missingSerieRatings = this.series.filter(
      (serie) =>
        !serie.seasons?.length ||
        serie.seasons.some((season) => !season.seasonRating)
    ).length;
    const missingSerieTimes = this.series.filter(
      (serie) =>
        !serie.seasons?.length ||
        serie.seasons.some((season) => !season.seasonTimesWatched)
    ).length;
    if (missingSerieRatings > 0) {
      seriesItems.push({
        label: 'Séries sans note',
        count: missingSerieRatings,
      });
    }
    if (missingSerieTimes > 0) {
      seriesItems.push({
        label: 'Séries sans nombre de visionnages',
        count: missingSerieTimes,
      });
    }
    if (this.series.length > 0 && this.watchlistSeries.length === 0) {
      seriesItems.push({ label: 'Séries sans watchlist', count: 1 });
    }
    if (seriesItems.length > 0) {
      sections.push({ title: '📺 Séries', items: seriesItems });
    }

    const bookItems: TodoItem[] = [];

    const missingBookRatings = this.countMissing(this.books, (b) => b.rating);
    const missingBookTimes = this.countMissing(this.books, (b) => b.readTimes);
    if (missingBookRatings > 0) {
      bookItems.push({ label: 'Livres sans note', count: missingBookRatings });
    }
    if (missingBookTimes > 0) {
      bookItems.push({
        label: 'Livres sans nombre de lectures',
        count: missingBookTimes,
      });
    }
    if (this.books.length > 0 && this.readlistBooks.length === 0) {
      bookItems.push({ label: 'Livres sans readlist', count: 1 });
    }
    if (bookItems.length > 0) {
      sections.push({ title: '📖 Livres', items: bookItems });
    }

    const mangaItems: TodoItem[] = [];

    const missingMangaRatings = this.countMissing(this.mangas, (m) => m.rating);
    const missingMangaTimes = this.countMissing(
      this.mangas,
      (m) => m.readTimes
    );
    if (missingMangaRatings > 0) {
      mangaItems.push({
        label: 'Mangas sans note',
        count: missingMangaRatings,
      });
    }
    if (missingMangaTimes > 0) {
      mangaItems.push({
        label: 'Mangas sans nombre de lectures',
        count: missingMangaTimes,
      });
    }
    if (this.mangas.length > 0 && this.readlistMangas.length === 0) {
      mangaItems.push({ label: 'Mangas sans readlist', count: 1 });
    }
    if (mangaItems.length > 0) {
      sections.push({ title: '📚 Mangas', items: mangaItems });
    }

    const comicItems: TodoItem[] = [];

    const missingComicRatings = this.countMissing(this.comics, (c) => c.rating);
    const missingComicTimes = this.countMissing(
      this.comics,
      (c) => c.readTimes
    );
    if (missingComicRatings > 0) {
      comicItems.push({
        label: 'Comics sans note',
        count: missingComicRatings,
      });
    }
    if (missingComicTimes > 0) {
      comicItems.push({
        label: 'Comics sans nombre de lectures',
        count: missingComicTimes,
      });
    }
    if (this.comics.length > 0 && this.readlistComics.length === 0) {
      comicItems.push({ label: 'Comics sans readlist', count: 1 });
    }
    if (comicItems.length > 0) {
      sections.push({ title: '🦸 Comics', items: comicItems });
    }

    const bdItems: TodoItem[] = [];

    const missingBdRatings = this.countMissing(this.bds, (b) => b.rating);
    const missingBdTimes = this.countMissing(this.bds, (b) => b.readTimes);
    if (missingBdRatings > 0) {
      bdItems.push({ label: 'BD sans note', count: missingBdRatings });
    }
    if (missingBdTimes > 0) {
      bdItems.push({
        label: 'BD sans nombre de lectures',
        count: missingBdTimes,
      });
    }
    if (this.bds.length > 0 && this.readlistBds.length === 0) {
      bdItems.push({ label: 'BD sans readlist', count: 1 });
    }
    if (bdItems.length > 0) {
      sections.push({ title: '📗 BD', items: bdItems });
    }

    const manwhaItems: TodoItem[] = [];

    const missingManwhaRatings = this.countMissing(
      this.manwhas,
      (m) => m.rating
    );
    const missingManwhaTimes = this.countMissing(
      this.manwhas,
      (m) => m.readTimes
    );
    if (missingManwhaRatings > 0) {
      manwhaItems.push({
        label: 'Manwhas sans note',
        count: missingManwhaRatings,
      });
    }
    if (missingManwhaTimes > 0) {
      manwhaItems.push({
        label: 'Manwhas sans nombre de lectures',
        count: missingManwhaTimes,
      });
    }
    if (this.manwhas.length > 0 && this.readlistManwhas.length === 0) {
      manwhaItems.push({ label: 'Manwhas sans readlist', count: 1 });
    }
    if (manwhaItems.length > 0) {
      sections.push({ title: '📗 Manwhas', items: manwhaItems });
    }

    const gameItems: TodoItem[] = [];

    const missingGameRatings = this.countMissing(this.games, (g) => g.rating);
    const missingGameTimes = this.countMissing(
      this.games,
      (g) => g.timesFinished
    );
    if (missingGameRatings > 0) {
      gameItems.push({ label: 'Jeux sans note', count: missingGameRatings });
    }
    if (missingGameTimes > 0) {
      gameItems.push({
        label: 'Jeux sans nombre de fins',
        count: missingGameTimes,
      });
    }
    if (gameItems.length > 0) {
      sections.push({ title: '🎮 Jeux', items: gameItems });
    }

    const musicItems: TodoItem[] = [];

    const missingMusicRatings = this.countMissing(this.musics, (m) => m.rating);
    const missingMusicTimes = this.countMissing(
      this.musics,
      (m) => m.timesListened
    );
    if (missingMusicRatings > 0) {
      musicItems.push({
        label: 'Musiques sans note',
        count: missingMusicRatings,
      });
    }
    if (missingMusicTimes > 0) {
      musicItems.push({
        label: "Musiques sans nombre d'écoutes",
        count: missingMusicTimes,
      });
    }
    if (musicItems.length > 0) {
      sections.push({ title: '🎵 Musiques', items: musicItems });
    }

    return sections;
  }

  get emptyEntitySections(): EmptySection[] {
    const empty: EmptySection[] = [];
    if (this.movies.length === 0) {
      empty.push({
        title: '🎬 Films',
        message: "Vous n'avez pas encore de films.",
      });
    }
    if (this.series.length === 0) {
      empty.push({
        title: '📺 Séries',
        message: "Vous n'avez pas encore de séries.",
      });
    }
    if (this.books.length === 0) {
      empty.push({
        title: '📖 Livres',
        message: "Vous n'avez pas encore de livres.",
      });
    }
    if (this.mangas.length === 0) {
      empty.push({
        title: '📚 Mangas',
        message: "Vous n'avez pas encore de mangas.",
      });
    }
    if (this.comics.length === 0) {
      empty.push({
        title: '🦸 Comics',
        message: "Vous n'avez pas encore de comics.",
      });
    }
    if (this.bds.length === 0) {
      empty.push({ title: '📗 BD', message: "Vous n'avez pas encore de BD." });
    }
    if (this.manwhas.length === 0) {
      empty.push({
        title: '📗 Manwhas',
        message: "Vous n'avez pas encore de manwhas.",
      });
    }
    if (this.games.length === 0) {
      empty.push({
        title: '🎮 Jeux',
        message: "Vous n'avez pas encore de jeux.",
      });
    }
    if (this.musics.length === 0) {
      empty.push({
        title: '🎵 Musiques',
        message: "Vous n'avez pas encore de musiques.",
      });
    }
    return empty;
  }

  private countMissing<T>(
    items: T[],
    getValue: (item: T) => number | undefined
  ) {
    return items.filter((item) => {
      const value = getValue(item);
      return value === undefined || value === null || value <= 0;
    }).length;
  }
}
