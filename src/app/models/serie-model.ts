export interface Serie {
  title: string;
  director: string;
  actors: { name: string }[];
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  rating: number;
  nbEpisodesTotal: number;
  nbSeasons: number;
  timesWatched: number;
  genre: string;
  totalLength: number;
}
