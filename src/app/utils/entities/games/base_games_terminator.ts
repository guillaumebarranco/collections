import { BaseGame } from '../../../models/game-model';

/** Jeux vidéo majeurs dérivés des films Terminator (catalogue Makya). */
export const baseGamesTerminator: BaseGame[] = [
  {
    title: 'Terminator 3: War of the Machines',
    editor: 'Atari',
    hero: 'Terminator T-800',
    coverUrl: '/games_pictures/9c66049dd97d.jpg',
    releaseDate: '2003-12-02',
    averageTimeToFinish: 8,
    averageTimeToHundredPercent: 0,
    platform: 'Windows',
    saga: 'Terminator',
    platineTime: 0,
    description:
      'FPS multijoueur : batailles Skynet contre résistance, calqué sur Terminator 3.',
    fromEntity: {
      entityType: 'movie',
      title: 'Terminator 3 : Le Soulèvement des machines',
      secondEntityKey: 'Jonathan Mostow',
    },
  },
  {
    title: 'Terminator Salvation',
    editor: 'Electronic Arts',
    hero: 'John Connor',
    coverUrl: '/games_pictures/988e21481b7d.jpg',
    releaseDate: '2009-05-19',
    averageTimeToFinish: 10,
    averageTimeToHundredPercent: 15,
    platform: 'PlayStation 3, Xbox 360, Windows',
    saga: 'Terminator',
    platineTime: 0,
    description:
      'Tir à la troisième personne : campagne parallèle au film, développé par Grin.',
    fromEntity: {
      entityType: 'movie',
      title: 'Terminator Renaissance',
      secondEntityKey: 'McG',
    },
  },
  {
    title: 'Terminator Genisys: Guardian',
    editor: 'Glu Mobile',
    hero: 'Kyle Reese',
    coverUrl: '/games_pictures/1e0153da860a.jpg',
    releaseDate: '2015-06-01',
    averageTimeToFinish: 5,
    averageTimeToHundredPercent: 0,
    platform: 'Android, iOS',
    saga: 'Terminator',
    platineTime: 0,
    description:
      'Jeu mobile free-to-play tie-in (aussi publié sous le nom Revolution).',
    fromEntity: {
      entityType: 'movie',
      title: 'Terminator Genisys',
      secondEntityKey: 'Alan Taylor',
    },
  },
  {
    title: 'Terminator: Resistance',
    editor: 'Reef Entertainment',
    hero: 'Jacob Rivers',
    coverUrl: '/games_pictures/1458aa93d7f9.jpg',
    releaseDate: '2019-11-15',
    averageTimeToFinish: 12,
    averageTimeToHundredPercent: 25,
    platform:
      'PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S, Windows',
    saga: 'Terminator',
    platineTime: 0,
    description:
      'FPS solo : guerre du futur contre Skynet (Teyon), entre T1 et T2.',
    fromEntity: {
      entityType: 'movie',
      title: 'Terminator',
      secondEntityKey: 'James Cameron',
    },
  },
  {
    title: 'Terminator: Dark Fate – Defiance',
    editor: 'Slitherine Software',
    hero: 'Résistance humaine',
    coverUrl: '/games_pictures/954fe22d4a94.jpg',
    releaseDate: '2024-12-12',
    averageTimeToFinish: 20,
    averageTimeToHundredPercent: 0,
    platform: 'Windows',
    saga: 'Terminator',
    platineTime: 0,
    description:
      'STR temps réel : factions humaines contre Legion dans la continuité de Dark Fate.',
    fromEntity: {
      entityType: 'movie',
      title: 'Terminator: Dark Fate',
      secondEntityKey: 'Tim Miller',
    },
  },
];
