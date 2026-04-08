import { baseGames } from '../../utils/entities/games/base_games';
import { baseGamesApi } from '../../utils/entities/games/base_games_api';
import { baseGamesMario } from '../../utils/entities/games/base_games_mario';
import { baseGamesAdaptations } from '../../utils/entities/games/base_games_adaptations';

import { guillaumeGames } from '../../utils/users/guillaume/games';
import { guillaumeGameListGames } from '../../utils/users/guillaume/games/guillaume_gamelist_games';
import { ronanGames } from '../../utils/users/ronan/games/ronan_games';
import { ronanGameListGames } from '../../utils/users/ronan/games/ronan_gamelist_games';
import { BaseGame, UserGame } from '../../models/game-model';
import { amandineGames } from '../../utils/users/amandine/games/amandine_games';
import { amandineGameListGames } from '../../utils/users/amandine/games/amandine_gamelist_games';
import { kevinGames } from '../../utils/users/kevin/games/kevin_games';
import { kevinGameListGames } from '../../utils/users/kevin/games/kevin_gamelist_games';
import { williamGames } from '../../utils/users/william/games/william_games';
import { williamGameListGames } from '../../utils/users/william/games/william_gamelist_games';
import { dantesGames } from '../../utils/users/dantes/games/dantes_games';

export const allBaseGames: BaseGame[] = [
  ...baseGames,
  ...baseGamesApi,
  ...baseGamesMario,
  ...baseGamesAdaptations,
];

export function getLocalGamesByUser(userId: string): UserGame[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeGames];
    case 'ronan':
      return [...ronanGames];
    case 'amandine':
      return [...amandineGames];
    case 'kevin':
      return [...kevinGames];
    case 'william':
      return [...williamGames];
    case 'dantes':
      return [...dantesGames];
    default:
      return [];
  }
}

export function getLocalGamelistByUser(userId: string): UserGame[] {
  switch (userId) {
    case 'guillaume':
      return [...guillaumeGameListGames];
    case 'ronan':
      return [...ronanGameListGames];
    case 'amandine':
      return [...amandineGameListGames];
    case 'kevin':
      return [...kevinGameListGames];
    case 'william':
      return [...williamGameListGames];
    default:
      return [];
  }
}
