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
    image: `${BADGES_IMAGE_PATH}/books/Tyrion_Lannister.png`,
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
    id: 'rat-bibliotheque',
    name: 'Rat de bibliothèque',
    description: 'Avoir lu au moins 350 livres',
    image: `${BADGES_IMAGE_PATH}/books/Hermione_Granger.png`,
  },
  {
    id: 'amoureux-lecture',
    name: 'Amoureux de la lecture',
    description: 'Avoir lu au moins 400 livres',
    image: `${BADGES_IMAGE_PATH}/books/Liesel_Meminger.png`,
  },
  {
    id: 'maitre-lecteur',
    name: 'Maître lecteur',
    description: 'Avoir lu au moins 450 livres',
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
    id: 'sorcelier',
    name: 'Sorcelier',
    description: 'Avoir lu au moins 15 livres de fantasy',
    image: `${BADGES_IMAGE_PATH}/books/Tara_Duncan.png`,
  },
  {
    id: 'demi-dieu',
    name: 'Demi-dieu',
    description: 'Avoir lu au moins 30 livres de fantasy',
    image: `${BADGES_IMAGE_PATH}/books/Percy_Jackson.png`,
  },
  {
    id: 'reine-dragons',
    name: 'Reine des dragons',
    description: 'Avoir lu au moins 50 livres de fantasy',
    image: `${BADGES_IMAGE_PATH}/books/Daenerys.png`,
  },
  {
    id: 'elu-prophetie',
    name: 'Elu de la prophetie',
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
    name: 'Petit béguin',
    description: 'Avoir lu au moins 15 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Hazel_et_Gus.png`,
  },
  {
    id: 'lover-books',
    name: 'Lover',
    description: 'Avoir lu au moins 30 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Jamie_et_London.png`,
  },
  {
    id: 'ames-soeurs',
    name: 'Âmes-sœurs',
    description: 'Avoir lu au moins 50 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Bella_et_Edward.png`,
  },
  {
    id: 'amour-a-travers-la-mort',
    name: "L'amour absolu",
    description: 'Avoir lu au moins 80 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Romeo_et_Juliette.png`,
  },
  {
    id: 'icone-romance',
    name: 'Icône de la romance',
    description: 'Avoir lu au moins 100 livres de romance',
    image: `${BADGES_IMAGE_PATH}/books/Elizabeth_et_Darcy.png`,
  },
  // ——— Science-fiction (livres)
  {
    id: 'marche-vers-l-inconnu',
    name: "En marche vers l'inconnu",
    description: 'Avoir lu au moins 15 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/La_Horde_Du_Contrevent.png`,
  },
  {
    id: 'guerrier-omniscient',
    name: 'Guerrier omniscient',
    description: 'Avoir lu au moins 30 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/Dune.png`,
  },
  {
    id: 'explorateur-profondeurs',
    name: 'Explorateur des profondeurs',
    description: 'Avoir lu au moins 50 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/Nautilus.png`,
  },
  {
    id: 'survivant-invasion',
    name: "Survivant de l'invasion",
    description: 'Avoir lu au moins 80 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/Guerre_des_Mondes.png`,
  },
  {
    id: 'architecte-psychohistoire',
    name: 'Architecte de la psychohistoire',
    description: 'Avoir lu au moins 100 livres de science-fiction',
    image: `${BADGES_IMAGE_PATH}/books/Fondation.png`,
  },
  // ——— Policier (livres)
  {
    id: 'amateur-polars',
    name: 'Amateur de polars',
    description: 'Avoir lu au moins 15 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Millenium.png`,
  },
  {
    id: 'enqueteur-verite',
    name: 'Enquêteur de la vérité',
    description: 'Avoir lu au moins 30 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Da_Vinci_Code.png`,
  },
  {
    id: 'artiste-evasion',
    name: "Artiste de l'évasion",
    description: 'Avoir lu au moins 50 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Arsene_Lupin.png`,
  },
  {
    id: 'maitre-mystere',
    name: 'Maître du mystère',
    description: 'Avoir lu au moins 80 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Ils_Etaient_Dix.png`,
  },
  {
    id: 'genie-deduction',
    name: 'Génie de la déduction',
    description: 'Avoir lu au moins 100 livres de policier',
    image: `${BADGES_IMAGE_PATH}/books/Sherlock_Holmes.png`,
  },
  // ——— Nonfiction (livres)
  {
    id: 'lecteur-curieux-nonfiction',
    name: 'Lecteur curieux',
    description: 'Avoir lu au moins 15 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Anne_Frank.png`,
  },
  {
    id: 'chercheur-savoir',
    name: 'Chercheur du savoir',
    description: 'Avoir lu au moins 30 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Nelson_Mandela.png`,
  },
  {
    id: 'precurseur-progres',
    name: 'Précurseur du progrès',
    description: 'Avoir lu au moins 50 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Simone_Veil.png`,
  },
  {
    id: 'icone-changement',
    name: 'Icône du changement',
    description: 'Avoir lu au moins 80 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Martin_Luther_King.png`,
  },
  {
    id: 'sage-humanite',
    name: "Sage de l'humanité",
    description: 'Avoir lu au moins 100 livres de nonfiction',
    image: `${BADGES_IMAGE_PATH}/books/Gandhi.png`,
  },
  // ——— Aventure (livres)
  {
    id: 'explorateur',
    name: 'Explorateur',
    description: 'Avoir lu au moins 15 livres d’aventure',
    image: `${BADGES_IMAGE_PATH}/books/Alice_Au_Pays_Des_Merveilles.png`,
  },
  {
    id: 'moussaillon-flots',
    name: 'Moussaillon des flots',
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
    id: 'ubiquiste-monde',
    name: 'Ubiquiste du monde',
    description: 'Avoir lu au moins 80 livres d’aventure',
    image: `${BADGES_IMAGE_PATH}/books/Le_Comte_De_Monte_Cristo.png`,
  },
  {
    id: 'aventurier-legendaire',
    name: 'Aventurier légendaire',
    description: 'Avoir lu au moins 100 livres d’aventure',
    image: `${BADGES_IMAGE_PATH}/books/Odyssee.png`,
  },
];
