import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

/** Badges « bandes dessinées lues » (sans genre). */
export const BDS_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'bds-quinze-lus',
    name: 'Premières BDs',
    description: 'Avoir lu au moins 15 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Kevin_McCallister.png`,
    threshold: 15,
  },
  {
    id: 'bds-trente-lus',
    name: 'Lecteur de BD',
    description: 'Avoir lu au moins 30 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Danny_Madigan.png`,
    threshold: 30,
  },
  {
    id: 'bds-cinquante-lus',
    name: 'Bibliothèque BD',
    description: 'Avoir lu au moins 50 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Carl_Denham.png`,
    threshold: 50,
  },
  {
    id: 'bds-quatre-vingt-lus',
    name: 'Collection BD',
    description: 'Avoir lu au moins 200 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Manny_Torres.png`,
    threshold: 200,
  },
  {
    id: 'bds-cent-lus',
    name: 'Inconditionnel de la bulle',
    description: 'Avoir lu au moins 300 bandes dessinées',
    image: `${BADGES_IMAGE_PATH}/movies/Parzival.jpg`,
    threshold: 300,
  },
];
