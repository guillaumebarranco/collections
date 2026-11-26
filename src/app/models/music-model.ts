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
 * Note d'un album pour un utilisateur.
 * Pas d'entité album : le couple artiste + nom d'album suffit à l'identifier.
 */
export interface UserAlbumNote {
  artist: string;
  album: string;
  rating: number;
  favorite?: boolean;
}

export type UserAlbumNotes = UserAlbumNote[];

export interface Music extends BaseMusic, UserMusic {}
