import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book-model';
import { Manga } from '../../models/manga-model';
import { Manwha } from '../../models/manwha-model';
import { Movie } from '../../models/movie-model';
import { Serie } from '../../models/serie-model';
import { Game } from '../../models/game-model';
import { Music } from '../../models/music-model';

interface TodoItem {
  label: string;
  count: number;
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
  @Input() manwhas: Manwha[] = [];
  @Input() movies: Movie[] = [];
  @Input() series: Serie[] = [];
  @Input() games: Game[] = [];
  @Input() musics: Music[] = [];
  @Input() watchlistMovies: Movie[] = [];
  @Input() watchlistSeries: Serie[] = [];
  @Input() readlistBooks: Book[] = [];
  @Input() readlistMangas: Manga[] = [];
  @Input() readlistManwhas: Manwha[] = [];

  get todoItems(): TodoItem[] {
    const items: TodoItem[] = [];

    const missingMovieRatings = this.countMissing(this.movies, (m) => m.rating);
    const missingMovieTimes = this.countMissing(
      this.movies,
      (m) => m.timesWatched
    );
    if (missingMovieRatings > 0) {
      items.push({ label: 'Films sans note', count: missingMovieRatings });
    }
    if (missingMovieTimes > 0) {
      items.push({
        label: 'Films sans nombre de visionnages',
        count: missingMovieTimes,
      });
    }
    if (this.movies.length > 0 && this.watchlistMovies.length === 0) {
      items.push({ label: 'Films sans watchlist', count: 1 });
    }

    const missingSerieRatings = this.countMissing(this.series, (s) => s.rating);
    const missingSerieTimes = this.countMissing(
      this.series,
      (s) => s.timesWatched
    );
    if (missingSerieRatings > 0) {
      items.push({ label: 'Séries sans note', count: missingSerieRatings });
    }
    if (missingSerieTimes > 0) {
      items.push({
        label: 'Séries sans nombre de visionnages',
        count: missingSerieTimes,
      });
    }
    if (this.series.length > 0 && this.watchlistSeries.length === 0) {
      items.push({ label: 'Séries sans watchlist', count: 1 });
    }

    const missingBookRatings = this.countMissing(this.books, (b) => b.rating);
    const missingBookTimes = this.countMissing(
      this.books,
      (b) => b.readTimes
    );
    if (missingBookRatings > 0) {
      items.push({ label: 'Livres sans note', count: missingBookRatings });
    }
    if (missingBookTimes > 0) {
      items.push({
        label: 'Livres sans nombre de lectures',
        count: missingBookTimes,
      });
    }
    if (this.books.length > 0 && this.readlistBooks.length === 0) {
      items.push({ label: 'Livres sans readlist', count: 1 });
    }

    const missingMangaRatings = this.countMissing(this.mangas, (m) => m.rating);
    const missingMangaTimes = this.countMissing(
      this.mangas,
      (m) => m.readTimes
    );
    if (missingMangaRatings > 0) {
      items.push({ label: 'Mangas sans note', count: missingMangaRatings });
    }
    if (missingMangaTimes > 0) {
      items.push({
        label: 'Mangas sans nombre de lectures',
        count: missingMangaTimes,
      });
    }
    if (this.mangas.length > 0 && this.readlistMangas.length === 0) {
      items.push({ label: 'Mangas sans readlist', count: 1 });
    }

    const missingManwhaRatings = this.countMissing(
      this.manwhas,
      (m) => m.rating
    );
    const missingManwhaTimes = this.countMissing(
      this.manwhas,
      (m) => m.readTimes
    );
    if (missingManwhaRatings > 0) {
      items.push({ label: 'Manwhas sans note', count: missingManwhaRatings });
    }
    if (missingManwhaTimes > 0) {
      items.push({
        label: 'Manwhas sans nombre de lectures',
        count: missingManwhaTimes,
      });
    }
    if (this.manwhas.length > 0 && this.readlistManwhas.length === 0) {
      items.push({ label: 'Manwhas sans readlist', count: 1 });
    }

    const missingGameRatings = this.countMissing(this.games, (g) => g.rating);
    const missingGameTimes = this.countMissing(
      this.games,
      (g) => g.timesFinished
    );
    if (missingGameRatings > 0) {
      items.push({ label: 'Jeux sans note', count: missingGameRatings });
    }
    if (missingGameTimes > 0) {
      items.push({
        label: 'Jeux sans nombre de fins',
        count: missingGameTimes,
      });
    }

    const missingMusicRatings = this.countMissing(
      this.musics,
      (m) => m.rating
    );
    const missingMusicTimes = this.countMissing(
      this.musics,
      (m) => m.timesListened
    );
    if (missingMusicRatings > 0) {
      items.push({ label: 'Musiques sans note', count: missingMusicRatings });
    }
    if (missingMusicTimes > 0) {
      items.push({
        label: "Musiques sans nombre d'écoutes",
        count: missingMusicTimes,
      });
    }

    return items;
  }

  get emptyEntities(): string[] {
    const empty: string[] = [];
    if (this.movies.length === 0) empty.push('films');
    if (this.series.length === 0) empty.push('séries');
    if (this.books.length === 0) empty.push('livres');
    if (this.mangas.length === 0) empty.push('mangas');
    if (this.manwhas.length === 0) empty.push('manwhas');
    if (this.games.length === 0) empty.push('jeux');
    if (this.musics.length === 0) empty.push('musiques');
    return empty;
  }

  private countMissing<T>(items: T[], getValue: (item: T) => number | undefined) {
    return items.filter((item) => {
      const value = getValue(item);
      return value === undefined || value === null || value <= 0;
    }).length;
  }
}
