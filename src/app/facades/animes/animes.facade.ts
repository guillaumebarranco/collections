import {
  Anime,
  BaseAnime,
  UserAnime,
  UserAnimeSeason,
} from '../../models/anime-model';
import type { LightAnime } from '../../models/entity-light.model';

import {
  fetchBaseAnimesFromApi,
  fetchBaseAnimesLightFromApi,
  fetchMergedUserAnimesFromApi,
  fetchMergedWatchlistAnimesFromApi,
  fetchUserAnimesFromApi,
  fetchWatchlistAnimesFromApi,
  fetchOtherUsersAnimesRatedFromApi,
  OtherUserAnimeRating,
} from './api-animes.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getAnimeDataFromUserAnimeAndBaseAnime } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseAnimesCached = createCachedFetcher(fetchBaseAnimesFromApi);
const fetchBaseAnimesLightCached = createCachedFetcher(
  fetchBaseAnimesLightFromApi
);

function buildSeasons(
  seasonsCount: number,
  existing?: UserAnimeSeason[]
): UserAnimeSeason[] {
  const safeNbSeasons = Math.max(0, Number(seasonsCount) || 0);
  if (existing && existing.length > 0) {
    if (existing.length >= safeNbSeasons) {
      return existing.slice(0, safeNbSeasons);
    }
    const missing = Array.from(
      { length: safeNbSeasons - existing.length },
      (_, index) => ({
        seasonNumber: existing.length + index + 1,
        seasonRating: 0,
        watching: false,
        seasonTimesWatched: 0,
        /** Pas de date : la saison n’a pas été vue (évite de fausser le tri « visionnage récent »). */
        firstViewedDate: '',
        lastViewedDate: '',
        otherViewedDates: [],
      })
    );
    return [...existing, ...missing];
  }
  return Array.from({ length: safeNbSeasons }, (_, index) => ({
    seasonNumber: index + 1,
    seasonRating: 0,
    watching: false,
    seasonTimesWatched: 0,
    firstViewedDate: '',
    lastViewedDate: '',
    otherViewedDates: [],
  }));
}

async function getAllAnimesData(animes: UserAnime[]): Promise<Anime[]> {
  const baseAnimes = await getAllBaseAnimes();

  return animes.map((anime: UserAnime) => {
    const matchingBaseAnime = baseAnimes.filter(
      (baseAnime: BaseAnime) => baseAnime.title === anime.title
    );

    // For the case when multiple animes have the same name, hence matching from anime director
    const definitiveMatchingAnime =
      matchingBaseAnime.length === 1
        ? matchingBaseAnime[0]
        : matchingBaseAnime.filter((baseAnime: BaseAnime) => {
            return baseAnime.director === anime.director;
          })[0];

    const seasonsCount =
      definitiveMatchingAnime?.seasonsData?.length ??
      anime.seasons?.length ??
      0;
    const seasons = buildSeasons(seasonsCount, anime.seasons);

    return getAnimeDataFromUserAnimeAndBaseAnime(
      anime,
      definitiveMatchingAnime,
      seasons
    );
  });
}

async function getMergedUserAnimes(userId: string): Promise<Anime[]> {
  try {
    return await fetchMergedUserAnimesFromApi(userId);
  } catch {
    const userAnimes = await fetchUserAnimesFromApi(userId);
    return getAllAnimesData(userAnimes);
  }
}

async function getMergedWatchlistAnimes(userId: string): Promise<Anime[]> {
  try {
    return await fetchMergedWatchlistAnimesFromApi(userId);
  } catch {
    const watchlist = await fetchWatchlistAnimesFromApi(userId);
    return getAllAnimesData(watchlist);
  }
}

export async function getAllAnimes(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Anime[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllAnimesData(offline.animes.user),
    };
  }

  try {
    return {
      [currentUserId]: await getMergedUserAnimes(currentUserId),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllWatchlistAnimes(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Anime[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllAnimesData(offline.animes.watchlist),
    };
  }

  try {
    return {
      [currentUserId]: await getMergedWatchlistAnimes(currentUserId),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseAnimes(): Promise<BaseAnime[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.animes.base;

  try {
    return await fetchBaseAnimesCached();
  } catch {
    return [];
  }
}

/** Catalogue allégé pour les pages select. */
export async function getAllBaseAnimesLight(): Promise<LightAnime[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    return offline.animes.base.map((s) => ({
      title: s.title,
      director: s.director,
      coverUrl: s.coverUrl ?? '',
      releaseDate: s.releaseDate ?? '',
      seasonsCount: s.seasonsData?.length ?? 0,
    }));
  }

  try {
    return await fetchBaseAnimesLightCached();
  } catch {
    return [];
  }
}

export async function getAllAnimesMerged(
  currentUserId = 'guillaume'
): Promise<Anime[]> {
  const allAnimes = await getAllAnimes(currentUserId);
  return Object.values(allAnimes)
    .flat()
    .reduce((acc: Anime[], item: Anime) => {
      if (
        acc.find(
          (anime) =>
            anime.title === item.title && anime.director === item.director
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getAnimesByUser(userId: string): Promise<Anime[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllAnimesData(offline.animes.user);
  }

  try {
    return await getMergedUserAnimes(userId);
  } catch {
    return [];
  }
}

/** User animes bruts (clés d'exclusion select, sans join catalogue). */
export async function getUserAnimesRaw(userId: string): Promise<UserAnime[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.animes.user;
  }
  try {
    return await fetchUserAnimesFromApi(userId);
  } catch {
    return [];
  }
}

export async function getWatchlistAnimesRaw(userId: string): Promise<UserAnime[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.animes.watchlist;
  }
  try {
    return await fetchWatchlistAnimesFromApi(userId);
  } catch {
    return [];
  }
}

export async function getCurrentWatchlistAnimesByUser(
  userId: string
): Promise<Anime[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllAnimesData(offline.animes.watchlist);
  }

  try {
    return await getMergedWatchlistAnimes(userId);
  } catch {
    return [];
  }
}

export async function getOtherUsersAnimesRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserAnimeRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersAnimesRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
