import { Comic, BaseComic, UserComic } from '../../models/comic-model';
import {
  fetchBaseComicsFromApi,
  fetchReadlistComicsFromApi,
  fetchUserComicsFromApi,
  fetchOtherUsersComicsRatedFromApi,
  OtherUserComicRating,
} from './api-comics.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getComicDataFromUserComicAndBaseComic } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseComicsCached = createCachedFetcher(fetchBaseComicsFromApi);

async function getAllComicsData(comics: UserComic[]): Promise<Comic[]> {
  const baseComics = await getAllBaseComics();

  return comics.map((comic: UserComic) => {
    const matchingBaseComics = baseComics.filter(
      (baseComic: BaseComic) => baseComic.title === comic.title
    );

    const definitiveMatchingComic =
      matchingBaseComics.length === 1
        ? matchingBaseComics[0]
        : matchingBaseComics.filter((baseComic: BaseComic) => {
            return baseComic.writer === comic.writer;
          })[0];

    return getComicDataFromUserComicAndBaseComic(
      comic,
      definitiveMatchingComic
    );
  });
}

export async function getAllComics(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Comic[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllComicsData(offline.comics.user),
    };
  }

  try {
    const userComics = await fetchUserComicsFromApi(currentUserId);
    return {
      [currentUserId]: await getAllComicsData(userComics),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllReadlistComics(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Comic[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllComicsData(offline.comics.readlist),
    };
  }

  try {
    const readlist = await fetchReadlistComicsFromApi(currentUserId);
    return {
      [currentUserId]: await getAllComicsData(readlist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseComics(): Promise<BaseComic[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.comics.base;

  try {
    const apiComics = await fetchBaseComicsCached();
    return apiComics;
  } catch {
    return [];
  }
}

export async function getAllComicsMerged(
  currentUserId = 'guillaume'
): Promise<Comic[]> {
  const allComics = await getAllComics(currentUserId);
  return Object.values(allComics)
    .flat()
    .reduce((acc: Comic[], item: Comic) => {
      if (
        acc.find(
          (comic) => comic.title === item.title && comic.writer === item.writer
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getComicsByUser(userId: string): Promise<Comic[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllComicsData(offline.comics.user);
  }

  try {
    const userComics = await fetchUserComicsFromApi(userId);
    return getAllComicsData(userComics);
  } catch {
    return [];
  }
}

export async function getCurrentReadlistComicsByUser(
  userId: string
): Promise<Comic[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllComicsData(offline.comics.readlist);
  }

  try {
    const readlist = await fetchReadlistComicsFromApi(userId);
    return getAllComicsData(readlist);
  } catch {
    return [];
  }
}

export async function getOtherUsersComicsRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserComicRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersComicsRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
