import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/** Badges « séries vues » (sans genre). Paliers alignés avec scripts/check-badges.ts */
export const SERIES_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'series-cinq-vues',
    name: 'Spectateur en herbe',
    description: 'Avoir vu au moins 5 séries',
    image: `${BADGES_IMAGE_PATH}/movies/Star_Trek.png`,
  },
  {
    id: 'series-dix-vues',
    name: 'Accro au petit écran',
    description: 'Avoir vu au moins 10 séries',
    image: `${BADGES_IMAGE_PATH}/movies/Terminator.png`,
  },
  {
    id: 'series-vingt-cinq-vues',
    name: 'Binge-watcher confirmé',
    description: 'Avoir vu au moins 25 séries',
    image: `${BADGES_IMAGE_PATH}/movies/Matrix.png`,
  },
  {
    id: 'series-quarante-vues',
    name: 'Marathonien des saisons',
    description: 'Avoir vu au moins 40 séries',
    image: `${BADGES_IMAGE_PATH}/movies/Retour_Vers_Le_Futur.png`,
  },
  {
    id: 'series-soixante-vues',
    name: 'Maître du visionnage',
    description: 'Avoir vu au moins 60 séries',
    image: `${BADGES_IMAGE_PATH}/movies/Star_Wars.png`,
  },
];
