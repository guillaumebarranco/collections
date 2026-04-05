import {
  baseBooks,
  baseBooksFantasySaga,
  baseBooksSaga,
  baseBooksApi,
  baseBooksFromMom,
  baseBooksAventure,
  baseBooksFantasy,
  baseBooksFantastique,
  baseBooksHorreur,
  baseBooksPolicier,
  baseBooksScienceFiction,
  baseBooksRomance,
  baseBooksThriller,
  baseBooksClassiques,
  baseBooksDystopie,
  baseBooksNonfiction,
  baseBooksJeunesse,
} from '../../utils/entities/books';

import {
  guillaumeBooks,
  guillaumeBooksFantasySaga,
  guillaumeBooksSaga,
  guillaumeReadlistBooks,
} from '../../utils/users/guillaume/books';
import { kevinBooks, kevinReadListBooks } from '../../utils/users/kevin/books';
import { ronanBooks, ronanReadListBooks } from '../../utils/users/ronan/books';
import {
  amandineBooks,
  amandineReadListBooks,
} from '../../utils/users/amandine/books';
import { williamBooks } from '../../utils/users/william/books/william_books';
import { williamReadListBooks } from '../../utils/users/william/books/william_readlist_books';
import { BaseBook, UserBook } from '../../models/book-model';
import { dantesBooks } from '../../utils/users/dantes/books/dantes_books';
import { masterofmadnessBooks } from '../../utils/users/masterofmadness/books/masterofmadness_books';
import { marinaBooks } from '../../utils/users/marina/books/marina_books';
import { cassandreBooks } from '../../utils/users/cassandre/books/cassandre_books';

export const allBaseBooks: BaseBook[] = [
  ...baseBooks,
  ...baseBooksFantasySaga,
  ...baseBooksSaga,
  ...baseBooksAventure,
  ...baseBooksFantasy,
  ...baseBooksFantastique,
  ...baseBooksHorreur,
  ...baseBooksPolicier,
  ...baseBooksScienceFiction,
  ...baseBooksRomance,
  ...baseBooksThriller,
  ...baseBooksClassiques,
  ...baseBooksApi,
  ...baseBooksFromMom,
  ...baseBooksNonfiction,
  ...baseBooksDystopie,
  ...baseBooksJeunesse,
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
      return [...williamBooks];
    case 'kevin':
      return [...kevinBooks];
    case 'amandine':
      return [...amandineBooks];
    case 'ronan':
      return [...ronanBooks];
    case 'dantes':
      return [...dantesBooks];
    case 'masterofmadness':
      return [...masterofmadnessBooks];
    case 'marina':
      return [...marinaBooks];
    case 'cassandre':
      return [...cassandreBooks];
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
    case 'william':
      return [...williamReadListBooks];
    default:
      return [];
  }
}
