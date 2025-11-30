import { Routes } from '@angular/router';
import { BooksComponent } from './containers/collections/books/books.component';
import { MangasComponent } from './containers/collections/mangas/mangas.component';
import { ManwhasComponent } from './containers/collections/manwhas/manwhas.component';
import { MoviesComponent } from './containers/collections/movies/movies.component';
import { SeriesComponent } from './containers/collections/series/series.component';
import { GamesComponent } from './containers/collections/games/games.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { SelectMoviesComponent } from './containers/selection/select-movies/select-movies.component';
import { SelectBooksComponent } from './containers/selection/select-books/select-books.component';
import { SelectSeriesComponent } from './containers/selection/select-series/select-series.component';
import { SelectMangasComponent } from './containers/selection/select-mangas/select-mangas.component';
import { SelectManwhasComponent } from './containers/selection/select-manwhas/select-manwhas.component';
import { SelectGamesComponent } from './containers/selection/select-games/select-games.component';
import { MusicsComponent } from './containers/collections/musics/musics.component';
import { SelectMusicsComponent } from './containers/selection/select-musics/select-musics.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'books',
    component: BooksComponent,
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
    path: 'select-books',
    component: SelectBooksComponent,
  },
  {
    path: 'select-series',
    component: SelectSeriesComponent,
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
    path: 'select-musics',
    component: SelectMusicsComponent,
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'books',
        component: BooksComponent,
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
        path: 'select-books',
        component: SelectBooksComponent,
      },
      {
        path: 'select-series',
        component: SelectSeriesComponent,
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
        path: 'select-musics',
        component: SelectMusicsComponent,
      },
    ],
  },
];
