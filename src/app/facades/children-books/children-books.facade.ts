import { ChildrenBook, BaseChildrenBook, UserChildrenBook } from '../../models/children-book-model';
import type { LightBook } from '../../models/entity-light.model';
import {
  fetchBaseChildrenBooksFromApi,
  fetchBaseChildrenBooksLightFromApi,
  fetchMergedUserChildrenBooksFromApi,
  fetchMergedReadlistChildrenBooksFromApi,
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
const fetchBaseChildrenBooksLightCached = createCachedFetcher(
  fetchBaseChildrenBooksLightFromApi
);

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

async function getMergedUserChildrenBooks(userId: string): Promise<ChildrenBook[]> {
  try {
    return await fetchMergedUserChildrenBooksFromApi(userId);
  } catch {
    const userChildrenBooks = await fetchUserChildrenBooksFromApi(userId);
    return getAllChildrenBooksData(userChildrenBooks);
  }
}

async function getMergedReadlistChildrenBooks(userId: string): Promise<ChildrenBook[]> {
  try {
    return await fetchMergedReadlistChildrenBooksFromApi(userId);
  } catch {
    const readlist = await fetchReadlistChildrenBooksFromApi(userId);
    return getAllChildrenBooksData(readlist);
  }
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

/** Catalogue allégé pour les pages select. */
export async function getAllBaseChildrenBooksLight(): Promise<LightBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    return offline.childrenBooks.base.map((b) => ({
      title: b.title,
      author: b.author,
      coverUrl: b.coverUrl ?? '',
      saga: b.saga ?? '',
      selectDisplayOrder: b.selectDisplayOrder ?? 0,
    }));
  }

  try {
    return await fetchBaseChildrenBooksLightCached();
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
    return {
      [currentUserId]: await getMergedUserChildrenBooks(currentUserId),
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
    return {
      [currentUserId]: await getMergedReadlistChildrenBooks(currentUserId),
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
    return await getMergedUserChildrenBooks(userId);
  } catch {
    return [];
  }
}

/** User children books bruts (clés d'exclusion select, sans join catalogue). */
export async function getUserChildrenBooksRaw(userId: string): Promise<UserChildrenBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.childrenBooks.user;
  }
  try {
    return await fetchUserChildrenBooksFromApi(userId);
  } catch {
    return [];
  }
}

export async function getReadlistChildrenBooksRaw(
  userId: string
): Promise<UserChildrenBook[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.childrenBooks.readlist;
  }
  try {
    return await fetchReadlistChildrenBooksFromApi(userId);
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
    return await getMergedReadlistChildrenBooks(userId);
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
