import { formatTimeStats, ItemWithGameLength, TimeStats } from './stats.utils';
import type { UserGameSession } from '../models/game-model';

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

type GameWithSessions = ItemWithGameLength & {
  sessions?: UserGameSession[];
};

/**
 * Calcule le temps joué à partir des sessions (nouveau modèle).
 */
function getGameTimePlayedFromSessions(
  sessions: UserGameSession[],
  game: ItemWithGameLength
): number {
  let total = 0;
  for (const s of sessions) {
    if (s.platinedGame) {
      total += game.platineTime > 0 ? game.platineTime : game.averageTimeToHundredPercent;
    } else if (s.finishedGameWithHundredPercent) {
      total += game.averageTimeToHundredPercent;
    } else if (s.finishedGame) {
      total += game.averageTimeToFinish;
    } else {
      total += s.additionnalEstimatedTime ?? 0;
    }
  }
  return total;
}

export function getGameTimePlayed(game: GameWithSessions): number {
  if (game.sessions && game.sessions.length > 0) {
    return getGameTimePlayedFromSessions(game.sessions, game);
  }

  let length = 0;

  if (game.platined && game.timesFinished < 2) {
    length += game.platineTime;
    if (game.timesFinished > 1) {
      length += (game.timesFinished - 1) * game.averageTimeToFinish;
    }
  }

  if (game.platined && game.timesFinished > 1) {
    length += game.platineTime;
    length += (game.timesFinished - 1) * game.averageTimeToFinish;
  }

  if (game.timesFinishedHundredPercent > 0 && game.timesFinished < 2) {
    length += game.averageTimeToHundredPercent * game.timesFinishedHundredPercent;
  }

  if (game.timesFinishedHundredPercent > 0 && game.timesFinished > 1) {
    length += game.averageTimeToHundredPercent;
    length += (game.timesFinished - 1) * game.averageTimeToFinish;
  }

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
