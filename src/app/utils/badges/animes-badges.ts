import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/**
 * Badges « animés vues » (hors watchlist). Un animé compte si au moins une saison
 * est entièrement visionnée (≥1) ; pas les seules saisons à 0 ou 0,5.
 */
export const ANIMES_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'animes-vingt-cinq-vues',
    name: 'Spectateur en herbe',
    description: 'Avoir complété au moins une saison sur 25 animés distincts',
    image: `${BADGES_IMAGE_PATH}/animes/Howard.png`,
    threshold: 25,
  },
  {
    id: 'animes-cinquante-vues',
    name: 'Accro au petit écran',
    description: 'Avoir complété au moins une saison sur 50 animés distincts',
    image: `${BADGES_IMAGE_PATH}/animes/Prince.png`,
    threshold: 50,
  },
  {
    id: 'animes-soixante-quinze-vues',
    name: 'Binge-watcher confirmé',
    description: 'Avoir complété au moins une saison sur 75 animés distincts',
    image: `${BADGES_IMAGE_PATH}/animes/Ted.png`,
    threshold: 75,
  },
  {
    id: 'animes-cent-vues',
    name: 'Marathonien des saisons',
    description: 'Avoir complété au moins une saison sur 100 animés distincts',
    image: `${BADGES_IMAGE_PATH}/animes/Randy.png`,
    threshold: 100,
  },
  {
    id: 'animes-cent-cinquante-vues',
    name: 'Maître du visionnage',
    description: 'Avoir complété au moins une saison sur 150 animés distincts',
    image: `${BADGES_IMAGE_PATH}/animes/Homer.png`,
    threshold: 150,
  },
];
