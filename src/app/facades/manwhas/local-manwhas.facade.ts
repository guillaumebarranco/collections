import { baseManwhas, baseManwhasApi } from '../../utils/entities/manwhas';
import { guillaumeManwhas } from '../../utils/users/guillaume/manwhas';
import { BaseManwha, UserManwha } from '../../models/manwha-model';
import { ronanManwhas } from '../../utils/users/ronan/manwhas/ronan_manwhas';
import { amandineManwhas } from '../../utils/users/amandine/manwhas/amandine_manwhas';
import { kevinManwhas } from '../../utils/users/kevin/manwhas/kevin_manwhas';
import { williamManwhas } from '../../utils/users/william/manwhas/william_manwhas';
import { guillaumeReadListManwhas } from '../../utils/users/guillaume/manwhas/guillaume_readlist_manwhas';
import { ronanReadListManwhas } from '../../utils/users/ronan/manwhas/ronan_readlist_manwhas';
import { williamReadListManwhas } from '../../utils/users/william/manwhas/william_readlist_manwhas';
import { amandineReadListManwhas } from '../../utils/users/amandine/manwhas/amandine_readlist_manwhas';
import { kevinReadListManwhas } from '../../utils/users/kevin/manwhas/kevin_readlist_manwhas';

export const allBaseManwhas: BaseManwha[] = [...baseManwhas, ...baseManwhasApi];

export function getLocalManwhasByUser(userId: string): UserManwha[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeManwhas];
    case 'ronan':
      return [...ronanManwhas];
    case 'william':
      return [...williamManwhas];
    case 'amandine':
      return [...amandineManwhas];
    case 'kevin':
      return [...kevinManwhas];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserManwha[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeReadListManwhas];
    case 'ronan':
      return [...ronanReadListManwhas];
    case 'william':
      return [...williamReadListManwhas];
    case 'amandine':
      return [...amandineReadListManwhas];
    case 'kevin':
      return [...kevinReadListManwhas];
    default:
      return [];
  }
}
