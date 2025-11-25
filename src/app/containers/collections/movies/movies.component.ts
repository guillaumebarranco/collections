import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from '../../../components/movie/movie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
} from '../../../components/stats-display/stats-display.component';
import {
  getTotalWatchingTime,
  getTotalDuration,
} from '../../../utils/stats.utils';
import { Movie } from '../../../models/movie-model';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  getAllMovies,
  getAllWatchlistMovies,
} from '../../../facades/movies.facade';

type MovieView = 'watched' | 'watchlist';

@Component({
  selector: 'app-movies',
  imports: [
    RouterLink,
    CommonModule,
    MovieComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  selectedSort = signal<string>('rating');
  selectedView = signal<MovieView>('watched');

  sortOptions: SortOption[] = [
    { value: 'title', label: 'Titre (A-Z)' },
    { value: 'title-desc', label: 'Titre (Z-A)' },
    { value: 'releaseDate', label: 'Date de sortie (récent)' },
    { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
    { value: 'rating', label: 'Note (élevée)' },
    { value: 'rating-asc', label: 'Note (faible)' },
    { value: 'timesWatched', label: 'Visionnages (élevé)' },
    { value: 'timesWatched-asc', label: 'Visionnages (faible)' },
    { value: 'length', label: 'Durée (long)' },
    { value: 'length-asc', label: 'Durée (court)' },
    { value: 'lastViewedDate', label: 'Dernier visionnage (récent)' },
    { value: 'lastViewedDate-asc', label: 'Dernier visionnage (ancien)' },
  ];

  movieViewOptions: { value: MovieView; label: string }[] = [
    { value: 'watched', label: 'Films vus' },
    { value: 'watchlist', label: 'Films à voir' },
  ];

  moviesList = signal<{ [key: string]: Movie[] }>(getAllMovies());

  watchingMoviesList = signal<{ [key: string]: Movie[] }>(
    getAllWatchlistMovies()
  );

  allWatchlistMovies = computed<Movie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.watchingMoviesList()[params['id']] || []
      : this.watchingMoviesList()['guillaume'];
  });

  allMovies = computed<Movie[]>(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.moviesList()[params['id']] || []
      : this.moviesList()['guillaume'];
  });

  filteredMovies = computed<Movie[]>(() => {
    const movies =
      this.selectedView() === 'watchlist'
        ? this.allWatchlistMovies()
        : this.allMovies();

    return movies;
  });

  sortedMovies = computed<Movie[]>(() => {
    const sortedMovies = [...this.filteredMovies()];

    switch (this.selectedSort()) {
      case 'title':
        return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
      case 'releaseDate':
        return sortedMovies.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
      case 'releaseDate-asc':
        return sortedMovies.sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
        );
      case 'rating':
        return sortedMovies.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.timesWatched - a.timesWatched;
        });
      case 'rating-asc':
        return sortedMovies.sort((a, b) => {
          if (a.rating !== b.rating) {
            return a.rating - b.rating;
          }
          return b.timesWatched - a.timesWatched;
        });
      case 'timesWatched':
        return sortedMovies.sort((a, b) => b.timesWatched - a.timesWatched);
      case 'timesWatched-asc':
        return sortedMovies.sort((a, b) => a.timesWatched - b.timesWatched);
      case 'length':
        return sortedMovies.sort((a, b) => b.length - a.length);
      case 'length-asc':
        return sortedMovies.sort((a, b) => a.length - b.length);
      case 'lastViewedDate':
        return sortedMovies.sort((a, b) => {
          const dateA = a.lastViewedDate
            ? new Date(a.lastViewedDate).getTime()
            : 0;
          const dateB = b.lastViewedDate
            ? new Date(b.lastViewedDate).getTime()
            : 0;
          return dateB - dateA;
        });
      case 'lastViewedDate-asc':
        return sortedMovies.sort((a, b) => {
          const dateA = a.lastViewedDate
            ? new Date(a.lastViewedDate).getTime()
            : 0;
          const dateB = b.lastViewedDate
            ? new Date(b.lastViewedDate).getTime()
            : 0;
          return dateA - dateB;
        });
      default:
        return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
    }
  });

  stats = computed<StatItem[]>(() => {
    const totalDuration = getTotalDuration(this.filteredMovies());
    const totalWatchingTime = getTotalWatchingTime(this.filteredMovies());

    return [
      {
        label: 'Durée totale de tous les films',
        value: totalDuration.formatted,
        icon: '🎬',
        color: 'success',
      },
      {
        label: 'Temps total passé devant des films',
        value: totalWatchingTime.formatted,
        icon: '⏱️',
        color: 'primary',
      },
    ];
  });

  getSelectMoviesRoute(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? `/${params['id']}/select-movies` : '/select-movies';
  }

  getSelectWatchlistRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    const userId = hasNameParam ? params['id'] : 'guillaume';
    return hasNameParam ? [`/${userId}`, 'select-movies'] : ['/select-movies'];
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: MovieView) {
    this.selectedView.set(view);
  }
}
