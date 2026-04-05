import { Country } from './countries.enum';

export interface MandatorySerieData {
  title: string;
  director: string;
}

/** Normalise les genres (tableau, chaîne « a, b » ou données héritées). */
export function normalizeSerieGenres(raw: unknown): string[] {
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

export interface BaseSerie extends MandatorySerieData {
  actors: {
    name: string;
  }[];
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  genre: string[];
  seasonsData: BaseSerieSeasonData[];
  description: string;
  countryOrigin: Country;
  saga: string;
}

export interface BaseSerieSeasonData {
  seasonNumber: number;
  nbEpisodes: number;
  totalLength: number;
}

export interface UserSerieSeason {
  seasonNumber: number;
  seasonRating: number;
  /**
   * Watchlist : 0 = pas commencé, 0.5 = en cours de visionnage, ≥1 = visionnages complets.
   * Fichier vus + nouvelle saison : la saison N+1 (après la dernière à ≥1) peut être passée à 0.5 puis à ≥1.
   */
  seasonTimesWatched: number;
  lastViewedDate: string;
}

export interface UserSerie extends MandatorySerieData {
  seasons: UserSerieSeason[];
  owned: boolean;
  watchPriority: 1 | 2 | 3;
  wantToWatchAgain: boolean;
  ratingComment: string;
  borrowed: string;
  loaned: string;
}

export type UserSeries = UserSerie[];

/** Fichiers utilisateur sérialisés : certains contiennent encore une note globale `rating`. */
export type UserSerieFileRow = UserSerie & { rating?: number };

export interface Serie extends BaseSerie, UserSerie {}
