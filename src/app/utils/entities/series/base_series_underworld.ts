import { BaseSerie } from '../../../models/serie-model';

/** Courts métrages d’animation liés à la saga Underworld. */
export const baseSeriesUnderworld: BaseSerie[] = [
  {
    title: 'Underworld : Endless War',
    director: 'Juno John Lee',
    actors: [{ name: 'Kate Beckinsale' }],
    coverUrl:
      '/series_pictures/fc60a5b3c283.jpg',
    releaseDate: '2011-01-01',
    endDate: '2011-01-01',
    genre: ['Animation', 'Action', 'Horreur'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 3,
        totalLength: 18,
      },
    ],
    description:
      'Trois courts métrages animés avec Selene, initialement diffusés avec Underworld : Éveil.',
    fromEntity: {
      entityType: 'movie',
      title: 'Underworld : Éveil',
      secondEntityKey: 'Måns Mårlind, Björn Stein',
    },
    saga: 'Underworld',
    countryOrigin: 'États-Unis',
  },
];
