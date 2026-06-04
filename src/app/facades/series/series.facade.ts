import {
  Serie,
  BaseSerie,
  UserSerie,
  UserSerieSeason,
} from '../../models/serie-model';

import {
  fetchBaseSeriesFromApi,
  fetchUserSeriesFromApi,
  fetchWatchlistSeriesFromApi,
  fetchOtherUsersSeriesRatedFromApi,
  OtherUserSerieRating,
} from './api-series.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getSerieDataFromUserSerieAndBaseSerie } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseSeriesCached = createCachedFetcher(fetchBaseSeriesFromApi);

function buildSeasons(
  seasonsCount: number,
  existing?: UserSerieSeason[]
): UserSerieSeason[] {
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

async function getAllSeriesData(series: UserSerie[]): Promise<Serie[]> {
  const baseSeries = await getAllBaseSeries();

  return series.map((serie: UserSerie) => {
    const matchingBaseSerie = baseSeries.filter(
      (baseSerie: BaseSerie) => baseSerie.title === serie.title
    );

    // For the case when multiple series have the same name, hence matching from serie director
    const definitiveMatchingSerie =
      matchingBaseSerie.length === 1
        ? matchingBaseSerie[0]
        : matchingBaseSerie.filter((baseSerie: BaseSerie) => {
            return baseSerie.director === serie.director;
          })[0];

    const seasonsCount =
      definitiveMatchingSerie?.seasonsData?.length ??
      serie.seasons?.length ??
      0;
    const seasons = buildSeasons(seasonsCount, serie.seasons);

    return getSerieDataFromUserSerieAndBaseSerie(
      serie,
      definitiveMatchingSerie,
      seasons
    );
  });
}

export async function getAllSeries(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Serie[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllSeriesData(offline.series.user),
    };
  }

  try {
    const userSeries = await fetchUserSeriesFromApi(currentUserId);
    return {
      [currentUserId]: await getAllSeriesData(userSeries),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllWatchlistSeries(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Serie[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllSeriesData(offline.series.watchlist),
    };
  }

  try {
    const watchlist = await fetchWatchlistSeriesFromApi(currentUserId);
    return {
      [currentUserId]: await getAllSeriesData(watchlist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseSeries(): Promise<BaseSerie[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.series.base;

  try {
    return await fetchBaseSeriesCached();
  } catch {
    return [];
  }
}

export async function getAllSeriesMerged(
  currentUserId = 'guillaume'
): Promise<Serie[]> {
  const allSeries = await getAllSeries(currentUserId);
  return Object.values(allSeries)
    .flat()
    .reduce((acc: Serie[], item: Serie) => {
      if (
        acc.find(
          (serie) =>
            serie.title === item.title && serie.director === item.director
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getSeriesByUser(userId: string): Promise<Serie[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllSeriesData(offline.series.user);
  }

  try {
    const userSeries = await fetchUserSeriesFromApi(userId);
    return getAllSeriesData(userSeries);
  } catch {
    return [];
  }
}

export async function getCurrentWatchlistSeriesByUser(
  userId: string
): Promise<Serie[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllSeriesData(offline.series.watchlist);
  }

  try {
    const watchlist = await fetchWatchlistSeriesFromApi(userId);
    return getAllSeriesData(watchlist);
  } catch {
    return [];
  }
}

export async function getOtherUsersSeriesRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserSerieRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersSeriesRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
