import type { UserBd } from '../../src/app/models/bd-model';
import { loadUserEntityArrays } from '../local-entity-loader';

export function getLocalBdsByUser(userId: string): UserBd[] {
  return loadUserEntityArrays(
    userId,
    'bds',
    (file) => !file.includes('readlist')
  ) as UserBd[];
}
