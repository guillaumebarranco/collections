import type { UserGame } from '../../src/app/models/game-model';
import { loadUserEntityArrays } from '../local-entity-loader';

export function getLocalGamesByUser(userId: string): UserGame[] {
  return loadUserEntityArrays(
    userId,
    'games',
    (file) => !file.includes('gamelist')
  ) as UserGame[];
}
