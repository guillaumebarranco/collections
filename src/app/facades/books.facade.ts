import { Book, BaseBook, UserBook } from '../models/book-model';

import {
  baseBooks,
  baseBooksFantasySaga,
  baseBooksSaga,
} from '../utils/entities/books';

import {
  guillaumeBooks,
  guillaumeBooksFantasySaga,
  guillaumeBooksSaga,
} from '../utils/users/guillaume/books';
import { kevinBooks1, kevinBooks2 } from '../utils/users/kevin/books';
import { baseBooksFromKevin } from '../utils/entities/books/books_from_kevin';

const allBaseBooks: BaseBook[] = [
  ...baseBooks,
  ...baseBooksFantasySaga,
  ...baseBooksSaga,
  ...baseBooksFromKevin,
];

export function getAllBooks(): { [key: string]: Book[] } {
  return {
    guillaume: getAllBooksData([
      ...guillaumeBooks,
      ...guillaumeBooksFantasySaga,
      ...guillaumeBooksSaga,
    ]),
    william: getAllBooksData([]),
    kevin: getAllBooksData([...kevinBooks1, ...kevinBooks2]),
    amandine: getAllBooksData([]),
  };
}

export function getAllBooksMerged(): Book[] {
  return Object.values(getAllBooks()).flat();
}

function getAllBooksData(books: UserBook[]): Book[] {
  return books.map((book: UserBook) => {
    const matchingBaseBook = allBaseBooks.filter(
      (baseBook: BaseBook) => baseBook.title === book.title
    );

    // For the case when multiple books have the same name, hence matching from book director
    const definitiveMatchingBook =
      matchingBaseBook.length === 1
        ? matchingBaseBook[0]
        : matchingBaseBook.filter((baseBook: BaseBook) => {
            return baseBook.author === book.author;
          })[0];

    return {
      title: book.title,
      author: book.author,
      rating: book.rating,
      readDate: book.readDate,
      readTimes: book.readTimes,
      coverUrl: definitiveMatchingBook?.coverUrl || '',
      pages: definitiveMatchingBook?.pages || 0,
      genre: definitiveMatchingBook?.genre || '',
      saga: definitiveMatchingBook?.saga || '',
      sagaOrder: definitiveMatchingBook?.sagaOrder || 0,
    };
  });
}
