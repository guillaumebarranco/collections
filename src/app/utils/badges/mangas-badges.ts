import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/** Badges « mangas lus » (volume total, sans genre). */
export const MANGAS_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'mangas-quinze-lus',
    name: 'Premiers mangas',
    description: 'Avoir lu au moins 15 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Toad.png`,
    threshold: 15,
  },
  {
    id: 'mangas-trente-lus',
    name: 'Lecteur de mangas',
    description: 'Avoir lu au moins 30 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Ratchet.png`,
    threshold: 30,
  },
  {
    id: 'mangas-cinquante-lus',
    name: 'Bibliothèque mangas',
    description: 'Avoir lu au moins 50 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Meat_Boy.png`,
    threshold: 50,
  },
  {
    id: 'mangas-quatre-vingt-lus',
    name: 'Collection mangas',
    description: 'Avoir lu au moins 80 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Pacman.png`,
    threshold: 80,
  },
  {
    id: 'mangas-cent-lus',
    name: 'Maître mangaka',
    description: 'Avoir lu au moins 100 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Warcraft.png`,
    threshold: 100,
  },
];
