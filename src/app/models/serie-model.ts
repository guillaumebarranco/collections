// export interface Serie {
//   totalLength: number;
// }

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
  nbEpisodesTotal: number;
  nbSeasons: number;
  totalLength: number;
  seasonsData: BaseSerieSeasonData[];
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
}

export interface UserSerie extends MandatorySerieData {
  seasons: UserSerieSeason[];
}

export interface Serie extends BaseSerie, UserSerie {}
