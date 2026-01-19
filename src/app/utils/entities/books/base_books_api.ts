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
    author: 'Bryce O\'Connor et Luke Chmilenko',
    coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUJ9pL8vArgM9IIucAqGrTSR49Ej1FItei-89XnkjzsLpc9M-SNFCo_Dh&s=10',
    pages: 464,
    genre: 'Science fiction',
    saga: '',
    sagaOrder: 0,
    nbTomes: 0,
    isFinished: false,
  },
];
