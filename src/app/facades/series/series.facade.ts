import { Serie, BaseSerie, UserSerie } from '../../models/serie-model';

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
} from './api-series.facade';

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

    return {
      title: serie.title,
      director: serie.director,
      rating: serie.rating,
      timesWatched: serie.timesWatched,
      stoppedAtSeason: serie.stoppedAtSeason || 0,
      actors: definitiveMatchingSerie?.actors || [],
      coverUrl: definitiveMatchingSerie?.coverUrl || '',
      releaseDate: definitiveMatchingSerie?.releaseDate || '',
      endDate: definitiveMatchingSerie?.endDate || '',
      nbEpisodesTotal: definitiveMatchingSerie?.nbEpisodesTotal || 0,
      nbSeasons: definitiveMatchingSerie?.nbSeasons || 0,
      totalLength: definitiveMatchingSerie?.totalLength || 0,
      genre: definitiveMatchingSerie?.genre || '',
    };
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
    return await fetchBaseSeriesFromApi();
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
