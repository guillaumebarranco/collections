import type { GameFromEntityAdaptation } from './from-entity.model';

export interface MandatoryGameData {
  title: string;
  editor: string;
}

export interface BaseGame extends MandatoryGameData {
  hero: string;
  coverUrl: string;
  releaseDate: string;
  averageTimeToFinish: number;
  averageTimeToHundredPercent: number;
  platform: string;
  saga: string;
  platineTime: number;
  description: string;
  /** Œuvre source (livre, film, série, autre jeu, etc.) si adaptation. */
  fromEntity?: GameFromEntityAdaptation | null;
}

export interface UserGame extends MandatoryGameData {
  rating: number;
  owned: boolean;
  gamelistPriority: 1 | 2 | 3;
  wantToPlayAgain: boolean;
  /** Sessions de jeu (dérivent timesFinished, platined, etc.) */
  sessions: UserGameSession[];
  ratingComment: string;
  borrowed: string;
  loaned: string;
}

export interface UserGameSession {
  finishedGame: boolean;
  finishedGameWithHundredPercent: boolean;
  platinedGame: boolean;
  additionnalEstimatedTime: number;
  /** Date (YYYY-MM-DD) à laquelle la session a été terminée / enregistrée. */
  finishedSessionDate: string;
  /** Partie en cours : uniquement sur la dernière session, une seule à true par jeu. */
  currentlyPlaying?: boolean;
}

export type UserGames = UserGame[];

/** Totaux dérivés des sessions (calculés par getGameDataFromUserGameAndBaseGame). */
export interface GameComputedTotals {
  timesFinished: number;
  timesFinishedHundredPercent: number;
  additionnalEstimatedTime: number;
  platined: boolean;
}

export interface Game extends BaseGame, UserGame, GameComputedTotals {}
