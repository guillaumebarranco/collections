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
  timesFinished: number;
  timesFinishedHundredPercent: number;
  additionnalEstimatedTime: number;
  platined: boolean;
  owned: boolean;
  gamelistPriority: 1 | 2 | 3;
}

export type UserGames = UserGame[];

export interface Game extends BaseGame, UserGame {}
