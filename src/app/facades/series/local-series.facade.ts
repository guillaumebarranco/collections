import { baseSeries } from '../../utils/entities/series/base_series';
import { baseSeriesApi } from '../../utils/entities/series/base_series_api';

import { guillaumeSeries } from '../../utils/users/guillaume/series';
import { ronanSeries } from '../../utils/users/ronan/series/ronan_series';
import { BaseSerie, UserSerie } from '../../models/serie-model';
import { kevinSeries } from '../../utils/users/kevin/series/kevin_series';
import { amandineSeries } from '../../utils/users/amandine/series/amandine_series';
import { williamSeries } from '../../utils/users/william/series/william_series';

export const allBaseSeries: BaseSerie[] = [...baseSeries, ...baseSeriesApi];

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
    default:
      return [];
  }
}
