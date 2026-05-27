import type { Book } from '../models/book-model';
import {
  type ScanTrackingPeriod,
  SCAN_CHART_START_YEAR,
  parseActivityDate,
} from './dashboard-monthly-activity.utils';

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

export type BookChartListEntry = {
  title: string;
  author: string;
};

/** Chaque lecture datée = une barre d’un jour (relectures = barres distinctes). */
export function getBookReadTrackingPeriods(
  books: Book[],
  includeRereads = true,
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date(),
): ScanTrackingPeriod[] {
  const rangeStart = new Date(startYear, 0, 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(reference);
  rangeEnd.setHours(23, 59, 59, 999);

  const periods: ScanTrackingPeriod[] = [];

  for (const book of books) {
    const parsedDates = collectBookReadDatesForChart(book, includeRereads)
      .map((dateStr) => parseActivityDate(dateStr))
      .filter((date): date is Date => date !== null)
      .sort((a, b) => a.getTime() - b.getTime());

    const showReadNumber = parsedDates.length > 1;

    parsedDates.forEach((readDate, index) => {
      const dayStart = new Date(readDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      if (
        dayEnd.getTime() < rangeStart.getTime() ||
        dayStart.getTime() > rangeEnd.getTime()
      ) {
        return;
      }

      const key = `read:${book.title}|${book.author}|${index}`;
      const label = showReadNumber
        ? `${book.title} (lecture ${index + 1})`
        : book.title;

      periods.push({
        key,
        label,
        start: dayStart,
        end: dayEnd,
        trackingKind: 'book-read',
      });
    });
  }

  return periods.sort(
    (a, b) =>
      a.start.getTime() - b.start.getTime() ||
      a.label.localeCompare(b.label, 'fr'),
  );
}

/** Livres lus sans aucune date de lecture pour le graphique timeline. */
export function getBooksUndatedForReadingChart(
  books: Book[],
): BookChartListEntry[] {
  return books
    .filter((book) => (book.readTimes ?? 0) > 0)
    .filter((book) => collectBookReadDatesForChart(book, true).length === 0)
    .map((book) => ({ title: book.title, author: book.author }))
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}
