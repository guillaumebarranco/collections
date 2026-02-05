export interface MandatoryMovieData {
  title: string;
  director: string;
}

export interface BaseMovie extends MandatoryMovieData {
  actors: {
    name: string;
  }[];
  coverUrl: string;
  releaseDate: string;
  length: number;
  genre: string;
  saga: string;
}

export interface UserMovie extends MandatoryMovieData {
  rating: number;
  timesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  seenAtCinema: boolean;
  owned: boolean;
  wantToSeeAgain: boolean;
  watchPriority: number;
}

export type UserMovies = UserMovie[];

export interface Movie extends BaseMovie, UserMovie {}
