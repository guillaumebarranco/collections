import { Serie } from '../models/serie-model';

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
 * Les saisons à 0 ou 0.5 seules ne comptent pas ; une entrée = une série (pas une saison).
 */
export function countSeriesSeenForBadges(
  rows: ReadonlyArray<{
    title?: string;
    director?: string;
    seasons?: ReadonlyArray<{ seasonTimesWatched?: number }>;
  }>
): number {
  const keys = new Set<string>();
  for (const r of rows) {
    const t = (r.title ?? '').trim();
    const d = (r.director ?? '').trim();
    if (!t || !d) continue;
    const seen = (r.seasons ?? []).some(
      (s) => Number(s.seasonTimesWatched ?? 0) >= 1
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
        season.seasonTimesWatched || 0,
      ])
    );
    const totalSeasonTimes = serie.seasons.reduce(
      (sum, season) => sum + (season.seasonTimesWatched || 0),
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
      (sum, season) => sum + (season.seasonTimesWatched || 0),
      0
    );
  }
  return 0;
}

/** Watchlist : aucune saison commencée (toutes à 0). */
export function isSerieWatchlistNotStarted(serie: Serie): boolean {
  const seasons = serie.seasons ?? [];
  if (seasons.length === 0) {
    return true;
  }
  return seasons.every((s) => (s.seasonTimesWatched ?? 0) === 0);
}

/** Watchlist : marquée « en cours » (chaque saison à 0.5), comme readTimes 0.5 pour les livres. */
export function isSerieWatchlistInProgress(serie: Serie): boolean {
  const seasons = serie.seasons ?? [];
  if (seasons.length === 0) {
    return false;
  }
  return seasons.every((s) => (s.seasonTimesWatched ?? 0) === 0.5);
}

/** Dernière saison marquée comme vue au moins une fois complètement (≥1). */
export function getLastFullyWatchedSeasonNumber(serie: Serie): number {
  let maxN = 0;
  for (const s of serie.seasons ?? []) {
    if ((s.seasonTimesWatched ?? 0) >= 1) {
      maxN = Math.max(maxN, s.seasonNumber);
    }
  }
  return maxN;
}

/**
 * Horodatage (ms) le plus récent parmi les `lastViewedDate` des saisons
 * avec visionnage réel (seasonTimesWatched > 0 : en cours ou terminé).
 * Ignore les saisons à 0 même si une date parasite est présente (ex. padding UI).
 * 0 si aucune date valide (tri : séries sans historique en fin de liste).
 */
export function getSerieLatestSeasonLastViewedTime(serie: Serie): number {
  let max = 0;
  for (const s of serie.seasons ?? []) {
    if (Number(s.seasonTimesWatched ?? 0) <= 0) {
      continue;
    }
    const raw = s.lastViewedDate?.trim();
    if (!raw) continue;
    const t = new Date(raw).getTime();
    if (!Number.isNaN(t) && t > max) {
      max = t;
    }
  }
  return max;
}

/**
 * Saison N+1 à passer à 0.5 : N = dernière saison complètement vue, la suivante existe en base et est encore à 0.
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
  const tw = row?.seasonTimesWatched ?? 0;
  if (tw >= 1 || tw === 0.5) {
    return null;
  }
  if (tw !== 0) {
    return null;
  }
  return next;
}

/** Fichier « vus » : une nouvelle saison est disponible et peut être marquée « en cours » (0.5). */
export function serieShowsNewSeasonStartedButton(serie: Serie): boolean {
  return getNextSeasonNumberForNewSeasonStarted(serie) !== null;
}

/**
 * Série du fichier vus + au moins une saison en cours (0.5) : affichage aussi dans « En cours ».
 * (Distinct de la watchlist où toutes les saisons sont à 0.5 sans saison ≥1.)
 */
export function isSerieFinishedWithNewSeasonInProgress(serie: Serie): boolean {
  const seasons = serie.seasons ?? [];
  if (seasons.length === 0) {
    return false;
  }
  let hasComplete = false;
  let hasHalf = false;
  for (const s of seasons) {
    const tw = s.seasonTimesWatched ?? 0;
    if (tw >= 1) {
      hasComplete = true;
    }
    if (tw === 0.5) {
      hasHalf = true;
    }
  }
  return hasComplete && hasHalf;
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
