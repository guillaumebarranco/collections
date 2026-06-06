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

function getGameFinishHours(item: GameForFinishStats): number {
  return Math.max(0, item.averageTimeToFinish ?? 0);
}

/** Temps estimé pour le 100 % in-game (sans priorité au temps platine). */
export function getGameCompletionHundredPercentHours(
  item: GameForFinishStats
): number {
  const finish = getGameFinishHours(item);
  const hundred =
    item.averageTimeToHundredPercent > 0
      ? item.averageTimeToHundredPercent
      : finish;
  return Math.max(hundred, finish);
}

/**
 * Temps estimé pour platiner ou faire 100 % d'un jeu.
 * Si les durées 100 % / platine ne sont pas renseignées, on retombe au minimum
 * sur le temps pour terminer l'histoire.
 */
export function getGamePlatineOrHundredPercentHours(
  item: GameForFinishStats
): number {
  const finish = getGameFinishHours(item);
  let target = finish;
  if (item.platineTime > 0) {
    target = item.platineTime;
  } else if (item.averageTimeToHundredPercent > 0) {
    target = item.averageTimeToHundredPercent;
  }
  return Math.max(target, finish);
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
    (sum, item) => sum + getGamePlatineOrHundredPercentHours(item),
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
  for (const s of list) {
    if (s.platinedGame) {
      total += getGamePlatineOrHundredPercentHours(entity);
    } else if (s.finishedGameWithHundredPercent) {
      total += getGameCompletionHundredPercentHours(entity);
    } else if (s.finishedGame) {
      total += getGameFinishHours(entity);
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

function getSessionEndDateString(session: UserGameSession): string {
  const legacy = session as UserGameSession & { finishedSessionDate?: string };
  return (session.sessionEndDate || legacy.finishedSessionDate || '').trim();
}

function getSessionStartDateString(session: UserGameSession): string {
  return (session.sessionStartDate || '').trim();
}

function formatReferenceDate(reference: Date): string {
  const y = reference.getFullYear();
  const m = String(reference.getMonth() + 1).padStart(2, '0');
  const d = String(reference.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Session ouverte : date de début renseignée, sans date de fin. */
export function isGameSessionOpen(session: UserGameSession): boolean {
  return (
    getSessionStartDateString(session).length > 0 &&
    !getSessionEndDateString(session)
  );
}

/** Jeu en cours : dernière session `currentlyPlaying` ou session ouverte. */
export function isGameInProgress(
  game: Pick<{ sessions?: UserGameSession[] }, 'sessions'>
): boolean {
  const sessions = game.sessions ?? [];
  if (sessions.length === 0) {
    return false;
  }
  const last = sessions[sessions.length - 1];
  return Boolean(last?.currentlyPlaying) || isGameSessionOpen(last);
}

export type GameLastSessionDisplay =
  | { kind: 'inProgress'; date: string }
  | { kind: 'firstSession'; date: string }
  | { kind: 'lastSession'; date: string };

function sessionHasDates(session: UserGameSession): boolean {
  return (
    getSessionStartDateString(session).length > 0 ||
    getSessionEndDateString(session).length > 0
  );
}

/** Première session datée, toutes les suivantes sans dates (rejouabilités non datées). */
function isFirstSessionDatedSubsequentEmpty(
  sessions: UserGameSession[]
): boolean {
  if (sessions.length <= 1) {
    return false;
  }
  if (!sessionHasDates(sessions[0])) {
    return false;
  }
  for (let i = 1; i < sessions.length; i++) {
    if (sessionHasDates(sessions[i])) {
      return false;
    }
  }
  return true;
}

function getFirstSessionDisplayDate(session: UserGameSession): string | null {
  const start = getSessionStartDateString(session);
  if (start) {
    return start;
  }
  return getSessionEndDateString(session) || null;
}

function getLastSessionDisplayDate(session: UserGameSession): string | null {
  const end = getSessionEndDateString(session);
  if (end) {
    return end;
  }
  return getSessionStartDateString(session) || null;
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

/**
 * Timestamp pour le tri « Derniers jeux joués récents » :
 * les jeux en cours comptent comme joués aujourd'hui.
 */
export function getGameLastPlayedSortTimestamp(
  game: GameForPlayedTimeStats,
  reference = new Date()
): number {
  if (isGameInProgress(game)) {
    return reference.getTime();
  }
  return getGameLastPlayedTimestamp(game, reference);
}

/** Date (YYYY-MM-DD) de la dernière session de jeu, pour affichage sur la card. */
export function getGameLastSessionDateString(
  game: GameForPlayedTimeStats,
  reference = new Date()
): string | null {
  const sessions = game.sessions ?? [];
  if (sessions.length === 0) {
    return null;
  }

  let bestSession: UserGameSession | null = null;
  let bestTimestamp = 0;
  for (const session of sessions) {
    const activity = getGameSessionLastActivityTimestamp(session, reference);
    if (activity > bestTimestamp) {
      bestTimestamp = activity;
      bestSession = session;
    }
  }

  if (!bestSession || bestTimestamp <= 0) {
    return null;
  }

  const end = getSessionEndDateString(bestSession);
  if (end) {
    return end;
  }

  const start = getSessionStartDateString(bestSession);
  if (start) {
    return start;
  }

  if (bestSession.currentlyPlaying) {
    return formatReferenceDate(reference);
  }

  return null;
}

/** Libellé + date de session pour affichage sur la card. */
export function getGameLastSessionDisplay(
  game: GameForPlayedTimeStats,
  reference = new Date()
): GameLastSessionDisplay | null {
  const sessions = game.sessions ?? [];
  if (sessions.length === 0) {
    return null;
  }

  const last = sessions[sessions.length - 1];
  if (Boolean(last?.currentlyPlaying) || isGameSessionOpen(last)) {
    const start = getSessionStartDateString(last);
    if (start) {
      return { kind: 'inProgress', date: start };
    }
    if (last.currentlyPlaying) {
      return { kind: 'inProgress', date: formatReferenceDate(reference) };
    }
  }

  if (isFirstSessionDatedSubsequentEmpty(sessions)) {
    const date = getFirstSessionDisplayDate(sessions[0]);
    if (date) {
      return { kind: 'firstSession', date };
    }
  }

  if (sessionHasDates(last)) {
    const date = getLastSessionDisplayDate(last);
    if (date) {
      return { kind: 'lastSession', date };
    }
  }

  return null;
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
