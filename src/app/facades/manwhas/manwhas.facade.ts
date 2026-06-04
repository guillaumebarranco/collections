import { Manwha, BaseManwha, UserManwha } from '../../models/manwha-model';

import {
  fetchBaseManwhasFromApi,
  fetchUserManwhasFromApi,
  fetchReadlistManwhasFromApi,
  fetchOtherUsersManwhasRatedFromApi,
  OtherUserManwhaRating,
} from './api-manwhas.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getManwhaDataFromUserManwhaAndBaseManwha } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

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

    return getManwhaDataFromUserManwhaAndBaseManwha(
      manwha,
      definitiveMatchingManwha
    );
  });
}

export async function getAllManwhas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manwha[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllManwhasData(offline.manwhas.user),
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
  const offline = getActiveOfflineCache();
  if (offline) return offline.manwhas.base;

  try {
    return await fetchBaseManwhasCached();
  } catch {
    return [];
  }
}

export async function getAllReadlistManwhas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manwha[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllManwhasData(offline.manwhas.readlist),
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
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllManwhasData(offline.manwhas.user);
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
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllManwhasData(offline.manwhas.readlist);
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
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserManwhaRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersManwhasRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
