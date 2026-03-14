import { baseBds, baseBdsApi } from '../../utils/entities/bds';
import { BaseBd, UserBd } from '../../models/bd-model';
import { guillaumeBds } from '../../utils/users/guillaume/bds/guillaume_bds';
import { guillaumeReadListBds } from '../../utils/users/guillaume/bds/guillaume_readlist_bds';
import { amandineBds } from '../../utils/users/amandine/bds/amandine_bds';
import { amandineReadListBds } from '../../utils/users/amandine/bds/amandine_readlist_bds';
import { kevinBds } from '../../utils/users/kevin/bds/kevin_bds';
import { kevinReadListBds } from '../../utils/users/kevin/bds/kevin_readlist_bds';
import { ronanBds } from '../../utils/users/ronan/bds/ronan_bds';
import { ronanReadListBds } from '../../utils/users/ronan/bds/ronan_readlist_bds';
import { williamBds } from '../../utils/users/william/bds/william_bds';
import { williamReadListBds } from '../../utils/users/william/bds/william_readlist_bds';
import { xerythBds } from '../../utils/users/xeryth/bds/xeryth_bds';
import { xerythReadListBds } from '../../utils/users/xeryth/bds/xeryth_readlist_bds';
import { marinaBds } from '../../utils/users/marina/bds/marina_bds';

export const allBaseBds: BaseBd[] = [...baseBds, ...baseBdsApi];

export function getLocalBdsByUser(userId: string): UserBd[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeBds];
    case 'amandine':
      return [...amandineBds];
    case 'kevin':
      return [...kevinBds];
    case 'ronan':
      return [...ronanBds];
    case 'william':
      return [...williamBds];
    case 'xeryth':
      return [...xerythBds];
    case 'marina':
      return [...marinaBds];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserBd[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeReadListBds];
    case 'amandine':
      return [...amandineReadListBds];
    case 'kevin':
      return [...kevinReadListBds];
    case 'ronan':
      return [...ronanReadListBds];
    case 'william':
      return [...williamReadListBds];
    case 'xeryth':
      return [...xerythReadListBds];
    default:
      return [];
  }
}
