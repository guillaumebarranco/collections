import type { EntityQuote } from './entity-quote.model';

export interface MandatoryMusicData {
  title: string;
  artist: string;
}

export interface BaseMusic extends MandatoryMusicData {
  album: string;
  /** Position du morceau dans l'album. 0 = non renseigné, l'ordre d'affichage reste alphabétique. */
  albumTrackId: number;
  coverUrl: string;
  releaseDate: string;
  duration: number; // en secondes
  genre: string;
}

export interface UserMusic extends MandatoryMusicData {
  rating: number;
  timesListened: number;
  /** Connaît le morceau par cœur. */
  byHeart: boolean;
  /** Morceau mis en avant, indépendamment de l'album. */
  favorite: boolean;
  /** Citations extraites du morceau. */
  quotes: EntityQuote[];
}

export type UserMusics = UserMusic[];

/**
 * Album suivi pour un utilisateur.
 * Pas d'entité album : le couple artiste + nom d'album suffit à l'identifier.
 */
export interface UserAlbum {
  artist: string;
  album: string;
  rating: number;
  favorite: boolean;
  /** Présent dans la liste « Albums à écouter ». */
  toListen: boolean;
  /** Dernier « J'ai écouté cet album », au format YYYY-MM-DD. */
  lastListenedDate: string | null;
}

export type UserAlbums = UserAlbum[];

export interface Music extends BaseMusic, UserMusic {}
