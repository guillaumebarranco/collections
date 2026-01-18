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
} from './api-manwhas.facade';

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
    return await fetchBaseManwhasFromApi();
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

  const readlist = getLocalReadlistByUser(currentUserId);
  return {
    [currentUserId]: await getAllManwhasData(readlist),
  };
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

  return getAllManwhasData(getLocalReadlistByUser(userId));
}
