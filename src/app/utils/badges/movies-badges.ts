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
  // ——— Science-fiction (Films)
  {
    id: 'initie-scifi-movies',
    name: 'Initié de la science-fiction (films)',
    description: 'Avoir vu au moins 50 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Star_Trek.png`,
  },
  {
    id: 'lecteur-scifi-movies',
    name: 'Explorateur de science-fiction (films)',
    description: 'Avoir vu au moins 100 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Terminator.png`,
  },
  {
    id: 'explorateur-scifi-movies',
    name: 'Voyageur interstellaire (films)',
    description: 'Avoir vu au moins 150 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Matrix.png`,
  },
  {
    id: 'voyageur-scifi-movies',
    name: 'Maître de la galaxie',
    description: 'Avoir vu au moins 200 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Retour_Vers_Le_Futur.png`,
  },
  {
    id: 'maitre-scifi-movies',
    name: 'Légende de la science-fiction',
    description: 'Avoir vu au moins 300 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Star_Wars.png`,
  },
  // ——— Thriller (Films)
  {
    id: 'frisson-thriller-movies',
    name: 'Frisson du thriller',
    description: 'Avoir vu au moins 50 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Carl_Denham.png`,
  },
  {
    id: 'amateur-thriller-movies',
    name: 'Amateur de thrillers',
    description: 'Avoir vu au moins 100 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Manny_Torres.png`,
  },
  {
    id: 'enqueteur-thriller-movies',
    name: 'Enquêteur du thriller',
    description: 'Avoir vu au moins 150 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Danny_Madigan.png`,
  },
  {
    id: 'inspecteur-thriller-movies',
    name: 'Inspecteur du suspense',
    description: 'Avoir vu au moins 200 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Kevin_McCallister.png`,
  },
  {
    id: 'maitre-thriller-movies',
    name: 'Maître du thriller',
    description: 'Avoir vu au moins 300 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Parzival.jpg`,
  },
  // ——— Horreur (Films)
  {
    id: 'courage-horreur-movies',
    name: 'Premier frisson',
    description: "Avoir vu au moins 50 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Carl_Denham.png`,
  },
  {
    id: 'amateur-horreur-movies',
    name: "Amateur d'horreur",
    description: "Avoir vu au moins 100 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Manny_Torres.png`,
  },
  {
    id: 'survivant-horreur-movies',
    name: 'Survivant du grand écran',
    description: "Avoir vu au moins 150 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Danny_Madigan.png`,
  },
  {
    id: 'chasseur-horreur-movies',
    name: 'Chasseur de cauchemars',
    description: "Avoir vu au moins 200 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Kevin_McCallister.png`,
  },
  {
    id: 'maitre-horreur-movies',
    name: "Maître de l'horreur",
    description: "Avoir vu au moins 300 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Parzival.jpg`,
  },
  // ——— Comédie (Films)
  {
    id: 'sourire-comedie-movies',
    name: 'Premier sourire',
    description: 'Avoir vu au moins 50 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/Sophie_et_Julien.png`,
  },
  {
    id: 'rire-comedie-movies',
    name: 'Rieur confirmé',
    description: 'Avoir vu au moins 100 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/Satine_et_Christian.png`,
  },
  {
    id: 'fou-rire-comedie-movies',
    name: 'Fou rire garanti',
    description: 'Avoir vu au moins 150 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/Bebe_et_Johnny.png`,
  },
  {
    id: 'comedien-comedie-movies',
    name: 'Comédien du canapé',
    description: 'Avoir vu au moins 200 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/Vivian_et_Edward.png`,
  },
  {
    id: 'maitre-comedie-movies',
    name: 'Maître de la comédie',
    description: 'Avoir vu au moins 300 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/Rose_et_Jack.png`,
  },
  // ——— Action (Films)
  {
    id: 'recrue-action-movies',
    name: "Recrue de l'action",
    description: "Avoir vu au moins 50 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Avengers.png`,
  },
  {
    id: 'soldat-action-movies',
    name: "Soldat de l'action",
    description: "Avoir vu au moins 100 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Ordre_Jedi.png`,
  },
  {
    id: 'commandant-action-movies',
    name: "Commandant de l'action",
    description: "Avoir vu au moins 150 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Anneau.png`,
  },
  {
    id: 'elite-action-movies',
    name: "Élite de l'action",
    description: "Avoir vu au moins 200 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Reliques.png`,
  },
  {
    id: 'legende-action-movies',
    name: "Légende de l'action",
    description: "Avoir vu au moins 300 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Parzival.jpg`,
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
