import { baseManwhas, baseManwhasApi } from '../../utils/entities/manwhas';
import { guillaumeManwhas } from '../../utils/users/guillaume/manwhas';
import { BaseManwha, UserManwha } from '../../models/manwha-model';

export const allBaseManwhas: BaseManwha[] = [...baseManwhas, ...baseManwhasApi];

export function getLocalManwhasByUser(userId: string): UserManwha[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeManwhas];
    default:
      return [];
  }
}

export function getLocalReadlistByUser(userId: string): UserManwha[] {
  switch (userId) {
    case 'guillaume':
      return [];
    default:
      return [];
  }
}
