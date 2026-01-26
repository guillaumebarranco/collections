import { BaseBook } from '../../../models/book-model';

export const baseBooksApi: BaseBook[] = [
  {
    title: 'Croc-Blanc',
    author: 'Jack London',
    coverUrl: '/books_pictures/A65190.jpg',
    pages: 288,
    genre: 'Classiques',
    saga: '',
    sagaOrder: 0,
  },

  {
    title: 'Iron Prince',
    author: "Bryce O'Connor et Luke Chmilenko",
    coverUrl: '/books_pictures/stormweaver-tome-1-iron-prince-5789471.jpg',
    pages: 464,
    genre: 'Science fiction',
    saga: '',
    sagaOrder: 0,
    nbTomes: 0,
    isFinished: false,
  },
];
