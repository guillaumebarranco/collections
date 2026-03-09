import { Country } from './countries.enum';

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
  description: string;
  countryOrigin: Country;
  fromEntity: {
    entityType: 'book' | 'game' | 'comic' | 'manga' | 'manwha' | 'serie';
    title: string;
    secondEntityKey: string;
  } | null;
}

export interface UserMovie extends MandatoryMovieData {
  rating: number;
  timesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  seenAtCinema: boolean;
  owned: boolean;
  wantToSeeAgain: boolean;
  watchPriority: 1 | 2 | 3;
  ratingComment: string;
  inList: string[];
}

export type UserMovies = UserMovie[];

export interface Movie extends BaseMovie, UserMovie {}
