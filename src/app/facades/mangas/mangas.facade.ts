import { Manga, BaseManga, UserManga } from '../../models/manga-model';

import {
  allBaseMangas,
  getLocalMangasByUser,
  getLocalReadlistByUser,
} from './local-mangas.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseMangasFromApi,
  fetchUserMangasFromApi,
  fetchReadlistMangasFromApi,
  fetchOtherUsersMangasRatedFromApi,
  OtherUserMangaRating,
} from './api-mangas.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { users } from '../../utils/users/users';

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

    return {
      title: manga.title,
      author: manga.author,
      rating: manga.rating,
      readDate: manga.readDate,
      readTimes: manga.readTimes,
      coverUrl: definitiveMatchingManga?.coverUrl || '',
      pages: definitiveMatchingManga?.pages || 0,
      genre: definitiveMatchingManga?.genre || '',
      nbTomes: definitiveMatchingManga?.nbTomes || 0,
      isFinished: definitiveMatchingManga?.isFinished || false,
      owned: manga.owned,
    };
  });
}

export async function getAllMangas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manga[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllMangasData(
        getLocalMangasByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return allBaseMangas;
  }

  try {
    return await fetchBaseMangasCached();
  } catch {
    return [];
  }
}

export async function getAllReadlistMangas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manga[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllMangasData(
        getLocalReadlistByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return getAllMangasData(getLocalMangasByUser(userId));
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
  if (isLocalhost()) {
    return getAllMangasData(getLocalReadlistByUser(userId));
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
  minRating = 4
): Promise<OtherUserMangaRating[]> {
  if (isLocalhost()) {
    const otherUsers = users
      .map((user) => user.username)
      .filter((username) => username !== currentUserId);
    const results: OtherUserMangaRating[] = [];
    otherUsers.forEach((username) => {
      const mangas = getLocalMangasByUser(username);
      mangas
        .filter((manga: any) => (manga.rating ?? 0) >= minRating)
        .forEach((manga: any) => {
          results.push({
            title: manga.title,
            author: manga.author,
            rating: manga.rating ?? 0,
            userId: username,
          });
        });
    });
    return results;
  }

  try {
    return await fetchOtherUsersMangasRatedFromApi(currentUserId, minRating);
  } catch {
    return [];
  }
}
