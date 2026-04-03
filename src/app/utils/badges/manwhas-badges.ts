import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/** Badges « manwhas lus » (sans genre). */
export const MANWHAS_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'manwhas-quinze-lus',
    name: 'Premiers manwhas',
    description: 'Avoir lu au moins 15 manwhas',
    image: `${BADGES_IMAGE_PATH}/books/Bella_Swan.png`,
    threshold: 15,
  },
  {
    id: 'manwhas-trente-lus',
    name: 'Lecteur de manwhas',
    description: 'Avoir lu au moins 30 manwhas',
    image: `${BADGES_IMAGE_PATH}/books/Will_Hunting.png`,
    threshold: 30,
  },
  {
    id: 'manwhas-cinquante-lus',
    name: 'Bibliothèque manwha',
    description: 'Avoir lu au moins 50 manwhas',
    image: `${BADGES_IMAGE_PATH}/books/John_Keating.png`,
    threshold: 50,
  },
  {
    id: 'manwhas-quatre-vingt-lus',
    name: 'Collection manwha',
    description: 'Avoir lu au moins 80 manwhas',
    image: `${BADGES_IMAGE_PATH}/books/Tyrion_Lannister.png`,
    threshold: 80,
  },
  {
    id: 'manwhas-cent-lus',
    name: 'Expert manwha',
    description: 'Avoir lu au moins 100 manwhas',
    image: `${BADGES_IMAGE_PATH}/books/Belle.png`,
    threshold: 100,
  },
];
