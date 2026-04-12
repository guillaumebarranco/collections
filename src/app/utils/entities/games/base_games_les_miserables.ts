import { BaseGame } from '../../../models/game-model';

export const baseGamesLesMiserables: BaseGame[] = [
  {
    title: 'Les Misérables : Jean Valjean',
    editor: 'Microids',
    hero: 'Jean Valjean',
    coverUrl:
      '/games_pictures/20c36f969ca4.jpg',
    releaseDate: '2016-09-15',
    averageTimeToFinish: 6,
    averageTimeToHundredPercent: 12,
    platform: 'Windows',
    saga: 'Les Misérables',
    platineTime: 0,
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'Les Misérables',
      secondEntityKey: 'Victor Hugo',
    },
  },
];
