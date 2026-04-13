import { baseSeries } from '../../utils/entities/series/base_series';
import { baseSeriesAnimees } from '../../utils/entities/series/base_series_animees';

import { guillaumeSeries } from '../../utils/users/guillaume/series';
import { guillaumeWatchListSeries } from '../../utils/users/guillaume/series/guillaume_watchlist_series';
import { ronanSeries } from '../../utils/users/ronan/series/ronan_series';
import { ronanWatchlistSeries } from '../../utils/users/ronan/series/ronan_watchlist_series';
import { BaseSerie, UserSerie } from '../../models/serie-model';
import { kevinSeries } from '../../utils/users/kevin/series/kevin_series';
import { kevinWatchlistSeries } from '../../utils/users/kevin/series/kevin_watchlist_series';
import { amandineSeries } from '../../utils/users/amandine/series/amandine_series';
import { amandineWatchListSeries } from '../../utils/users/amandine/series/amandine_watchlist_series';
import { williamSeries } from '../../utils/users/william/series/william_series';
import { williamWatchListSeries } from '../../utils/users/william/series/william_watchlist_series';
import { cassandreWatchListSeries } from '../../utils/users/cassandre/series/cassandre_watchlist_series';
import { cassandreSeries } from '../../utils/users/cassandre/series/cassandre_series';
import { marinaSeries } from '../../utils/users/marina/series/marina_series';
import { marinaWatchListSeries } from '../../utils/users/marina/series/marina_watchlist_series';
import { masterofmadnessSeries } from '../../utils/users/masterofmadness/series/masterofmadness_series';
import { baseSeriesApi } from '../../utils/entities/series/base_series_api';

export const allBaseSeries: BaseSerie[] = [
  ...baseSeries,
  ...baseSeriesAnimees,
  ...baseSeriesApi,
];

export function getLocalSeriesByUser(userId: string): UserSerie[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeSeries];
    case 'ronan':
      return [...ronanSeries];
    case 'kevin':
      return [...kevinSeries];
    case 'amandine':
      return [...amandineSeries];
    case 'william':
      return [...williamSeries];
    case 'cassandre':
      return [...cassandreSeries];
    case 'marina':
      return [...marinaSeries];
    case 'masterofmadness':
      return [...masterofmadnessSeries];
    default:
      return [];
  }
}

export function getLocalWatchlistByUser(userId: string): UserSerie[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeWatchListSeries];
    case 'ronan':
      return [...ronanWatchlistSeries];
    case 'kevin':
      return [...kevinWatchlistSeries];
    case 'amandine':
      return [...amandineWatchListSeries];
    case 'william':
      return [...williamWatchListSeries];
    case 'cassandre':
      return [...cassandreWatchListSeries];
    case 'marina':
      return [...marinaWatchListSeries];
    default:
      return [];
  }
}
