import { Manwha, BaseManwha, UserManwha } from '../../models/manwha-model';

import {
  allBaseManwhas,
  getLocalManwhasByUser,
  getLocalReadlistByUser,
} from './local-manwhas.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseManwhasFromApi,
  fetchUserManwhasFromApi,
  fetchReadlistManwhasFromApi,
  fetchOtherUsersManwhasRatedFromApi,
  OtherUserManwhaRating,
} from './api-manwhas.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { users } from '../../utils/users/users';

const fetchBaseManwhasCached = createCachedFetcher(fetchBaseManwhasFromApi);

async function getAllManwhasData(manwhas: UserManwha[]): Promise<Manwha[]> {
  const baseManwhas = await getAllBaseManwhas();

  return manwhas.map((manwha: UserManwha) => {
    const matchingBaseManwha = baseManwhas.filter(
      (baseManwha: BaseManwha) => baseManwha.title === manwha.title
    );

    const definitiveMatchingManwha =
      matchingBaseManwha.length === 1
        ? matchingBaseManwha[0]
        : matchingBaseManwha.filter((baseManwha: BaseManwha) => {
            return baseManwha.author === manwha.author;
          })[0];

    return {
      title: manwha.title,
      author: manwha.author,
      rating: manwha.rating,
      readDate: manwha.readDate,
      readTimes: manwha.readTimes,
      coverUrl: definitiveMatchingManwha?.coverUrl || '',
      pages: definitiveMatchingManwha?.pages || 0,
      genre: definitiveMatchingManwha?.genre || '',
      nbChapters: definitiveMatchingManwha?.nbChapters || 0,
      isFinished: definitiveMatchingManwha?.isFinished || false,
      saga: '',
      sagaOrder: 0,
      owned: manwha.owned,
    };
  });
}

export async function getAllManwhas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manwha[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllManwhasData(
        getLocalManwhasByUser(currentUserId)
      ),
    };
  }

  try {
    const userManwhas = await fetchUserManwhasFromApi(currentUserId);
    return {
      [currentUserId]: await getAllManwhasData(userManwhas),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseManwhas(): Promise<BaseManwha[]> {
  if (isLocalhost()) {
    return allBaseManwhas;
  }

  try {
    return await fetchBaseManwhasCached();
  } catch {
    return [];
  }
}

export async function getAllReadlistManwhas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manwha[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllManwhasData(
        getLocalReadlistByUser(currentUserId)
      ),
    };
  }

  try {
    const readlist = await fetchReadlistManwhasFromApi(currentUserId);
    return {
      [currentUserId]: await getAllManwhasData(readlist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllManwhasMerged(
  currentUserId = 'guillaume'
): Promise<Manwha[]> {
  const allManwhas = await getAllManwhas(currentUserId);
  return Object.values(allManwhas)
    .flat()
    .reduce((acc: Manwha[], item: Manwha) => {
      if (
        acc.find(
          (manwha) =>
            manwha.title === item.title && manwha.author === item.author
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getManwhasByUser(userId: string): Promise<Manwha[]> {
  if (isLocalhost()) {
    return getAllManwhasData(getLocalManwhasByUser(userId));
  }

  try {
    const userManwhas = await fetchUserManwhasFromApi(userId);
    return getAllManwhasData(userManwhas);
  } catch {
    return [];
  }
}

export async function getCurrentReadlistManwhasByUser(
  userId: string
): Promise<Manwha[]> {
  if (isLocalhost()) {
    return getAllManwhasData(getLocalReadlistByUser(userId));
  }

  try {
    const readlist = await fetchReadlistManwhasFromApi(userId);
    return getAllManwhasData(readlist);
  } catch {
    return [];
  }
}

export async function getOtherUsersManwhasRated(
  currentUserId = 'guillaume',
  minRating = 4
): Promise<OtherUserManwhaRating[]> {
  if (isLocalhost()) {
    const otherUsers = users
      .map((user) => user.username)
      .filter((username) => username !== currentUserId);
    const results: OtherUserManwhaRating[] = [];
    otherUsers.forEach((username) => {
      const manwhas = getLocalManwhasByUser(username);
      manwhas
        .filter((manwha: any) => (manwha.rating ?? 0) >= minRating)
        .forEach((manwha: any) => {
          results.push({
            title: manwha.title,
            author: manwha.author,
            rating: manwha.rating ?? 0,
            userId: username,
          });
        });
    });
    return results;
  }

  try {
    return await fetchOtherUsersManwhasRatedFromApi(currentUserId, minRating);
  } catch {
    return [];
  }
}
