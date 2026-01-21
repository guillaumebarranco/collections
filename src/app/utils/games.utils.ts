import { formatTimeStats, ItemWithGameLength, TimeStats } from './stats.utils';

export function getTotalTimeToFinishGames(
  items: ItemWithGameLength[]
): TimeStats {
  let totalHours = 0;
  for (const item of items) {
    const length = item.averageTimeToFinish;
    totalHours += length;
  }
  return formatTimeStats(totalHours * 60);
}

export function getTotalTimeToFinishGamesAtHundredPercent(
  items: ItemWithGameLength[]
): TimeStats {
  let totalHours = 0;
  for (const item of items) {
    const length =
      item.platineTime > 0
        ? item.platineTime
        : item.averageTimeToHundredPercent;
    totalHours += length;
  }
  return formatTimeStats(totalHours * 60);
}

export function getGameTimePlayed(game: ItemWithGameLength): number {
  let length = 0;

  // Si l'utilisateur a platiné le jeu et ne l'a pas fini une nouvelle fois ensuite
  if (game.platined && game.timesFinished < 2) {
    length += game.platineTime;

    if (game.timesFinished > 1) {
      length += (game.timesFinished - 1) * game.averageTimeToFinish;
    }
  }

  // Si l'utilisateur a platiné le jeu et l'a fini plusieurs fois ensuite
  if (game.platined && game.timesFinished > 1) {
    length += game.platineTime;

    length += (game.timesFinished - 1) * game.averageTimeToFinish;
  }

  // Si l'utilisateur a fini le jeu à 100%
  if (game.timesFinishedHundredPercent > 0 && game.timesFinished < 2) {
    length +=
      game.averageTimeToHundredPercent * game.timesFinishedHundredPercent;
  }

  // Si l'utilisateur a fini le jeu mais pas à 100%
  if (
    !game.platined &&
    game.timesFinishedHundredPercent < 1 &&
    game.timesFinished > 0
  ) {
    length += game.averageTimeToFinish * game.timesFinished;
  }

  length += game.additionnalEstimatedTime;

  return length;
}

export function getTotalPlayedTime(items: ItemWithGameLength[]): TimeStats {
  let totalHours = 0;
  for (const item of items) {
    const length = getGameTimePlayed(item);

    if (length) {
      totalHours += length;
    }
  }
  return formatTimeStats(totalHours * 60);
}
