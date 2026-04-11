import { BaseGame } from '../../../models/game-model';

const fromBook = {
  entityType: 'book' as const,
  title: 'La guerre des mondes',
  secondEntityKey: 'H.G. Wells',
};

/**
 * Jeux adaptés du roman *La guerre des mondes* (dont versions Jeff Wayne).
 */
export const baseGamesWarOfTheWorlds: BaseGame[] = [
  {
    title: "Jeff Wayne's La guerre des mondes (1984)",
    editor: 'CRL Group',
    hero: 'Journaliste',
    coverUrl: '/games_pictures/war-of-the-worlds-1984-spectrum.jpg',
    releaseDate: '1984-01-01',
    averageTimeToFinish: 3,
    averageTimeToHundredPercent: 6,
    platform: 'ZX Spectrum',
    saga: 'La guerre des mondes',
    platineTime: 0,
    description: '',
    fromEntity: fromBook,
  },
  {
    title: "Jeff Wayne's La guerre des mondes (1998)",
    editor: 'GT Interactive',
    hero: 'Stratège',
    coverUrl: '/games_pictures/war-of-the-worlds-1998-pc.jpg',
    releaseDate: '1998-02-10',
    averageTimeToFinish: 20,
    averageTimeToHundredPercent: 40,
    platform: 'Windows',
    saga: 'La guerre des mondes',
    platineTime: 0,
    description: '',
    fromEntity: fromBook,
  },
  {
    title: "Jeff Wayne's La guerre des mondes (1999)",
    editor: 'GT Interactive',
    hero: 'Pilote',
    coverUrl: '/games_pictures/war-of-the-worlds-1999-ps1.jpg',
    releaseDate: '1999-11-19',
    averageTimeToFinish: 12,
    averageTimeToHundredPercent: 20,
    platform: 'PlayStation',
    saga: 'La guerre des mondes',
    platineTime: 0,
    description: '',
    fromEntity: fromBook,
  },
  {
    title: 'La guerre des mondes',
    editor: 'Other Ocean Interactive',
    hero: 'Survivant',
    coverUrl: '/games_pictures/war-of-the-worlds-2011.jpg',
    releaseDate: '2011-10-25',
    averageTimeToFinish: 4,
    averageTimeToHundredPercent: 8,
    platform: 'PlayStation 3, Xbox 360',
    saga: 'La guerre des mondes',
    platineTime: 15,
    description: '',
    fromEntity: fromBook,
  },
];
