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
    coverUrl: '/games_pictures/saint-seiya-sanctuary-ps2.jpg',
    releaseDate: '2005-10-27',
    averageTimeToFinish: 12,
    averageTimeToHundredPercent: 25,
    platform: 'PlayStation 2',
    saga: 'Saint Seiya',
    platineTime: 0,
    description: '',
    fromEntity: fromManga,
  },
  {
    title: 'Saint Seiya : Brave Soldiers',
    editor: 'Bandai Namco',
    hero: 'Pégase',
    coverUrl: '/games_pictures/saint-seiya-brave-soldiers.jpg',
    releaseDate: '2013-10-17',
    averageTimeToFinish: 10,
    averageTimeToHundredPercent: 35,
    platform: 'PlayStation 3',
    saga: 'Saint Seiya',
    platineTime: 25,
    description: '',
    fromEntity: fromManga,
  },
  {
    title: "Saint Seiya : Soldiers' Soul",
    editor: 'Bandai Namco',
    hero: 'Pégase',
    coverUrl: '/games_pictures/saint-seiya-soldiers-soul.jpg',
    releaseDate: '2015-09-25',
    averageTimeToFinish: 12,
    averageTimeToHundredPercent: 40,
    platform: 'PlayStation 4',
    saga: 'Saint Seiya',
    platineTime: 40,
    description: '',
    fromEntity: fromManga,
  },
  {
    title: 'Saint Seiya Awakening : Knights of the Zodiac',
    editor: 'YOOZOO Games',
    hero: 'Pégase',
    coverUrl: '/games_pictures/saint-seiya-awakening.jpg',
    releaseDate: '2019-06-27',
    averageTimeToFinish: 40,
    averageTimeToHundredPercent: 120,
    platform: 'Android, iOS',
    saga: 'Saint Seiya',
    platineTime: 0,
    description: '',
    fromEntity: fromManga,
  },
];
