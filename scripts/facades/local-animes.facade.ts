import type { UserAnime } from '../../src/app/models/anime-model';
import { loadUserEntityArrays } from '../local-entity-loader';

export function getLocalAnimesByUser(userId: string): UserAnime[] {
  return loadUserEntityArrays(
    userId,
    'animes',
    (file) => !file.includes('watchlist')
  ) as UserAnime[];
}
