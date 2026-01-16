import {
  baseBooks,
  baseBooksFantasySaga,
  baseBooksSaga,
  baseBooksFromKevin,
  baseBooksFromRonan,
  baseFromReadlistBooks,
  baseBooksApi,
} from '../../utils/entities/books';

import {
  guillaumeBooks,
  guillaumeBooksFantasySaga,
  guillaumeBooksSaga,
  guillaumeReadlistBooks,
} from '../../utils/users/guillaume/books';
import {
  kevinBooks1,
  kevinBooks2,
  kevinReadListBooks,
} from '../../utils/users/kevin/books';
import { ronanBooks, ronanReadListBooks } from '../../utils/users/ronan/books';
import { amandineBooks, amandineReadListBooks } from '../../utils/users/amandine/books';
import { BaseBook, UserBook } from '../../models/book-model';

export const allBaseBooks: BaseBook[] = [
  ...baseBooks,
  ...baseBooksFantasySaga,
  ...baseBooksSaga,
  ...baseBooksFromKevin,
  ...baseBooksFromRonan,
  ...baseFromReadlistBooks,
  ...baseBooksApi,
];

export function getLocalBooksByUser(userId: string): UserBook[] {
  switch (userId) {
    case 'guillaume':
      return [
        ...guillaumeBooks,
        ...guillaumeBooksFantasySaga,
        ...guillaumeBooksSaga,
      ];
    case 'william':
      return [];
    case 'kevin':
      return [...kevinBooks1, ...kevinBooks2];
    case 'amandine':
      return [...amandineBooks];
    case 'ronan':
      return [...ronanBooks];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserBook[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeReadlistBooks];
    case 'kevin':
      return [...kevinReadListBooks];
    case 'amandine':
      return [...amandineReadListBooks];
    case 'ronan':
      return [...ronanReadListBooks];
    default:
      return [];
  }
}
