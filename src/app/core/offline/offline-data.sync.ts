import { fetchBaseBdsFromApi, fetchReadlistBdsFromApi, fetchUserBdsFromApi } from '../../facades/bds/api-bds.facade';
import {
  fetchBaseBooksFromApi,
  fetchReadlistBooksFromApi,
  fetchUserBooksFromApi,
} from '../../facades/books/api-books.facade';
import {
  fetchBaseComicsFromApi,
  fetchReadlistComicsFromApi,
  fetchUserComicsFromApi,
} from '../../facades/comics/api-comics.facade';
import {
  fetchBaseGamesFromApi,
  fetchGamelistGamesFromApi,
  fetchUserGamesFromApi,
} from '../../facades/games/api-games.facade';
import { invalidateBaseGamesCache } from '../../facades/games/games.facade';
import {
  fetchBaseMangasFromApi,
  fetchReadlistMangasFromApi,
  fetchUserMangasFromApi,
} from '../../facades/mangas/api-mangas.facade';
import {
  fetchBaseManwhasFromApi,
  fetchReadlistManwhasFromApi,
  fetchUserManwhasFromApi,
} from '../../facades/manwhas/api-manwhas.facade';
import {
  fetchBaseMoviesFromApi,
  fetchUserMoviesFromApi,
  fetchWatchlistMoviesFromApi,
} from '../../facades/movies/api-movies.facade';
import {
  fetchBaseMusicsFromApi,
  fetchUserMusicsFromApi,
} from '../../facades/musics/api-musics.facade';
import {
  fetchBaseSeriesFromApi,
  fetchUserSeriesFromApi,
  fetchWatchlistSeriesFromApi,
} from '../../facades/series/api-series.facade';
import { fetchTopFiveFromApi } from '../../facades/top-five/api-top-five.facade';
import { createEmptyTopFive } from '../../models/top-five-model';
import type { OfflineCachePayload } from './offline-cache.model';

export type OfflineSyncResult =
  | { ok: true; payload: OfflineCachePayload }
  | { ok: false; error: string };

/**
 * Télécharge les données de l’utilisateur connecté (base + user) pour le mode hors-ligne.
 */
export async function fetchOfflineCachePayload(
  userId: string
): Promise<OfflineSyncResult> {
  const normalizedId = userId.trim().toLowerCase();
  if (!normalizedId) {
    return { ok: false, error: 'Utilisateur non connecté.' };
  }

  try {
    invalidateBaseGamesCache();

    const [
      moviesBase,
      moviesUser,
      moviesWatchlist,
      booksBase,
      booksUser,
      booksReadlist,
      seriesBase,
      seriesUser,
      seriesWatchlist,
      gamesBase,
      gamesUser,
      gamesGamelist,
      mangasBase,
      mangasUser,
      mangasReadlist,
      manwhasBase,
      manwhasUser,
      manwhasReadlist,
      comicsBase,
      comicsUser,
      comicsReadlist,
      bdsBase,
      bdsUser,
      bdsReadlist,
      musicsBase,
      musicsUser,
      topFive,
    ] = await Promise.all([
      fetchBaseMoviesFromApi(),
      fetchUserMoviesFromApi(normalizedId),
      fetchWatchlistMoviesFromApi(normalizedId),
      fetchBaseBooksFromApi(),
      fetchUserBooksFromApi(normalizedId),
      fetchReadlistBooksFromApi(normalizedId),
      fetchBaseSeriesFromApi(),
      fetchUserSeriesFromApi(normalizedId),
      fetchWatchlistSeriesFromApi(normalizedId),
      fetchBaseGamesFromApi(),
      fetchUserGamesFromApi(normalizedId),
      fetchGamelistGamesFromApi(normalizedId),
      fetchBaseMangasFromApi(),
      fetchUserMangasFromApi(normalizedId),
      fetchReadlistMangasFromApi(normalizedId),
      fetchBaseManwhasFromApi(),
      fetchUserManwhasFromApi(normalizedId),
      fetchReadlistManwhasFromApi(normalizedId),
      fetchBaseComicsFromApi(),
      fetchUserComicsFromApi(normalizedId),
      fetchReadlistComicsFromApi(normalizedId),
      fetchBaseBdsFromApi(),
      fetchUserBdsFromApi(normalizedId),
      fetchReadlistBdsFromApi(normalizedId),
      fetchBaseMusicsFromApi(),
      fetchUserMusicsFromApi(normalizedId),
      fetchTopFiveFromApi(normalizedId).catch(() => createEmptyTopFive()),
    ]);

    const payload: OfflineCachePayload = {
      userId: normalizedId,
      savedAt: new Date().toISOString(),
      movies: {
        base: moviesBase,
        user: moviesUser,
        watchlist: moviesWatchlist,
      },
      books: {
        base: booksBase,
        user: booksUser,
        readlist: booksReadlist,
      },
      series: {
        base: seriesBase,
        user: seriesUser,
        watchlist: seriesWatchlist,
      },
      games: {
        base: gamesBase,
        user: gamesUser,
        gamelist: gamesGamelist,
      },
      mangas: {
        base: mangasBase,
        user: mangasUser,
        readlist: mangasReadlist,
      },
      manwhas: {
        base: manwhasBase,
        user: manwhasUser,
        readlist: manwhasReadlist,
      },
      comics: {
        base: comicsBase,
        user: comicsUser,
        readlist: comicsReadlist,
      },
      bds: {
        base: bdsBase,
        user: bdsUser,
        readlist: bdsReadlist,
      },
      musics: {
        base: musicsBase,
        user: musicsUser,
      },
      topFive,
    };

    return { ok: true, payload };
  } catch {
    return {
      ok: false,
      error:
        'Échec de la sauvegarde. Vérifiez votre connexion et réessayez.',
    };
  }
}
