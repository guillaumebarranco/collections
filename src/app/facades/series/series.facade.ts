import { Serie, BaseSerie, UserSerie } from '../../models/serie-model';

import { allBaseSeries, getLocalSeriesByUser } from './local-series.facade';
import { DEFAULT_USER_IDS, isLocalhost } from '../../core/config';
import { fetchUserSeriesFromApi } from './api-series.facade';

function getAllSeriesData(series: UserSerie[]): Serie[] {
  return series.map((serie: UserSerie) => {
    const matchingBaseSerie = allBaseSeries.filter(
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

function buildSeriesMap(
  userId: string,
  series: Serie[]
): { [key: string]: Serie[] } {
  return DEFAULT_USER_IDS.reduce(
    (acc, id) => ({
      ...acc,
      [id]: id === userId ? series : [],
    }),
    {} as { [key: string]: Serie[] }
  );
}

export async function getAllSeries(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Serie[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllSeriesData(getLocalSeriesByUser('guillaume')),
      william: getAllSeriesData(getLocalSeriesByUser('william')),
      kevin: getAllSeriesData(getLocalSeriesByUser('kevin')),
      amandine: getAllSeriesData(getLocalSeriesByUser('amandine')),
      ronan: getAllSeriesData(getLocalSeriesByUser('ronan')),
    };
  }

  try {
    const userSeries = await fetchUserSeriesFromApi(currentUserId);
    return buildSeriesMap(currentUserId, getAllSeriesData(userSeries));
  } catch {
    return buildSeriesMap(currentUserId, []);
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
