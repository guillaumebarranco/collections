import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/** Badges « mangas lus » (volume total, sans genre). Paliers alignés avec scripts/check-badges.ts */
export const MANGAS_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'mangas-quinze-lus',
    name: 'Premiers mangas',
    description: 'Avoir lu au moins 15 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Toad.png`,
  },
  {
    id: 'mangas-trente-lus',
    name: 'Lecteur de mangas',
    description: 'Avoir lu au moins 30 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Ratchet.png`,
  },
  {
    id: 'mangas-cinquante-lus',
    name: 'Bibliothèque mangas',
    description: 'Avoir lu au moins 50 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Meat_Boy.png`,
  },
  {
    id: 'mangas-quatre-vingt-lus',
    name: 'Collection mangas',
    description: 'Avoir lu au moins 80 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Pacman.png`,
  },
  {
    id: 'mangas-cent-lus',
    name: 'Maître mangaka',
    description: 'Avoir lu au moins 100 mangas',
    image: `${BADGES_IMAGE_PATH}/games/Warcraft.png`,
  },
];
