import { Music, BaseMusic, UserMusic } from '../../models/music-model';
import {
  fetchBaseMusicsFromApi,
  fetchMergedUserMusicsFromApi,
  fetchUserMusicsFromApi,
} from './api-musics.facade';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';

async function getAllMusicsData(musics: UserMusic[]): Promise<Music[]> {
  const baseMusics = await getAllBaseMusics();

  return musics.map((music: UserMusic) => {
    const matchingBaseMusics = baseMusics.filter(
      (baseMusic: BaseMusic) => baseMusic.title === music.title
    );

    const definitiveMatchingMusic =
      matchingBaseMusics.length === 1
        ? matchingBaseMusics[0]
        : matchingBaseMusics.filter((baseMusic: BaseMusic) => {
            return baseMusic.artist === music.artist;
          })[0];

    return {
      title: music.title,
      artist: music.artist,
      rating: music.rating,
      timesListened: music.timesListened,
      album: definitiveMatchingMusic?.album || 'Unknown',
      coverUrl: definitiveMatchingMusic?.coverUrl || '',
      releaseDate: definitiveMatchingMusic?.releaseDate || '',
      duration: definitiveMatchingMusic?.duration || 0,
      genre: definitiveMatchingMusic?.genre || '',
    };
  });
}

async function getMergedUserMusics(userId: string): Promise<Music[]> {
  try {
    return await fetchMergedUserMusicsFromApi(userId);
  } catch {
    const userMusics = await fetchUserMusicsFromApi(userId);
    return getAllMusicsData(userMusics);
  }
}

export async function getAllMusics(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Music[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllMusicsData(offline.musics.user),
    };
  }

  try {
    return {
      [currentUserId]: await getMergedUserMusics(currentUserId),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseMusics(): Promise<BaseMusic[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.musics.base;

  try {
    return await fetchBaseMusicsFromApi();
  } catch {
    return [];
  }
}

export async function getAllMusicsMerged(
  currentUserId = 'guillaume'
): Promise<Music[]> {
  const allMusics = await getAllMusics(currentUserId);
  return Object.values(allMusics)
    .flat()
    .reduce((acc: Music[], item: Music) => {
      if (
        acc.find(
          (music) =>
            music.title === item.title && music.artist === item.artist
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getMusicsByUser(userId: string): Promise<Music[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllMusicsData(offline.musics.user);
  }

  try {
    return await getMergedUserMusics(userId);
  } catch {
    return [];
  }
}

/** User musics bruts (clés d'exclusion select, sans join catalogue). */
export async function getUserMusicsRaw(userId: string): Promise<UserMusic[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return offline.musics.user;
  }
  try {
    return await fetchUserMusicsFromApi(userId);
  } catch {
    return [];
  }
}
