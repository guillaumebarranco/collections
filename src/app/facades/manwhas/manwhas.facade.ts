import { Manwha, BaseManwha, UserManwha } from '../../models/manwha-model';

import {
  allBaseManwhas,
  getLocalManwhasByUser,
  getLocalReadlistByUser,
} from './local-manwhas.facade';
import { DEFAULT_USER_IDS, isLocalhost } from '../../core/config';
import { fetchUserManwhasFromApi } from './api-manwhas.facade';

function getAllManwhasData(manwhas: UserManwha[]): Manwha[] {
  return manwhas.map((manwha: UserManwha) => {
    const matchingBaseManwha = allBaseManwhas.filter(
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

function buildManwhasMap(
  userId: string,
  manwhas: Manwha[]
): { [key: string]: Manwha[] } {
  return DEFAULT_USER_IDS.reduce(
    (acc, id) => ({
      ...acc,
      [id]: id === userId ? manwhas : [],
    }),
    {} as { [key: string]: Manwha[] }
  );
}

export async function getAllManwhas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manwha[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllManwhasData(getLocalManwhasByUser('guillaume')),
      william: getAllManwhasData(getLocalManwhasByUser('william')),
      kevin: getAllManwhasData(getLocalManwhasByUser('kevin')),
      amandine: getAllManwhasData(getLocalManwhasByUser('amandine')),
      ronan: getAllManwhasData(getLocalManwhasByUser('ronan')),
    };
  }

  try {
    const userManwhas = await fetchUserManwhasFromApi(currentUserId);
    return buildManwhasMap(currentUserId, getAllManwhasData(userManwhas));
  } catch {
    return buildManwhasMap(currentUserId, []);
  }
}

export async function getAllReadlistManwhas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manwha[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllManwhasData(getLocalReadlistByUser('guillaume')),
      william: [],
      kevin: getAllManwhasData(getLocalReadlistByUser('kevin')),
      amandine: getAllManwhasData(getLocalReadlistByUser('amandine')),
      ronan: getAllManwhasData(getLocalReadlistByUser('ronan')),
    };
  }

  const readlist = getLocalReadlistByUser(currentUserId);
  return buildManwhasMap(currentUserId, getAllManwhasData(readlist));
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
