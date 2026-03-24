export interface TimeStats {
  days: number;
  hours: number;
  minutes: number;
  formatted: string;
}

export interface ItemWithLength {
  length?: number;
  totalLength?: number;
  timesWatched?: number;
  title: string;
}

export interface ItemWithPages {
  pages?: number;
  readTimes?: number;
  title: string;
  nbChapters?: number;
}

export interface ItemWithTomes {
  nbTomes?: number;
  readTimes?: number;
  title: string;
}

export interface ItemWithGameLength {
  title: string;
  averageTimeToFinish: number;
  platined: boolean;
  timesFinished: number;
  timesFinishedHundredPercent: number;
  additionnalEstimatedTime: number;
  platineTime: number;
  averageTimeToHundredPercent: number;
}

export function capitalizeFirstLetter(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// Estimation : 1 minute 30s par page en moyenne
export const MINUTES_PER_PAGE = 1.5;
export const SECONDS_PER_COMIC_PAGE = 20;
// Estimation : 200 pages par tome de manga en moyenne
export const PAGES_PER_MANGA_TOME = 200;
export const PAGES_PER_MANWHA_CHAPTER = 30;
export const MINUTES_PER_MANWHA_CHAPTER = 5;
// Estimation : 30 minutes par tome de manga en moyenne
export const MINUTES_PER_MANGA_TOME = 30;

export function formatTimeStats(totalMinutes: number): TimeStats {
  // Arrondir totalMinutes à l'entier le plus proche pour éviter les décimales dans les minutes
  const roundedMinutes = Math.round(totalMinutes);
  const days = Math.floor(roundedMinutes / (24 * 60));
  const hours = Math.floor((roundedMinutes % (24 * 60)) / 60);
  const minutes = Math.round(roundedMinutes % 60);
  let formatted = '';
  if (days > 0) formatted += `${days} jours`;
  if (hours > 0) formatted += (formatted ? ', ' : '') + `${hours} heures`;
  if (minutes > 0)
    formatted += (formatted ? ' et ' : '') + `${minutes} minutes`;
  if (!formatted) formatted = '0 minutes';
  return { days, hours, minutes, formatted };
}

export function getTotalWatchingTime(items: ItemWithLength[]): TimeStats {
  let totalMinutes = 0;
  for (const item of items) {
    const length = item.length || item.totalLength;
    if (length && item.timesWatched) {
      totalMinutes += length * item.timesWatched;
    }
  }
  return formatTimeStats(totalMinutes);
}

export function getTotalDuration(items: ItemWithLength[]): TimeStats {
  let totalMinutes = 0;
  for (const item of items) {
    const length = item.length || item.totalLength;
    if (length) {
      totalMinutes += length;
    }
  }
  return formatTimeStats(totalMinutes);
}

export function getTotalPages(items: ItemWithPages[]): number {
  let totalPages = 0;
  for (const item of items) {
    if (item.pages) {
      totalPages += item.pages;
    }
  }
  return totalPages;
}

export function getTotalPagesRead(items: ItemWithPages[]): number {
  let totalPages = 0;
  for (const item of items) {
    if (item.pages && item.readTimes) {
      totalPages += item.pages * item.readTimes;
    }
  }
  return totalPages;
}

export function getTotalMangaPages(items: ItemWithTomes[]): number {
  let totalPages = 0;
  for (const item of items) {
    if (item.nbTomes) {
      const pagesPerRead = item.nbTomes * PAGES_PER_MANGA_TOME;
      const readTimes = item.readTimes || 1;
      totalPages += pagesPerRead * readTimes;
    }
  }
  return totalPages;
}

export function getTotalComicsPages(items: ItemWithPages[]): number {
  let totalPages = 0;
  for (const item of items) {
    if (item.pages) {
      totalPages += item.pages * (item.readTimes || 1);
    }
  }
  return totalPages;
}

export function getTotalBdPages(items: ItemWithPages[]): number {
  let totalPages = 0;
  for (const item of items) {
    if (item.pages) {
      totalPages += item.pages * (item.readTimes || 1);
    }
  }
  return totalPages;
}

export function getTotalMangaTomesRead(items: ItemWithTomes[]): number {
  let totalTomes = 0;
  for (const item of items) {
    if (item.nbTomes) {
      const readTimes = item.readTimes || 1;
      totalTomes += item.nbTomes * readTimes;
    }
  }
  return totalTomes;
}

export function getTotalComicsTomesRead(items: ItemWithTomes[]): number {
  let totalTomes = 0;
  for (const item of items) {
    if (item.nbTomes) {
      const readTimes = item.readTimes || 1;
      totalTomes += item.nbTomes * readTimes;
    }
  }
  return totalTomes;
}

export function getTotalManwhasPages(items: ItemWithPages[]): number {
  let totalPages = 0;
  for (const item of items) {
    if (item.nbChapters) {
      const readTimes = item.readTimes || 1;
      totalPages += item.nbChapters * PAGES_PER_MANWHA_CHAPTER * readTimes;
    }
  }
  return totalPages;
}

export function getTotalManwhasChaptersRead(items: ItemWithPages[]): number {
  let totalChapters = 0;
  for (const item of items) {
    if (item.nbChapters && item.readTimes) {
      totalChapters += item.nbChapters * item.readTimes;
    }
  }
  return totalChapters;
}

export function getEstimatedReadingTime(items: ItemWithPages[]): TimeStats {
  const totalPagesRead = getTotalPagesRead(items);
  const totalMinutes = totalPagesRead * MINUTES_PER_PAGE;
  return formatTimeStats(totalMinutes);
}

export function getEstimatedMangaReadingTime(
  items: ItemWithTomes[]
): TimeStats {
  let totalMinutes = 0;
  for (const item of items) {
    if (item.nbTomes) {
      const minutesPerRead = item.nbTomes * MINUTES_PER_MANGA_TOME;
      const readTimes = item.readTimes || 1;
      totalMinutes += minutesPerRead * readTimes;
    }
  }
  return formatTimeStats(totalMinutes);
}

export function getEstimatedManwhaReadingTime(
  items: ItemWithPages[]
): TimeStats {
  let totalMinutes = 0;
  for (const item of items) {
    if (item.nbChapters) {
      const minutesPerChapter = item.nbChapters * MINUTES_PER_MANWHA_CHAPTER;
      const readTimes = item.readTimes || 1;
      totalMinutes += minutesPerChapter * readTimes;
    }
  }
  return formatTimeStats(totalMinutes);
}

export function getEstimatedComicsReadingTime(
  items: ItemWithPages[]
): TimeStats {
  let totalMinutes = 0;
  for (const item of items) {
    if (item.pages) {
      const minutesPerRead = (item.pages * SECONDS_PER_COMIC_PAGE) / 60;
      const readTimes = item.readTimes || 1;
      totalMinutes += minutesPerRead * readTimes;
    }
  }
  return formatTimeStats(totalMinutes);
}

export function getEstimatedBdReadingTime(items: ItemWithPages[]): TimeStats {
  let totalMinutes = 0;
  for (const item of items) {
    if (item.pages) {
      const minutesPerRead = (item.pages * SECONDS_PER_COMIC_PAGE) / 60;
      const readTimes = item.readTimes || 1;
      totalMinutes += minutesPerRead * readTimes;
    }
  }
  return formatTimeStats(totalMinutes);
}
