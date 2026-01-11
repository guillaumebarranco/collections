import { Serie, BaseSerie, UserSerie } from '../models/serie-model';

import { baseSeries } from '../utils/entities/series/base_series';

import { guillaumeSeries } from '../utils/users/guillaume/series';
import { ronanSeries } from '../utils/users/ronan/series/ronan_series';

const allBaseSeries: BaseSerie[] = [...baseSeries];

export function getAllSeries(): { [key: string]: Serie[] } {
  return {
    guillaume: getAllSeriesData([...guillaumeSeries]),
    william: getAllSeriesData([]),
    kevin: [],
    amandine: getAllSeriesData([]),
    ronan: getAllSeriesData([...ronanSeries]),
  };
}

export function getAllSeriesMerged(): Serie[] {
  return Object.values(getAllSeries())
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
