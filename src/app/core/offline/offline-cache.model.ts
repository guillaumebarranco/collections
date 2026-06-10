import type { BaseBd, UserBd } from '../../models/bd-model';
import type { BaseBook, UserBook } from '../../models/book-model';
import type {
  BaseChildrenBook,
  UserChildrenBook,
} from '../../models/children-book-model';
import type { BaseComic, UserComic } from '../../models/comic-model';
import type { BaseGame, UserGame } from '../../models/game-model';
import type { BaseManga, UserManga } from '../../models/manga-model';
import type { BaseManwha, UserManwha } from '../../models/manwha-model';
import type { BaseMovie, UserMovie } from '../../models/movie-model';
import type { BaseMusic, UserMusic } from '../../models/music-model';
import type { BaseSerie, UserSerie } from '../../models/serie-model';
import type { TopFiveByEntity } from '../../models/top-five-model';

export interface OfflineMoviesCache {
  base: BaseMovie[];
  user: UserMovie[];
  watchlist: UserMovie[];
}

export interface OfflineBooksCache {
  base: BaseBook[];
  user: UserBook[];
  readlist: UserBook[];
}

export interface OfflineChildrenBooksCache {
  base: BaseChildrenBook[];
  user: UserChildrenBook[];
  readlist: UserChildrenBook[];
}

export interface OfflineSeriesCache {
  base: BaseSerie[];
  user: UserSerie[];
  watchlist: UserSerie[];
}

export interface OfflineGamesCache {
  base: BaseGame[];
  user: UserGame[];
  gamelist: UserGame[];
}

export interface OfflineMangasCache {
  base: BaseManga[];
  user: UserManga[];
  readlist: UserManga[];
}

export interface OfflineManwhasCache {
  base: BaseManwha[];
  user: UserManwha[];
  readlist: UserManwha[];
}

export interface OfflineComicsCache {
  base: BaseComic[];
  user: UserComic[];
  readlist: UserComic[];
}

export interface OfflineBdsCache {
  base: BaseBd[];
  user: UserBd[];
  readlist: UserBd[];
}

export interface OfflineMusicsCache {
  base: BaseMusic[];
  user: UserMusic[];
}

export interface OfflineCachePayload {
  userId: string;
  savedAt: string;
  movies: OfflineMoviesCache;
  books: OfflineBooksCache;
  childrenBooks: OfflineChildrenBooksCache;
  series: OfflineSeriesCache;
  games: OfflineGamesCache;
  mangas: OfflineMangasCache;
  manwhas: OfflineManwhasCache;
  comics: OfflineComicsCache;
  bds: OfflineBdsCache;
  musics: OfflineMusicsCache;
  topFive: TopFiveByEntity;
}

export interface OfflinePrefs {
  cacheEnabled: boolean;
  offlineModeActive: boolean;
  lastSavedAt: string | null;
  cacheUserId: string | null;
}
