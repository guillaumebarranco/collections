/**
 * Payload allégé de GET /api/dashboard/:userId/overview
 * (fusion user+base côté serveur, champs utiles à la vue d'ensemble).
 */

export type DashboardOverviewLightSeason = {
  seasonNumber: number;
  seasonRating: number;
  seasonTimesWatched: number;
};

export type DashboardOverviewLightSeasonData = {
  seasonNumber: number;
  totalLength: number;
};

export type DashboardOverviewLightSession = {
  finishedGame: boolean;
  finishedGameWithHundredPercent: boolean;
  platinedGame: boolean;
  additionnalEstimatedTime: number;
  currentlyPlaying: boolean;
  sessionStartDate: string;
  sessionEndDate: string;
};

export type DashboardOverview = {
  movies: Array<{
    title: string;
    director: string;
    rating: number;
    timesWatched: number;
    length: number;
  }>;
  books: Array<{
    title: string;
    author: string;
    rating: number;
    readTimes: number;
    pages: number;
  }>;
  series: Array<{
    title: string;
    director: string;
    rating: number;
    seasons: DashboardOverviewLightSeason[];
    seasonsData: DashboardOverviewLightSeasonData[];
  }>;
  games: Array<{
    title: string;
    editor: string;
    rating: number;
    sessions: DashboardOverviewLightSession[];
    averageTimeToFinish: number;
    platineTime: number;
    averageTimeToHundredPercent: number;
    timesFinished: number;
    timesFinishedHundredPercent: number;
    platined: boolean;
    additionnalEstimatedTime: number;
  }>;
  mangas: Array<{
    title: string;
    author: string;
    rating: number;
    readTimes: number;
    nbTomes: number;
  }>;
  manwhas: Array<{
    title: string;
    author: string;
    rating: number;
    readTimes: number;
    nbChapters: number;
  }>;
  comics: Array<{
    title: string;
    writer: string;
    designer: string;
    rating: number;
    readTimes: number;
    pages: number;
  }>;
  bds: Array<{
    title: string;
    writer: string;
    designer: string;
    rating: number;
    readTimes: number;
    pages: number;
  }>;
  musics: Array<{
    title: string;
    artist: string;
    rating: number;
    timesListened: number;
    duration: number;
  }>;
  watchlistMoviesCount: number;
  watchlistSeriesCount: number;
  readlistBooksCount: number;
  readlistMangasCount: number;
  readlistComicsCount: number;
  readlistBdsCount: number;
  readlistManwhasCount: number;
};
