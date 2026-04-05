import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/**
 * Badges « séries vues » (hors watchlist). Une série compte si au moins une saison
 * est entièrement visionnée (≥1) ; pas les seules saisons à 0 ou 0,5.
 */
export const SERIES_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'series-vingt-cinq-vues',
    name: 'Spectateur en herbe',
    description: 'Avoir complété au moins une saison sur 25 séries distinctes',
    image: `${BADGES_IMAGE_PATH}/series/Howard.png`,
    threshold: 25,
  },
  {
    id: 'series-cinquante-vues',
    name: 'Accro au petit écran',
    description: 'Avoir complété au moins une saison sur 50 séries distinctes',
    image: `${BADGES_IMAGE_PATH}/series/Prince.png`,
    threshold: 50,
  },
  {
    id: 'series-soixante-quinze-vues',
    name: 'Binge-watcher confirmé',
    description: 'Avoir complété au moins une saison sur 75 séries distinctes',
    image: `${BADGES_IMAGE_PATH}/series/Ted.png`,
    threshold: 75,
  },
  {
    id: 'series-cent-vues',
    name: 'Marathonien des saisons',
    description: 'Avoir complété au moins une saison sur 100 séries distinctes',
    image: `${BADGES_IMAGE_PATH}/series/Randy.png`,
    threshold: 100,
  },
  {
    id: 'series-cent-cinquante-vues',
    name: 'Maître du visionnage',
    description: 'Avoir complété au moins une saison sur 150 séries distinctes',
    image: `${BADGES_IMAGE_PATH}/series/Homer.png`,
    threshold: 150,
  },
];
