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

async function safeCount(
  fetchFn: () => Promise<unknown[]>
): Promise<number> {
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
