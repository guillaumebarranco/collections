import { Game, BaseGame, UserGame } from '../models/game-model';

import { baseGames } from '../utils/entities/games/base_games';

import { guillaumeGames } from '../utils/users/guillaume/games';
import { ronanGames } from '../utils/users/ronan/games/ronan_games';

const allBaseGames: BaseGame[] = [...baseGames];

export function getAllGames(): { [key: string]: Game[] } {
  return {
    guillaume: getAllGamesData([...guillaumeGames]),
    william: getAllGamesData([]),
    kevin: [],
    amandine: getAllGamesData([]),
    ronan: getAllGamesData([...ronanGames]),
  };
}

export function getAllGamesMerged(): Game[] {
  return Object.values(getAllGames())
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

export function getGamesByUser(userId: string): Game[] {
  const allGamesData = getAllGames();
  return allGamesData[userId] || [];
}

function getAllGamesData(games: UserGame[]): Game[] {
  return games.map((game: UserGame) => {
    const matchingBaseGame = allBaseGames.filter(
      (baseGame: BaseGame) => baseGame.title === game.title
    );

    // For the case when multiple games have the same name, hence matching from game director
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
    };
  });
}
