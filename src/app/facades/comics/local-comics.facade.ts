import {
  baseComics,
  baseComicsApi,
  baseComicsUnderworld,
  baseComicsMatrix,
  baseComicsTerminator,
} from '../../utils/entities/comics';
import { BaseComic, UserComic } from '../../models/comic-model';
import { guillaumeComics } from '../../utils/users/guillaume/comics/guillaume_comics';
import { guillaumeReadListComics } from '../../utils/users/guillaume/comics/guillaume_readlist_comics';
import { amandineComics } from '../../utils/users/amandine/comics/amandine_comics';
import { amandineReadListComics } from '../../utils/users/amandine/comics/amandine_readlist_comics';
import { kevinComics } from '../../utils/users/kevin/comics/kevin_comics';
import { kevinReadListComics } from '../../utils/users/kevin/comics/kevin_readlist_comics';
import { ronanComics } from '../../utils/users/ronan/comics/ronan_comics';
import { ronanReadListComics } from '../../utils/users/ronan/comics/ronan_readlist_comics';
import { williamComics } from '../../utils/users/william/comics/william_comics';
import { williamReadListComics } from '../../utils/users/william/comics/william_readlist_comics';
import { xerythComics } from '../../utils/users/xeryth/comics/xeryth_comics';
import { xerythReadListComics } from '../../utils/users/xeryth/comics/xeryth_readlist_comics';

export const allBaseComics: BaseComic[] = [
  ...baseComics,
  ...baseComicsApi,
  ...baseComicsUnderworld,
  ...baseComicsMatrix,
  ...baseComicsTerminator,
];

export function getLocalComicsByUser(userId: string): UserComic[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeComics];
    case 'amandine':
      return [...amandineComics];
    case 'kevin':
      return [...kevinComics];
    case 'ronan':
      return [...ronanComics];
    case 'william':
      return [...williamComics];
    case 'xeryth':
      return [...xerythComics];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserComic[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeReadListComics];
    case 'amandine':
      return [...amandineReadListComics];
    case 'kevin':
      return [...kevinReadListComics];
    case 'ronan':
      return [...ronanReadListComics];
    case 'william':
      return [...williamReadListComics];
    case 'xeryth':
      return [...xerythReadListComics];
    default:
      return [];
  }
}
