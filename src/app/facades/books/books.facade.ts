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
  fetchReadlistBooksFromApi,
  fetchOtherUsersBooksRatedFromApi,
  OtherUserBookRating,
} from './api-books.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { users } from '../../utils/users/users';

const fetchBaseBooksCached = createCachedFetcher(fetchBaseBooksFromApi);

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
      owned: book.owned,
      readPriority: book.readPriority,
    };
  });
}

export async function getAllBaseBooks(): Promise<BaseBook[]> {
  if (isLocalhost()) {
    return allBaseBooks;
  }

  try {
    return await fetchBaseBooksCached();
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

  try {
    const readlist = await fetchReadlistBooksFromApi(currentUserId);
    return {
      [currentUserId]: await getAllBooksData(readlist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
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

  try {
    const readlist = await fetchReadlistBooksFromApi(userId);
    return getAllBooksData(readlist);
  } catch {
    return [];
  }
}

export async function getOtherUsersBooksRated(
  currentUserId = 'guillaume',
  minRating = 4
): Promise<OtherUserBookRating[]> {
  if (isLocalhost()) {
    const otherUsers = users
      .map((user) => user.username)
      .filter((username) => username !== currentUserId);
    const results: OtherUserBookRating[] = [];
    otherUsers.forEach((username) => {
      const books = getLocalBooksByUser(username);
      books
        .filter((book) => (book.rating ?? 0) >= minRating)
        .forEach((book) => {
          results.push({
            title: book.title,
            author: book.author,
            rating: book.rating ?? 0,
            userId: username,
          });
        });
    });
    return results;
  }

  try {
    return await fetchOtherUsersBooksRatedFromApi(currentUserId, minRating);
  } catch {
    return [];
  }
}
