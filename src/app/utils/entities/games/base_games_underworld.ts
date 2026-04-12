import { BaseGame } from '../../../models/game-model';

/** Jeux officiels dérivés du film Underworld (2003). */
export const baseGamesUnderworld: BaseGame[] = [
  {
    title: 'Underworld: Bloodline',
    editor: 'Black Widow Games',
    hero: 'Selene',
    coverUrl:
      '/games_pictures/825b3976d700.jpg',
    releaseDate: '2003-09-19',
    averageTimeToFinish: 2,
    averageTimeToHundredPercent: 0,
    platform: 'PC (mod Half-Life)',
    saga: 'Underworld',
    platineTime: 0,
    description:
      'Mod multijoueur officiel promotionnel pour Half-Life, vampires contre lycans.',
    fromEntity: {
      entityType: 'movie',
      title: 'Underworld',
      secondEntityKey: 'Len Wiseman',
    },
  },
  {
    title: 'Underworld: The Eternal War',
    editor: 'Play-It',
    hero: 'Selene',
    coverUrl:
      '/games_pictures/1526325f9477.jpg',
    releaseDate: '2004-01-16',
    averageTimeToFinish: 8,
    averageTimeToHundredPercent: 0,
    platform: 'PlayStation 2',
    saga: 'Underworld',
    platineTime: 0,
    description:
      'Shoot them up vue de dessus : campagne vampires ou lycans, suite au film de 2003.',
    fromEntity: {
      entityType: 'movie',
      title: 'Underworld',
      secondEntityKey: 'Len Wiseman',
    },
  },
];
