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
  fetchOtherUsersGamesRatedFromApi,
  OtherUserGameRating,
} from './api-games.facade';
import { createCachedFetcher } from '../../utils/cache.utils';
import { users } from '../../utils/users/users';

const fetchBaseGamesCached = createCachedFetcher(fetchBaseGamesFromApi);

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
      timesFinishedHundredPercent: game.timesFinishedHundredPercent,
      averageTimeToHundredPercent:
        definitiveMatchingGame?.averageTimeToHundredPercent || 0,
      owned: game.owned,
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
    const apiGames = await fetchBaseGamesCached();
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

export async function getOtherUsersGamesRated(
  currentUserId = 'guillaume',
  minRating = 4
): Promise<OtherUserGameRating[]> {
  if (isLocalhost()) {
    const otherUsers = users
      .map((user) => user.username)
      .filter((username) => username !== currentUserId);
    const results: OtherUserGameRating[] = [];
    otherUsers.forEach((username) => {
      const games = getLocalGamesByUser(username);
      games
        .filter((game: any) => (game.rating ?? 0) >= minRating)
        .forEach((game: any) => {
          results.push({
            title: game.title,
            editor: game.editor,
            rating: game.rating ?? 0,
            userId: username,
          });
        });
    });
    return results;
  }

  try {
    return await fetchOtherUsersGamesRatedFromApi(currentUserId, minRating);
  } catch {
    return [];
  }
}
