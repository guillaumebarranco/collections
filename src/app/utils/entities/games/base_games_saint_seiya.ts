import { BaseGame } from '../../../models/game-model';

const fromManga = {
  entityType: 'manga' as const,
  title: 'Saint Seiya',
  secondEntityKey: 'Masami Kurumada',
};

/**
 * Jeux *Saint Seiya* / *Les Chevaliers du Zodiaque* (sélection).
 */
export const baseGamesSaintSeiya: BaseGame[] = [
  {
    title: 'Saint Seiya : Le Sanctuaire',
    editor: 'Bandai',
    hero: 'Pégase',
    coverUrl:
      'https://www.gamecash.fr/thumbnail-600/saint-seiya-sanctuaire-ps2-e10468.jpg',
    releaseDate: '2005-10-27',
    averageTimeToFinish: 12,
    averageTimeToHundredPercent: 25,
    platform: 'PlayStation 2',
    saga: 'Saint Seiya',
    platineTime: 0,
    description: '',
    fromEntity: {
      entityType: 'manga' as const,
      title: 'Saint Seiya',
      secondEntityKey: 'Masami Kurumada',
    },
  },
  {
    title: 'Saint Seiya : Brave Soldiers',
    editor: 'Bandai Namco',
    hero: 'Pégase',
    coverUrl: '/games_pictures/867cf64c51b5.jpg',
    releaseDate: '2013-10-17',
    averageTimeToFinish: 10,
    averageTimeToHundredPercent: 35,
    platform: 'PlayStation 3',
    saga: 'Saint Seiya',
    platineTime: 25,
    description: '',
    fromEntity: {
      entityType: 'manga' as const,
      title: 'Saint Seiya',
      secondEntityKey: 'Masami Kurumada',
    },
  },
  {
    title: "Saint Seiya : Soldiers' Soul",
    editor: 'Bandai Namco',
    hero: 'Pégase',
    coverUrl:
      '/games_pictures/bd1451856cc2.jpg',
    releaseDate: '2015-09-25',
    averageTimeToFinish: 12,
    averageTimeToHundredPercent: 40,
    platform: 'PlayStation 4',
    saga: 'Saint Seiya',
    platineTime: 40,
    description: '',
    fromEntity: {
      entityType: 'manga' as const,
      title: 'Saint Seiya',
      secondEntityKey: 'Masami Kurumada',
    },
  },
  {
    title: 'Saint Seiya Awakening : Knights of the Zodiac',
    editor: 'YOOZOO Games',
    hero: 'Pégase',
    coverUrl:
      '/games_pictures/ab8217f45425.png',
    releaseDate: '2019-06-27',
    averageTimeToFinish: 40,
    averageTimeToHundredPercent: 120,
    platform: 'Android, iOS',
    saga: 'Saint Seiya',
    platineTime: 0,
    description: '',
    fromEntity: {
      entityType: 'manga' as const,
      title: 'Saint Seiya',
      secondEntityKey: 'Masami Kurumada',
    },
  },
];
