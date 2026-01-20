import { musics as baseMusics } from '../../utils/entities/musics';
import { musics as guillaumeMusics } from '../../utils/users/guillaume/musics';
import { BaseMusic, UserMusic } from '../../models/music-model';
import { ronanMusics } from '../../utils/users/ronan/musics/ronan_musics';
import { data as soundtrackData } from '../../utils/users/xeryth/data';

const SOUNDTRACKS_ALBUM = 'Films/Séries/Jeux/Animés';

const normalizeKey = (value: string) => value.trim().toLowerCase();
const musicKey = (title: string, artist: string) =>
  `${normalizeKey(title)}|${normalizeKey(artist)}`;

const parseDurationToSeconds = (duration: string): number => {
  const parts = duration.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3)
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
};

const soundtrackBaseMusics: BaseMusic[] = soundtrackData.map((item) => ({
  title: item.title,
  artist: item.artist,
  album: SOUNDTRACKS_ALBUM,
  coverUrl: '',
  releaseDate: '',
  duration: parseDurationToSeconds(item.duration),
  genre: 'Soundtrack',
}));

const soundtrackUserMusics: UserMusic[] = soundtrackData.map((item) => ({
  title: item.title,
  artist: item.artist,
  rating: 0,
  timesListened: 1,
}));

const mergeBaseMusics = (source: BaseMusic[], extra: BaseMusic[]) => {
  const existing = new Set(
    source.map((music) => musicKey(music.title, music.artist))
  );
  return [
    ...source,
    ...extra.filter(
      (music) => !existing.has(musicKey(music.title, music.artist))
    ),
  ];
};

const mergeUserMusics = (source: UserMusic[], extra: UserMusic[]) => {
  const existing = new Set(
    source.map((music) => musicKey(music.title, music.artist))
  );
  return [
    ...source,
    ...extra.filter(
      (music) => !existing.has(musicKey(music.title, music.artist))
    ),
  ];
};

export const allBaseMusics: BaseMusic[] = mergeBaseMusics(
  baseMusics,
  soundtrackBaseMusics
);

export function getLocalMusicsByUser(userId: string): UserMusic[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeMusics];
    case 'ronan':
      return mergeUserMusics(ronanMusics, soundtrackUserMusics);
    default:
      return [];
  }
}
