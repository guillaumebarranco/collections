import { baseMangas } from '../../utils/entities/mangas';
import { guillaumeMangas } from '../../utils/users/guillaume/mangas';
import { BaseManga, UserManga } from '../../models/manga-model';

export const allBaseMangas: BaseManga[] = [...baseMangas];

export function getLocalMangasByUser(userId: string): UserManga[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeMangas];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserManga[] {
  switch (userId) {
    case 'guillaume':
      return [];
    default:
      return [];
  }
}
