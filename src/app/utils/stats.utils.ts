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
}

export interface ItemWithTomes {
  nbTomes?: number;
  readTimes?: number;
  title: string;
}

export interface ItemWithGameLength {
  title: string;
  averageTimeToFinish: number;
  timesFinished: number;
  additionnalEstimatedTime: number;
}

// Estimation : 2 minutes par page en moyenne
export const MINUTES_PER_PAGE = 2;
// Estimation : 200 pages par tome de manga en moyenne
export const PAGES_PER_MANGA_TOME = 200;
// Estimation : 30 minutes par tome de manga en moyenne
export const MINUTES_PER_MANGA_TOME = 30;

export function formatTimeStats(totalMinutes: number): TimeStats {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  let formatted = '';
  if (days > 0) formatted += `${days} jours`;
  if (hours > 0) formatted += (formatted ? ', ' : '') + `${hours} heures`;
  if (minutes > 0) formatted += (formatted ? ' et ' : '') + `${minutes} minutes`;
  if (!formatted) formatted = '0 minutes';
  return { days, hours, minutes, formatted };
}

export function getTotalWatchingTime(items: ItemWithLength[]): TimeStats {
  let totalMinutes = 0;
  for (const item of items) {
    const length = item.length || item.totalLength;
    if (length && item.timesWatched) {
      totalMinutes += length * item.timesWatched;
    } else {
      console.log(`Missing data for: ${item.title}`);
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
    } else {
      console.log(`Missing data for: ${item.title}`);
    }
  }
  return formatTimeStats(totalMinutes);
}

export function getTotalPages(items: ItemWithPages[]): number {
  let totalPages = 0;
  for (const item of items) {
    if (item.pages) {
      totalPages += item.pages;
    } else {
      console.log(`Missing pages for: ${item.title}`);
    }
  }
  return totalPages;
}

export function getTotalPagesRead(items: ItemWithPages[]): number {
  let totalPages = 0;
  for (const item of items) {
    if (item.pages && item.readTimes) {
      totalPages += item.pages * item.readTimes;
    } else {
      console.log(`Missing data for: ${item.title}`);
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
    } else {
      console.log(`Missing tomes for: ${item.title}`);
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
    } else {
      console.log(`Missing tomes for: ${item.title}`);
    }
  }
  return totalTomes;
}

export function getEstimatedReadingTime(items: ItemWithPages[]): TimeStats {
  const totalPagesRead = getTotalPagesRead(items);
  const totalMinutes = totalPagesRead * MINUTES_PER_PAGE;
  return formatTimeStats(totalMinutes);
}

export function getEstimatedMangaReadingTime(items: ItemWithTomes[]): TimeStats {
  let totalMinutes = 0;
  for (const item of items) {
    if (item.nbTomes) {
      const minutesPerRead = item.nbTomes * MINUTES_PER_MANGA_TOME;
      const readTimes = item.readTimes || 1;
      totalMinutes += minutesPerRead * readTimes;
    } else {
      console.log(`Missing tomes for: ${item.title}`);
    }
  }
  return formatTimeStats(totalMinutes);
}