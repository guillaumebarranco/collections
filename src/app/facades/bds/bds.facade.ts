import { Bd, BaseBd, UserBd } from '../../models/bd-model';
import {
  fetchBaseBdsFromApi,
  fetchReadlistBdsFromApi,
  fetchUserBdsFromApi,
  fetchOtherUsersBdsRatedFromApi,
  OtherUserBdRating,
} from './api-bds.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getBdDataFromUserBdAndBaseBd } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseBdsCached = createCachedFetcher(fetchBaseBdsFromApi);

async function getAllBdsData(bds: UserBd[]): Promise<Bd[]> {
  const baseBds = await getAllBaseBds();

  return bds.map((bd: UserBd) => {
    const matchingBaseBds = baseBds.filter(
      (baseBd: BaseBd) => baseBd.title === bd.title
    );

    const definitiveMatchingBd =
      matchingBaseBds.length === 1
        ? matchingBaseBds[0]
        : matchingBaseBds.filter((baseBd: BaseBd) => {
            return baseBd.writer === bd.writer;
          })[0];

    return getBdDataFromUserBdAndBaseBd(bd, definitiveMatchingBd);
  });
}

export async function getAllBds(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Bd[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllBdsData(offline.bds.user),
    };
  }

  try {
    const userBds = await fetchUserBdsFromApi(currentUserId);
    return {
      [currentUserId]: await getAllBdsData(userBds),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllReadlistBds(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Bd[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllBdsData(offline.bds.readlist),
    };
  }

  try {
    const readlist = await fetchReadlistBdsFromApi(currentUserId);
    return {
      [currentUserId]: await getAllBdsData(readlist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseBds(): Promise<BaseBd[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.bds.base;

  try {
    const apiBds = await fetchBaseBdsCached();
    return apiBds;
  } catch {
    return [];
  }
}

export async function getAllBdsMerged(
  currentUserId = 'guillaume'
): Promise<Bd[]> {
  const allBds = await getAllBds(currentUserId);
  return Object.values(allBds)
    .flat()
    .reduce((acc: Bd[], item: Bd) => {
      if (
        acc.find((bd) => bd.title === item.title && bd.writer === item.writer)
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getBdsByUser(userId: string): Promise<Bd[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllBdsData(offline.bds.user);
  }

  try {
    const userBds = await fetchUserBdsFromApi(userId);
    return getAllBdsData(userBds);
  } catch {
    return [];
  }
}

export async function getCurrentReadlistBdsByUser(
  userId: string
): Promise<Bd[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllBdsData(offline.bds.readlist);
  }

  try {
    const readlist = await fetchReadlistBdsFromApi(userId);
    return getAllBdsData(readlist);
  } catch {
    return [];
  }
}

export async function getOtherUsersBdsRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserBdRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersBdsRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
