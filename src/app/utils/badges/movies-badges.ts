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
    id: 'amour-jeunesse',
    name: 'Un amour de jeunesse',
    description: 'Avoir vu au moins 50 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Sophie_et_Julien.png`,
  },
  {
    id: 'un-amour-de-cinema',
    name: 'Un amour de cinéma',
    description: 'Avoir vu au moins 100 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Satine_et_Christian.png`,
  },
  {
    id: 'passion-vacances',
    name: 'Une passion de vacances',
    description: 'Avoir vu au moins 150 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Bebe_et_Johnny.png`,
  },
  {
    id: 'grand-amour-movies',
    name: 'Le Grand amour',
    description: 'Avoir vu au moins 200 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Vivian_et_Edward.png`,
  },
  {
    id: 'amour-eternel-movies',
    name: "L'amour éternel",
    description: 'Avoir vu au moins 300 films de romance',
    image: `${BADGES_IMAGE_PATH}/movies/Rose_et_Jack.png`,
  },
  // ——— Science-fiction (Films)
  {
    id: 'extraterrestre',
    name: 'Extraterrestre',
    description: 'Avoir vu au moins 50 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Star_Trek.png`,
  },
  {
    id: 'machine-du-futur',
    name: 'Machine du futur',
    description: 'Avoir vu au moins 100 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Terminator.png`,
  },
  {
    id: 'elu-de-la-matrice',
    name: 'Elu de la matrice',
    description: 'Avoir vu au moins 150 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Matrix.png`,
  },
  {
    id: 'voyageur-temporel',
    name: 'Voyageur temporel',
    description: 'Avoir vu au moins 200 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Retour_Vers_Le_Futur.png`,
  },
  {
    id: 'maitre-galaxie',
    name: 'Maitre de la galaxie',
    description: 'Avoir vu au moins 300 films de science-fiction',
    image: `${BADGES_IMAGE_PATH}/movies/Star_Wars.png`,
  },
  // ——— Thriller (Films)
  {
    id: 'obsession-psychologique',
    name: 'Obsession psychologique',
    description: 'Avoir vu au moins 50 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Le_Nombre_23.png`,
  },
  {
    id: 'expert-tension',
    name: 'Expert de la tension',
    description: 'Avoir vu au moins 100 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Prisoners.png`,
  },
  {
    id: 'fondateur-thriller',
    name: 'Fondateur du thriller',
    description: 'Avoir vu au moins 150 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/La_Nuit_Du_Chasseur.png`,
  },
  {
    id: 'maitre-suspense',
    name: 'Maitre du suspense',
    description: 'Avoir vu au moins 200 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Seven.png`,
  },
  {
    id: 'genie-manipulation',
    name: 'Génie de la manipulation',
    description: 'Avoir vu au moins 300 films thriller',
    image: `${BADGES_IMAGE_PATH}/movies/Le_Silence_Des_Agneaux.png`,
  },
  // ——— Horreur (Films)
  {
    id: 'tout-ce-sang',
    name: 'Tout ce sang',
    description: "Avoir vu au moins 50 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Psychose.png`,
  },
  {
    id: 'derriere-le-masque',
    name: 'Derrière le masque',
    description: "Avoir vu au moins 100 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Jason.png`,
  },
  {
    id: 'gardien-horreur',
    name: "Gardien de l'horreur",
    description: "Avoir vu au moins 150 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Shining.png`,
  },
  {
    id: 'terreur-autre-monde',
    name: "Terreur d'un autre monde",
    description: "Avoir vu au moins 200 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Alien.png`,
  },
  {
    id: 'maitre-horreur-movies',
    name: "Maître de l'horreur",
    description: "Avoir vu au moins 300 films d'horreur",
    image: `${BADGES_IMAGE_PATH}/movies/Scream.png`,
  },
  // ——— Comédie (Films)
  {
    id: 'drole-de-gendarme',
    name: 'Drôle de gendarme',
    description: 'Avoir vu au moins 50 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/Le_Gendarme.png`,
  },
  {
    id: 'espion-blanquette',
    name: 'Espion de la blanquette',
    description: 'Avoir vu au moins 100 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/OSS_117.png`,
  },
  {
    id: 'oh-le-con',
    name: 'Oh le con !',
    description: 'Avoir vu au moins 150 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/Le_Diner_De_Cons.png`,
  },
  {
    id: 'sancho-de-cuba',
    name: 'Sancho de Cuba',
    description: 'Avoir vu au moins 200 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/The_Mask.png`,
  },
  {
    id: 'architecte-humour',
    name: "Architecte de l'humour",
    description: 'Avoir vu au moins 300 films de comédie',
    image: `${BADGES_IMAGE_PATH}/movies/Asterix_Et_Obelix_Mission_Cleopatre.png`,
  },
  // ——— Action (Films)
  {
    id: 'transporteur',
    name: 'Transporteur',
    description: "Avoir vu au moins 50 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Le_Transporteur.png`,
  },
  {
    id: 'baba-yaga',
    name: 'Baba Yaga',
    description: "Avoir vu au moins 100 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/John_Wick.png`,
  },
  {
    id: 'flic-new-york',
    name: 'Flic de New-York',
    description: "Avoir vu au moins 150 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Piege_de_Cristal.png`,
  },
  {
    id: 'veteran',
    name: 'Vétéran',
    description: "Avoir vu au moins 200 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Rambo.png`,
  },
  {
    id: 'icone-action',
    name: "Icône de l'action",
    description: "Avoir vu au moins 300 films d'action",
    image: `${BADGES_IMAGE_PATH}/movies/Predator.png`,
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
