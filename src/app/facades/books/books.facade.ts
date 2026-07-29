import { Book, BaseBook, UserBook } from '../../models/book-model';
import type { LightBook } from '../../models/entity-light.model';
import {
  fetchBaseBooksFromApi,
  fetchBaseBooksLightFromApi,
  fetchMergedUserBooksFromApi,
  fetchMergedReadlistBooksFromApi,
  fetchUserBooksFromApi,
  fetchReadlistBooksFromApi,
  fetchOtherUsersBooksRatedFromApi,
  OtherUserBookRating,
} from './api-books.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getBookDataFromUserBookAndBaseBook } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseBooksCached = createCachedFetcher(fetchBaseBooksFromApi);
const fetchBaseBooksLightCached = createCachedFetcher(
  fetchBaseBooksLightFromApi
);

async function getAllBooksData(books: UserBook[]): Promise<Book[]> {
  const baseBooks = await getAllBaseBooks();

  return books.map((book: UserBook) => {
    const matchingBaseBook = baseBooks.filter(
      (baseBook: BaseBook) => baseBook.title === book.title
    );

    const definitiveMatchingBook =
      matchingBaseBook.length === 1
        ? matchingBaseBook[0]
        : matchingBaseBook.filter((baseBook: BaseBook) => {
            return baseBook.author === book.author;
          })[0];

    return getBookDataFromUserBookAndBaseBook(book, definitiveMatchingBook);
  });
}

async function getMergedUserBooks(userId: string): Promise<Book[]> {
  try {
    return await fetchMergedUserBooksFromApi(userId);
  } catch {
    const userBooks = await fetchUserBooksFromApi(userId);
    return getAllBooksData(userBooks);
  }
}

async function getMergedReadlistBooks(userId: string): Promise<Book[]> {
  try {
    return await fetchMergedReadlistBooksFromApi(userId);
  } catch {
    const readlist = await fetchReadlistBooksFromApi(userId);
    return getAllBooksData(readlist);
  }
}

export async function getAllBaseBooks(): Promise<BaseBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.books.base;

  try {
    return await fetchBaseBooksCached();
  } catch {
    return [];
  }
}

/** Catalogue allégé pour les pages select. */
export async function getAllBaseBooksLight(): Promise<LightBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    return offline.books.base.map((b) => ({
      title: b.title,
      author: b.author,
      coverUrl: b.coverUrl ?? '',
      saga: b.saga ?? '',
      selectDisplayOrder: b.selectDisplayOrder ?? 0,
    }));
  }

  try {
    return await fetchBaseBooksLightCached();
  } catch {
    return [];
  }
}

export async function getAllBooks(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Book[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllBooksData(offline.books.user),
    };
  }

  try {
    return {
      [currentUserId]: await getMergedUserBooks(currentUserId),
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
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllBooksData(offline.books.readlist),
    };
  }

  try {
    return {
      [currentUserId]: await getMergedReadlistBooks(currentUserId),
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
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllBooksData(offline.books.user);
  }

  try {
    return await getMergedUserBooks(userId);
  } catch {
    return [];
  }
}

/** User books bruts (clés d'exclusion select, sans join catalogue). */
export async function getUserBooksRaw(userId: string): Promise<UserBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.books.user;
  }
  try {
    return await fetchUserBooksFromApi(userId);
  } catch {
    return [];
  }
}

export async function getReadlistBooksRaw(userId: string): Promise<UserBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.books.readlist;
  }
  try {
    return await fetchReadlistBooksFromApi(userId);
  } catch {
    return [];
  }
}

export async function getCurrentReadlistBooksByUser(
  userId: string
): Promise<Book[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllBooksData(offline.books.readlist);
  }

  try {
    return await getMergedReadlistBooks(userId);
  } catch {
    return [];
  }
}

export async function getOtherUsersBooksRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserBookRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersBooksRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
