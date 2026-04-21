export interface FeedItemMovie {
  title: string;
  director: string;
  date: string;
  rating?: number;
}

export interface FeedItemBook {
  title: string;
  author: string;
  date: string;
  rating?: number;
}

export interface FeedItemSerie {
  title: string;
  director: string;
  date: string;
  rating?: number;
  /** Saison associée à la dernière date de visionnage affichée. */
  seasonNumber?: number;
}

export interface FeedUserEntry {
  userId: string;
  movies: FeedItemMovie[];
  books: FeedItemBook[];
  series: FeedItemSerie[];
}

export interface FeedResponse {
  feed: FeedUserEntry[];
}
