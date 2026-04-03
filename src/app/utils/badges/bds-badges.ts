import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/** Badges « bandes dessinées lues » (sans genre). Paliers alignés avec scripts/check-badges.ts */
export const BDS_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'bds-quinze-lus',
    name: 'Premières BDs',
    description: 'Avoir lu au moins 15 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Kevin_McCallister.png`,
  },
  {
    id: 'bds-trente-lus',
    name: 'Lecteur de BD',
    description: 'Avoir lu au moins 30 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Danny_Madigan.png`,
  },
  {
    id: 'bds-cinquante-lus',
    name: 'Bibliothèque BD',
    description: 'Avoir lu au moins 50 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Carl_Denham.png`,
  },
  {
    id: 'bds-quatre-vingt-lus',
    name: 'Collection BD',
    description: 'Avoir lu au moins 80 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Manny_Torres.png`,
  },
  {
    id: 'bds-cent-lus',
    name: 'Inconditionnel de la bulle',
    description: 'Avoir lu au moins 100 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Parzival.jpg`,
  },
];
