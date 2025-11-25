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
}

export interface UserSerie extends MandatorySerieData {
  rating: number;
  timesWatched: number;
}

export interface Serie extends BaseSerie, UserSerie {}
