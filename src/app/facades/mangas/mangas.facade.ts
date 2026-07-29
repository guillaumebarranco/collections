import { Manga, BaseManga, UserManga } from '../../models/manga-model';
import type { LightManga } from '../../models/entity-light.model';

import {
  fetchBaseMangasFromApi,
  fetchBaseMangasLightFromApi,
  fetchMergedUserMangasFromApi,
  fetchMergedReadlistMangasFromApi,
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
const fetchBaseMangasLightCached = createCachedFetcher(
  fetchBaseMangasLightFromApi
);

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

async function getMergedUserMangas(userId: string): Promise<Manga[]> {
  try {
    return await fetchMergedUserMangasFromApi(userId);
  } catch {
    const userMangas = await fetchUserMangasFromApi(userId);
    return getAllMangasData(userMangas);
  }
}

async function getMergedReadlistMangas(userId: string): Promise<Manga[]> {
  try {
    return await fetchMergedReadlistMangasFromApi(userId);
  } catch {
    const readlist = await fetchReadlistMangasFromApi(userId);
    return getAllMangasData(readlist);
  }
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
    return {
      [currentUserId]: await getMergedUserMangas(currentUserId),
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

/** Catalogue allégé pour les pages select. */
export async function getAllBaseMangasLight(): Promise<LightManga[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    return offline.mangas.base.map((m) => ({
      title: m.title,
      author: m.author,
      coverUrl: m.coverUrl ?? '',
    }));
  }

  try {
    return await fetchBaseMangasLightCached();
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
    return {
      [currentUserId]: await getMergedReadlistMangas(currentUserId),
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
    return await getMergedUserMangas(userId);
  } catch {
    return [];
  }
}

/** User mangas bruts (clés d'exclusion select, sans join catalogue). */
export async function getUserMangasRaw(userId: string): Promise<UserManga[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.mangas.user;
  }
  try {
    return await fetchUserMangasFromApi(userId);
  } catch {
    return [];
  }
}

export async function getReadlistMangasRaw(userId: string): Promise<UserManga[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.mangas.readlist;
  }
  try {
    return await fetchReadlistMangasFromApi(userId);
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
    return await getMergedReadlistMangas(userId);
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
