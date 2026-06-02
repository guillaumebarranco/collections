import { Country } from './countries.enum';
import type { SerieFromEntityAdaptation } from './from-entity.model';

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
  /** Œuvre source (livre, BD, film, autre série, etc.) si adaptation. */
  fromEntity: SerieFromEntityAdaptation | null;
}

export interface BaseSerieSeasonData {
  seasonNumber: number;
  nbEpisodes: number;
  totalLength: number;
}

export interface UserSerieSeason {
  seasonNumber: number;
  seasonRating: number;
  /** En cours de visionnage (watchlist ou nouvelle saison sur une série déjà vue). */
  watching: boolean;
  /** 0 = pas commencé, ≥1 = visionnages complets de la saison. */
  seasonTimesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  otherViewedDates: string[];
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
