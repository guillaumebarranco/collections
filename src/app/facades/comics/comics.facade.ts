import { Comic, BaseComic, UserComic } from '../../models/comic-model';
import {
  allBaseComics,
  getLocalComicsByUser,
  getLocalReadlistByUser,
} from './local-comics.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseComicsFromApi,
  fetchReadlistComicsFromApi,
  fetchUserComicsFromApi,
  fetchOtherUsersComicsRatedFromApi,
  OtherUserComicRating,
} from './api-comics.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { users } from '../../utils/users/users';

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

    return {
      title: comic.title,
      writer: comic.writer,
      rating: comic.rating,
      readDate: comic.readDate,
      readTimes: comic.readTimes,
      coverUrl: definitiveMatchingComic?.coverUrl || '',
      pages: definitiveMatchingComic?.pages || 0,
      genre: definitiveMatchingComic?.genre || '',
      designer: definitiveMatchingComic?.designer || '',
      owned: comic.owned,
      readPriority: comic.readPriority,
    };
  });
}

export async function getAllComics(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Comic[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllComicsData(
        getLocalComicsByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllComicsData(
        getLocalReadlistByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return allBaseComics;
  }

  try {
    const apiComics = await fetchBaseComicsCached();
    return apiComics.length ? apiComics : allBaseComics;
  } catch {
    return allBaseComics;
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
  if (isLocalhost()) {
    return getAllComicsData(getLocalComicsByUser(userId));
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
  if (isLocalhost()) {
    return getAllComicsData(getLocalReadlistByUser(userId));
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
  minRating = 4
): Promise<OtherUserComicRating[]> {
  if (isLocalhost()) {
    const otherUsers = users
      .map((user) => user.username)
      .filter((username) => username !== currentUserId);
    const results: OtherUserComicRating[] = [];
    otherUsers.forEach((username) => {
      const comics = getLocalComicsByUser(username);
      comics
        .filter((comic: any) => (comic.rating ?? 0) >= minRating)
        .forEach((comic: any) => {
          results.push({
            title: comic.title,
            writer: comic.writer,
            rating: comic.rating ?? 0,
            userId: username,
          });
        });
    });
    return results;
  }

  try {
    return await fetchOtherUsersComicsRatedFromApi(currentUserId, minRating);
  } catch {
    return [];
  }
}
