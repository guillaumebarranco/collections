export enum QuizzEntityType {
  MOVIE = 'movie',
  SERIE = 'serie',
  BOOK = 'book',
  GAME = 'game',
  BD = 'bd',
  COMIC = 'comic',
  MANGA = 'manga',
  MANWHA = 'manwha',
}

export interface QuizzQuestion {
  id: number;
  title: string;
  multipleChoice: boolean;
  proposedAnswers: string[];
  acceptedAnswers: string[];
}

export interface Quizz {
  creator: string;
  entityType: QuizzEntityType;
  entityTitle: string;
  level: number;
  questions: QuizzQuestion[];
}
