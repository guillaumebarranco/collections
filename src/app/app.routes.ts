import { Routes } from '@angular/router';
import { BooksComponent } from './containers/collections/books/books.component';
import { MangasComponent } from './containers/collections/mangas/mangas.component';
import { ManwhasComponent } from './containers/collections/manwhas/manwhas.component';
import { ComicsComponent } from './containers/collections/comics/comics.component';
import { BdsComponent } from './containers/collections/bds/bds.component';
import { MoviesComponent } from './containers/collections/movies/movies.component';
import { SeriesComponent } from './containers/collections/series/series.component';
import { GamesComponent } from './containers/collections/games/games.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { SelectMoviesComponent } from './containers/selection/movies/select-movies/select-movies.component';
import { SelectMoviesTimesWatchedComponent } from './containers/selection/movies/select-movies-times-watched/select-movies-times-watched.component';
import { SelectMoviesRatingComponent } from './containers/selection/movies/select-movies-rating/select-movies-rating.component';
import { SelectMoviesOwnedComponent } from './containers/selection/movies/select-movies-owned/select-movies-owned.component';
import { SelectBooksComponent } from './containers/selection/books/select-books/select-books.component';
import { SelectBooksRatingComponent } from './containers/selection/books/select-books-rating/select-books-rating.component';
import { SelectBooksTimesReadComponent } from './containers/selection/books/select-books-times-read/select-books-times-read.component';
import { SelectBooksOwnedComponent } from './containers/selection/books/select-books-owned/select-books-owned.component';
import { SelectSeriesComponent } from './containers/selection/series/select-series/select-series.component';
import { SelectSeriesRatingComponent } from './containers/selection/series/select-series-rating/select-series-rating.component';
import { SelectSeriesTimesWatchedComponent } from './containers/selection/series/select-series-times-watched/select-series-times-watched.component';
import { SelectSeriesOwnedComponent } from './containers/selection/series/select-series-owned/select-series-owned.component';
import { SelectMangasComponent } from './containers/selection/mangas/select-mangas/select-mangas.component';
import { SelectMangasRatingComponent } from './containers/selection/mangas/select-mangas-rating/select-mangas-rating.component';
import { SelectMangasTimesReadComponent } from './containers/selection/mangas/select-mangas-times-read/select-mangas-times-read.component';
import { SelectMangasOwnedComponent } from './containers/selection/mangas/select-mangas-owned/select-mangas-owned.component';
import { SelectComicsComponent } from './containers/selection/comics/select-comics/select-comics.component';
import { SelectComicsRatingComponent } from './containers/selection/comics/select-comics-rating/select-comics-rating.component';
import { SelectComicsTimesReadComponent } from './containers/selection/comics/select-comics-times-read/select-comics-times-read.component';
import { SelectComicsOwnedComponent } from './containers/selection/comics/select-comics-owned/select-comics-owned.component';
import { SelectBdsComponent } from './containers/selection/bds/select-bds/select-bds.component';
import { SelectBdsRatingComponent } from './containers/selection/bds/select-bds-rating/select-bds-rating.component';
import { SelectBdsTimesReadComponent } from './containers/selection/bds/select-bds-times-read/select-bds-times-read.component';
import { SelectBdsOwnedComponent } from './containers/selection/bds/select-bds-owned/select-bds-owned.component';
import { SelectManwhasComponent } from './containers/selection/manwhas/select-manwhas/select-manwhas.component';
import { SelectManwhasRatingComponent } from './containers/selection/manwhas/select-manwhas-rating/select-manwhas-rating.component';
import { SelectManwhasTimesReadComponent } from './containers/selection/manwhas/select-manwhas-times-read/select-manwhas-times-read.component';
import { SelectManwhasOwnedComponent } from './containers/selection/manwhas/select-manwhas-owned/select-manwhas-owned.component';
import { SelectGamesComponent } from './containers/selection/games/select-games/select-games.component';
import { SelectGamesRatingComponent } from './containers/selection/games/select-games-rating/select-games-rating.component';
import { SelectGamesOwnedComponent } from './containers/selection/games/select-games-owned/select-games-owned.component';
import { MusicsComponent } from './containers/collections/musics/musics.component';
import { AdminMusicsComponent } from './containers/admin-collections/musics/musics.component';
import { SelectMusicsComponent } from './containers/selection/musics/select-musics/select-musics.component';
import { SelectMusicsRatingComponent } from './containers/selection/musics/select-musics-rating/select-musics-rating.component';
import { SelectMusicsTimesListenedComponent } from './containers/selection/musics/select-musics-times-listened/select-musics-times-listened.component';
import { EditMovieComponent } from './containers/edit/edit-movie/edit-movie.component';
import { EditBookComponent } from './containers/edit/edit-book/edit-book.component';
import { EditSerieComponent } from './containers/edit/edit-serie/edit-serie.component';
import { EditGameComponent } from './containers/edit/edit-game/edit-game.component';
import { AdminLayoutComponent } from './containers/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './containers/admin-dashboard/admin-dashboard.component';
import { AdminMoviesComponent } from './containers/admin-collections/movies/movies.component';
import { AdminGamesComponent } from './containers/admin-collections/games/games.component';
import { AdminSeriesComponent } from './containers/admin-collections/series/series.component';
import { AdminBooksComponent } from './containers/admin-collections/books/books.component';
import { AdminMangasComponent } from './containers/admin-collections/mangas/mangas.component';
import { AdminManwhasComponent } from './containers/admin-collections/manwhas/manwhas.component';
import { AdminComicsComponent } from './containers/admin-collections/comics/comics.component';
import { AdminBdsComponent } from './containers/admin-collections/bds/bds.component';
import { AdaptationsComponent } from './containers/adaptations/adaptations.component';
import { QuizzsComponent } from './containers/collections/quizzs/quizzs.component';
import { RecordsComponent } from './containers/records/records.component';
import { EntityStatsComponent } from './containers/entity-stats/entity-stats.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'movies',
        component: AdminMoviesComponent,
      },
      {
        path: 'books',
        component: AdminBooksComponent,
      },
      {
        path: 'mangas',
        component: AdminMangasComponent,
      },
      {
        path: 'manwhas',
        component: AdminManwhasComponent,
      },
      {
        path: 'comics',
        component: AdminComicsComponent,
      },
      {
        path: 'bds',
        component: AdminBdsComponent,
      },
      {
        path: 'series',
        component: AdminSeriesComponent,
      },
      {
        path: 'games',
        component: AdminGamesComponent,
      },
      {
        path: 'musics',
        component: AdminMusicsComponent,
      },
    ],
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
    path: 'comics',
    component: ComicsComponent,
  },
  {
    path: 'bds',
    component: BdsComponent,
  },
  {
    path: 'musics',
    component: MusicsComponent,
  },
  {
    path: 'mix',
    redirectTo: 'adaptations',
    pathMatch: 'full',
  },
  {
    path: 'adaptations',
    component: AdaptationsComponent,
  },
  {
    path: 'quizzs',
    component: QuizzsComponent,
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
    path: 'select-movies-owned',
    component: SelectMoviesOwnedComponent,
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
    path: 'select-books-owned',
    component: SelectBooksOwnedComponent,
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
    path: 'select-series-owned',
    component: SelectSeriesOwnedComponent,
  },
  {
    path: 'select-mangas',
    component: SelectMangasComponent,
  },
  {
    path: 'select-mangas-times-read',
    component: SelectMangasTimesReadComponent,
  },
  {
    path: 'select-mangas-owned',
    component: SelectMangasOwnedComponent,
  },
  {
    path: 'select-mangas-rating',
    component: SelectMangasRatingComponent,
  },
  {
    path: 'select-comics',
    component: SelectComicsComponent,
  },
  {
    path: 'select-comics-times-read',
    component: SelectComicsTimesReadComponent,
  },
  {
    path: 'select-comics-owned',
    component: SelectComicsOwnedComponent,
  },
  {
    path: 'select-comics-rating',
    component: SelectComicsRatingComponent,
  },
  {
    path: 'select-bds',
    component: SelectBdsComponent,
  },
  {
    path: 'select-bds-times-read',
    component: SelectBdsTimesReadComponent,
  },
  {
    path: 'select-bds-owned',
    component: SelectBdsOwnedComponent,
  },
  {
    path: 'select-bds-rating',
    component: SelectBdsRatingComponent,
  },
  {
    path: 'select-manwhas',
    component: SelectManwhasComponent,
  },
  {
    path: 'select-manwhas-times-read',
    component: SelectManwhasTimesReadComponent,
  },
  {
    path: 'select-manwhas-owned',
    component: SelectManwhasOwnedComponent,
  },
  {
    path: 'select-manwhas-rating',
    component: SelectManwhasRatingComponent,
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
    path: 'select-games-owned',
    component: SelectGamesOwnedComponent,
  },
  {
    path: 'select-musics',
    component: SelectMusicsComponent,
  },
  {
    path: 'select-musics-rating',
    component: SelectMusicsRatingComponent,
  },
  {
    path: 'select-musics-times-listened',
    component: SelectMusicsTimesListenedComponent,
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
        path: 'edit-game/:slug',
        component: EditGameComponent,
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
        path: 'bds',
        component: BdsComponent,
      },
      {
        path: 'comics',
        component: ComicsComponent,
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
        children: [
          {
            path: 'edit/:slug',
            component: EditSerieComponent,
          },
        ],
      },
      {
        path: 'games',
        component: GamesComponent,
        children: [
          {
            path: 'edit/:slug',
            component: EditGameComponent,
          },
        ],
      },
      {
        path: 'musics',
        component: MusicsComponent,
      },
      {
        path: 'mix',
        redirectTo: 'adaptations',
        pathMatch: 'full',
      },
      {
        path: 'adaptations',
        component: AdaptationsComponent,
      },
      {
        path: 'quizzs',
        component: QuizzsComponent,
      },
      {
        path: 'records',
        component: RecordsComponent,
      },
      {
        path: 'entity-stats',
        component: EntityStatsComponent,
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
        path: 'select-movies-owned',
        component: SelectMoviesOwnedComponent,
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
        path: 'select-books-owned',
        component: SelectBooksOwnedComponent,
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
        path: 'select-series-owned',
        component: SelectSeriesOwnedComponent,
      },
      {
        path: 'select-mangas',
        component: SelectMangasComponent,
      },
      {
        path: 'select-mangas-times-read',
        component: SelectMangasTimesReadComponent,
      },
      {
        path: 'select-mangas-owned',
        component: SelectMangasOwnedComponent,
      },
      {
        path: 'select-mangas-rating',
        component: SelectMangasRatingComponent,
      },
      {
        path: 'select-comics',
        component: SelectComicsComponent,
      },
      {
        path: 'select-comics-times-read',
        component: SelectComicsTimesReadComponent,
      },
      {
        path: 'select-comics-owned',
        component: SelectComicsOwnedComponent,
      },
      {
        path: 'select-comics-rating',
        component: SelectComicsRatingComponent,
      },
      {
        path: 'select-bds',
        component: SelectBdsComponent,
      },
      {
        path: 'select-bds-times-read',
        component: SelectBdsTimesReadComponent,
      },
      {
        path: 'select-bds-owned',
        component: SelectBdsOwnedComponent,
      },
      {
        path: 'select-bds-rating',
        component: SelectBdsRatingComponent,
      },
      {
        path: 'select-manwhas',
        component: SelectManwhasComponent,
      },
      {
        path: 'select-manwhas-times-read',
        component: SelectManwhasTimesReadComponent,
      },
      {
        path: 'select-manwhas-owned',
        component: SelectManwhasOwnedComponent,
      },
      {
        path: 'select-manwhas-rating',
        component: SelectManwhasRatingComponent,
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
        path: 'select-games-owned',
        component: SelectGamesOwnedComponent,
      },
      {
        path: 'select-musics',
        component: SelectMusicsComponent,
      },
      {
        path: 'select-musics-rating',
        component: SelectMusicsRatingComponent,
      },
      {
        path: 'select-musics-times-listened',
        component: SelectMusicsTimesListenedComponent,
      },
    ],
  },
];
