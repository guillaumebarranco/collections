import { musics as baseMusics } from '../../utils/entities/musics';
import { musics as guillaumeMusics } from '../../utils/users/guillaume/musics';
import { BaseMusic, UserMusic } from '../../models/music-model';
import { ronanMusics } from '../../utils/users/ronan/musics/ronan_musics';

export const allBaseMusics: BaseMusic[] = [...baseMusics];

export function getLocalMusicsByUser(userId: string): UserMusic[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeMusics];
    case 'ronan':
      return [...ronanMusics];
    default:
      return [];
  }
}
