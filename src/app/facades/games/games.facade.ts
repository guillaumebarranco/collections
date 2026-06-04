import { Game, BaseGame, UserGame } from '../../models/game-model';

import {
  fetchBaseGamesFromApi,
  fetchUserGamesFromApi,
  fetchGamelistGamesFromApi,
  fetchOtherUsersGamesRatedFromApi,
  OtherUserGameRating,
} from './api-games.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { getGameDataFromUserGameAndBaseGame } from '../../helpers/entities.helper';
import {
  canServeOfflineUser,
  getActiveOfflineCache,
} from '../../core/offline/offline-entity-access';
import { isOfflineModeBlockingOtherUsers } from '../../core/offline/offline-mode.utils';

const fetchBaseGamesCached = createCachedFetcher(fetchBaseGamesFromApi);

/** À appeler après une modification admin des entités jeux (fichiers base). */
export function invalidateBaseGamesCache(): void {
  fetchBaseGamesCached.invalidate();
}

async function getAllGamesData(games: UserGame[]): Promise<Game[]> {
  const baseGames = await getAllBaseGames();

  return games.map((game: UserGame) => {
    const matchingBaseGame = baseGames.filter(
      (baseGame: BaseGame) => baseGame.title === game.title
    );

    // For the case when multiple games have the same name, hence matching from game editor
    const definitiveMatchingGame =
      matchingBaseGame.length === 1
        ? matchingBaseGame[0]
        : matchingBaseGame.filter((baseGame: BaseGame) => {
            return baseGame.editor === game.editor;
          })[0];

    return getGameDataFromUserGameAndBaseGame(game, definitiveMatchingGame);
  });
}

export async function getAllGames(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Game[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllGamesData(offline.games.user),
    };
  }

  try {
    const userGames = await fetchUserGamesFromApi(currentUserId);
    return {
      [currentUserId]: await getAllGamesData(userGames),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllGamelistGames(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Game[] }> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(currentUserId)) {
      return { [currentUserId]: [] };
    }
    return {
      [currentUserId]: await getAllGamesData(offline.games.gamelist),
    };
  }

  try {
    const gamelist = await fetchGamelistGamesFromApi(currentUserId);
    return {
      [currentUserId]: await getAllGamesData(gamelist),
    };
  } catch {
    return {
      [currentUserId]: [],
    };
  }
}

export async function getAllBaseGames(): Promise<BaseGame[]> {
  const offline = getActiveOfflineCache();
  if (offline) return offline.games.base;

  try {
    return await fetchBaseGamesCached();
  } catch {
    console.warn(
      'Impossible de charger les jeux de base via l’API, repli sur le bundle embarqué.'
    );
    return [];
  }
}

export async function getAllGamesMerged(
  currentUserId = 'guillaume'
): Promise<Game[]> {
  const allGames = await getAllGames(currentUserId);
  return Object.values(allGames)
    .flat()
    .reduce((acc: Game[], item: Game) => {
      if (
        acc.find(
          (game) => game.title === item.title && game.editor === item.editor
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);
}

export async function getGamesByUser(userId: string): Promise<Game[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllGamesData(offline.games.user);
  }

  try {
    const userGames = await fetchUserGamesFromApi(userId);
    return getAllGamesData(userGames);
  } catch {
    return [];
  }
}

export async function getCurrentGamelistGamesByUser(
  userId: string
): Promise<Game[]> {
  const offline = getActiveOfflineCache();
  if (offline) {
    if (!canServeOfflineUser(userId)) return [];
    return getAllGamesData(offline.games.gamelist);
  }

  try {
    const gamelist = await fetchGamelistGamesFromApi(userId);
    return getAllGamesData(gamelist);
  } catch {
    return [];
  }
}

export async function getOtherUsersGamesRated(
  currentUserId = 'guillaume',
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserGameRating[]> {
  if (isOfflineModeBlockingOtherUsers()) {
    return [];
  }

  try {
    return await fetchOtherUsersGamesRatedFromApi(
      currentUserId,
      minRating,
      followedUserIds
    );
  } catch {
    return [];
  }
}
