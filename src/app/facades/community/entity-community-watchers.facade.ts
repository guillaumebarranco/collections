import { getApiBaseUrl } from '../../core/config';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';
export type CommunityEntityKind =
  | 'movie'
  | 'book'
  | 'serie'
  | 'game'
  | 'manga'
  | 'comic'
  | 'manwha'
  | 'bd';

export type CommunityWatcherSeasonEntry = {
  seasonNumber: number;
  seasonRating: number;
  seasonTimesWatched: number;
  watching: boolean;
};

/** Même forme que l’API : `timesWatched` sert de compteur générique (lectures, parties, visionnages…). */
export type CommunityWatcherEntry = {
  userId: string;
  rating: number;
  timesWatched: number;
  /** Détail par saison (séries uniquement). */
  seasons?: CommunityWatcherSeasonEntry[];
};

const API_PATH: Record<CommunityEntityKind, string> = {
  movie: 'movies/movie-watchers',
  book: 'books/book-watchers',
  serie: 'series/serie-watchers',
  game: 'games/game-watchers',
  manga: 'mangas/manga-watchers',
  comic: 'comics/comic-watchers',
  manwha: 'manwhas/manwha-watchers',
  bd: 'bds/bd-watchers',
};

function isWatcherEngaged(row: CommunityWatcherEntry): boolean {
  return (row.rating ?? 0) > 0 || (row.timesWatched ?? 0) > 1;
}

function sortWatchersForDisplay(
  rows: CommunityWatcherEntry[],
  currentUserId: string
): CommunityWatcherEntry[] {
  const c = currentUserId.trim().toLowerCase();
  const engaged = rows.filter(isWatcherEngaged);
  const notEngaged = rows.filter((r) => !isWatcherEngaged(r));

  const sortTier = (tier: CommunityWatcherEntry[]): CommunityWatcherEntry[] => {
    const me = tier.filter((r) => r.userId.toLowerCase() === c);
    const others = tier.filter((r) => r.userId.toLowerCase() !== c);
    others.sort((a, b) =>
      a.userId.toLowerCase().localeCompare(b.userId.toLowerCase(), 'fr')
    );
    return [...me, ...others];
  };

  return [...sortTier(engaged), ...sortTier(notEngaged)];
}

async function fetchCommunityWatchersFromApi(
  kind: CommunityEntityKind,
  identity: Record<string, string>
): Promise<CommunityWatcherEntry[]> {
  const path = API_PATH[kind];
  const params = new URLSearchParams(identity);
  const response = await fetch(
    `${getApiBaseUrl()}/${path}?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Community watchers API error');
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((r: CommunityWatcherEntry & { seasons?: unknown }) => ({
    userId: String(r.userId),
    rating: Number(r.rating) || 0,
    timesWatched: Number(r.timesWatched) || 0,
    seasons: Array.isArray(r.seasons)
      ? r.seasons.map((se: CommunityWatcherSeasonEntry) => ({
          seasonNumber: Number(se.seasonNumber) || 0,
          seasonRating: Number(se.seasonRating) || 0,
          seasonTimesWatched: Number(se.seasonTimesWatched) || 0,
          watching: Boolean(se.watching),
        }))
      : undefined,
  }));
}

export async function getEntityCommunityWatchers(
  kind: CommunityEntityKind,
  identity: Record<string, string>,
  currentUserId: string
): Promise<CommunityWatcherEntry[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  const normalizedCurrent = currentUserId.trim().toLowerCase();

  try {
    const rows = await fetchCommunityWatchersFromApi(kind, identity);
    return sortWatchersForDisplay(rows, normalizedCurrent);
  } catch {
    return [];
  }
}

/** @deprecated Utiliser {@link getEntityCommunityWatchers} avec le kind `movie`. */
export async function getMovieWatchers(
  title: string,
  director: string,
  currentUserId: string
): Promise<CommunityWatcherEntry[]> {
  return getEntityCommunityWatchers(
    'movie',
    { title, director },
    currentUserId
  );
}
