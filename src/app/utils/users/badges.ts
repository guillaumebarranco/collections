/**
 * Système de badges (gamification) pour les utilisateurs Makya.
 * Définitions de base des badges. Les badges débloqués par utilisateur
 * sont récupérés via l'API (BadgesService), comme les Top 5 personnels.
 * Chaque badge est associé à une image dans public/badges (ex. graine-lecteur.png).
 */

const BADGES_IMAGE_PATH = '/badges';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  /** Chemin de l'image du badge (fichier dans public/badges). */
  image: string;
}

/** Définitions de tous les badges disponibles (catalogue de base). */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ——— Livres
  {
    id: 'petit-lecteur',
    name: 'Petit lecteur',
    description: 'Avoir lu au moins 50 livres',
    image: `${BADGES_IMAGE_PATH}/books/Bella_Swan.png`,
  },
  {
    id: 'graine-lecteur',
    name: 'Graine de lecteur',
    description: 'Avoir lu au moins 100 livres',
    image: `${BADGES_IMAGE_PATH}/books/Will_Hunting.png`,
  },
  {
    id: 'lecteur-assidu',
    name: 'Lecteur assidu',
    description: 'Avoir lu au moins 150 livres',
    image: `${BADGES_IMAGE_PATH}/books/John_Keating.png`,
  },
  {
    id: 'lecteur-chevronne',
    name: 'Lecteur chevronné',
    description: 'Avoir lu au moins 200 livres',
    image: `${BADGES_IMAGE_PATH}/books/Hermione_Granger.png`,
  },
  {
    id: 'lecteur-passionne',
    name: 'Lecteur passionné',
    description: 'Avoir lu au moins 250 livres',
    image: `${BADGES_IMAGE_PATH}/books/Belle.png`,
  },
  {
    id: 'lecteur-veteran',
    name: 'Lecteur vétéran',
    description: 'Avoir lu au moins 300 livres',
    image: `${BADGES_IMAGE_PATH}/books/Harlan.png`,
  },
  {
    id: 'maitre-lecteur',
    name: 'Maître lecteur',
    description: 'Avoir lu au moins 400 livres',
    image: `${BADGES_IMAGE_PATH}/books/Carlisle_Cullen.webp`,
  },
  {
    id: 'doyen-lecteurs',
    name: 'Doyen des lecteurs',
    description: 'Avoir lu au moins 500 livres',
    image: `${BADGES_IMAGE_PATH}/books/Albus_Dumbledore.png`,
  },
  // ——— Fantasy (livres)
  {
    id: 'eleve-fantasy',
    name: 'Élève de la fantasy',
    description: 'Avoir lu au moins 15 livres de fantasy',
    image: `${BADGES_IMAGE_PATH}/books/Tara_Duncan.png`,
  },
  {
    id: 'amoureux-fantasy',
    name: 'Amoureux de la fantasy',
    description: 'Avoir lu au moins 30 livres de fantasy',
    image: `${BADGES_IMAGE_PATH}/books/Percy_Jackson.png`,
  },
  {
    id: 'chevalier-fantasy',
    name: 'Chevalier de la fantasy',
    description: 'Avoir lu au moins 50 livres de fantasy',
    image: `${BADGES_IMAGE_PATH}/books/Daenerys.png`,
  },
  {
    id: 'heros-fantasy',
    name: 'Héros de la fantasy',
    description: 'Avoir lu au moins 80 livres de fantasy',
    image: `${BADGES_IMAGE_PATH}/books/Harry_Potter.png`,
  },
  {
    id: 'seigneur-fantasy',
    name: 'Seigneur de la fantasy',
    description: 'Avoir lu au moins 100 livres de fantasy',
    image: `${BADGES_IMAGE_PATH}/books/Sauron.jpg`,
  },
  // ——— Romance (livres)
  {
    id: 'petit-beguin-books',
    name: 'Petit béguin (livres)',
    description: 'Avoir lu au moins 15 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Hazel_et_Gus.png`,
  },
  {
    id: 'lover-books',
    name: 'Lover (livres)',
    description: 'Avoir lu au moins 30 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Jamie_et_London.png`,
  },
  {
    id: 'amoureux-books',
    name: 'Amoureux (livres)',
    description: 'Avoir lu au moins 50 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Bella_et_Edward.png`,
  },
  {
    id: 'grand-amour-books',
    name: 'Le Grand amour (livres)',
    description: 'Avoir lu au moins 80 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Romeo_et_Juliette.png`,
  },
  {
    id: 'amour-eternel-books',
    name: 'L`amour éternel (livres)',
    description: 'Avoir lu au moins 100 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Elizabeth_et_Darcy.png`,
  },
  // ——— Films
  {
    id: 'cinephile-herbe',
    name: 'Cinéphile en herbe',
    description: 'Avoir vu au moins 100 films',
    image: `${BADGES_IMAGE_PATH}/movies/Danny_Madigan.png`,
  },
  {
    id: 'cinephile-amateur',
    name: 'Cinéphile amateur',
    description: 'Avoir vu au moins 300 films',
    image: `${BADGES_IMAGE_PATH}/movies/Manny_Torres.png`,
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
    image: `${BADGES_IMAGE_PATH}/movies/Carl_Denham.png`,
  },
  {
    id: 'cinephile-inconditionnel',
    name: 'Cinéphile inconditionnel',
    description: 'Avoir vu au moins 1000 films',
    image: `${BADGES_IMAGE_PATH}/movies/Carl_Denham.png`,
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
];

export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  image: string;
  earned: true;
}

export interface LockedBadge {
  id: string;
  name: string;
  description: string;
  image: string;
  earned: false;
}

export type BadgeDisplay = EarnedBadge | LockedBadge;

/**
 * Construit la liste des badges à afficher en fusionnant les définitions de base
 * avec les ids de badges débloqués par l'utilisateur (récupérés via l'API).
 */
export function getBadgesDisplay(earnedBadgeIds: string[]): BadgeDisplay[] {
  const earnedSet = new Set(earnedBadgeIds);
  return BADGE_DEFINITIONS.map((def) => ({
    id: def.id,
    name: def.name,
    description: def.description,
    image: def.image,
    earned: earnedSet.has(def.id),
  })) as BadgeDisplay[];
}
