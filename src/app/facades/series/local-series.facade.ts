import { baseSeries } from '../../utils/entities/series/base_series';
import { baseSeriesApi } from '../../utils/entities/series/base_series_api';

import { guillaumeSeries } from '../../utils/users/guillaume/series';
import { ronanSeries } from '../../utils/users/ronan/series/ronan_series';
import { BaseSerie, UserSerie } from '../../models/serie-model';

export const allBaseSeries: BaseSerie[] = [...baseSeries, ...baseSeriesApi];

export function getLocalSeriesByUser(userId: string): UserSerie[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeSeries];
    case 'ronan':
      return [...ronanSeries];
    default:
      return [];
  }
}
