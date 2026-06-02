import type { UserSerieSeason } from '../models/serie-model';

/** Livre / manga / manwha en cours de lecture (propriété dédiée ou legacy readTimes 0.5). */
export function isReading(item: {
  reading: boolean;
  readTimes?: number;
}): boolean {
  if (item.reading === true) {
    return true;
  }
  return (item.readTimes ?? 0) === 0.5;
}

/** Nombre de lectures entier (ignore le legacy 0.5 « en cours »). */
export function normalizedReadTimes(readTimes?: number): number {
  const rt = readTimes ?? 0;
  return rt === 0.5 ? 0 : rt;
}

/** Saison en cours de visionnage (propriété dédiée ou legacy seasonTimesWatched 0.5). */
export function isSeasonWatching(season: {
  watching: boolean;
  seasonTimesWatched?: number;
}): boolean {
  if (season.watching === true) {
    return true;
  }
  return (season.seasonTimesWatched ?? 0) === 0.5;
}

/** Visionnages complets d'une saison (ignore le legacy 0.5). */
export function normalizedSeasonTimesWatched(
  seasonTimesWatched?: number
): number {
  const tw = seasonTimesWatched ?? 0;
  return tw === 0.5 ? 0 : tw;
}

export function seasonHasViewingActivity(season: UserSerieSeason): boolean {
  return (
    isSeasonWatching(season) ||
    normalizedSeasonTimesWatched(season.seasonTimesWatched) > 0
  );
}
