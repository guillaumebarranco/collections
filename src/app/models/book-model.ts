export interface Book {
  title: string;
  author: string;
  coverUrl: string;
  readDate: string;
  rating: number;
  pages?: number;
  genre: string;
  saga: string;
  sagaOrder: number;
  readTimes?: number;
  nbTomes?: number;
  isFinished?: boolean;
}
