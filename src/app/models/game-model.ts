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
}

export interface Game extends BaseGame, UserGame {}
