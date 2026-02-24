import { Country } from './countries.enum';

export interface MandatorySerieData {
  title: string;
  director: string;
}

export interface BaseSerie extends MandatorySerieData {
  actors: {
    name: string;
  }[];
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  genre: string;
  seasonsData: BaseSerieSeasonData[];
  description: string;
  countryOrigin: Country;
  saga: string;
}

export interface BaseSerieSeasonData {
  seasonNumber: number;
  nbEpisodes: number;
  totalLength: number;
}

export interface UserSerieSeason {
  seasonNumber: number;
  seasonRating: number;
  seasonTimesWatched: number;
  lastViewedDate: string;
}

export interface UserSerie extends MandatorySerieData {
  seasons: UserSerieSeason[];
  owned: boolean;
  watchPriority: 1 | 2 | 3;
  wantToWatchAgain: boolean;
  ratingComment: string;
}

export type UserSeries = UserSerie[];

export interface Serie extends BaseSerie, UserSerie {}
