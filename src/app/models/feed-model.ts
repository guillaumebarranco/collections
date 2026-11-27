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

export interface FeedItemAlbum {
  title: string;
  artist: string;
  date: string;
  rating?: number;
}

export interface FeedItemGame {
  title: string;
  editor: string;
  date: string;
  rating?: number;
}

export interface FeedUserEntry {
  userId: string;
  movies: FeedItemMovie[];
  books: FeedItemBook[];
  series: FeedItemSerie[];
  games: FeedItemGame[];
  albums: FeedItemAlbum[];
}

export interface FeedResponse {
  feed: FeedUserEntry[];
}
