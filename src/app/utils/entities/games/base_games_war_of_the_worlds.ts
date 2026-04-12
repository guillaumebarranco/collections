import { BaseGame } from '../../../models/game-model';

export const baseGamesWarOfTheWorlds: BaseGame[] = [
  {
    title: "Jeff Wayne's La guerre des mondes (1984)",
    editor: 'CRL Group',
    hero: 'Journaliste',
    coverUrl:
      '/games_pictures/7432a9e47127.jpg',
    releaseDate: '1984-01-01',
    averageTimeToFinish: 3,
    averageTimeToHundredPercent: 6,
    platform: 'ZX Spectrum',
    saga: 'La guerre des mondes',
    platineTime: 0,
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'La guerre des mondes',
      secondEntityKey: 'H.G. Wells',
    },
  },
  {
    title: "Jeff Wayne's La guerre des mondes (1998)",
    editor: 'GT Interactive',
    hero: 'Stratège',
    coverUrl:
      '/games_pictures/659ae9207ab7.jpg',
    releaseDate: '1998-02-10',
    averageTimeToFinish: 20,
    averageTimeToHundredPercent: 40,
    platform: 'Windows, PlayStation',
    saga: 'La guerre des mondes',
    platineTime: 0,
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'La guerre des mondes',
      secondEntityKey: 'H.G. Wells',
    },
  },
];
