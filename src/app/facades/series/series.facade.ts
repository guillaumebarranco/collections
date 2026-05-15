import {
  Serie,
  BaseSerie,
  UserSerie,
  UserSerieSeason,
} from '../../models/serie-model';

import {
  allBaseSeries,
  getLocalSeriesByUser,
  getLocalWatchlistByUser,
} from './local-series.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseSeriesFromApi,
  fetchUserSeriesFromApi,
  fetchWatchlistSeriesFromApi,
  fetchOtherUsersSeriesRatedFromApi,
  OtherUserSerieRating,
} from './api-series.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getSerieDataFromUserSerieAndBaseSerie } from '../../helpers/entities.helper';

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
        seasonTimesWatched: 0,
        /** Pas de date : la saison n’a pas été vue (évite de fausser le tri « visionnage récent »). */
        lastViewedDate: '',
      })
    );
    return [...existing, ...missing];
  }
  return Array.from({ length: safeNbSeasons }, (_, index) => ({
    seasonNumber: index + 1,
    seasonRating: 0,
    seasonTimesWatched: 0,
    lastViewedDate: '',
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
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllSeriesData(
        getLocalSeriesByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllSeriesData(
        getLocalWatchlistByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return allBaseSeries;
  }

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
  if (isLocalhost()) {
    return getAllSeriesData(getLocalSeriesByUser(userId));
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
  if (isLocalhost()) {
    return getAllSeriesData(getLocalWatchlistByUser(userId));
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
  const otherUsers =
    followedUserIds.length > 0
      ? followedUserIds.filter((id) => id !== currentUserId.toLowerCase())
      : [];
  if (isLocalhost()) {
    const results: OtherUserSerieRating[] = [];
    otherUsers.forEach((username) => {
      const series = getLocalSeriesByUser(username);
      series
        .filter((serie: any) => {
          // Pour les séries, on prend la note moyenne des saisons
          const seasons = serie.seasons || [];
          if (seasons.length === 0) return false;
          const avgRating =
            seasons.reduce(
              (sum: number, s: any) => sum + (s.seasonRating || 0),
              0
            ) / seasons.length;
          return avgRating >= minRating;
        })
        .forEach((serie: any) => {
          const seasons = serie.seasons || [];
          const avgRating =
            seasons.length > 0
              ? seasons.reduce(
                  (sum: number, s: any) => sum + (s.seasonRating || 0),
                  0
                ) / seasons.length
              : 0;
          results.push({
            title: serie.title,
            director: serie.director,
            rating: avgRating,
            userId: username,
          });
        });
    });
    return results;
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
