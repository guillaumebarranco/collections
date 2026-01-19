import { Music, BaseMusic, UserMusic } from '../../models/music-model';
import { allBaseMusics, getLocalMusicsByUser } from './local-musics.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseMusicsFromApi,
  fetchUserMusicsFromApi,
} from './api-musics.facade';

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

export async function getAllMusics(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Music[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllMusicsData(
        getLocalMusicsByUser(currentUserId)
      ),
    };
  }

  try {
    const userMusics = await fetchUserMusicsFromApi(currentUserId);
    return {
      [currentUserId]: await getAllMusicsData(userMusics),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseMusics(): Promise<BaseMusic[]> {
  if (isLocalhost()) {
    return allBaseMusics;
  }

  try {
    const apiMusics = await fetchBaseMusicsFromApi();
    return apiMusics.length ? apiMusics : allBaseMusics;
  } catch {
    return allBaseMusics;
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
  if (isLocalhost()) {
    return getAllMusicsData(getLocalMusicsByUser(userId));
  }

  try {
    const userMusics = await fetchUserMusicsFromApi(userId);
    return getAllMusicsData(userMusics);
  } catch {
    return [];
  }
}
