import { BaseMovie } from '../../../models/movie-model';

export const baseMoviesApi: BaseMovie[] = [
  {
    title: 'Casablanca',
    director: 'Michael Curtiz',
    actors: [
      {
        name: 'Humphrey Bogart',
      },
      {
        name: 'Ingrid Bergman',
      },
      {
        name: 'Paul Henreid',
      },
    ],
    coverUrl: '/movies_pictures/casablanca.jpg',
    releaseDate: '1947-05-23',
    length: 102,
    genre: 'Drame',
  },
];
