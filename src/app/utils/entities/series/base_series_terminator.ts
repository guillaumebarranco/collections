import { BaseSerie } from '../../../models/serie-model';

/** Série TV Fox (2008–2009), suite alternative après Terminator 2. */
export const baseSeriesTerminator: BaseSerie[] = [
  {
    title: 'Terminator : Les Chroniques de Sarah Connor',
    director: 'Josh Friedman',
    actors: [
      { name: 'Lena Headey' },
      { name: 'Thomas Dekker' },
      { name: 'Summer Glau' },
    ],
    coverUrl:
      '/series_pictures/c8f790792ede.jpg',
    releaseDate: '2008-01-13',
    endDate: '2009-04-10',
    genre: ['Science-fiction', 'Action', 'Drame'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 9,
        totalLength: 396,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 22,
        totalLength: 968,
      },
    ],
    description:
      'Sarah et John traquent Skynet ; ignore les événements de Terminator 3. Titre VO : Terminator: The Sarah Connor Chronicles.',
    fromEntity: {
      entityType: 'movie',
      title: 'Terminator 2: Judgment Day',
      secondEntityKey: 'James Cameron',
    },
    saga: 'Terminator',
    countryOrigin: 'États-Unis',
  },
];
