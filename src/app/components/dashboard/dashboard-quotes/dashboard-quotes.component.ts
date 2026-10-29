import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import {
  ViewToggleComponent,
  type ViewToggleOption,
} from '../../shared/view-toggle/view-toggle.component';
import { getAllMovies } from '../../../facades/movies/movies.facade';
import { getAllBooks } from '../../../facades/books/books.facade';
import { getAllSeries } from '../../../facades/series/series.facade';
import { getAllMusics } from '../../../facades/musics/musics.facade';
import { Movie } from '../../../models/movie-model';
import { Book } from '../../../models/book-model';
import { Serie } from '../../../models/serie-model';
import { Music } from '../../../models/music-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';

type QuoteEntityType = 'movies' | 'books' | 'series' | 'musics';

interface QuotedWork {
  title: string;
  subtitle: string;
  quotes: string[];
}

@Component({
  selector: 'app-dashboard-quotes',
  standalone: true,
  imports: [CommonModule, ViewToggleComponent],
  templateUrl: './dashboard-quotes.component.html',
  styleUrl: './dashboard-quotes.component.scss',
})
export class DashboardQuotesComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private loadGeneration = 0;

  readonly entityTabOptions: ViewToggleOption[] = [
    { value: 'movies', label: '🎬 Films' },
    { value: 'books', label: '📖 Livres' },
    { value: 'series', label: '📺 Séries' },
    { value: 'musics', label: '🎵 Musiques' },
  ];

  readonly selectedEntity = signal<QuoteEntityType>('movies');
  readonly isLoading = signal(true);

  private readonly movies = signal<Movie[]>([]);
  private readonly books = signal<Book[]>([]);
  private readonly series = signal<Serie[]>([]);
  private readonly musics = signal<Music[]>([]);

  private readonly routeParams = toSignal(
    (this.activatedRoute.parent ?? this.activatedRoute).params,
    {
      initialValue: (this.activatedRoute.parent ?? this.activatedRoute).snapshot
        .params as Params,
    }
  );

  private readonly userId = computed(() => {
    const id = this.routeParams()['id'];
    return typeof id === 'string' && id ? id : DEFAULT_USER_ID;
  });

  readonly quotedWorks = computed<QuotedWork[]>(() => {
    switch (this.selectedEntity()) {
      case 'movies':
        return this.toQuotedWorks(this.movies(), (movie) => movie.director);
      case 'books':
        return this.toQuotedWorks(this.books(), (book) => book.author);
      case 'series':
        return this.toQuotedWorks(this.series(), (serie) => serie.director);
      case 'musics':
        return this.toQuotedWorks(this.musics(), (music) =>
          music.album ? `${music.artist} · ${music.album}` : music.artist
        );
    }
  });

  readonly emptyMessage = computed(() => {
    const labels: Record<QuoteEntityType, string> = {
      movies: 'les films',
      books: 'les livres',
      series: 'les séries',
      musics: 'les musiques',
    };
    return `Aucune citation enregistrée pour ${labels[this.selectedEntity()]}.`;
  });

  constructor() {
    effect(() => {
      const userId = this.userId();
      void this.loadQuotes(userId);
    });
  }

  selectEntity(entity: string): void {
    if (
      entity === 'movies' ||
      entity === 'books' ||
      entity === 'series' ||
      entity === 'musics'
    ) {
      this.selectedEntity.set(entity);
    }
  }

  private async loadQuotes(userId: string): Promise<void> {
    const generation = ++this.loadGeneration;
    this.isLoading.set(true);
    try {
      const [movies, books, series, musics] = await Promise.all([
        getAllMovies(userId),
        getAllBooks(userId),
        getAllSeries(userId),
        getAllMusics(userId),
      ]);
      if (generation !== this.loadGeneration) {
        return;
      }
      this.movies.set(movies[userId] ?? []);
      this.books.set(books[userId] ?? []);
      this.series.set(series[userId] ?? []);
      this.musics.set(musics[userId] ?? []);
    } finally {
      if (generation === this.loadGeneration) {
        this.isLoading.set(false);
      }
    }
  }

  private toQuotedWorks<T extends { title: string; quotes?: string[] }>(
    items: T[],
    subtitle: (item: T) => string
  ): QuotedWork[] {
    return items
      .map((item) => ({
        title: item.title,
        subtitle: subtitle(item).trim(),
        quotes: (item.quotes ?? [])
          .map((quote) => this.formatQuote(quote).trim())
          .filter(Boolean),
      }))
      .filter((item) => item.quotes.length > 0)
      .sort((a, b) =>
        a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
      );
  }

  private formatQuote(quote: string): string {
    return quote
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\n');
  }
}
