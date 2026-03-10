import { getApiBaseUrl } from '../../core/config';
import { fetchUserMoviesFromApi } from '../movies/api-movies.facade';
import { fetchUserSeriesFromApi } from '../series/api-series.facade';
import { fetchUserBooksFromApi } from '../books/api-books.facade';
import { fetchUserGamesFromApi } from '../games/api-games.facade';
import { fetchUserMangasFromApi } from '../mangas/api-mangas.facade';
import { fetchUserManwhasFromApi } from '../manwhas/api-manwhas.facade';
import { fetchUserComicsFromApi } from '../comics/api-comics.facade';
import { fetchUserBdsFromApi } from '../bds/api-bds.facade';
import { fetchUserMusicsFromApi } from '../musics/api-musics.facade';

export type AdminUser = {
  username: string;
};

export type AdminUsersResponse = {
  count: number;
  users: AdminUser[];
};

/** Comptages par type de collection pour un utilisateur (admin). */
export type UserCollectionCounts = {
  movies: number;
  series: number;
  books: number;
  games: number;
  mangas: number;
  manwhas: number;
  comics: number;
  bds: number;
  musics: number;
};

/** value = nombre d'entités (mostReadSeen) ou jours (mostTimeReadWatched). */
export type AdminRecordEntry = {
  username: string;
  value: number;
};

export type AdminRecordsCategory = {
  mostReadSeen: AdminRecordEntry[];
  mostTimeReadWatched: AdminRecordEntry[];
};

export type AdminRecordsCategoryKey =
  | 'books'
  | 'movies'
  | 'series'
  | 'games'
  | 'mangas'
  | 'manwhas'
  | 'comics'
  | 'bds'
  | 'musics';

/**
 * Réponse de l'API GET /admin/records.
 * Chaque catégorie : mostReadSeen (top 3 par nombre), mostTimeReadWatched (top 3 par temps, value en jours).
 * @see docs/API_ADMIN_RECORDS.md
 */
export type AdminRecordsResponse = Record<
  AdminRecordsCategoryKey,
  AdminRecordsCategory
>;

async function safeCount(fetchFn: () => Promise<unknown[]>): Promise<number> {
  try {
    const list = await fetchFn();
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

export async function getAdminUserStats(
  userId: string
): Promise<UserCollectionCounts> {
  const uid = userId.toLowerCase();
  const [movies, series, books, games, mangas, manwhas, comics, bds, musics] =
    await Promise.all([
      safeCount(() => fetchUserMoviesFromApi(uid)),
      safeCount(() => fetchUserSeriesFromApi(uid)),
      safeCount(() => fetchUserBooksFromApi(uid)),
      safeCount(() => fetchUserGamesFromApi(uid)),
      safeCount(() => fetchUserMangasFromApi(uid)),
      safeCount(() => fetchUserManwhasFromApi(uid)),
      safeCount(() => fetchUserComicsFromApi(uid)),
      safeCount(() => fetchUserBdsFromApi(uid)),
      safeCount(() => fetchUserMusicsFromApi(uid)),
    ]);
  return {
    movies,
    series,
    books,
    games,
    mangas,
    manwhas,
    comics,
    bds,
    musics,
  };
}

/**
 * Récupère les records (top 3 par nombre et par temps) depuis l'API dédiée.
 * Un seul appel HTTP : le backend agrège et renvoie directement la structure attendue.
 * @param adminUserId - ID de l'admin (pour autorisation)
 * @returns Données des records ou null si l'API n'est pas disponible / erreur
 */
export async function getAdminRecords(
  adminUserId: string
): Promise<AdminRecordsResponse | null> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/admin/records?userId=${encodeURIComponent(adminUserId)}`
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return normalizeAdminRecordsResponse(data);
  } catch {
    return null;
  }
}

const RECORDS_CATEGORY_KEYS: AdminRecordsCategoryKey[] = [
  'books',
  'movies',
  'series',
  'games',
  'mangas',
  'manwhas',
  'comics',
  'bds',
  'musics',
];

function normalizeEntry(entry: unknown): AdminRecordEntry {
  const e = entry as Record<string, unknown>;
  return {
    username: String(e?.['username'] ?? ''),
    value: Number(e?.['value'] ?? 0),
  };
}

function normalizeCategory(rawCat: unknown): AdminRecordsCategory {
  const cat = rawCat as Record<string, unknown>;
  return {
    mostReadSeen: Array.isArray(cat?.['mostReadSeen'])
      ? (cat['mostReadSeen'] as unknown[]).map(normalizeEntry)
      : [],
    mostTimeReadWatched: Array.isArray(cat?.['mostTimeReadWatched'])
      ? (cat['mostTimeReadWatched'] as unknown[]).map(normalizeEntry)
      : [],
  };
}

function normalizeAdminRecordsResponse(raw: unknown): AdminRecordsResponse {
  const rawObj = raw as Record<string, unknown>;
  const result = {} as AdminRecordsResponse;
  for (const key of RECORDS_CATEGORY_KEYS) {
    result[key] = normalizeCategory(rawObj?.[key] ?? {});
  }
  return result;
}

export async function getAdminUsers(
  userId: string
): Promise<AdminUsersResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/admin/users?userId=${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    return { count: 0, users: [] };
  }
  const payload = await response.json();
  return {
    count: Number(payload?.count ?? 0),
    users: Array.isArray(payload?.users) ? payload.users : [],
  };
}
