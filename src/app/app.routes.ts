import { Routes } from '@angular/router';
import { BooksComponent } from './containers/collections/books/books.component';
import { MangasComponent } from './containers/collections/mangas/mangas.component';
import { ManwhasComponent } from './containers/collections/manwhas/manwhas.component';
import { MoviesComponent } from './containers/collections/movies/movies.component';
import { SeriesComponent } from './containers/collections/series/series.component';
import { GamesComponent } from './containers/collections/games/games.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { SelectMoviesComponent } from './containers/selection/select-movies/select-movies.component';
import { SelectMoviesTimesWatchedComponent } from './containers/selection/select-movies-times-watched/select-movies-times-watched.component';
import { SelectMoviesRatingComponent } from './containers/selection/select-movies-rating/select-movies-rating.component';
import { SelectBooksComponent } from './containers/selection/select-books/select-books.component';
import { SelectBooksRatingComponent } from './containers/selection/select-books-rating/select-books-rating.component';
import { SelectBooksTimesReadComponent } from './containers/selection/select-books-times-read/select-books-times-read.component';
import { SelectSeriesComponent } from './containers/selection/select-series/select-series.component';
import { SelectSeriesRatingComponent } from './containers/selection/select-series-rating/select-series-rating.component';
import { SelectSeriesTimesWatchedComponent } from './containers/selection/select-series-times-watched/select-series-times-watched.component';
import { SelectMangasComponent } from './containers/selection/select-mangas/select-mangas.component';
import { SelectManwhasComponent } from './containers/selection/select-manwhas/select-manwhas.component';
import { SelectGamesComponent } from './containers/selection/select-games/select-games.component';
import { SelectGamesRatingComponent } from './containers/selection/select-games-rating/select-games-rating.component';
import { SelectGamesTimesFinishedComponent } from './containers/selection/select-games-times-finished/select-games-times-finished.component';
import { MusicsComponent } from './containers/collections/musics/musics.component';
import { SelectMusicsComponent } from './containers/selection/select-musics/select-musics.component';
import { EditMovieComponent } from './containers/edit/edit-movie/edit-movie.component';
import { EditBookComponent } from './containers/edit/edit-book/edit-book.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'movies',
    component: MoviesComponent,
    children: [
      {
        path: ':id',
        component: MoviesComponent,
      },
    ],
  },
  {
    path: 'series',
    component: SeriesComponent,
  },
  {
    path: 'games',
    component: GamesComponent,
  },
  {
    path: 'musics',
    component: MusicsComponent,
  },
  {
    path: 'select-movies',
    component: SelectMoviesComponent,
  },
  {
    path: 'select-movies-times-watched',
    component: SelectMoviesTimesWatchedComponent,
  },
  {
    path: 'select-movies-rating',
    component: SelectMoviesRatingComponent,
  },
  {
    path: 'select-books',
    component: SelectBooksComponent,
  },
  {
    path: 'select-books-times-read',
    component: SelectBooksTimesReadComponent,
  },
  {
    path: 'select-books-rating',
    component: SelectBooksRatingComponent,
  },
  {
    path: 'select-series',
    component: SelectSeriesComponent,
  },
  {
    path: 'select-series-rating',
    component: SelectSeriesRatingComponent,
  },
  {
    path: 'select-series-times-watched',
    component: SelectSeriesTimesWatchedComponent,
  },
  {
    path: 'select-mangas',
    component: SelectMangasComponent,
  },
  {
    path: 'select-manwhas',
    component: SelectManwhasComponent,
  },
  {
    path: 'select-games',
    component: SelectGamesComponent,
  },
  {
    path: 'select-games-rating',
    component: SelectGamesRatingComponent,
  },
  {
    path: 'select-games-times-finished',
    component: SelectGamesTimesFinishedComponent,
  },
  {
    path: 'select-musics',
    component: SelectMusicsComponent,
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'edit-movie/:slug',
        component: EditMovieComponent,
      },
      {
        path: 'edit-book/:slug',
        component: EditBookComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'books',
        component: BooksComponent,
        children: [
          {
            path: 'edit/:slug',
            component: EditBookComponent,
          },
        ],
      },
      {
        path: 'mangas',
        component: MangasComponent,
      },
      {
        path: 'manwhas',
        component: ManwhasComponent,
      },
      {
        path: 'movies',
        component: MoviesComponent,
        children: [
          {
            path: 'edit/:slug',
            component: EditMovieComponent,
          },
          {
            path: ':id',
            component: MoviesComponent,
          },
        ],
      },
      {
        path: 'series',
        component: SeriesComponent,
      },
      {
        path: 'games',
        component: GamesComponent,
      },
      {
        path: 'musics',
        component: MusicsComponent,
      },
      {
        path: 'select-movies',
        component: SelectMoviesComponent,
      },
      {
        path: 'select-movies-times-watched',
        component: SelectMoviesTimesWatchedComponent,
      },
      {
        path: 'select-movies-rating',
        component: SelectMoviesRatingComponent,
      },
      {
        path: 'select-books',
        component: SelectBooksComponent,
      },
      {
        path: 'select-books-times-read',
        component: SelectBooksTimesReadComponent,
      },
      {
        path: 'select-books-rating',
        component: SelectBooksRatingComponent,
      },
      {
        path: 'select-series',
        component: SelectSeriesComponent,
      },
      {
        path: 'select-series-rating',
        component: SelectSeriesRatingComponent,
      },
      {
        path: 'select-series-times-watched',
        component: SelectSeriesTimesWatchedComponent,
      },
      {
        path: 'select-mangas',
        component: SelectMangasComponent,
      },
      {
        path: 'select-manwhas',
        component: SelectManwhasComponent,
      },
      {
        path: 'select-games',
        component: SelectGamesComponent,
      },
      {
        path: 'select-games-rating',
        component: SelectGamesRatingComponent,
      },
      {
        path: 'select-games-times-finished',
        component: SelectGamesTimesFinishedComponent,
      },
      {
        path: 'select-musics',
        component: SelectMusicsComponent,
      },
    ],
  },
];
