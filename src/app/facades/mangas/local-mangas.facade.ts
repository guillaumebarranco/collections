import { baseMangas, baseMangasApi } from '../../utils/entities/mangas';
import { guillaumeMangas } from '../../utils/users/guillaume/mangas';
import { BaseManga, UserManga } from '../../models/manga-model';
import { ronanMangas } from '../../utils/users/ronan/mangas/ronan_mangas';

export const allBaseMangas: BaseManga[] = [...baseMangas, ...baseMangasApi];

export function getLocalMangasByUser(userId: string): UserManga[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeMangas];
    case 'ronan':
      return [...ronanMangas];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserManga[] {
  switch (userId) {
    case 'guillaume':
      return [];
    case 'ronan':
      return [];
    default:
      return [];
  }
}
