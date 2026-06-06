import type { BaseBook, UserBook } from '../../src/app/models/book-model';
import { loadAllBaseEntityArrays, loadUserEntityArrays } from '../local-entity-loader';

export const allBaseBooks = loadAllBaseEntityArrays('books') as BaseBook[];

export function getLocalBooksByUser(userId: string): UserBook[] {
  return loadUserEntityArrays(
    userId,
    'books',
    (file) => !file.includes('readlist')
  ) as UserBook[];
}
