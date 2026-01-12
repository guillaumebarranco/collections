import { Book, BaseBook, UserBook } from '../models/book-model';

import {
  baseBooks,
  baseBooksFantasySaga,
  baseBooksSaga,
  baseBooksFromKevin,
  baseBooksFromRonan,
  baseFromReadlistBooks,
} from '../utils/entities/books';

import {
  guillaumeBooks,
  guillaumeBooksFantasySaga,
  guillaumeBooksSaga,
} from '../utils/users/guillaume/books';
import { kevinBooks1, kevinBooks2 } from '../utils/users/kevin/books';
import { ronanBooks } from '../utils/users/ronan/books/ronan_books';

const allBaseBooks: BaseBook[] = [
  ...baseBooks,
  ...baseBooksFantasySaga,
  ...baseBooksSaga,
  ...baseBooksFromKevin,
  ...baseBooksFromRonan,
  ...baseFromReadlistBooks,
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
    ronan: getAllBooksData([...ronanBooks]),
  };
}

export function getAllReadlistBooks(): { [key: string]: Book[] } {
  return {
    guillaume: baseFromReadlistBooks.map((baseBook: BaseBook) => ({
      ...baseBook,
      readDate: '',
      rating: 0,
      readTimes: 0,
    })),
    william: [],
    kevin: [],
    amandine: [],
  };
}

export function getAllBooksMerged(): Book[] {
  return Object.values(getAllBooks())
    .flat()
    .reduce((acc: Book[], item: Book) => {
      if (
        acc.find(
          (book) => book.title === item.title && book.author === item.author
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
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
