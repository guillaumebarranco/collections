import type { UserComic } from '../../src/app/models/comic-model';
import { loadUserEntityArrays } from '../local-entity-loader';

export function getLocalComicsByUser(userId: string): UserComic[] {
  return loadUserEntityArrays(
    userId,
    'comics',
    (file) => !file.includes('readlist')
  ) as UserComic[];
}
