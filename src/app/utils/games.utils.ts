import { formatTimeStats, TimeStats } from './stats.utils';
import type { UserGameSession } from '../models/game-model';

/** Données minimales pour les stats "temps pour terminer / 100%". */
export interface GameForFinishStats {
  averageTimeToFinish: number;
  platineTime: number;
  averageTimeToHundredPercent: number;
}

/** Données minimales pour la stat "temps passé à jouer" (sessions + durées de référence). */
export interface GameForPlayedTimeStats extends GameForFinishStats {
  sessions: UserGameSession[];
}

/**
 * Temps total (théorique) pour terminer une fois chaque jeu de la liste.
 * Utilisé pour la stat "Temps total pour terminer tous les jeux".
 */
export function getTotalTimeToFinishGames(
  items: GameForFinishStats[]
): TimeStats {
  const totalHours = items.reduce(
    (sum, item) => sum + item.averageTimeToFinish,
    0
  );
  return formatTimeStats(totalHours * 60);
}

/**
 * Temps total (théorique) pour platiner ou faire 100 % de chaque jeu.
 * Utilisé pour la stat "Temps total pour platiner/100% tous les jeux".
 */
export function getTotalTimeToFinishGamesAtHundredPercent(
  items: GameForFinishStats[]
): TimeStats {
  const totalHours = items.reduce(
    (sum, item) =>
      sum +
      (item.platineTime > 0
        ? item.platineTime
        : item.averageTimeToHundredPercent),
    0
  );
  return formatTimeStats(totalHours * 60);
}

/**
 * Heures de jeu estimées à partir des sessions et des durées de référence (base).
 * Partagé par l’admin serveur et les stats front.
 */
export function getGamePlayedHoursFromSessions(
  sessions: UserGameSession[] | undefined,
  entity: GameForFinishStats
): number {
  const list = sessions ?? [];
  if (list.length === 0) {
    return 0;
  }
  let total = 0;
  const platineTime =
    entity.platineTime > 0
      ? entity.platineTime
      : entity.averageTimeToHundredPercent;
  for (const s of list) {
    if (s.platinedGame) {
      total += platineTime;
    } else if (s.finishedGameWithHundredPercent) {
      total += entity.averageTimeToHundredPercent;
    } else if (s.finishedGame) {
      total += entity.averageTimeToFinish;
    }
    total += Number(s.additionnalEstimatedTime) || 0;
  }
  return total;
}

/**
 * Temps total passé sur un jeu (en heures), dérivé des sessions.
 * Utilisé pour la stat "Temps total passé à jouer" et l'affichage par jeu.
 */
export function getGameTimePlayed(game: GameForPlayedTimeStats): number {
  return getGamePlayedHoursFromSessions(game.sessions, game);
}

/**
 * Temps total passé à jouer sur tous les jeux de la liste (somme des temps par session).
 * Utilisé pour la stat "Temps total passé à jouer".
 */
export function getTotalPlayedTime(items: GameForPlayedTimeStats[]): TimeStats {
  const totalHours = items.reduce(
    (sum, item) => sum + getGameTimePlayed(item),
    0
  );
  return formatTimeStats(totalHours * 60);
}
