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
