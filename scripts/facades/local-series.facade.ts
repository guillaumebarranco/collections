import type { UserSerie } from '../../src/app/models/serie-model';
import { loadUserEntityArrays } from '../local-entity-loader';

export function getLocalSeriesByUser(userId: string): UserSerie[] {
  return loadUserEntityArrays(
    userId,
    'series',
    (file) => !file.includes('watchlist')
  ) as UserSerie[];
}
