/** Types d’œuvres pour lesquels une demande d’ajout admin est possible. */
export type EntityAddRequestType =
  | 'movie'
  | 'serie'
  | 'book'
  | 'children-book'
  | 'manga'
  | 'manwha'
  | 'comic'
  | 'bd'
  | 'game';

/** Demande utilisateur pour qu’un admin ajoute une œuvre au catalogue. */
export type EntityAddRequest = {
  id: string;
  entityType: EntityAddRequestType;
  title: string;
  /** Valeur de la clé secondaire (réalisateur, auteur, etc.). */
  secondaryKey: string;
  /** Nom du champ secondaire côté modèle (`director`, `author`, …). */
  secondaryKeyField: string;
  requestedBy: string;
  requestedAt: string;
};

export type EntityAddRequestConfig = {
  /** Libellé singulier pour les phrases UI (« film », « livre »…). */
  label: string;
  /** Article indéfini (« un » / « une »). */
  article: 'un' | 'une';
  secondaryField: string;
  secondaryLabel: string;
  /** Libellé court pour l’admin. */
  typeLabel: string;
};

export const ENTITY_ADD_REQUEST_CONFIG: Record<
  EntityAddRequestType,
  EntityAddRequestConfig
> = {
  movie: {
    label: 'film',
    article: 'un',
    secondaryField: 'director',
    secondaryLabel: 'Réalisateur',
    typeLabel: 'Film',
  },
  serie: {
    label: 'série',
    article: 'une',
    secondaryField: 'director',
    secondaryLabel: 'Créateur',
    typeLabel: 'Série',
  },
  book: {
    label: 'livre',
    article: 'un',
    secondaryField: 'author',
    secondaryLabel: 'Auteur',
    typeLabel: 'Livre',
  },
  'children-book': {
    label: 'livre',
    article: 'un',
    secondaryField: 'author',
    secondaryLabel: 'Auteur',
    typeLabel: 'Livre enfant',
  },
  manga: {
    label: 'manga',
    article: 'un',
    secondaryField: 'author',
    secondaryLabel: 'Auteur',
    typeLabel: 'Manga',
  },
  manwha: {
    label: 'manwha',
    article: 'un',
    secondaryField: 'author',
    secondaryLabel: 'Auteur',
    typeLabel: 'Manwha',
  },
  comic: {
    label: 'comic',
    article: 'un',
    secondaryField: 'writer',
    secondaryLabel: 'Scénariste',
    typeLabel: 'Comic',
  },
  bd: {
    label: 'BD',
    article: 'une',
    secondaryField: 'writer',
    secondaryLabel: 'Scénariste',
    typeLabel: 'BD',
  },
  game: {
    label: 'jeu',
    article: 'un',
    secondaryField: 'editor',
    secondaryLabel: 'Éditeur',
    typeLabel: 'Jeu',
  },
};

export function getRequestEntityAddButtonLabel(
  entityType: EntityAddRequestType
): string {
  const { article, label } = ENTITY_ADD_REQUEST_CONFIG[entityType];
  return `Demander à l'admin l'ajout d'${article} ${label} sur Makya`;
}

export function getManualAddEntityButtonLabel(
  entityType: EntityAddRequestType
): string {
  const { article, label } = ENTITY_ADD_REQUEST_CONFIG[entityType];
  return `Ajouter manuellement ${article} ${label} qui n'existe pas encore sur Makya`;
}
