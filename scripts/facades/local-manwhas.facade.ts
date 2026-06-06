import type { UserManwha } from '../../src/app/models/manwha-model';
import { loadUserEntityArrays } from '../local-entity-loader';

export function getLocalManwhasByUser(userId: string): UserManwha[] {
  return loadUserEntityArrays(
    userId,
    'manwhas',
    (file) => !file.includes('readlist')
  ) as UserManwha[];
}
