import { Anime, UserAnimeSeason } from '../models/anime-model';
import {
  isSeasonWatching,
  normalizedSeasonTimesWatched,
  seasonHasViewingActivity,
} from './in-progress.utils';

export type AnimeLastViewedSeasonInfo = {
  seasonNumber: number;
  dateStr: string;
};

/** Dates de visionnage d'une saison (premier, dernier, autres). */
export function getAllSeasonViewedDateStrings(season: UserAnimeSeason): string[] {
  const out: string[] = [];
  for (const raw of [
    season.firstViewedDate,
    season.lastViewedDate,
    ...(season.otherViewedDates ?? []),
  ]) {
    const s = (raw ?? '').trim();
    if (s && !out.includes(s)) {
      out.push(s);
    }
  }
  return out;
}

/**
 * Saison la plus récemment visionnée et date associée (toutes dates de la saison).
 */
export function getAnimeLastViewedSeasonInfo(
  anime: Anime
): AnimeLastViewedSeasonInfo | null {
  let best: AnimeLastViewedSeasonInfo | null = null;
  let bestTime = 0;

  for (const season of anime.seasons ?? []) {
    if (!seasonHasViewingActivity(season)) {
      continue;
    }
    for (const dateStr of getAllSeasonViewedDateStrings(season)) {
      const t = new Date(dateStr).getTime();
      if (Number.isNaN(t)) {
        continue;
      }
      if (
        t > bestTime ||
        (t === bestTime &&
          best !== null &&
          season.seasonNumber > best.seasonNumber)
      ) {
        bestTime = t;
        best = { seasonNumber: season.seasonNumber, dateStr };
      }
    }
  }

  return best;
}

/**
 * Nombre de animés distincts en bibliothèque (titre + réalisateur), sans tenir compte du visionnage.
 */
export function countDistinctAnimesForBadges(
  rows: Array<{ title?: string; director?: string }>
): number {
  const keys = new Set<string>();
  for (const r of rows) {
    const t = (r.title ?? '').trim();
    const d = (r.director ?? '').trim();
    if (!t || !d) continue;
    keys.add(`${t}|${d}`);
  }
  return keys.size;
}

/**
 * Nombre de animés distincts « vues » pour les badges : au moins une saison avec
 * `seasonTimesWatched >= 1` (visionnage complet d’au moins une saison).
 * Les saisons uniquement en cours (`watching`) ne comptent pas ; une entrée = un animé (pas une saison).
 */
export function countAnimesSeenForBadges(
  rows: ReadonlyArray<{
    title?: string;
    director?: string;
    seasons?: ReadonlyArray<{
      watching: boolean;
      seasonTimesWatched?: number;
    }>;
  }>
): number {
  const keys = new Set<string>();
  for (const r of rows) {
    const t = (r.title ?? '').trim();
    const d = (r.director ?? '').trim();
    if (!t || !d) continue;
    const seen = (r.seasons ?? []).some(
      (s) => normalizedSeasonTimesWatched(s.seasonTimesWatched) >= 1
    );
    if (!seen) continue;
    keys.add(`${t}|${d}`);
  }
  return keys.size;
}

export function getAnimeSeasonsCount(anime: Anime): number {
  return anime.seasonsData?.length ?? 0;
}

export function getAnimeTotalEpisodes(anime: Anime): number {
  return (anime.seasonsData || []).reduce(
    (sum, season) => sum + (season.nbEpisodes || 0),
    0
  );
}

export function getAnimeTotalLengthMinutes(anime: Anime): number {
  return anime.seasonsData.reduce(
    (sum, season) => sum + (season.totalLength || 0),
    0
  );
}

export function getAnimeWatchedLengthMinutes(anime: Anime): number {
  if (
    anime.seasonsData &&
    anime.seasonsData.length > 0 &&
    anime.seasons &&
    anime.seasons.length > 0
  ) {
    const seasonsByNumber = new Map(
      anime.seasons.map((season) => [
        season.seasonNumber,
        normalizedSeasonTimesWatched(season.seasonTimesWatched),
      ])
    );
    const totalSeasonTimes = anime.seasons.reduce(
      (sum, season) =>
        sum + normalizedSeasonTimesWatched(season.seasonTimesWatched),
      0
    );

    if (totalSeasonTimes > 0) {
      return anime.seasonsData.reduce((sum, season) => {
        const timesWatched = seasonsByNumber.get(season.seasonNumber) || 0;
        return sum + (season.totalLength || 0) * timesWatched;
      }, 0);
    }
  }

  return 0;
}

export function getAnimeTotalTimesWatched(anime: Anime): number {
  if (anime.seasons && anime.seasons.length > 0) {
    return anime.seasons.reduce(
      (sum, season) =>
        sum + normalizedSeasonTimesWatched(season.seasonTimesWatched),
      0
    );
  }
  return 0;
}

/** Watchlist : aucune saison commencée (pas en cours, pas vue). */
export function isAnimeWatchlistNotStarted(anime: Anime): boolean {
  const seasons = anime.seasons ?? [];
  if (seasons.length === 0) {
    return true;
  }
  return seasons.every(
    (s) =>
      !isSeasonWatching(s) &&
      normalizedSeasonTimesWatched(s.seasonTimesWatched) === 0
  );
}

/** Watchlist : marquée « en cours » (chaque saison en watching). */
export function isAnimeWatchlistInProgress(anime: Anime): boolean {
  const seasons = anime.seasons ?? [];
  if (seasons.length === 0) {
    return false;
  }
  return seasons.every((s) => isSeasonWatching(s));
}

/** Dernière saison marquée comme vue au moins une fois complètement (≥1). */
export function getLastFullyWatchedSeasonNumber(anime: Anime): number {
  let maxN = 0;
  for (const s of anime.seasons ?? []) {
    if (normalizedSeasonTimesWatched(s.seasonTimesWatched) >= 1) {
      maxN = Math.max(maxN, s.seasonNumber);
    }
  }
  return maxN;
}

/**
 * Horodatage (ms) le plus récent parmi les `lastViewedDate` des saisons
 * avec visionnage réel (en cours ou terminé).
 * Ignore les saisons sans activité même si une date parasite est présente.
 */
export function getAnimeLatestSeasonLastViewedTime(anime: Anime): number {
  const info = getAnimeLastViewedSeasonInfo(anime);
  if (!info) {
    return 0;
  }
  const t = new Date(info.dateStr).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Saison N+1 à marquer en cours : N = dernière saison complètement vue, la suivante existe et n'est pas déjà commencée.
 */
export function getNextSeasonNumberForNewSeasonStarted(
  anime: Anime
): number | null {
  const dataLen = anime.seasonsData?.length ?? 0;
  if (dataLen === 0) {
    return null;
  }
  const N = getLastFullyWatchedSeasonNumber(anime);
  if (N < 1) {
    return null;
  }
  const next = N + 1;
  if (next > dataLen) {
    return null;
  }
  const row = (anime.seasons ?? []).find((s) => s.seasonNumber === next);
  if (!row) {
    return next;
  }
  if (
    isSeasonWatching(row) ||
    normalizedSeasonTimesWatched(row.seasonTimesWatched) >= 1
  ) {
    return null;
  }
  if (normalizedSeasonTimesWatched(row.seasonTimesWatched) !== 0) {
    return null;
  }
  return next;
}

/** Fichier « vus » : une nouvelle saison est disponible et peut être marquée « en cours ». */
export function animeShowsNewSeasonStartedButton(anime: Anime): boolean {
  return getNextSeasonNumberForNewSeasonStarted(anime) !== null;
}

/**
 * Animé du fichier vus + au moins une saison en cours : affichage aussi dans « En cours ».
 * (Distinct de la watchlist où toutes les saisons sont en watching sans saison ≥1.)
 */
export function isAnimeFinishedWithNewSeasonInProgress(anime: Anime): boolean {
  const seasons = anime.seasons ?? [];
  if (seasons.length === 0) {
    return false;
  }
  let hasComplete = false;
  let hasInProgress = false;
  for (const s of seasons) {
    if (normalizedSeasonTimesWatched(s.seasonTimesWatched) >= 1) {
      hasComplete = true;
    }
    if (isSeasonWatching(s)) {
      hasInProgress = true;
    }
  }
  return hasComplete && hasInProgress;
}

export function getAnimeAverageRating(anime: Anime): number {
  if (anime.seasons && anime.seasons.length > 0) {
    const ratings = anime.seasons.map((season) => season.seasonRating || 0);
    const hasAnyRating = ratings.some((rating) => rating > 0);
    if (!hasAnyRating) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return total / ratings.length;
  }
  return 0;
}
