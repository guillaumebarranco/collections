import { BaseGame } from '../../../models/game-model';

/** Jeux dérivés de la saga Tara Duncan (romans Sophie Audouin-Mamikonian). */
export const baseGamesTaraDuncan: BaseGame[] = [
  {
    title: 'Tara Duncan Le Jeu',
    editor: 'Feerik',
    hero: 'Tara Duncan',
    coverUrl: '/games_pictures/7701805ec4d9.jpg',
    releaseDate: '2011-04-20',
    averageTimeToFinish: 24,
    averageTimeToHundredPercent: 0,
    platform: 'Navigateur web',
    saga: 'Tara Duncan',
    platineTime: 0,
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'Les sortceliers',
      secondEntityKey: 'Sophie Audouin-Mamikonian',
    },
  },
];
