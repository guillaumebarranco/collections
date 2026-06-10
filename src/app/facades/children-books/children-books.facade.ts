import { ChildrenBook, BaseChildrenBook, UserChildrenBook } from '../../models/children-book-model';
import {
  fetchBaseChildrenBooksFromApi,
  fetchUserChildrenBooksFromApi,
  fetchReadlistChildrenBooksFromApi,
  fetchOtherUsersChildrenBooksRatedFromApi,
  OtherUserChildrenBookRating,
} from './api-children-books.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getChildrenBookDataFromUserChildrenBookAndBaseChildrenBook } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseChildrenBooksCached = createCachedFetcher(fetchBaseChildrenBooksFromApi);

async function getAllChildrenBooksData(childrenBooks: UserChildrenBook[]): Promise<ChildrenBook[]> {
  const baseChildrenBooks = await getAllBaseChildrenBooks();

  return childrenBooks.map((childrenBook: UserChildrenBook) => {
    const matchingBaseChildrenBook = baseChildrenBooks.filter(
      (baseChildrenBook: BaseChildrenBook) => baseChildrenBook.title === childrenBook.title
    );

    const definitiveMatchingChildrenBook =
      matchingBaseChildrenBook.length === 1
        ? matchingBaseChildrenBook[0]
        : matchingBaseChildrenBook.filter((baseChildrenBook: BaseChildrenBook) => {
            return baseChildrenBook.author === childrenBook.author;
          })[0];

    return getChildrenBookDataFromUserChildrenBookAndBaseChildrenBook(childrenBook, definitiveMatchingChildrenBook);
  });
}

export async function getAllBaseChildrenBooks(): Promise<BaseChildrenBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.childrenBooks.base;

  try {
    return await fetchBaseChildrenBooksCached();
  } catch {
    return [];
  }
}

export async function getAllChildrenBooks(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: ChildrenBook[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllChildrenBooksData(offline.childrenBooks.user),
    };
  }

  try {
    const userChildrenBooks = await fetchUserChildrenBooksFromApi(currentUserId);
    return {
      [currentUserId]: await getAllChildrenBooksData(userChildrenBooks),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllReadlistChildrenBooks(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: ChildrenBook[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllChildrenBooksData(offline.childrenBooks.readlist),
    };
  }

  try {
    const readlist = await fetchReadlistChildrenBooksFromApi(currentUserId);
    return {
      [currentUserId]: await getAllChildrenBooksData(readlist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllChildrenBooksMerged(
  currentUserId = 'guillaume'
): Promise<ChildrenBook[]> {
  const allChildrenBooks = await getAllChildrenBooks(currentUserId);
  return Object.values(allChildrenBooks)
    .flat()
    .reduce((acc: ChildrenBook[], item: ChildrenBook) => {
      if (
        acc.find(
          (childrenBook) => childrenBook.title === item.title && childrenBook.author === item.author
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getChildrenBooksByUser(userId: string): Promise<ChildrenBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllChildrenBooksData(offline.childrenBooks.user);
  }

  try {
    const userChildrenBooks = await fetchUserChildrenBooksFromApi(userId);
    return getAllChildrenBooksData(userChildrenBooks);
  } catch {
    return [];
  }
}

export async function getCurrentReadlistChildrenBooksByUser(
  userId: string
): Promise<ChildrenBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllChildrenBooksData(offline.childrenBooks.readlist);
  }

  try {
    const readlist = await fetchReadlistChildrenBooksFromApi(userId);
    return getAllChildrenBooksData(readlist);
  } catch {
    return [];
  }
}

export async function getOtherUsersChildrenBooksRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserChildrenBookRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersChildrenBooksRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
