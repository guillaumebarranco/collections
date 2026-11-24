import type { EntityQuote } from './entity-quote.model';

export interface MandatoryMusicData {
  title: string;
  artist: string;
}

export interface BaseMusic extends MandatoryMusicData {
  album: string;
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
}

export type UserAlbumNotes = UserAlbumNote[];

export interface Music extends BaseMusic, UserMusic {}
