import { baseGames } from '../../utils/entities/games/base_games';
import { baseGamesApi } from '../../utils/entities/games/base_games_api';

import { guillaumeGames } from '../../utils/users/guillaume/games';
import { ronanGames } from '../../utils/users/ronan/games/ronan_games';
import { BaseGame, UserGame } from '../../models/game-model';

export const allBaseGames: BaseGame[] = [...baseGames, ...baseGamesApi];

export function getLocalGamesByUser(userId: string): UserGame[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeGames];
    case 'ronan':
      return [...ronanGames];
    default:
      return [];
  }
}
