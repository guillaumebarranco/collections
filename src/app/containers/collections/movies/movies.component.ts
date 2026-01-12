import {
  Component,
  inject,
  signal,
  computed,
  effect,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieComponent } from '../../../components/movie/movie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import {
  SortDropdownComponent,
  SortOption,
} from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatsDisplayComponent,
  StatItem,
  StatItemColor,
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

type MovieView = 'watched' | 'cinema' | 'watchlist';

@Component({
  selector: 'app-movies',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MovieComponent,
    MenuComponent,
    SortDropdownComponent,
    StatsDisplayComponent,
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  private isInitializing = false;

  selectedSort = signal<string>('lastViewedDate');
  selectedView = signal<MovieView>('watched');
  selectedYearFilter = signal<string>('all');

  constructor() {
    // Synchroniser les changements de filtres/tri avec l'URL
    effect(() => {
      if (this.isInitializing) return;

      const queryParams: any = {};

      if (this.selectedView() !== 'watched') {
        queryParams.view = this.selectedView();
      }

      if (this.selectedSort() !== 'lastViewedDate') {
        queryParams.sort = this.selectedSort();
      }

      if (this.selectedYearFilter() !== 'all') {
        queryParams.year = this.selectedYearFilter();
      }

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : {},
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  ngOnInit() {
    // Lire les paramètres de l'URL au démarrage
    this.loadParamsFromUrl(this.activatedRoute.snapshot.queryParams);

    // Écouter les changements de query params (navigation avant/arrière)
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.isInitializing = true;
      this.loadParamsFromUrl(queryParams);
      this.isInitializing = false;
    });
  }

  private loadParamsFromUrl(queryParams: Params) {
    if (
      queryParams['view'] === 'watchlist' ||
      queryParams['view'] === 'watched' ||
      queryParams['view'] === 'cinema'
    ) {
      this.selectedView.set(queryParams['view'] as MovieView);
    }

    if (queryParams['sort']) {
      const validSort = this.sortOptions.find(
        (opt) => opt.value === queryParams['sort']
      );
      if (validSort) {
        this.selectedSort.set(queryParams['sort']);
      }
    }

    if (queryParams['year']) {
      const validYear = this.yearFilterOptions.find(
        (opt) => opt.value === queryParams['year']
      );
      if (validYear) {
        this.selectedYearFilter.set(queryParams['year']);
      }
    }
  }

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
    { value: 'cinema', label: 'Films vus au cinéma' },
    { value: 'watchlist', label: 'Films à voir' },
  ];

  yearFilterOptions = [
    { value: 'all', label: 'Toutes' },
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
    { value: '2014', label: '2014' },
    { value: '2013', label: '2013' },
    { value: '2012', label: '2012' },
    { value: '2011', label: '2011' },
    { value: '2010', label: '2010' },
    { value: '2009', label: '2009' },
    { value: '2008', label: '2008' },
    { value: '2007', label: '2007' },
    { value: '2006', label: '2006' },
    { value: '2005', label: '2005' },
    { value: '2004', label: '2004' },
    { value: '2003', label: '2003' },
    { value: '2002', label: '2002' },
    { value: 'before2002', label: 'Avant 2002' },
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
    if (this.selectedView() === 'watchlist') {
      return this.allWatchlistMovies();
    }

    if (this.selectedView() === 'cinema') {
      return this.allMovies().filter((movie) => movie.seenAtCinema === true);
    }

    return this.allMovies();
  });

  filteredMoviesByYear = computed<Movie[]>(() => {
    let filteredMovies = [...this.filteredMovies()];

    // Filtrage par année (seulement pour les films vus et vus au cinéma, basé sur firstViewedDate)
    if (this.selectedView() === 'watched' || this.selectedView() === 'cinema') {
      if (
        [
          2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016,
          2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005,
          2004, 2003, 2002,
        ].includes(Number(this.selectedYearFilter()))
      ) {
        filteredMovies = filteredMovies.filter((m) =>
          m.firstViewedDate?.startsWith(this.selectedYearFilter())
        );
      } else if (this.selectedYearFilter() === 'before2002') {
        filteredMovies = filteredMovies.filter((m) => {
          if (!m.firstViewedDate) return true;
          const year = parseInt(m.firstViewedDate.substring(0, 4));
          return year < 2002;
        });
      }
    }

    return filteredMovies;
  });

  sortedMovies = computed<Movie[]>(() => {
    const sortedMovies = [...this.filteredMoviesByYear()];

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
    // Utiliser les films filtrés pour les stats
    const moviesToUse = this.filteredMoviesByYear();
    const totalDuration = getTotalDuration(moviesToUse);
    const totalWatchingTime = getTotalWatchingTime(moviesToUse);

    return [
      {
        label: 'Durée totale de tous les films',
        value: totalDuration.formatted,
        icon: '🎬',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé devant des films',
        value: totalWatchingTime.formatted,
        icon: '⏱️',
        color: StatItemColor.PRIMARY,
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

  getSelectCinemaRoute(): string[] {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? [`/${params['id']}`, 'select-movies'] : ['/select-movies'];
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewChange(view: MovieView) {
    this.selectedView.set(view);
  }

  onYearFilterChange(year: string) {
    this.selectedYearFilter.set(year);
  }
}
