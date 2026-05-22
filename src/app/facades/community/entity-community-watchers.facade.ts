import { isLocalhost } from '../../core/config';
import { getApiBaseUrl } from '../../core/config';
import { getLocalMoviesByUser } from '../movies/local-movies.facade';
import { getLocalBooksByUser } from '../books/local-books.facade';
import { getLocalSeriesByUser } from '../series/local-series.facade';
import { getLocalGamesByUser } from '../games/local-games.facade';
import { getLocalMangasByUser } from '../mangas/local-mangas.facade';
import { getLocalComicsByUser } from '../comics/local-comics.facade';
import { getLocalManwhasByUser } from '../manwhas/local-manwhas.facade';
import { getLocalBdsByUser } from '../bds/local-bds.facade';
import type { UserGame } from '../../models/game-model';
import type { UserSerie } from '../../models/serie-model';
import { ALL_LOCAL_COMMUNITY_USER_IDS } from './community-local-user-ids';

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
};

/** Même forme que l’API : `timesWatched` sert de compteur générique (lectures, parties, visionnages…). */
export type CommunityWatcherEntry = {
  userId: string;
  rating: number;
  timesWatched: number;
  /** Détail par saison (séries uniquement). */
  seasons?: CommunityWatcherSeasonEntry[];
};

function mapSerieSeasonsForCommunity(
  serie: UserSerie
): CommunityWatcherSeasonEntry[] {
  return [...(serie.seasons ?? [])]
    .filter((se) => (se.seasonTimesWatched ?? 0) > 0)
    .sort((a, b) => a.seasonNumber - b.seasonNumber)
    .map((se) => ({
      seasonNumber: se.seasonNumber,
      seasonRating: se.seasonRating ?? 0,
      seasonTimesWatched: se.seasonTimesWatched ?? 0,
    }));
}

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

function gameFinishedSessionsCount(game: UserGame): number {
  return (game.sessions ?? []).filter((s) => s.finishedGame).length;
}

function serieWatchCount(serie: UserSerie): number {
  return (serie.seasons ?? []).reduce(
    (acc, se) => acc + Math.max(0, Math.floor(se.seasonTimesWatched ?? 0)),
    0
  );
}

function serieAverageRating(serie: UserSerie): number {
  const seasons = serie.seasons ?? [];
  const rated = seasons.filter(
    (se) => (se.seasonTimesWatched ?? 0) >= 1 && (se.seasonRating ?? 0) > 0
  );
  if (rated.length === 0) {
    return 0;
  }
  const total = rated.reduce((a, se) => a + (se.seasonRating ?? 0), 0);
  return Math.round((total / rated.length) * 2) / 2;
}

function extractLocalWatcherRow(
  kind: CommunityEntityKind,
  userId: string,
  identity: Record<string, string>
): CommunityWatcherEntry | null {
  const title = identity['title'] ?? '';
  switch (kind) {
    case 'movie': {
      const director = identity['director'] ?? '';
      const movies = getLocalMoviesByUser(userId);
      const match = movies.find(
        (m) =>
          m.title === title &&
          m.director === director &&
          (m.timesWatched ?? 0) > 0
      );
      return match
        ? {
            userId,
            rating: match.rating ?? 0,
            timesWatched: match.timesWatched ?? 0,
          }
        : null;
    }
    case 'book': {
      const author = identity['author'] ?? '';
      const books = getLocalBooksByUser(userId);
      const match = books.find(
        (b) =>
          b.title === title &&
          b.author === author &&
          (b.readTimes ?? 0) >= 1
      );
      return match
        ? {
            userId,
            rating: match.rating ?? 0,
            timesWatched: match.readTimes ?? 0,
          }
        : null;
    }
    case 'serie': {
      const director = identity['director'] ?? '';
      const series = getLocalSeriesByUser(userId);
      const match = series.find(
        (s) => s.title === title && s.director === director
      );
      if (!match) return null;
      const tw = serieWatchCount(match);
      if (tw <= 0) return null;
      return {
        userId,
        rating: serieAverageRating(match),
        timesWatched: tw,
        seasons: mapSerieSeasonsForCommunity(match),
      };
    }
    case 'game': {
      const editor = identity['editor'] ?? '';
      const games = getLocalGamesByUser(userId);
      const match = games.find(
        (g) => g.title === title && g.editor === editor
      );
      if (!match) return null;
      const n = gameFinishedSessionsCount(match);
      if (n <= 0) return null;
      return {
        userId,
        rating: match.rating ?? 0,
        timesWatched: n,
      };
    }
    case 'manga': {
      const author = identity['author'] ?? '';
      const mangas = getLocalMangasByUser(userId);
      const match = mangas.find(
        (m) =>
          m.title === title &&
          m.author === author &&
          (m.readTimes ?? 0) >= 1
      );
      return match
        ? {
            userId,
            rating: match.rating ?? 0,
            timesWatched: match.readTimes ?? 0,
          }
        : null;
    }
    case 'comic': {
      const writer = identity['writer'] ?? '';
      const comics = getLocalComicsByUser(userId);
      const match = comics.find(
        (c) =>
          c.title === title &&
          c.writer === writer &&
          (c.readTimes ?? 0) >= 1
      );
      return match
        ? {
            userId,
            rating: match.rating ?? 0,
            timesWatched: match.readTimes ?? 0,
          }
        : null;
    }
    case 'manwha': {
      const author = identity['author'] ?? '';
      const manwhas = getLocalManwhasByUser(userId);
      const match = manwhas.find(
        (m) =>
          m.title === title &&
          m.author === author &&
          (m.readTimes ?? 0) >= 1
      );
      return match
        ? {
            userId,
            rating: match.rating ?? 0,
            timesWatched: match.readTimes ?? 0,
          }
        : null;
    }
    case 'bd': {
      const writer = identity['writer'] ?? '';
      const bds = getLocalBdsByUser(userId);
      const match = bds.find(
        (b) =>
          b.title === title &&
          b.writer === writer &&
          (b.readTimes ?? 0) >= 1
      );
      return match
        ? {
            userId,
            rating: match.rating ?? 0,
            timesWatched: match.readTimes ?? 0,
          }
        : null;
    }
    default:
      return null;
  }
}

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
        }))
      : undefined,
  }));
}

function loadLocalCommunityWatchers(
  kind: CommunityEntityKind,
  identity: Record<string, string>
): CommunityWatcherEntry[] {
  const rows: CommunityWatcherEntry[] = [];
  for (const uid of ALL_LOCAL_COMMUNITY_USER_IDS) {
    const row = extractLocalWatcherRow(kind, uid, identity);
    if (row) {
      rows.push(row);
    }
  }
  return rows;
}

export async function getEntityCommunityWatchers(
  kind: CommunityEntityKind,
  identity: Record<string, string>,
  currentUserId: string
): Promise<CommunityWatcherEntry[]> {
  const normalizedCurrent = currentUserId.trim().toLowerCase();

  try {
    const rows = await fetchCommunityWatchersFromApi(kind, identity);
    if (rows.length > 0 || !isLocalhost()) {
      return sortWatchersForDisplay(rows, normalizedCurrent);
    }
  } catch {
    if (!isLocalhost()) {
      return [];
    }
  }

  const rows = loadLocalCommunityWatchers(kind, identity);
  return sortWatchersForDisplay(rows, normalizedCurrent);
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
