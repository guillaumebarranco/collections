import { Serie, UserSerieSeason } from '../models/serie-model';
import {
  isSeasonWatching,
  normalizedSeasonTimesWatched,
  seasonHasViewingActivity,
} from './in-progress.utils';

export type SerieLastViewedSeasonInfo = {
  seasonNumber: number;
  dateStr: string;
};

/** Dates de visionnage d'une saison (premier, dernier, autres). */
export function getAllSeasonViewedDateStrings(season: UserSerieSeason): string[] {
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
export function getSerieLastViewedSeasonInfo(
  serie: Serie
): SerieLastViewedSeasonInfo | null {
  let best: SerieLastViewedSeasonInfo | null = null;
  let bestTime = 0;

  for (const season of serie.seasons ?? []) {
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
 * Nombre de séries distinctes en bibliothèque (titre + réalisateur), sans tenir compte du visionnage.
 */
export function countDistinctSeriesForBadges(
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
 * Nombre de séries distinctes « vues » pour les badges : au moins une saison avec
 * `seasonTimesWatched >= 1` (visionnage complet d’au moins une saison).
 * Les saisons uniquement en cours (`watching`) ne comptent pas ; une entrée = une série (pas une saison).
 */
export function countSeriesSeenForBadges(
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

export function getSerieSeasonsCount(serie: Serie): number {
  return serie.seasonsData?.length ?? 0;
}

export function getSerieTotalEpisodes(serie: Serie): number {
  return (serie.seasonsData || []).reduce(
    (sum, season) => sum + (season.nbEpisodes || 0),
    0
  );
}

export function getSerieTotalLengthMinutes(serie: Serie): number {
  return serie.seasonsData.reduce(
    (sum, season) => sum + (season.totalLength || 0),
    0
  );
}

export function getSerieWatchedLengthMinutes(serie: Serie): number {
  if (
    serie.seasonsData &&
    serie.seasonsData.length > 0 &&
    serie.seasons &&
    serie.seasons.length > 0
  ) {
    const seasonsByNumber = new Map(
      serie.seasons.map((season) => [
        season.seasonNumber,
        normalizedSeasonTimesWatched(season.seasonTimesWatched),
      ])
    );
    const totalSeasonTimes = serie.seasons.reduce(
      (sum, season) =>
        sum + normalizedSeasonTimesWatched(season.seasonTimesWatched),
      0
    );

    if (totalSeasonTimes > 0) {
      return serie.seasonsData.reduce((sum, season) => {
        const timesWatched = seasonsByNumber.get(season.seasonNumber) || 0;
        return sum + (season.totalLength || 0) * timesWatched;
      }, 0);
    }
  }

  return 0;
}

export function getSerieTotalTimesWatched(serie: Serie): number {
  if (serie.seasons && serie.seasons.length > 0) {
    return serie.seasons.reduce(
      (sum, season) =>
        sum + normalizedSeasonTimesWatched(season.seasonTimesWatched),
      0
    );
  }
  return 0;
}

/** Watchlist : aucune saison commencée (pas en cours, pas vue). */
export function isSerieWatchlistNotStarted(serie: Serie): boolean {
  const seasons = serie.seasons ?? [];
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
export function isSerieWatchlistInProgress(serie: Serie): boolean {
  const seasons = serie.seasons ?? [];
  if (seasons.length === 0) {
    return false;
  }
  return seasons.every((s) => isSeasonWatching(s));
}

/** Dernière saison marquée comme vue au moins une fois complètement (≥1). */
export function getLastFullyWatchedSeasonNumber(serie: Serie): number {
  let maxN = 0;
  for (const s of serie.seasons ?? []) {
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
export function getSerieLatestSeasonLastViewedTime(serie: Serie): number {
  const info = getSerieLastViewedSeasonInfo(serie);
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
  serie: Serie
): number | null {
  const dataLen = serie.seasonsData?.length ?? 0;
  if (dataLen === 0) {
    return null;
  }
  const N = getLastFullyWatchedSeasonNumber(serie);
  if (N < 1) {
    return null;
  }
  const next = N + 1;
  if (next > dataLen) {
    return null;
  }
  const row = (serie.seasons ?? []).find((s) => s.seasonNumber === next);
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
export function serieShowsNewSeasonStartedButton(serie: Serie): boolean {
  return getNextSeasonNumberForNewSeasonStarted(serie) !== null;
}

/**
 * Série du fichier vus + au moins une saison en cours : affichage aussi dans « En cours ».
 * (Distinct de la watchlist où toutes les saisons sont en watching sans saison ≥1.)
 */
export function isSerieFinishedWithNewSeasonInProgress(serie: Serie): boolean {
  const seasons = serie.seasons ?? [];
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

export function getSerieAverageRating(serie: Serie): number {
  if (serie.seasons && serie.seasons.length > 0) {
    const ratings = serie.seasons.map((season) => season.seasonRating || 0);
    const hasAnyRating = ratings.some((rating) => rating > 0);
    if (!hasAnyRating) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return total / ratings.length;
  }
  return 0;
}
