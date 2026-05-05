import { BaseSerie } from '../../../models/serie-model';

export const baseSeriesApi: BaseSerie[] = [
  {
    title: "Maul : Seigneur de l'ombre",
    director: "Dave Filoni, Matt Michnovetz",
    actors: [
      {
        name: "Sam Witwer",
      },
      {
        name: "Dennis Haysbert",
      },
      {
        name: "Gideon Adlon",
      },
    ],
    coverUrl: "/series_pictures/6f8b1f6cec88.jpg",
    releaseDate: "2026-04-06",
    endDate: "",
    genre: ['Science Fiction', 'Aventure'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 10,
        totalLength: 241,
      },
    ],
    description: "",
    countryOrigin: "États-Unis",
    saga: "Star Wars",
    fromEntity: null,
  },
];
