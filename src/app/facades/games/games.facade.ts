import { Game, BaseGame, UserGame } from '../../models/game-model';

import {
  allBaseGames,
  getLocalGamesByUser,
  getLocalGamelistByUser,
} from './local-games.facade';
import { isLocalhost } from '../../core/config';
import {
  fetchBaseGamesFromApi,
  fetchUserGamesFromApi,
  fetchGamelistGamesFromApi,
} from './api-games.facade';

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

    return {
      title: game.title,
      editor: game.editor,
      rating: game.rating,
      timesFinished: game.timesFinished,
      additionnalEstimatedTime: game.additionnalEstimatedTime,
      hero: definitiveMatchingGame?.hero || '',
      coverUrl: definitiveMatchingGame?.coverUrl || '',
      releaseDate: definitiveMatchingGame?.releaseDate || '',
      averageTimeToFinish: definitiveMatchingGame?.averageTimeToFinish || 0,
      platform: definitiveMatchingGame?.platform || '',
      saga: definitiveMatchingGame?.saga || '',
      platineTime: definitiveMatchingGame?.platineTime || 0,
      platined: game.platined,
    };
  });
}

export async function getAllGames(
  currentUserId = 'guillaume'
): Promise<{ [key: string]: Game[] }> {
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllGamesData(
        getLocalGamesByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return {
      [currentUserId]: await getAllGamesData(
        getLocalGamelistByUser(currentUserId)
      ),
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
  if (isLocalhost()) {
    return allBaseGames;
  }

  try {
    const apiGames = await fetchBaseGamesFromApi();
    return apiGames.length ? apiGames : allBaseGames;
  } catch {
    return allBaseGames;
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
  if (isLocalhost()) {
    return getAllGamesData(getLocalGamesByUser(userId));
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
  if (isLocalhost()) {
    return getAllGamesData(getLocalGamelistByUser(userId));
  }

  try {
    const gamelist = await fetchGamelistGamesFromApi(userId);
    return getAllGamesData(gamelist);
  } catch {
    return [];
  }
}
