import { Book, BaseBook, UserBook } from '../../models/book-model';

import {
  allBaseBooks,
  getLocalBooksByUser,
  getLocalReadlistByUser,
} from './local-books.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseBooksFromApi,
  fetchUserBooksFromApi,
} from './api-books.facade';

async function getAllBooksData(books: UserBook[]): Promise<Book[]> {
  const baseBooks = await getAllBaseBooks();

  return books.map((book: UserBook) => {
    const matchingBaseBook = baseBooks.filter(
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

export async function getAllBaseBooks(): Promise<BaseBook[]> {
  if (isLocalhost()) {
    return allBaseBooks;
  }

  try {
    return await fetchBaseBooksFromApi();
  } catch {
    return [];
  }
}

export async function getAllBooks(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Book[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllBooksData(
        getLocalBooksByUser(currentUserId)
      ),
    };
  }

  try {
    const userBooks = await fetchUserBooksFromApi(currentUserId);
    return {
      [currentUserId]: await getAllBooksData(userBooks),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllReadlistBooks(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Book[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllBooksData(
        getLocalReadlistByUser(currentUserId)
      ),
    };
  }

  const readlist = getLocalReadlistByUser(currentUserId);
  return {
    [currentUserId]: await getAllBooksData(readlist),
  };
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
  if (isLocalhost()) {
    return getAllBooksData(getLocalBooksByUser(userId));
  }

  try {
    const userBooks = await fetchUserBooksFromApi(userId);
    return getAllBooksData(userBooks);
  } catch {
    return [];
  }
}

export async function getCurrentReadlistBooksByUser(
  userId: string
): Promise<Book[]> {
  if (isLocalhost()) {
    return getAllBooksData(getLocalReadlistByUser(userId));
  }

  return getAllBooksData(getLocalReadlistByUser(userId));
}
