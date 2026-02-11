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
 * Calcule le temps joué (en heures) à partir des sessions d'un jeu.
 */
function getGameTimePlayedFromSessions(
  sessions: UserGameSession[],
  game: GameForFinishStats
): number {
  let total = 0;
  for (const s of sessions) {
    if (s.platinedGame) {
      total +=
        game.platineTime > 0
          ? game.platineTime
          : game.averageTimeToHundredPercent;
    } else if (s.finishedGameWithHundredPercent) {
      total += game.averageTimeToHundredPercent;
    } else if (s.finishedGame) {
      total += game.averageTimeToFinish;
    }

    total += s.additionnalEstimatedTime ?? 0;
  }
  return total;
}

/**
 * Temps total passé sur un jeu (en heures), dérivé des sessions.
 * Utilisé pour la stat "Temps total passé à jouer" et l'affichage par jeu.
 */
export function getGameTimePlayed(game: GameForPlayedTimeStats): number {
  const sessions = game.sessions ?? [];
  if (sessions.length === 0) return 0;
  return getGameTimePlayedFromSessions(sessions, game);
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
