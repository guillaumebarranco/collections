import { BadgeDefinition, BADGES_IMAGE_PATH } from '../../models/badge-model';

export const BOOKS_BADGE_DEFINITIONS: BadgeDefinition[] = [
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
  // ——— Science-fiction (livres)
  {
    id: 'initie-science-fiction',
    name: 'Initié en science-fiction',
    description: 'Avoir lu au moins 15 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/La_Horde_Du_Contrevent.png`,
  },
  {
    id: 'lecteur-science-fiction',
    name: 'Lecteur de science-fiction',
    description: 'Avoir lu au moins 30 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/Dune.png`,
  },
  {
    id: 'explorateur-science-fiction',
    name: 'Explorateur spatial',
    description: 'Avoir lu au moins 50 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/Nautilus.png`,
  },
  {
    id: 'voyageur-science-fiction',
    name: 'Voyageur interstellaire',
    description: 'Avoir lu au moins 80 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/Guerre_des_Mondes.png`,
  },
  {
    id: 'maitre-science-fiction',
    name: 'Maître de la science-fiction',
    description: 'Avoir lu au moins 100 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/Fondation.png`,
  },
  // ——— Policier (livres)
  {
    id: 'lecteur-polar',
    name: 'Lecteur de polar',
    description: 'Avoir lu au moins 15 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Millenium.png`,
  },
  {
    id: 'amateur-polars',
    name: 'Amateur de polars',
    description: 'Avoir lu au moins 30 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Da_Vinci_Code.png`,
  },
  {
    id: 'enqueteur-livres',
    name: 'Enquêteur',
    description: 'Avoir lu au moins 50 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Arsene_Lupin.png`,
  },
  {
    id: 'inspecteur-livres',
    name: 'Inspecteur',
    description: 'Avoir lu au moins 80 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Ils_Etaient_Dix.png`,
  },
  {
    id: 'maitre-polar',
    name: 'Maître du polar',
    description: 'Avoir lu au moins 100 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Sherlock_Holmes.png`,
  },
  // ——— Nonfiction (livres)
  {
    id: 'lecteur-curieux-nonfiction',
    name: 'Lecteur curieux',
    description: 'Avoir lu au moins 15 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Tara_Duncan.png`,
  },
  {
    id: 'chercheur-savoir',
    name: 'Chercheur de savoir',
    description: 'Avoir lu au moins 30 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Bella_Swan.png`,
  },
  {
    id: 'amateur-reel',
    name: 'Amateur du réel',
    description: 'Avoir lu au moins 50 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Hazel_et_Gus.png`,
  },
  {
    id: 'erudit-livres',
    name: 'Érudit',
    description: 'Avoir lu au moins 80 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Jamie_et_London.png`,
  },
  {
    id: 'sage-nonfiction',
    name: 'Sage de la nonfiction',
    description: 'Avoir lu au moins 100 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Elizabeth_et_Darcy.png`,
  },
  // ——— Aventure (livres)
  {
    id: 'petit-explorateur-aventure',
    name: 'Petit explorateur',
    description: 'Avoir lu au moins 15 livres d’aventure',
    image: `${BADGES_IMAGE_PATH}/books/Alice_Au_Pays_Des_Merveilles.png`,
  },
  {
    id: 'aventurier-livres',
    name: 'Aventurier',
    description: 'Avoir lu au moins 30 livres d’aventure',
    image: `${BADGES_IMAGE_PATH}/books/Ile_Au_Tresor.png`,
  },
  {
    id: 'grand-voyageur-livres',
    name: 'Grand voyageur',
    description: 'Avoir lu au moins 50 livres d’aventure',
    image: `${BADGES_IMAGE_PATH}/books/Le_Tour_Du_Monde_En_80_Jours.png`,
  },
  {
    id: 'heros-aventure',
    name: 'Héros d’aventure',
    description: 'Avoir lu au moins 80 livres d’aventure',
    image: `${BADGES_IMAGE_PATH}/books/Le_Comte_De_Monte_Cristo.png`,
  },
  {
    id: 'legende-aventure',
    name: 'Légende de l’aventure',
    description: 'Avoir lu au moins 100 livres d’aventure',
    image: `${BADGES_IMAGE_PATH}/books/Odyssee.png`,
  },
];
