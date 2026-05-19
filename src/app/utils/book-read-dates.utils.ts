import type { Book } from '../models/book-model';

/** Dates de lecture prises en compte dans le graphique « livres lus par an ». */
export function collectBookReadDatesForChart(
  book: Book,
  includeRereads = true
): string[] {
  if (!includeRereads) {
    return book.firstReadDate ? [book.firstReadDate] : [];
  }

  const readTimes = book.readTimes ?? 1;

  if (readTimes <= 1) {
    const dateStr = book.lastReadDate || book.firstReadDate;
    return dateStr ? [dateStr] : [];
  }

  const dates: string[] = [];
  const primaryDates = new Set<string>();

  if (book.firstReadDate) {
    dates.push(book.firstReadDate);
    primaryDates.add(book.firstReadDate);
  }
  if (book.lastReadDate) {
    if (book.lastReadDate !== book.firstReadDate) {
      dates.push(book.lastReadDate);
    }
    primaryDates.add(book.lastReadDate);
  }

  for (const date of book.otherReadDates ?? []) {
    if (date && !primaryDates.has(date) && !dates.includes(date)) {
      dates.push(date);
    }
  }

  return dates;
}

/**
 * Années de lecture à compter pour le graphique « livres lus par an ».
 * @param includeRereads Si false, uniquement firstReadDate (un livre = une entrée max).
 */
export function getBookReadYearsForChart(
  book: Book,
  includeRereads = true
): number[] {
  return collectBookReadDatesForChart(book, includeRereads)
    .map((dateStr) => new Date(dateStr).getFullYear())
    .filter((year) => !Number.isNaN(year));
}

/** Lectures déclarées (readTimes) sans date associée dans le graphique. */
export function getBookUndatedReadCountForChart(book: Book): number {
  const readTimes = book.readTimes ?? 1;
  const datedCount = collectBookReadDatesForChart(book, true).length;
  return Math.max(0, readTimes - datedCount);
}
