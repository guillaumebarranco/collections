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
    sagaFinished: false,
  },

  {
    title: 'Iron Prince',
    author: "Bryce O'Connor et Luke Chmilenko",
    coverUrl: '/books_pictures/stormweaver-tome-1-iron-prince-5789471.jpg',
    pages: 464,
    genre: 'Science fiction',
    saga: '',
    sagaOrder: 0,
    sagaFinished: false,
  },

  {
    title: 'Le Monde de Narnia (Tome 3) Le Cheval et son Ecuyer',
    author: 'C. S. Lewis',
    coverUrl:
      'https://cdn.shopify.com/s/files/1/0398/4202/1535/files/Y2680YOTO02220LemondedeNarnia3LeChevaletsonecuyer_Rounded.png?v=1711318245',
    pages: 240,
    genre: 'Fantasy',
    saga: 'Le Monde de Narnia',
    sagaOrder: 3,
    sagaFinished: false,
  },
];
