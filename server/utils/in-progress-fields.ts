/** Normalise readTimes / reading (legacy 0.5 = en cours). */
export function parseReadingFromFile(
  readTimesRaw: number,
  readingRaw: boolean | null
): { readTimes: number; reading: boolean } {
  let readTimes = readTimesRaw;
  let reading = readingRaw ?? false;
  if (readTimes === 0.5) {
    reading = true;
    readTimes = 0;
  }
  return { readTimes, reading };
}

/** Normalise seasonTimesWatched / watching (legacy 0.5 = en cours). */
export function parseWatchingFromFile(
  seasonTimesWatchedRaw: number,
  watchingRaw: boolean | null
): { seasonTimesWatched: number; watching: boolean } {
  let seasonTimesWatched = seasonTimesWatchedRaw;
  let watching = watchingRaw ?? false;
  if (seasonTimesWatched === 0.5) {
    watching = true;
    seasonTimesWatched = 0;
  }
  return { seasonTimesWatched, watching };
}

export function formatReadingTsLine(reading: boolean): string {
  return `    reading: ${reading},\n`;
}

export function formatWatchingTsLine(watching: boolean): string {
  return `      watching: ${watching},\n`;
}
