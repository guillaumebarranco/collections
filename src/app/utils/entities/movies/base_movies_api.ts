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

  {
    title: 'The Rip',
    director: 'Joe Carnahan',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Ben Affleck',
      },
      {
        name: 'Steven Yeun',
      },
    ],
    coverUrl: 'https://www.ecranlarge.com/content/uploads/2026/01/8318c06373acd968023aa5afab9c2ae6.jpg',
    releaseDate: '2026-01-16',
    length: 115,
    genre: 'Thriller',
  },
];
