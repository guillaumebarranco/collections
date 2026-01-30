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

  {
    title: 'Gourou',
    director: 'Yann Gozlan',
    actors: [
      {
        name: 'Pierre Niney',
      },
      {
        name: 'Marion Barbeau',
      },
    ],
    coverUrl: 'https://www.franceinfo.fr/pictures/opqGlAnn4JdCIEUHz77XvPBBZas/0x0:810x1080/fit-in/720x/filters:format(jpg)/2026/01/23/affiche-gourou-69739a616185e473791238.jpg',
    releaseDate: '2026-01-28',
    length: 126,
    genre: 'Thriller',
  },

  {
    title: '28 ans plus tard',
    director: 'Danny Boyle',
    actors: [
      {
        name: 'Aaron Taylor-Johnson',
      },
      {
        name: 'Jodie Comer',
      },
      {
        name: 'Ralph Fiennes',
      }
    ],
    coverUrl: 'https://fr.web.img4.acsta.net/img/06/ce/06ceefbccc9f512925c9af7ac11c6d56.jpg',
    releaseDate: '2025-06-18',
    length: 115,
    genre: 'Horreur',
  },
];
