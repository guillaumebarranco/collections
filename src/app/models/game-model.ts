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
}

export interface UserGame extends MandatoryGameData {
  rating: number;
  /** @deprecated Préférer sessions ; conservé pour rétrocompatibilité */
  // timesFinished?: number;
  /** @deprecated Préférer sessions ; conservé pour rétrocompatibilité */
  // timesFinishedHundredPercent?: number;
  /** @deprecated Préférer sessions (somme des additionnalEstimatedTime) ; conservé pour rétrocompatibilité */
  // additionnalEstimatedTime?: number;
  /** @deprecated Préférer sessions (au plus une session avec platinedGame) ; conservé pour rétrocompatibilité */
  // platined?: boolean;
  owned: boolean;
  gamelistPriority: 1 | 2 | 3;
  wantToPlayAgain: boolean;
  /** Sessions de jeu : chaque session = soit platined, soit 100%, soit terminé, soit seulement temps additionnel */
  sessions?: UserGameSession[];
}

export interface UserGameSession {
  finishedGame: boolean;
  finishedGameWithHundredPercent: boolean;
  platinedGame: boolean;
  additionnalEstimatedTime: number;
}

export type UserGames = UserGame[];

export interface Game extends BaseGame, UserGame {}
