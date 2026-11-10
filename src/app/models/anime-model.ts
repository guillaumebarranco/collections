import { Country } from './countries.enum';
import type { AnimeFromEntityAdaptation } from './from-entity.model';

export interface MandatoryAnimeData {
  title: string;
  director: string;
}

/** Normalise les genres (tableau, chaîne « a, b » ou données héritées). */
export function normalizeAnimeGenres(raw: unknown): string[] {
  if (raw === undefined || raw === null) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    if (!raw.trim()) {
      return [];
    }
    return raw
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);
  }
  return [];
}

export interface BaseAnime extends MandatoryAnimeData {
  actors: {
    name: string;
  }[];
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  genre: string[];
  seasonsData: BaseAnimeSeasonData[];
  description: string;
  countryOrigin: Country;
  saga: string;
  /** Œuvre source (livre, BD, film, autre animé, etc.) si adaptation. */
  fromEntity: AnimeFromEntityAdaptation | null;
}

export interface BaseAnimeSeasonData {
  seasonNumber: number;
  nbEpisodes: number;
  totalLength: number;
}

export interface UserAnimeSeason {
  seasonNumber: number;
  seasonRating: number;
  /** En cours de visionnage (watchlist ou nouvelle saison sur un animé déjà vue). */
  watching: boolean;
  /** 0 = pas commencé, ≥1 = visionnages complets de la saison. */
  seasonTimesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  otherViewedDates: string[];
}

export interface UserAnime extends MandatoryAnimeData {
  seasons: UserAnimeSeason[];
  owned: boolean;
  watchPriority: 1 | 2 | 3;
  wantToWatchAgain: boolean;
  ratingComment: string;
  borrowed: string;
  loaned: string;
  /** Citations extraites de l'animé. */
  quotes: string[];
}

export type UserAnimes = UserAnime[];

/** Fichiers utilisateur sérialisés : certains contiennent encore une note globale `rating`. */
export type UserAnimeFileRow = UserAnime & { rating?: number };

export interface Anime extends BaseAnime, UserAnime {}
