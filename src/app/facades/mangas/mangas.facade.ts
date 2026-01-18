import { Manga, BaseManga, UserManga } from '../../models/manga-model';

import {
  allBaseMangas,
  getLocalMangasByUser,
  getLocalReadlistByUser,
} from './local-mangas.facade';
import { DEFAULT_USER_IDS, isLocalhost } from '../../core/config';
import { fetchBaseMangasFromApi, fetchUserMangasFromApi } from './api-mangas.facade';

function getAllMangasData(mangas: UserManga[]): Manga[] {
  return mangas.map((manga: UserManga) => {
    const matchingBaseManga = allBaseMangas.filter(
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
    };
  });
}

function buildMangasMap(
  userId: string,
  mangas: Manga[]
): { [key: string]: Manga[] } {
  return DEFAULT_USER_IDS.reduce(
    (acc, id) => ({
      ...acc,
      [id]: id === userId ? mangas : [],
    }),
    {} as { [key: string]: Manga[] }
  );
}

export async function getAllMangas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manga[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllMangasData(getLocalMangasByUser('guillaume')),
      william: getAllMangasData(getLocalMangasByUser('william')),
      kevin: getAllMangasData(getLocalMangasByUser('kevin')),
      amandine: getAllMangasData(getLocalMangasByUser('amandine')),
      ronan: getAllMangasData(getLocalMangasByUser('ronan')),
    };
  }

  try {
    const userMangas = await fetchUserMangasFromApi(currentUserId);
    return buildMangasMap(currentUserId, getAllMangasData(userMangas));
  } catch {
    return buildMangasMap(currentUserId, []);
  }
}

export async function getAllBaseMangas(): Promise<BaseManga[]> {
  if (isLocalhost()) {
    return allBaseMangas;
  }

  try {
    return await fetchBaseMangasFromApi();
  } catch {
    return [];
  }
}

export async function getAllReadlistMangas(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Manga[] }> {
  if (isLocalhost()) {
    return {
      guillaume: getAllMangasData(getLocalReadlistByUser('guillaume')),
      william: [],
      kevin: getAllMangasData(getLocalReadlistByUser('kevin')),
      amandine: getAllMangasData(getLocalReadlistByUser('amandine')),
      ronan: getAllMangasData(getLocalReadlistByUser('ronan')),
    };
  }

  const readlist = getLocalReadlistByUser(currentUserId);
  return buildMangasMap(currentUserId, getAllMangasData(readlist));
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

  return getAllMangasData(getLocalReadlistByUser(userId));
}
