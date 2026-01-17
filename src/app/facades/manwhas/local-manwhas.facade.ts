import { baseManwhas, baseManwhasApi } from '../../utils/entities/manwhas';
import { guillaumeManwhas } from '../../utils/users/guillaume/manwhas';
import { BaseManwha, UserManwha } from '../../models/manwha-model';
import { ronanManwhas } from '../../utils/users/ronan/manwhas/ronan_manwhas';

export const allBaseManwhas: BaseManwha[] = [...baseManwhas, ...baseManwhasApi];

export function getLocalManwhasByUser(userId: string): UserManwha[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeManwhas];
    case 'ronan':
      return [...ronanManwhas];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserManwha[] {
  switch (userId) {
    case 'guillaume':
      return [];
    case 'ronan':
      return [];
    default:
      return [];
  }
}
