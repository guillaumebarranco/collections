import { Bd, BaseBd, UserBd } from '../../models/bd-model';
import { isLocalhost } from '../../core/config';
import {
  allBaseBds,
  getLocalBdsByUser,
  getLocalReadlistByUser,
} from './local-bds.facade';
import {
  fetchBaseBdsFromApi,
  fetchReadlistBdsFromApi,
  fetchUserBdsFromApi,
} from './api-bds.facade';

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
            return baseBd.designer === bd.designer;
          })[0];

    return {
      title: bd.title,
      designer: bd.designer,
      rating: bd.rating,
      readDate: bd.readDate,
      readTimes: bd.readTimes,
      coverUrl: definitiveMatchingBd?.coverUrl || '',
      pages: definitiveMatchingBd?.pages || 0,
      genre: definitiveMatchingBd?.genre || '',
      nbTomes: definitiveMatchingBd?.nbTomes || 0,
      isFinished: definitiveMatchingBd?.isFinished || false,
      writer: definitiveMatchingBd?.writer || '',
    };
  });
}

export async function getAllBds(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Bd[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllBdsData(getLocalBdsByUser(currentUserId)),
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
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllBdsData(
        getLocalReadlistByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return allBaseBds;
  }

  try {
    const apiBds = await fetchBaseBdsFromApi();
    return apiBds.length ? apiBds : allBaseBds;
  } catch {
    return allBaseBds;
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
        acc.find((bd) => bd.title === item.title && bd.designer === item.designer)
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getBdsByUser(userId: string): Promise<Bd[]> {
  if (isLocalhost()) {
    return getAllBdsData(getLocalBdsByUser(userId));
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
  if (isLocalhost()) {
    return getAllBdsData(getLocalReadlistByUser(userId));
  }

  try {
    const readlist = await fetchReadlistBdsFromApi(userId);
    return getAllBdsData(readlist);
  } catch {
    return [];
  }
}
