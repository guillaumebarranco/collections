import { baseMangas, baseMangasApi } from '../../utils/entities/mangas';
import { guillaumeMangas } from '../../utils/users/guillaume/mangas';
import { BaseManga, UserManga } from '../../models/manga-model';
import { ronanMangas } from '../../utils/users/ronan/mangas/ronan_mangas';
import { williamMangas } from '../../utils/users/william/mangas/william_mangas';
import { amandineMangas } from '../../utils/users/amandine/mangas/amandine_mangas';
import { kevinMangas } from '../../utils/users/kevin/mangas/kevin_mangas';
import { guillaumeReadListMangas } from '../../utils/users/guillaume/mangas/guillaume_readlist_mangas';
import { ronanReadListMangas } from '../../utils/users/ronan/mangas/ronan_readlist_mangas';
import { williamReadListMangas } from '../../utils/users/william/mangas/william_readlist_mangas';
import { amandineReadListMangas } from '../../utils/users/amandine/mangas/amandine_readlist_mangas';
import { kevinReadListMangas } from '../../utils/users/kevin/mangas/kevin_readlist_mangas';
import { hikenMangas } from '../../utils/users/hiken/mangas/hiken_mangas';
import { lucileMangas } from '../../utils/users/lucile/mangas/lucile_mangas';

export const allBaseMangas: BaseManga[] = [...baseMangas, ...baseMangasApi];

export function getLocalMangasByUser(userId: string): UserManga[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeMangas];
    case 'ronan':
      return [...ronanMangas];
    case 'william':
      return [...williamMangas];
    case 'amandine':
      return [...amandineMangas];
    case 'kevin':
      return [...kevinMangas];
    case 'hiken':
      return [...hikenMangas];
    case 'lucile':
      return [...lucileMangas];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserManga[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeReadListMangas];
    case 'ronan':
      return [...ronanReadListMangas];
    case 'william':
      return [...williamReadListMangas];
    case 'amandine':
      return [...amandineReadListMangas];
    case 'kevin':
      return [...kevinReadListMangas];
    default:
      return [];
  }
}
