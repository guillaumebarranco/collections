import { Book, BaseBook, UserBook } from '../../models/book-model';

import {
  allBaseBooks,
  getLocalBooksByUser,
  getLocalReadlistByUser,
} from './local-books.facade';
import { DEFAULT_USER_IDS, isLocalhost } from '../../core/config';
import { fetchUserBooksFromApi } from './api-books.facade';

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

function buildBooksMap(
  userId: string,
  books: Book[]
): { [key: string]: Book[] } {
  return DEFAULT_USER_IDS.reduce(
    (acc, id) => ({
      ...acc,
      [id]: id === userId ? books : [],
    }),
    {} as { [key: string]: Book[] }
  );
}

export async function getAllBooks(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Book[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllBooksData(getLocalBooksByUser('guillaume')),
      william: getAllBooksData(getLocalBooksByUser('william')),
      kevin: getAllBooksData(getLocalBooksByUser('kevin')),
      amandine: getAllBooksData(getLocalBooksByUser('amandine')),
      ronan: getAllBooksData(getLocalBooksByUser('ronan')),
    };
  }

  try {
    const userBooks = await fetchUserBooksFromApi(currentUserId);
    return buildBooksMap(currentUserId, getAllBooksData(userBooks));
  } catch {
    return buildBooksMap(currentUserId, []);
  }
}

export async function getAllReadlistBooks(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Book[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllBooksData(getLocalReadlistByUser('guillaume')),
      william: [],
      kevin: getAllBooksData(getLocalReadlistByUser('kevin')),
      amandine: getAllBooksData(getLocalReadlistByUser('amandine')),
      ronan: getAllBooksData(getLocalReadlistByUser('ronan')),
    };
  }

  const readlist = getLocalReadlistByUser(currentUserId);
  return buildBooksMap(currentUserId, getAllBooksData(readlist));
}

export async function getAllBooksMerged(
  currentUserId = 'guillaume'
): Promise<Book[]> {
  const allBooks = await getAllBooks(currentUserId);
  return Object.values(allBooks)
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

export async function getBooksByUser(userId: string): Promise<Book[]> {
  // if (isLocalhost()) {
  return getAllBooksData(getLocalBooksByUser(userId));
  // }

  // try {
  //   const userBooks = await fetchUserBooksFromApi(userId);
  //   return getAllBooksData(userBooks);
  // } catch {
  //   return [];
  // }
}

export async function getCurrentReadlistBooksByUser(
  userId: string
): Promise<Book[]> {
  if (isLocalhost()) {
    return getAllBooksData(getLocalReadlistByUser(userId));
  }

  return getAllBooksData(getLocalReadlistByUser(userId));
}
