import type { Movie } from '../models/movie-model';

/** Dates de visionnage prises en compte dans le graphique « films vus par an ». */
export function collectMovieSeenDatesForChart(
  movie: Movie,
  includeRewatches = true
): string[] {
  if (!includeRewatches) {
    return movie.firstViewedDate ? [movie.firstViewedDate] : [];
  }

  const timesWatched = movie.timesWatched ?? 1;

  if (timesWatched <= 1) {
    const dateStr = movie.lastViewedDate || movie.firstViewedDate;
    return dateStr ? [dateStr] : [];
  }

  const dates: string[] = [];
  const primaryDates = new Set<string>();

  if (movie.firstViewedDate) {
    dates.push(movie.firstViewedDate);
    primaryDates.add(movie.firstViewedDate);
  }
  if (movie.lastViewedDate) {
    if (movie.lastViewedDate !== movie.firstViewedDate) {
      dates.push(movie.lastViewedDate);
    }
    primaryDates.add(movie.lastViewedDate);
  }

  for (const date of movie.otherSeenDates ?? []) {
    if (date && !primaryDates.has(date) && !dates.includes(date)) {
      dates.push(date);
    }
  }

  return dates;
}

/**
 * Années de visionnage à compter pour le graphique « films vus par an ».
 * @param includeRewatches Si false, uniquement firstViewedDate (un film = une entrée max).
 */
export function getMovieSeenYearsForChart(
  movie: Movie,
  includeRewatches = true
): number[] {
  return collectMovieSeenDatesForChart(movie, includeRewatches)
    .map((dateStr) => new Date(dateStr).getFullYear())
    .filter((year) => !Number.isNaN(year));
}

/** Visionnages déclarés (timesWatched) sans date associée dans le graphique. */
export function getMovieUndatedSeenCountForChart(movie: Movie): number {
  const timesWatched = movie.timesWatched ?? 1;
  const datedCount = collectMovieSeenDatesForChart(movie, true).length;
  return Math.max(0, timesWatched - datedCount);
}
