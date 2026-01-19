

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
}

export interface Music extends BaseMusic, UserMusic {}
