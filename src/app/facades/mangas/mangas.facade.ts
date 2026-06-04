import { Manga, BaseManga, UserManga } from '../../models/manga-model';

import {
  fetchBaseMangasFromApi,
  fetchUserMangasFromApi,
  fetchReadlistMangasFromApi,
  fetchOtherUsersMangasRatedFromApi,
  OtherUserMangaRating,
} from './api-mangas.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getMangaDataFromUserMangaAndBaseManga } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseMangasCached = createCachedFetcher(fetchBaseMangasFromApi);

async function getAllMangasData(mangas: UserManga[]): Promise<Manga[]> {
  const baseMangas = await getAllBaseMangas();

  return mangas.map((manga: UserManga) => {
    const matchingBaseManga = baseMangas.filter(
      (baseManga: BaseManga) => baseManga.title === manga.title
    );

    const definitiveMatchingManga =
      matchingBaseManga.length === 1
        ? matchingBaseManga[0]
        : matchingBaseManga.filter((baseManga: BaseManga) => {
            return baseManga.author === manga.author;
          })[0];

    return getMangaDataFromUserMangaAndBaseManga(
      manga,
      definitiveMatchingManga
    );
  });
}

export async function getAllMangas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manga[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllMangasData(offline.mangas.user),
    };
  }

  try {
    const userMangas = await fetchUserMangasFromApi(currentUserId);
    return {
      [currentUserId]: await getAllMangasData(userMangas),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseMangas(): Promise<BaseManga[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.mangas.base;

  try {
    return await fetchBaseMangasCached();
  } catch {
    return [];
  }
}

export async function getAllReadlistMangas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manga[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllMangasData(offline.mangas.readlist),
    };
  }

  try {
    const readlist = await fetchReadlistMangasFromApi(currentUserId);
    return {
      [currentUserId]: await getAllMangasData(readlist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllMangasMerged(
  currentUserId = 'guillaume'
): Promise<Manga[]> {
  const allMangas = await getAllMangas(currentUserId);
  return Object.values(allMangas)
    .flat()
    .reduce((acc: Manga[], item: Manga) => {
      if (
        acc.find(
          (manga) => manga.title === item.title && manga.author === item.author
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getMangasByUser(userId: string): Promise<Manga[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllMangasData(offline.mangas.user);
  }

  try {
    const userMangas = await fetchUserMangasFromApi(userId);
    return getAllMangasData(userMangas);
  } catch {
    return [];
  }
}

export async function getCurrentReadlistMangasByUser(
  userId: string
): Promise<Manga[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllMangasData(offline.mangas.readlist);
  }

  try {
    const readlist = await fetchReadlistMangasFromApi(userId);
    return getAllMangasData(readlist);
  } catch {
    return [];
  }
}

export async function getOtherUsersMangasRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserMangaRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersMangasRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
