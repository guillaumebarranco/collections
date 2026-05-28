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

function parseGameSessionDate(raw: string | undefined | null): number {
  const value = (raw ?? '').trim();
  if (!value) {
    return 0;
  }
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

/** Timestamp de la dernière activité connue sur une session (fin, début, ou aujourd'hui si en cours). */
export function getGameSessionLastActivityTimestamp(
  session: UserGameSession,
  reference = new Date()
): number {
  const legacy = session as UserGameSession & { finishedSessionDate?: string };
  const end = parseGameSessionDate(
    session.sessionEndDate || legacy.finishedSessionDate
  );
  if (end > 0) {
    return end;
  }
  const start = parseGameSessionDate(session.sessionStartDate);
  if (start > 0) {
    return start;
  }
  if (session.currentlyPlaying) {
    return reference.getTime();
  }
  return 0;
}

/** Timestamp de la dernière activité sur toutes les sessions du jeu. */
export function getGameLastPlayedTimestamp(
  game: GameForPlayedTimeStats,
  reference = new Date()
): number {
  let max = 0;
  for (const session of game.sessions ?? []) {
    const activity = getGameSessionLastActivityTimestamp(session, reference);
    if (activity > max) {
      max = activity;
    }
  }
  return max;
}

/** Timestamp de la première session datée du jeu. */
export function getGameFirstPlayedTimestamp(game: GameForPlayedTimeStats): number {
  let min = 0;
  let hasDate = false;
  for (const session of game.sessions ?? []) {
    const start = parseGameSessionDate(session.sessionStartDate);
    const end = parseGameSessionDate(session.sessionEndDate);
    const candidate = start || end;
    if (!candidate) {
      continue;
    }
    if (!hasDate || candidate < min) {
      min = candidate;
      hasDate = true;
    }
  }
  return hasDate ? min : 0;
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
