import type { UserManga } from '../../src/app/models/manga-model';
import { loadUserEntityArrays } from '../local-entity-loader';

export function getLocalMangasByUser(userId: string): UserManga[] {
  return loadUserEntityArrays(
    userId,
    'mangas',
    (file) => !file.includes('readlist')
  ) as UserManga[];
}
