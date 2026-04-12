import { BaseSerie } from '../../../models/serie-model';

/** Animatrix : anthologie de courts métrages d’animation dans l’univers Matrix. */
export const baseSeriesMatrix: BaseSerie[] = [
  {
    title: 'The Animatrix',
    director:
      'Peter Chung, Andy Jones, Yoshiaki Kawajiri, Takeshi Koike, Mahiro Maeda, Kōji Morimoto, Shinichirō Watanabe',
    actors: [{ name: 'Keanu Reeves' }, { name: 'Carrie-Anne Moss' }],
    coverUrl:
      '/series_pictures/e9d9900c69c8.jpg',
    releaseDate: '2003-06-03',
    endDate: '2003-06-03',
    genre: ['Animation', 'Science-fiction', 'Anthologie'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 9,
        totalLength: 73,
      },
    ],
    description:
      'Neuf courts métrages (dont The Second Renaissance) produits par les Wachowski, entre le premier Matrix et Reloaded.',
    fromEntity: {
      entityType: 'movie',
      title: 'Matrix',
      secondEntityKey: 'Lana Wachowski, Lilly Wachowski',
    },
    saga: 'Matrix',
    countryOrigin: 'États-Unis',
  },
];
