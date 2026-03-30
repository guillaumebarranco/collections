import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

export const MOVIES_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'cinephile-herbe',
    name: 'Cinéphile en herbe',
    description: 'Avoir vu au moins 100 films',
    image: `${BADGES_IMAGE_PATH}/movies/Kevin_McCallister.png`,
  },
  {
    id: 'cinephile-amateur',
    name: 'Cinéphile amateur',
    description: 'Avoir vu au moins 300 films',
    image: `${BADGES_IMAGE_PATH}/movies/Danny_Madigan.png`,
  },
  {
    id: 'cinephile-passionne',
    name: 'Cinéphile passionné',
    description: 'Avoir vu au moins 500 films',
    image: `${BADGES_IMAGE_PATH}/movies/Carl_Denham.png`,
  },
  {
    id: 'cinephile-devoué',
    name: 'Cinéphile devoué',
    description: 'Avoir vu au moins 800 films',
    image: `${BADGES_IMAGE_PATH}/movies/Manny_Torres.png`,
  },
  {
    id: 'cinephile-inconditionnel',
    name: 'Cinéphile inconditionnel',
    description: 'Avoir vu au moins 1000 films',
    image: `${BADGES_IMAGE_PATH}/movies/Parzival.jpg`,
  },
  // ——— Romance (Films)
  {
    id: 'petit-beguin-movies',
    name: 'Petit béguin (films)',
    description: 'Avoir vu au moins 50 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Sophie_et_Julien.png`,
  },
  {
    id: 'lover-movies',
    name: 'Lover (films)',
    description: 'Avoir vu au moins 100 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Satine_et_Christian.png`,
  },
  {
    id: 'amoureux-movies',
    name: 'Amoureux (films)',
    description: 'Avoir vu au moins 150 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Bebe_et_Johnny.png`,
  },
  {
    id: 'grand-amour-movies',
    name: 'Le Grand amour (films)',
    description: 'Avoir vu au moins 200 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Vivian_et_Edward.png`,
  },
  {
    id: 'amour-eternel-movies',
    name: 'L`amour éternel (films)',
    description: 'Avoir vu au moins 300 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Rose_et_Jack.png`,
  },
  // ——— Films (sagas)
  {
    id: 'vengeurs-de-la-terre',
    name: 'Vengeur de la Terre',
    description: 'Avoir vu tous les films du MCU',
    image: `${BADGES_IMAGE_PATH}/movies/Avengers.png`,
  },
  {
    id: 'badges-des-trois-sorciers',
    name: 'Champion du tournoi des Trois Sorciers',
    description: 'Avoir vu tous les films du Wizarding World',
    image: `${BADGES_IMAGE_PATH}/movies/Reliques.png`,
  },
  {
    id: 'guerrier-de-la-terre-du-milieu',
    name: 'Guerrier de la Terre du Milieu',
    description: 'Avoir vu tous les films du lore de Tolkien',
    image: `${BADGES_IMAGE_PATH}/movies/Anneau.png`,
  },
  {
    id: 'membre-de-l-ordre',
    name: "Membre de l'ordre",
    description: 'Avoir vu tous les films du lore Star Wars',
    image: `${BADGES_IMAGE_PATH}/movies/Ordre_Jedi.png`,
  },
];
