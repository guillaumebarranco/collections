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
    coverUrl: '/movies_pictures/8318c06373acd968023aa5afab9c2ae6.jpg',
    releaseDate: '2026-01-16',
    length: 115,
    genre: 'Thriller',
  },

  {
    title: 'Greenland - Le Dernier Refuge',
    director: 'Ric Roman Waugh',
    actors: [
      {
        name: 'Gerard Butler',
      },
      {
        name: 'Morena Baccarin',
      },
      {
        name: 'Roger Dale Floyd',
      },
    ],
    coverUrl: '/movies_pictures/images.webp',
    releaseDate: '2020-07-29',
    length: 120,
    genre: 'Catastrophe',
  },

  {
    title: 'Arco',
    director: 'Ugo Bienvenu',
    actors: [
      {
        name: 'Margot Ringard Oldra',
      },
      {
        name: 'Oscar Tresanini',
      },
    ],
    coverUrl: '/movies_pictures/4bb40b414c1d86022f4031676a309432.webp',
    releaseDate: '2025-10-22',
    length: 89,
    genre: 'Animation',
  },

  {
    title: 'La Cité de Dieu',
    director: 'Fernando Meirelles, Kátia Lund',
    actors: [
      {
        name: 'Alexandre Rodrigues',
      },
      {
        name: 'Douglas Silva',
      },
      {
        name: 'Phellipe Haagensen',
      },
      {
        name: 'Alice Braga',
      },
    ],
    coverUrl: '/movies_pictures/citedieu.webp',
    releaseDate: '2002-08-30',
    length: 130,
    genre: 'Drame',
  },
];
