import { BaseGame } from '../../../models/game-model';

/** Jeux vidéo officiels de la franchise Matrix. */
export const baseGamesMatrix: BaseGame[] = [
  {
    title: 'Enter the Matrix',
    editor: 'Atari',
    hero: 'Niobe / Ghost',
    coverUrl: '/games_pictures/0855167593be.jpg',
    releaseDate: '2003-05-14',
    averageTimeToFinish: 12,
    averageTimeToHundredPercent: 20,
    platform: 'PlayStation 2, Xbox, GameCube, Windows',
    saga: 'Matrix',
    platineTime: 0,
    description:
      'Action en vue à la troisième personne, intrigues parallèles à Reloaded et Revolutions (FMV, séquences inédites).',
    fromEntity: {
      entityType: 'movie',
      title: 'The Matrix Reloaded',
      secondEntityKey: 'Lana Wachowski, Lilly Wachowski',
    },
  },
  {
    title: 'The Matrix Online',
    editor: 'Warner Bros. Interactive Entertainment',
    hero: 'Avatar joueur',
    coverUrl:
      '/games_pictures/929c083fb4d9.jpg',
    releaseDate: '2005-03-22',
    averageTimeToFinish: 80,
    averageTimeToHundredPercent: 0,
    platform: 'Windows (MMORPG)',
    saga: 'Matrix',
    platineTime: 0,
    description:
      'MMORPG (Monolith Productions) : suite officielle de l’intrigue après Revolutions ; serveurs arrêtés en 2009.',
    fromEntity: {
      entityType: 'movie',
      title: 'The Matrix Revolutions',
      secondEntityKey: 'Lana Wachowski, Lilly Wachowski',
    },
  },
  {
    title: 'The Matrix: Path of Neo',
    editor: 'Atari',
    hero: 'Neo',
    coverUrl: '/games_pictures/64fa5928c749.jpg',
    releaseDate: '2005-11-08',
    averageTimeToFinish: 15,
    averageTimeToHundredPercent: 25,
    platform: 'PlayStation 2, Xbox, Windows',
    saga: 'Matrix',
    platineTime: 0,
    description:
      'Reprise des séquences d’action de la trilogie avec Neo ; développé par Shiny Entertainment.',
    fromEntity: {
      entityType: 'movie',
      title: 'Matrix',
      secondEntityKey: 'Lana Wachowski, Lilly Wachowski',
    },
  },
  {
    title: 'The Matrix Awakens: An Unreal Engine 5 Experience',
    editor: 'Epic Games',
    hero: 'Neo',
    coverUrl:
      '/games_pictures/ec4d2c53cf76.jpg',
    releaseDate: '2021-12-09',
    averageTimeToFinish: 1,
    averageTimeToHundredPercent: 0,
    platform: 'PlayStation 5, Xbox Series X/S',
    saga: 'Matrix',
    platineTime: 0,
    description:
      'Démo technique UE5 (ville ouverte, personnages du film) sortie avec Resurrections.',
    fromEntity: {
      entityType: 'movie',
      title: 'The Matrix Resurrections',
      secondEntityKey: 'Lana Wachowski',
    },
  },
];
