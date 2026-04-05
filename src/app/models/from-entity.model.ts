/**
 * Modèle commun pour le champ « œuvre source » (adaptation).
 * Les types d’entité autorisés diffèrent selon le média cible (ex. un jeu peut
 * référencer un film, ce qu’un film catalogue ne modélise pas comme source).
 */

export interface FromEntitySourceBase {
  title: string;
  secondEntityKey: string;
}

/**
 * Types d’œuvre dont un film ou une série catalogue peut être adapté.
 * Exclut `movie` : pas de référence film→film dans ce modèle.
 */
export type MovieFromEntityType =
  | 'book'
  | 'bd'
  | 'game'
  | 'comic'
  | 'manga'
  | 'manwha'
  | 'serie';

export interface MovieFromEntityAdaptation extends FromEntitySourceBase {
  entityType: MovieFromEntityType;
}

/**
 * Types d’œuvre dont un jeu peut être adapté (inclut les films).
 * `secondEntityKey` : auteur / scénariste / éditeur / réalisateur selon le type.
 */
export type GameFromEntityType = MovieFromEntityType | 'movie';

export interface GameFromEntityAdaptation extends FromEntitySourceBase {
  entityType: GameFromEntityType;
}
