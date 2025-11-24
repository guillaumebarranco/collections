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
}

export interface UserMovie extends MandatoryMovieData {
  rating: number;
  timesWatched: number;
  lastViewedDate: string;
}

export interface Movie extends BaseMovie, UserMovie {}
