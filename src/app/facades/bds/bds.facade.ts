import { Bd, BaseBd, UserBd } from '../../models/bd-model';
import type { LightBd } from '../../models/entity-light.model';
import {
  fetchBaseBdsFromApi,
  fetchBaseBdsLightFromApi,
  fetchMergedUserBdsFromApi,
  fetchMergedReadlistBdsFromApi,
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
const fetchBaseBdsLightCached = createCachedFetcher(fetchBaseBdsLightFromApi);

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

async function getMergedUserBds(userId: string): Promise<Bd[]> {
  try {
    return await fetchMergedUserBdsFromApi(userId);
  } catch {
    const userBds = await fetchUserBdsFromApi(userId);
    return getAllBdsData(userBds);
  }
}

async function getMergedReadlistBds(userId: string): Promise<Bd[]> {
  try {
    return await fetchMergedReadlistBdsFromApi(userId);
  } catch {
    const readlist = await fetchReadlistBdsFromApi(userId);
    return getAllBdsData(readlist);
  }
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
    return {
      [currentUserId]: await getMergedUserBds(currentUserId),
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
    return {
      [currentUserId]: await getMergedReadlistBds(currentUserId),
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

/** Catalogue allégé pour les pages select. */
export async function getAllBaseBdsLight(): Promise<LightBd[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    return offline.bds.base.map((b) => ({
      title: b.title,
      writer: b.writer ?? '',
      designer: b.designer ?? '',
      coverUrl: b.coverUrl ?? '',
    }));
  }

  try {
    return await fetchBaseBdsLightCached();
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
    return await getMergedUserBds(userId);
  } catch {
    return [];
  }
}

/** User bds bruts (clés d'exclusion select, sans join catalogue). */
export async function getUserBdsRaw(userId: string): Promise<UserBd[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.bds.user;
  }
  try {
    return await fetchUserBdsFromApi(userId);
  } catch {
    return [];
  }
}

export async function getReadlistBdsRaw(userId: string): Promise<UserBd[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.bds.readlist;
  }
  try {
    return await fetchReadlistBdsFromApi(userId);
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
    return await getMergedReadlistBds(userId);
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
