import type { Book } from '../models/book-model';
import type { Bd } from '../models/bd-model';
import type { Movie } from '../models/movie-model';

export const APPROXIMATE_DATE_BADGE_LABEL = 'Date approximative';

/** Première lecture antérieure à cette date → date approximative. */
export const BOOK_APPROXIMATE_DATE_CUTOFF = '2023-01-01';

/** Première vision (hors cinéma) antérieure à cette date → date approximative. */
export const MOVIE_APPROXIMATE_DATE_CUTOFF = '2015-01-01';

/** Lecture de BD antérieure à cette date → date approximative. */
export const BD_APPROXIMATE_DATE_CUTOFF = '2020-01-01';

function isValidIsoDate(raw: string | undefined | null): boolean {
  if (raw == null || typeof raw !== 'string') {
    return false;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(raw.trim());
}

export function isBookApproximateReadDate(book: Book): boolean {
  if ((book.readTimes ?? 0) <= 0) {
    return false;
  }
  const date = book.firstReadDate?.trim();
  if (!isValidIsoDate(date)) {
    return false;
  }
  return date! < BOOK_APPROXIMATE_DATE_CUTOFF;
}

export function isMovieApproximateViewDate(movie: Movie): boolean {
  if ((movie.timesWatched ?? 0) <= 0) {
    return false;
  }
  if (movie.seenAtCinema) {
    return false;
  }
  const date = movie.firstViewedDate?.trim();
  if (!isValidIsoDate(date)) {
    return false;
  }
  return date! < MOVIE_APPROXIMATE_DATE_CUTOFF;
}

export function isBdApproximateReadDate(bd: Bd): boolean {
  if ((bd.readTimes ?? 0) <= 0) {
    return false;
  }
  const date = bd.readDate?.trim();
  if (!isValidIsoDate(date)) {
    return false;
  }
  return date! < BD_APPROXIMATE_DATE_CUTOFF;
}
