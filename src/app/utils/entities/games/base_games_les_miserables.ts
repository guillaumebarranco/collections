import { BaseGame } from '../../../models/game-model';

const fromBook = {
  entityType: 'book' as const,
  title: 'Les Misérables',
  secondEntityKey: 'Victor Hugo',
};

/**
 * Jeux adaptés du roman *Les Misérables*.
 */
export const baseGamesLesMiserables: BaseGame[] = [
  {
    title: 'Les Misérables : Jean Valjean',
    editor: 'Microids',
    hero: 'Jean Valjean',
    coverUrl: '/games_pictures/les-miserables-jean-valjean-2016.jpg',
    releaseDate: '2016-09-15',
    averageTimeToFinish: 6,
    averageTimeToHundredPercent: 12,
    platform: 'Windows',
    saga: 'Les Misérables',
    platineTime: 0,
    description: '',
    fromEntity: fromBook,
  },
];
