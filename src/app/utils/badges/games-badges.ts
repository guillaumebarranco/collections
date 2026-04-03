import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

export const GAMES_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'joueur-du-dimanche',
    name: 'Joueur du dimanche',
    description: 'Avoir joué à au moins 20 jeux vidéos',
    image: `${BADGES_IMAGE_PATH}/games/Toad.png`,
    threshold: 20,
  },
  {
    id: 'petit-joueur',
    name: 'Petit joueur',
    description: 'Avoir joué à au moins 50 jeux vidéos',
    image: `${BADGES_IMAGE_PATH}/games/Ratchet.png`,
    threshold: 50,
  },
  {
    id: 'gamer',
    name: 'Gamer',
    description: 'Avoir joué à au moins 100 jeux vidéos',
    image: `${BADGES_IMAGE_PATH}/games/Meat_Boy.png`,
    threshold: 100,
  },
  {
    id: 'nerd',
    name: 'Nerd',
    description: 'Avoir joué à au moins 150 jeux vidéos',
    image: `${BADGES_IMAGE_PATH}/games/Pacman.png`,
    threshold: 150,
  },
  {
    id: 'no-life',
    name: 'NoLife',
    description: 'Avoir joué à au moins 200 jeux vidéos',
    image: `${BADGES_IMAGE_PATH}/games/Warcraft.png`,
    threshold: 200,
  },
  {
    id: 'joueur-capable',
    name: 'Joueur capable',
    description: 'Avoir terminé au moins 50 jeux vidéos',
    image: `${BADGES_IMAGE_PATH}/games/Eddie_Plant.png`,
    threshold: 50,
  },
  {
    id: 'champion-du-joystick',
    name: 'Champion du joystick',
    description: 'Avoir terminé à au moins 100 jeux vidéos',
    image: `${BADGES_IMAGE_PATH}/games/Artemis.png`,
    threshold: 100,
  },
  {
    id: 'virtuose-de-la-manette',
    name: 'Virtuose de la manette',
    description: 'Avoir terminé à au moins 200 jeux vidéos',
    image: `${BADGES_IMAGE_PATH}/games/Sam_Brenner.png`,
    threshold: 200,
  },
];
