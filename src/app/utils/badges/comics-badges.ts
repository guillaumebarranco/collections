import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/** Badges « comics lus » (sans genre). */
export const COMICS_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'comics-quinze-lus',
    name: 'Premiers comics',
    description: 'Avoir lu au moins 15 comics',
    image: `${BADGES_IMAGE_PATH}/games/Eddie_Plant.png`,
    threshold: 15,
  },
  {
    id: 'comics-trente-lus',
    name: 'Lecteur de comics',
    description: 'Avoir lu au moins 30 comics',
    image: `${BADGES_IMAGE_PATH}/games/Artemis.png`,
    threshold: 30,
  },
  {
    id: 'comics-cinquante-lus',
    name: 'Bibliothèque comics',
    description: 'Avoir lu au moins 50 comics',
    image: `${BADGES_IMAGE_PATH}/games/Sam_Brenner.png`,
    threshold: 50,
  },
  {
    id: 'comics-quatre-vingt-lus',
    name: 'Collection comics',
    description: 'Avoir lu au moins 80 comics',
    image: `${BADGES_IMAGE_PATH}/books/Harlan.png`,
    threshold: 80,
  },
  {
    id: 'comics-cent-lus',
    name: 'Maître des cases',
    description: 'Avoir lu au moins 100 comics',
    image: `${BADGES_IMAGE_PATH}/books/Hermione_Granger.png`,
    threshold: 100,
  },
];
