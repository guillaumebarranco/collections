import { BaseSerie } from '../../../models/serie-model';

/** Série Netflix (2015–2018), préquelle au film Le Chat Potté. */
export const baseSeriesShrek: BaseSerie[] = [
  {
    title: 'Les Aventures du Chat Potté',
    director: 'Doug Langdale',
    actors: [
      { name: 'Eric Bauza' },
      { name: 'Jayma Mays' },
      { name: 'Joshua Rush' },
    ],
    coverUrl:
      '/series_pictures/4712abb0f1ec.jpg',
    releaseDate: '2015-01-16',
    endDate: '2018-09-28',
    genre: ['Animation', 'Aventure', 'Comédie', 'Fantastique'],
    seasonsData: [
      { seasonNumber: 1, nbEpisodes: 15, totalLength: 360 },
      { seasonNumber: 2, nbEpisodes: 13, totalLength: 312 },
      { seasonNumber: 3, nbEpisodes: 13, totalLength: 312 },
      { seasonNumber: 4, nbEpisodes: 13, totalLength: 312 },
      { seasonNumber: 5, nbEpisodes: 13, totalLength: 312 },
      { seasonNumber: 6, nbEpisodes: 11, totalLength: 264 },
    ],
    description:
      'Série Netflix en 78 épisodes (~24 min en moyenne) : jeune Chat Potté défend San Lorenzo. Titre VO : The Adventures of Puss in Boots.',
    fromEntity: {
      entityType: 'movie',
      title: 'Le Chat Potté',
      secondEntityKey: 'Chris Miller',
    },
    saga: 'Shrek',
    countryOrigin: 'États-Unis',
  },
];
