export interface Movie {
  title: string;
  director: string;
  actors: {
    name: string;
  }[];
  coverUrl: string;
  releaseDate: string;
  rating: number;
  length: number;
  genre: string;
  timesWatched: number;
  lastViewedDate?: string;
}
