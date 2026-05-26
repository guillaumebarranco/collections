import type { Book } from '../models/book-model';
import type { Movie } from '../models/movie-model';
import type { Manga } from '../models/manga-model';
import type { Comic } from '../models/comic-model';
import type { Bd } from '../models/bd-model';
import type { Manwha } from '../models/manwha-model';
import type { Serie } from '../models/serie-model';
import type { Game, UserGameSession } from '../models/game-model';
import type { Music } from '../models/music-model';
import { getGamePlayedHoursFromSessions } from './games.utils';
import {
  isBdApproximateReadDate,
  isBookApproximateReadDate,
  isMovieApproximateViewDate,
} from './approximate-date-badges.utils';

export type ActivityCounts = {
  books: number;
  mangas: number;
  comics: number;
  bds: number;
  manwhas: number;
  movies: number;
  series: number;
  games: number;
};

export type ActivityMovieViewBadge = 'first' | 'rewatch';

export type ActivityMovieSample = {
  line: string;
  viewBadge: ActivityMovieViewBadge;
  showCinemaBadge: boolean;
  showApproximateDateBadge: boolean;
};

export type ActivityBookReadBadge = 'first' | 'reread';

export type ActivityBookSample = {
  line: string;
  readBadge: ActivityBookReadBadge;
  showApproximateDateBadge: boolean;
};

export type ActivityScanEndBadge = 'finished' | 'stopped';

export type ActivityMangaSample = {
  line: string;
  showScanBadge: boolean;
  scanEndBadge: ActivityScanEndBadge | null;
};

export type ActivityManwhaSample = {
  line: string;
  showScanBadge: boolean;
  scanEndBadge: ActivityScanEndBadge | null;
};

export type ActivityBdSample = {
  line: string;
  showApproximateDateBadge: boolean;
};

export type ActivitySerieViewBadge = 'first' | 'rewatch';

export type ActivitySerieSample = {
  line: string;
  viewBadge: ActivitySerieViewBadge;
};

export type ActivityGameSample = {
  line: string;
  showGameSessionBadge: boolean;
};

export type ActivitySamples = {
  books: ActivityBookSample[];
  mangas: ActivityMangaSample[];
  comics: string[];
  bds: ActivityBdSample[];
  manwhas: ActivityManwhaSample[];
  movies: ActivityMovieSample[];
  series: ActivitySerieSample[];
  games: ActivityGameSample[];
};

export type ActivityWindowResult = {
  counts: ActivityCounts;
  samples: ActivitySamples;
};

export type CalendarMonthRange = {
  key: string;
  label: string;
  rangeStart: Date;
  rangeEnd: Date;
};

const MAX_SAMPLES = 12;

export function parseActivityDate(raw: string | undefined | null): Date | null {
  if (raw == null || typeof raw !== 'string') {
    return null;
  }
  const s = raw.trim();
  if (!s) {
    return null;
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (iso) {
    const y = Number(iso[1]);
    const m = Number(iso[2]) - 1;
    const d = Number(iso[3]);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
      return null;
    }
    const dt = new Date(y, m, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d) {
      return null;
    }
    return dt;
  }
  const t = Date.parse(s);
  if (Number.isNaN(t)) {
    return null;
  }
  return new Date(t);
}

export function isInInclusiveRange(d: Date, start: Date, end: Date): boolean {
  const t = d.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

/** Fenêtre glissante : 30 jours calendaires incluant aujourd’hui (aujourd’hui + 29 jours précédents, minuit → fin de journée). */
export function getRolling30DaysRange(reference = new Date()): {
  start: Date;
  end: Date;
} {
  const end = new Date(reference);
  end.setHours(23, 59, 59, 999);
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 29);
  return { start, end };
}

function buildCalendarMonthRange(y: number, m: number): CalendarMonthRange {
  const rangeStart = new Date(y, m, 1, 0, 0, 0, 0);
  const rangeEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
  const key = `${y}-${String(m + 1).padStart(2, '0')}`;
  const rawLabel = rangeStart.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
  const label =
    rawLabel.length > 0
      ? rawLabel.charAt(0).toLocaleUpperCase('fr-FR') + rawLabel.slice(1)
      : key;
  return { key, label, rangeStart, rangeEnd };
}

/** Mois calendaires complets : du 1er au dernier jour, les 12 derniers mois en partant du mois courant. */
export function getLast12CalendarMonths(
  reference = new Date()
): CalendarMonthRange[] {
  const out: CalendarMonthRange[] = [];
  let y = reference.getFullYear();
  let m = reference.getMonth();
  for (let i = 0; i < 12; i++) {
    out.push(buildCalendarMonthRange(y, m));
    m -= 1;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
  }
  return out;
}

/** Les 12 mois d'une année civile (décembre → janvier). */
export function getCalendarMonthsForYear(year: number): CalendarMonthRange[] {
  const out: CalendarMonthRange[] = [];
  for (let m = 11; m >= 0; m--) {
    out.push(buildCalendarMonthRange(year, m));
  }
  return out;
}

/** Plage calendaire d'une année civile complète (1er janv. → 31 déc.). */
export function getCalendarYearRange(year: number): {
  rangeStart: Date;
  rangeEnd: Date;
} {
  return {
    rangeStart: new Date(year, 0, 1, 0, 0, 0, 0),
    rangeEnd: new Date(year, 11, 31, 23, 59, 59, 999),
  };
}

/** Union des mois affichés (du plus ancien au plus récent). */
export function getCalendarMonthsUnionRange(
  months: CalendarMonthRange[]
): { rangeStart: Date; rangeEnd: Date } | null {
  if (months.length === 0) {
    return null;
  }
  let rangeStart = months[0].rangeStart;
  let rangeEnd = months[0].rangeEnd;
  for (const m of months) {
    if (m.rangeStart.getTime() < rangeStart.getTime()) {
      rangeStart = m.rangeStart;
    }
    if (m.rangeEnd.getTime() > rangeEnd.getTime()) {
      rangeEnd = m.rangeEnd;
    }
  }
  return { rangeStart, rangeEnd };
}

export const YEAR_TAB_PREFIX = 'year-';

export function yearTabValue(year: number): string {
  return `${YEAR_TAB_PREFIX}${year}`;
}

export function parseYearTabValue(value: string): number | null {
  if (!value.startsWith(YEAR_TAB_PREFIX)) {
    return null;
  }
  const y = Number(value.slice(YEAR_TAB_PREFIX.length));
  if (!Number.isInteger(y) || y < 2000 || y > 2100) {
    return null;
  }
  return y;
}

/** Années des onglets : (année courante − 1) jusqu'à endYear inclus. */
export function getYearTabYears(
  reference = new Date(),
  endYear = 2000
): number[] {
  const start = reference.getFullYear() - 1;
  const years: number[] = [];
  for (let y = start; y >= endYear; y--) {
    years.push(y);
  }
  return years;
}

function takeSampleTitles(titles: string[]): string[] {
  return titles.slice(0, MAX_SAMPLES);
}

function takeMovieSamples(
  samples: ActivityMovieSample[]
): ActivityMovieSample[] {
  return samples.slice(0, MAX_SAMPLES);
}

function takeBookSamples(samples: ActivityBookSample[]): ActivityBookSample[] {
  return samples.slice(0, MAX_SAMPLES);
}

function takeMangaSamples(
  samples: ActivityMangaSample[]
): ActivityMangaSample[] {
  return samples.slice(0, MAX_SAMPLES);
}

function takeManwhaSamples(
  samples: ActivityManwhaSample[]
): ActivityManwhaSample[] {
  return samples.slice(0, MAX_SAMPLES);
}

function takeBdSamples(samples: ActivityBdSample[]): ActivityBdSample[] {
  return samples.slice(0, MAX_SAMPLES);
}

function takeSerieSamples(
  samples: ActivitySerieSample[]
): ActivitySerieSample[] {
  return samples.slice(0, MAX_SAMPLES);
}

function takeGameSamples(samples: ActivityGameSample[]): ActivityGameSample[] {
  return samples.slice(0, MAX_SAMPLES);
}

function formatBdSample(bd: Bd): ActivityBdSample {
  return {
    line: `${bd.title} — ${bd.writer}`,
    showApproximateDateBadge: isBdApproximateReadDate(bd),
  };
}

function formatBookSample(
  book: Book,
  rangeStart: Date,
  rangeEnd: Date
): ActivityBookSample {
  const first = parseActivityDate(book.firstReadDate);
  const firstInRange = Boolean(
    first && isInInclusiveRange(first, rangeStart, rangeEnd)
  );
  return {
    line: `${book.title} — ${book.author}`,
    readBadge: firstInRange ? 'first' : 'reread',
    showApproximateDateBadge: isBookApproximateReadDate(book),
  };
}

function formatMovieSample(
  movie: Movie,
  rangeStart: Date,
  rangeEnd: Date
): ActivityMovieSample {
  const first = parseActivityDate(movie.firstViewedDate);
  const firstInRange = Boolean(
    first && isInInclusiveRange(first, rangeStart, rangeEnd)
  );
  return {
    line: `${movie.title} — ${movie.director}`,
    viewBadge: firstInRange ? 'first' : 'rewatch',
    showCinemaBadge: Boolean(movie.seenAtCinema && firstInRange),
    showApproximateDateBadge: isMovieApproximateViewDate(movie),
  };
}

function bookHasActivityInRange(
  book: Book,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  if ((book.readTimes ?? 0) <= 0) {
    return false;
  }
  const dates = [
    book.firstReadDate,
    book.lastReadDate,
    ...(book.otherReadDates ?? []),
  ];
  return dates.some((raw) => {
    const d = parseActivityDate(raw);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
  });
}

function movieHasActivityInRange(
  movie: Movie,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  if ((movie.timesWatched ?? 0) <= 0) {
    return false;
  }
  const dates = [
    movie.firstViewedDate,
    movie.lastViewedDate,
    ...(movie.otherSeenDates ?? []),
  ];
  return dates.some((raw) => {
    const d = parseActivityDate(raw);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
  });
}

function readItemActivityDate(item: { readDate: string }): Date | null {
  return parseActivityDate(item.readDate);
}

export const SCAN_CHART_START_YEAR = 2000;

export type ScanTrackingPeriod = {
  key: string;
  label: string;
  start: Date;
  end: Date;
  /** Libellé de durée au survol (ex. temps de jeu d’une session). */
  durationLabel?: string;
  /** Préfixe de clé `oneshot:` pour les lectures sans suivi scan. */
  trackingKind?: 'scan' | 'one-shot';
};

/** Nombre de jours calendaires inclus entre deux dates d’activité. */
export function inclusiveActivityPeriodDays(start: Date, end: Date): number {
  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.max(
    1,
    Math.round((endDay.getTime() - startDay.getTime()) / msPerDay) + 1,
  );
}

/** Durée lisible : jours si moins d’un an, sinon années (décimale si besoin). */
export function formatActivityPeriodDurationLabel(
  start: Date,
  end: Date,
): string {
  const days = inclusiveActivityPeriodDays(start, end);
  if (days < 365) {
    return days === 1 ? '1 jour' : `${days} jours`;
  }

  const years = days / 365.25;
  const roundedTenth = Math.round(years * 10) / 10;
  const wholeYears = Math.round(roundedTenth);

  if (Math.abs(roundedTenth - wholeYears) < 0.05) {
    return wholeYears <= 1 ? '1 an' : `${wholeYears} ans`;
  }

  return `${roundedTenth.toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} ans`;
}

function buildScanTrackingPeriods<
  T extends {
    title: string;
    author: string;
    readTimes?: number;
    readingScanStartDate: string;
    endDate: string;
    readingScanStopDate: string;
  }
>(
  items: T[],
  getEndDate: (item: T, reference: Date) => Date,
  startYear: number,
  reference: Date
): ScanTrackingPeriod[] {
  const rangeStart = new Date(startYear, 0, 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(reference);
  rangeEnd.setHours(23, 59, 59, 999);

  const uniqueKeys = new Set<string>();
  const periods: ScanTrackingPeriod[] = [];

  for (const item of items) {
    if ((item.readTimes ?? 0) <= 0) {
      continue;
    }
    const scanStart = parseActivityDate(item.readingScanStartDate);
    if (!scanStart) {
      continue;
    }
    scanStart.setHours(0, 0, 0, 0);

    const key = `${item.title}|${item.author}`;
    if (uniqueKeys.has(key)) {
      continue;
    }
    uniqueKeys.add(key);

    const scanEnd = getEndDate(item, reference);
    if (scanEnd.getTime() < scanStart.getTime()) {
      continue;
    }
    if (
      scanEnd.getTime() < rangeStart.getTime() ||
      scanStart.getTime() > rangeEnd.getTime()
    ) {
      continue;
    }

    periods.push({
      key,
      label: item.title,
      start: scanStart,
      end: scanEnd,
      trackingKind: 'scan',
    });
  }

  return periods.sort(
    (a, b) =>
      a.start.getTime() - b.start.getTime() ||
      a.label.localeCompare(b.label, 'fr')
  );
}

function isMangaOneShotRead(manga: Manga): boolean {
  if ((manga.readTimes ?? 0) <= 0) {
    return false;
  }
  if (mangaHasReadingScanStart(manga)) {
    return false;
  }
  if (manga.readingScanStopDate.trim()) {
    return false;
  }
  return Boolean(parseActivityDate(manga.readDate));
}

/** Mangas lus en one shot : readDate renseignée, sans suivi scan. */
export function getMangaOneShotReadTrackingPeriods(
  mangas: Manga[],
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date(),
): ScanTrackingPeriod[] {
  const rangeStart = new Date(startYear, 0, 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(reference);
  rangeEnd.setHours(23, 59, 59, 999);

  const uniqueKeys = new Set<string>();
  const periods: ScanTrackingPeriod[] = [];

  for (const manga of mangas) {
    if (!isMangaOneShotRead(manga)) {
      continue;
    }
    const readDate = parseActivityDate(manga.readDate);
    if (!readDate) {
      continue;
    }
    readDate.setHours(0, 0, 0, 0);
    const readEnd = new Date(readDate);
    readEnd.setHours(23, 59, 59, 999);

    const key = `oneshot:${manga.title}|${manga.author}`;
    if (uniqueKeys.has(key)) {
      continue;
    }
    uniqueKeys.add(key);

    if (
      readEnd.getTime() < rangeStart.getTime() ||
      readDate.getTime() > rangeEnd.getTime()
    ) {
      continue;
    }

    periods.push({
      key,
      label: manga.title,
      start: readDate,
      end: readEnd,
      trackingKind: 'one-shot',
    });
  }

  return periods.sort(
    (a, b) =>
      a.start.getTime() - b.start.getTime() ||
      a.label.localeCompare(b.label, 'fr'),
  );
}

export function getMangaScanTrackingPeriods(
  mangas: Manga[],
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date()
): ScanTrackingPeriod[] {
  return buildScanTrackingPeriods(
    mangas,
    (manga, ref) => getMangaScanActivityEndDate(manga, ref),
    startYear,
    reference
  );
}

export function getMangaScanChartPeriods(
  mangas: Manga[],
  options: {
    includeScanTracking: boolean;
    includeOneShotReads: boolean;
    startYear?: number;
    reference?: Date;
  },
): ScanTrackingPeriod[] {
  const startYear = options.startYear ?? SCAN_CHART_START_YEAR;
  const reference = options.reference ?? new Date();
  const periods: ScanTrackingPeriod[] = [];

  if (options.includeScanTracking) {
    periods.push(...getMangaScanTrackingPeriods(mangas, startYear, reference));
  }
  if (options.includeOneShotReads) {
    periods.push(
      ...getMangaOneShotReadTrackingPeriods(mangas, startYear, reference),
    );
  }

  return periods.sort(
    (a, b) =>
      a.start.getTime() - b.start.getTime() ||
      a.label.localeCompare(b.label, 'fr'),
  );
}

export function getManwhaScanTrackingPeriods(
  manwhas: Manwha[],
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date()
): ScanTrackingPeriod[] {
  return buildScanTrackingPeriods(
    manwhas,
    (manwha, ref) => getManwhaScanActivityEndDate(manwha, ref),
    startYear,
    reference
  );
}

/** Mangas et manwhas réunis (clés distinctes par type pour éviter les collisions). */
export function getCombinedMangaManwhaScanTrackingPeriods(
  mangas: Manga[],
  manwhas: Manwha[],
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date()
): ScanTrackingPeriod[] {
  const mangaPeriods = getMangaScanTrackingPeriods(
    mangas,
    startYear,
    reference
  ).map((period) => ({
    ...period,
    key: `manga:${period.key}`,
  }));

  const manwhaPeriods = getManwhaScanTrackingPeriods(
    manwhas,
    startYear,
    reference
  ).map((period) => ({
    ...period,
    key: `manwha:${period.key}`,
  }));

  return [...mangaPeriods, ...manwhaPeriods].sort(
    (a, b) =>
      a.start.getTime() - b.start.getTime() ||
      a.label.localeCompare(b.label, 'fr')
  );
}

export type MangaChartListEntry = {
  title: string;
  author: string;
};

export function mangaHasAnyReadingChartDate(
  manga: Pick<Manga, 'readDate' | 'readingScanStartDate' | 'readingScanStopDate'>,
): boolean {
  return Boolean(
    parseActivityDate(manga.readDate) ||
      parseActivityDate(manga.readingScanStartDate) ||
      parseActivityDate(manga.readingScanStopDate),
  );
}

/** Mangas absents du graphique : readDate, readingScanStartDate et readingScanStopDate vides. */
export function getMangasUndatedForReadingChart(
  mangas: Manga[],
): MangaChartListEntry[] {
  return mangas
    .filter((manga) => !mangaHasAnyReadingChartDate(manga))
    .map((manga) => ({ title: manga.title, author: manga.author }))
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

/** Périodes de jeu par session (sessionStartDate / sessionEndDate) pour le graphique timeline. */
export function getGameSessionTrackingPeriods(
  games: Game[],
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date()
): ScanTrackingPeriod[] {
  const rangeStart = new Date(startYear, 0, 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(reference);
  rangeEnd.setHours(23, 59, 59, 999);

  const periods: ScanTrackingPeriod[] = [];

  for (const game of games) {
    const sessions = game.sessions ?? [];
    const datedSessionIndexes = sessions
      .map((session, index) => ({ session, index }))
      .filter(({ session }) => getGameSessionActivityStart(session) !== null);

    const showSessionNumber = datedSessionIndexes.length > 1;

    for (const { session, index } of datedSessionIndexes) {
      const sessionStart = getGameSessionActivityStart(session);
      if (!sessionStart) {
        continue;
      }
      const sessionEnd = getGameSessionActivityEnd(session, reference);
      if (!sessionEnd || sessionEnd.getTime() < sessionStart.getTime()) {
        continue;
      }
      if (
        sessionEnd.getTime() < rangeStart.getTime() ||
        sessionStart.getTime() > rangeEnd.getTime()
      ) {
        continue;
      }

      const key = `${game.title}|${game.editor}|${index}`;
      const label = showSessionNumber
        ? `${game.title} (session ${index + 1})`
        : game.title;

      periods.push({
        key,
        label,
        start: sessionStart,
        end: sessionEnd,
        durationLabel: formatActivityPeriodDurationLabel(
          sessionStart,
          sessionEnd,
        ),
      });
    }
  }

  return periods.sort(
    (a, b) =>
      a.start.getTime() - b.start.getTime() ||
      a.label.localeCompare(b.label, 'fr')
  );
}

export type GameChartListEntry = {
  title: string;
  editor: string;
};

export type GameChartPartialDatesEntry = GameChartListEntry & {
  undatedSessionsCount: number;
};

function gameSessionHasChartDate(session: UserGameSession): boolean {
  return getGameSessionActivityStart(session) !== null;
}

function getGameChartKey(game: Pick<Game, 'title' | 'editor'>): string {
  return `${game.title}|${game.editor}`;
}

/** Jeux absents du graphique : aucune session avec date de début ou de fin. */
export function getGamesMissingFromSessionChart(
  games: Game[],
): GameChartListEntry[] {
  return games
    .filter((game) =>
      (game.sessions ?? []).every((session) => !gameSessionHasChartDate(session)),
    )
    .map((game) => ({ title: game.title, editor: game.editor }))
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

/** Jeux présents sur le graphique avec au moins une session encore sans dates. */
export function getGamesWithUndatedSessionsOnChart(
  games: Game[],
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date(),
): GameChartPartialDatesEntry[] {
  const gamesOnChart = new Set(
    getGameSessionTrackingPeriods(games, startYear, reference).map((period) => {
      const lastPipe = period.key.lastIndexOf('|');
      return lastPipe >= 0 ? period.key.slice(0, lastPipe) : period.key;
    }),
  );

  return games
    .map((game) => {
      if (!gamesOnChart.has(getGameChartKey(game))) {
        return null;
      }
      const undatedSessionsCount = (game.sessions ?? []).filter(
        (session) => !gameSessionHasChartDate(session),
      ).length;
      if (undatedSessionsCount === 0) {
        return null;
      }
      return {
        title: game.title,
        editor: game.editor,
        undatedSessionsCount,
      };
    })
    .filter((entry): entry is GameChartPartialDatesEntry => entry !== null)
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

/**
 * Fin de la période scan :
 * 1. `readingScanStopDate` si renseignée (arrêt du suivi scan)
 * 2. sinon aujourd’hui si le manga est en cours (`endDate` vide)
 * 3. sinon la date de fin de parution du manga
 */
export function getMangaScanActivityEndDate(
  manga: Pick<Manga, 'endDate' | 'readingScanStopDate'>,
  reference = new Date()
): Date {
  const todayEnd = new Date(reference);
  todayEnd.setHours(23, 59, 59, 999);

  const userScanEnd = parseActivityDate(manga.readingScanStopDate);
  if (userScanEnd) {
    userScanEnd.setHours(23, 59, 59, 999);
    return userScanEnd.getTime() > todayEnd.getTime() ? todayEnd : userScanEnd;
  }

  const rawEnd = manga.endDate.trim();
  if (!rawEnd) {
    return todayEnd;
  }
  const parsed = parseActivityDate(rawEnd);
  if (!parsed) {
    return todayEnd;
  }
  parsed.setHours(23, 59, 59, 999);
  return parsed.getTime() < todayEnd.getTime() ? parsed : todayEnd;
}

export function mangaHasScanActivityInRange(
  manga: Manga,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): boolean {
  if ((manga.readTimes ?? 0) <= 0 || !mangaHasReadingScanStart(manga)) {
    return false;
  }
  const scanStart = parseActivityDate(manga.readingScanStartDate);
  if (!scanStart) {
    return false;
  }
  scanStart.setHours(0, 0, 0, 0);
  const scanEnd = getMangaScanActivityEndDate(manga, reference);
  if (scanEnd.getTime() < scanStart.getTime()) {
    return false;
  }
  return (
    scanStart.getTime() <= rangeEnd.getTime() &&
    scanEnd.getTime() >= rangeStart.getTime()
  );
}

function getScanEndBadge(
  item: {
    endDate: string;
    readingScanStopDate: string;
    readTimes?: number;
  },
  hasScanInRange: boolean,
  hasScanStart: boolean,
  getScanActivityEndDate: (reference: Date) => Date,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): ActivityScanEndBadge | null {
  if ((item.readTimes ?? 0) <= 0 || !hasScanStart) {
    return null;
  }
  if (!hasScanInRange) {
    return null;
  }

  const scanEnd = getScanActivityEndDate(reference);
  if (!isInInclusiveRange(scanEnd, rangeStart, rangeEnd)) {
    return null;
  }

  if (parseActivityDate(item.readingScanStopDate)) {
    return 'stopped';
  }

  const pubEnd = parseActivityDate(item.endDate.trim());
  if (!pubEnd) {
    return null;
  }
  pubEnd.setHours(23, 59, 59, 999);

  const todayEnd = new Date(reference);
  todayEnd.setHours(23, 59, 59, 999);
  if (pubEnd.getTime() >= todayEnd.getTime()) {
    return null;
  }

  if (
    scanEnd.getFullYear() === pubEnd.getFullYear() &&
    scanEnd.getMonth() === pubEnd.getMonth()
  ) {
    return 'finished';
  }

  return null;
}

function getMangaScanEndBadge(
  manga: Manga,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): ActivityScanEndBadge | null {
  return getScanEndBadge(
    manga,
    mangaHasScanActivityInRange(manga, rangeStart, rangeEnd, reference),
    mangaHasReadingScanStart(manga),
    (ref) => getMangaScanActivityEndDate(manga, ref),
    rangeStart,
    rangeEnd,
    reference
  );
}

function mangaReadDateInRange(
  manga: Manga,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  if ((manga.readTimes ?? 0) <= 0) {
    return false;
  }
  const d = readItemActivityDate(manga);
  return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
}

function formatMangaActivitySample(
  manga: Manga,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): ActivityMangaSample {
  const showScanBadge = mangaHasScanActivityInRange(
    manga,
    rangeStart,
    rangeEnd,
    reference
  );
  return {
    line: `${manga.title} — ${manga.author}`,
    showScanBadge,
    scanEndBadge: getMangaScanEndBadge(manga, rangeStart, rangeEnd, reference),
  };
}

function addMangaScanMinutesInRange(
  totalMinutes: number,
  scanSeen: Set<string>,
  manga: Manga,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): number {
  if ((manga.readTimes ?? 0) <= 0 || !mangaHasReadingScanStart(manga)) {
    return totalMinutes;
  }
  const scanStart = parseActivityDate(manga.readingScanStartDate);
  if (!scanStart) {
    return totalMinutes;
  }
  const scanEnd = getMangaScanActivityEndDate(manga, reference);
  const minutesPerMonth =
    MANGA_SCAN_CHAPTERS_PER_MONTH * MANGA_SCAN_MINUTES_PER_CHAPTER;
  const keyBase = `manga|${manga.title}|${manga.author}|scan`;

  let y = scanStart.getFullYear();
  let m = scanStart.getMonth();
  const endY = scanEnd.getFullYear();
  const endM = scanEnd.getMonth();

  while (y < endY || (y === endY && m <= endM)) {
    const monthStart = new Date(y, m, 1, 0, 0, 0, 0);
    const monthEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
    if (
      monthStart.getTime() <= rangeEnd.getTime() &&
      monthEnd.getTime() >= rangeStart.getTime()
    ) {
      const monthKey = `${keyBase}|${y}-${String(m + 1).padStart(2, '0')}`;
      if (!scanSeen.has(monthKey)) {
        scanSeen.add(monthKey);
        totalMinutes += minutesPerMonth;
      }
    }
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  return totalMinutes;
}

function hasReadingScanStart(item: { readingScanStartDate: string }): boolean {
  return Boolean(parseActivityDate(item.readingScanStartDate));
}

function mangaHasReadingScanStart(manga: Manga): boolean {
  return Boolean(parseActivityDate(manga.readingScanStartDate));
}

/**
 * Fin de la période scan manwha (même règles que pour les mangas).
 */
export function getManwhaScanActivityEndDate(
  manwha: Pick<Manwha, 'endDate' | 'readingScanStopDate'>,
  reference = new Date()
): Date {
  const todayEnd = new Date(reference);
  todayEnd.setHours(23, 59, 59, 999);

  const userScanEnd = parseActivityDate(manwha.readingScanStopDate);
  if (userScanEnd) {
    userScanEnd.setHours(23, 59, 59, 999);
    return userScanEnd.getTime() > todayEnd.getTime() ? todayEnd : userScanEnd;
  }

  const rawEnd = manwha.endDate.trim();
  if (!rawEnd) {
    return todayEnd;
  }
  const parsed = parseActivityDate(rawEnd);
  if (!parsed) {
    return todayEnd;
  }
  parsed.setHours(23, 59, 59, 999);
  return parsed.getTime() < todayEnd.getTime() ? parsed : todayEnd;
}

export function manwhaHasScanActivityInRange(
  manwha: Manwha,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): boolean {
  if ((manwha.readTimes ?? 0) <= 0 || !hasReadingScanStart(manwha)) {
    return false;
  }
  const scanStart = parseActivityDate(manwha.readingScanStartDate);
  if (!scanStart) {
    return false;
  }
  scanStart.setHours(0, 0, 0, 0);
  const scanEnd = getManwhaScanActivityEndDate(manwha, reference);
  if (scanEnd.getTime() < scanStart.getTime()) {
    return false;
  }
  return (
    scanStart.getTime() <= rangeEnd.getTime() &&
    scanEnd.getTime() >= rangeStart.getTime()
  );
}

function getManwhaScanEndBadge(
  manwha: Manwha,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): ActivityScanEndBadge | null {
  return getScanEndBadge(
    manwha,
    manwhaHasScanActivityInRange(manwha, rangeStart, rangeEnd, reference),
    hasReadingScanStart(manwha),
    (ref) => getManwhaScanActivityEndDate(manwha, ref),
    rangeStart,
    rangeEnd,
    reference
  );
}

function manwhaReadDateInRange(
  manwha: Manwha,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  if ((manwha.readTimes ?? 0) <= 0) {
    return false;
  }
  const d = readItemActivityDate(manwha);
  return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
}

function formatManwhaActivitySample(
  manwha: Manwha,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): ActivityManwhaSample {
  const showScanBadge = manwhaHasScanActivityInRange(
    manwha,
    rangeStart,
    rangeEnd,
    reference
  );
  return {
    line: `${manwha.title} — ${manwha.author}`,
    showScanBadge,
    scanEndBadge: getManwhaScanEndBadge(
      manwha,
      rangeStart,
      rangeEnd,
      reference
    ),
  };
}

function addManwhaScanMinutesInRange(
  totalMinutes: number,
  scanSeen: Set<string>,
  manwha: Manwha,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): number {
  if ((manwha.readTimes ?? 0) <= 0 || !hasReadingScanStart(manwha)) {
    return totalMinutes;
  }
  const scanStart = parseActivityDate(manwha.readingScanStartDate);
  if (!scanStart) {
    return totalMinutes;
  }
  const scanEnd = getManwhaScanActivityEndDate(manwha, reference);
  const minutesPerMonth =
    MANGA_SCAN_CHAPTERS_PER_MONTH * MANGA_SCAN_MINUTES_PER_CHAPTER;
  const keyBase = `manwha|${manwha.title}|${manwha.author}|scan`;

  let y = scanStart.getFullYear();
  let m = scanStart.getMonth();
  const endY = scanEnd.getFullYear();
  const endM = scanEnd.getMonth();

  while (y < endY || (y === endY && m <= endM)) {
    const monthStart = new Date(y, m, 1, 0, 0, 0, 0);
    const monthEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
    if (
      monthStart.getTime() <= rangeEnd.getTime() &&
      monthEnd.getTime() >= rangeStart.getTime()
    ) {
      const monthKey = `${keyBase}|${y}-${String(m + 1).padStart(2, '0')}`;
      if (!scanSeen.has(monthKey)) {
        scanSeen.add(monthKey);
        totalMinutes += minutesPerMonth;
      }
    }
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  return totalMinutes;
}

function seasonHasActivityInRange(
  season: Serie['seasons'][number],
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  if ((season.seasonTimesWatched ?? 0) <= 0) {
    return false;
  }
  const dates = [
    season.firstViewedDate,
    season.lastViewedDate,
    ...(season.otherViewedDates ?? []),
  ];
  return dates.some((raw) => {
    const d = parseActivityDate(raw);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
  });
}

function serieHasActivityInRange(
  serie: Serie,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  return (serie.seasons ?? []).some((s) =>
    seasonHasActivityInRange(s, rangeStart, rangeEnd)
  );
}

function formatSerieSampleLine(
  serie: Serie,
  rangeStart: Date,
  rangeEnd: Date
): string {
  const seasonNums = (serie.seasons ?? [])
    .filter((s) => seasonHasActivityInRange(s, rangeStart, rangeEnd))
    .map((s) => s.seasonNumber)
    .sort((a, b) => a - b);

  const base = `${serie.title} — ${serie.director}`;
  if (seasonNums.length === 0) {
    return base;
  }
  if (seasonNums.length === 1) {
    return `${base} — saison ${seasonNums[0]}`;
  }
  return `${base} — saisons ${seasonNums.join(', ')}`;
}

function formatSerieSample(
  serie: Serie,
  rangeStart: Date,
  rangeEnd: Date
): ActivitySerieSample {
  const activeSeasons = (serie.seasons ?? []).filter((s) =>
    seasonHasActivityInRange(s, rangeStart, rangeEnd)
  );
  const firstInRange = activeSeasons.some((s) => {
    const first = parseActivityDate(s.firstViewedDate);
    return Boolean(first && isInInclusiveRange(first, rangeStart, rangeEnd));
  });
  return {
    line: formatSerieSampleLine(serie, rangeStart, rangeEnd),
    viewBadge: firstInRange ? 'first' : 'rewatch',
  };
}

function getGameSessionActivityStart(session: UserGameSession): Date | null {
  const legacy = session as UserGameSession & { finishedSessionDate?: string };
  const start = parseActivityDate(session.sessionStartDate);
  if (start) {
    start.setHours(0, 0, 0, 0);
    return start;
  }
  const endOnly =
    parseActivityDate(session.sessionEndDate) ??
    parseActivityDate(legacy.finishedSessionDate);
  if (endOnly) {
    endOnly.setHours(0, 0, 0, 0);
    return endOnly;
  }
  return null;
}

function getGameSessionActivityEnd(
  session: UserGameSession,
  reference = new Date()
): Date | null {
  const legacy = session as UserGameSession & { finishedSessionDate?: string };
  const end =
    parseActivityDate(session.sessionEndDate) ??
    parseActivityDate(legacy.finishedSessionDate);
  if (end) {
    end.setHours(23, 59, 59, 999);
    return end;
  }
  const start = parseActivityDate(session.sessionStartDate);
  if (start || session.currentlyPlaying) {
    const todayEnd = new Date(reference);
    todayEnd.setHours(23, 59, 59, 999);
    return todayEnd;
  }
  return null;
}

export function gameSessionHasActivityInRange(
  session: UserGameSession,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): boolean {
  const sessionStart = getGameSessionActivityStart(session);
  if (!sessionStart) {
    return false;
  }
  const sessionEnd = getGameSessionActivityEnd(session, reference);
  if (!sessionEnd || sessionEnd.getTime() < sessionStart.getTime()) {
    return false;
  }
  return (
    sessionStart.getTime() <= rangeEnd.getTime() &&
    sessionEnd.getTime() >= rangeStart.getTime()
  );
}

export function gameHasActivityInRange(
  game: Game,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): boolean {
  return (game.sessions ?? []).some((session) =>
    gameSessionHasActivityInRange(session, rangeStart, rangeEnd, reference)
  );
}

function formatGameSampleLine(
  game: Game,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): string {
  const activeCount = (game.sessions ?? []).filter((session) =>
    gameSessionHasActivityInRange(session, rangeStart, rangeEnd, reference)
  ).length;
  const base = `${game.title} — ${game.editor}`;
  if (activeCount <= 1) {
    return base;
  }
  return `${base} — ${activeCount} sessions`;
}

function formatGameSample(
  game: Game,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): ActivityGameSample {
  const hasActiveSession = (game.sessions ?? []).some((session) =>
    gameSessionHasActivityInRange(session, rangeStart, rangeEnd, reference)
  );
  return {
    line: formatGameSampleLine(game, rangeStart, rangeEnd, reference),
    showGameSessionBadge: hasActiveSession,
  };
}

export function computeActivityInRange(
  books: Book[],
  mangas: Manga[],
  comics: Comic[],
  bds: Bd[],
  manwhas: Manwha[],
  movies: Movie[],
  series: Serie[],
  games: Game[],
  _musics: Music[],
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): ActivityWindowResult {
  const b = books.filter((book) =>
    bookHasActivityInRange(book, rangeStart, rangeEnd)
  );
  const mg = mangas.filter((m) => {
    if (mangaHasScanActivityInRange(m, rangeStart, rangeEnd)) {
      return true;
    }
    return mangaReadDateInRange(m, rangeStart, rangeEnd);
  });
  const c = comics.filter((x) => {
    const rt = x.readTimes ?? 0;
    if (rt <= 0) {
      return false;
    }
    const d = readItemActivityDate(x);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
  });
  const bd = bds.filter((x) => {
    const rt = x.readTimes ?? 0;
    if (rt <= 0) {
      return false;
    }
    const d = readItemActivityDate(x);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
  });
  const mw = manwhas.filter((x) => {
    if (manwhaHasScanActivityInRange(x, rangeStart, rangeEnd)) {
      return true;
    }
    return manwhaReadDateInRange(x, rangeStart, rangeEnd);
  });
  const mv = movies.filter((movie) =>
    movieHasActivityInRange(movie, rangeStart, rangeEnd)
  );
  const sr = series.filter((serie) =>
    serieHasActivityInRange(serie, rangeStart, rangeEnd)
  );
  const gm = games.filter((game) =>
    gameHasActivityInRange(game, rangeStart, rangeEnd, reference)
  );

  return {
    counts: {
      books: b.length,
      mangas: mg.length,
      comics: c.length,
      bds: bd.length,
      manwhas: mw.length,
      movies: mv.length,
      series: sr.length,
      games: gm.length,
    },
    samples: {
      books: takeBookSamples(
        b.map((x) => formatBookSample(x, rangeStart, rangeEnd))
      ),
      mangas: takeMangaSamples(
        mg.map((x) => formatMangaActivitySample(x, rangeStart, rangeEnd))
      ),
      comics: takeSampleTitles(c.map((x) => `${x.title} — ${x.writer}`)),
      bds: takeBdSamples(bd.map((x) => formatBdSample(x))),
      manwhas: takeManwhaSamples(
        mw.map((x) => formatManwhaActivitySample(x, rangeStart, rangeEnd))
      ),
      movies: takeMovieSamples(
        mv.map((x) => formatMovieSample(x, rangeStart, rangeEnd))
      ),
      series: takeSerieSamples(
        sr.map((x) => formatSerieSample(x, rangeStart, rangeEnd))
      ),
      games: takeGameSamples(
        gm.map((x) => formatGameSample(x, rangeStart, rangeEnd, reference))
      ),
    },
  };
}

function dateToDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(d.getDate()).padStart(2, '0')}`;
}

export type ActivityDurationTotals = {
  readingMinutes: number;
  viewingMinutes: number;
  gamingMinutes: number;
};

const MINUTES_PER_PAGE = 2;
const MINUTES_PER_MANGA_TOME = 30;
const MINUTES_PER_MANWHA_CHAPTER = 15;
const DEFAULT_GAME_SESSION_MINUTES = 60;

/** Chapitres de scan comptés par mois calendaire (activité mensuelle, mangas & manwhas). */
export const MANGA_SCAN_CHAPTERS_PER_MONTH = 4;
/** Durée estimée pour lire un chapitre en scan (activité mensuelle, mangas & manwhas). */
export const MANGA_SCAN_MINUTES_PER_CHAPTER = 5;
const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_MOVIE_MINUTES = 90;
const DEFAULT_READ_SESSION_MINUTES = 60;

function addSessionMinutesInRange(
  totalMinutes: number,
  seenSessions: Set<string>,
  dedupeKey: string,
  raw: string | undefined | null,
  rangeStart: Date,
  rangeEnd: Date,
  sessionMinutes: number
): number {
  const d = parseActivityDate(raw);
  if (!d || !isInInclusiveRange(d, rangeStart, rangeEnd)) {
    return totalMinutes;
  }
  const sessionKey = `${dedupeKey}|${dateToDayKey(d)}`;
  if (seenSessions.has(sessionKey)) {
    return totalMinutes;
  }
  seenSessions.add(sessionKey);
  return totalMinutes + Math.max(0, sessionMinutes);
}

function bookSessionMinutes(book: Book): number {
  const pages = book.pages ?? 0;
  const readTimes = Math.max(1, book.readTimes ?? 1);
  if (pages > 0) {
    return (pages / readTimes) * MINUTES_PER_PAGE;
  }
  return DEFAULT_READ_SESSION_MINUTES;
}

function pagesItemSessionMinutes(pages: number, readTimes: number): number {
  const rt = Math.max(1, readTimes);
  if (pages > 0) {
    return (pages / rt) * MINUTES_PER_PAGE;
  }
  return DEFAULT_READ_SESSION_MINUTES;
}

function mangaSessionMinutes(manga: Manga): number {
  const tomes = manga.nbTomes ?? 0;
  const readTimes = Math.max(1, manga.readTimes ?? 1);
  if (tomes > 0) {
    return (tomes / readTimes) * MINUTES_PER_MANGA_TOME;
  }
  return DEFAULT_READ_SESSION_MINUTES;
}

function manwhaSessionMinutes(manwha: Manwha): number {
  const chapters = manwha.nbChapters ?? 0;
  const readTimes = Math.max(1, manwha.readTimes ?? 1);
  if (chapters > 0) {
    return (chapters / readTimes) * MINUTES_PER_MANWHA_CHAPTER;
  }
  return DEFAULT_READ_SESSION_MINUTES;
}

function movieSessionMinutes(movie: Movie): number {
  return movie.length > 0 ? movie.length : DEFAULT_MOVIE_MINUTES;
}

function serieSeasonSessionMinutes(serie: Serie, seasonNumber: number): number {
  const seasonData = serie.seasonsData?.find(
    (s) => s.seasonNumber === seasonNumber
  );
  const totalLength = seasonData?.totalLength ?? 0;
  const userSeason = serie.seasons?.find(
    (s) => s.seasonNumber === seasonNumber
  );
  const times = Math.max(1, userSeason?.seasonTimesWatched ?? 1);
  if (totalLength > 0) {
    return totalLength / times;
  }
  return DEFAULT_MOVIE_MINUTES;
}

function gameSessionMinutes(game: Game, session: UserGameSession): number {
  const hours = getGamePlayedHoursFromSessions([session], game);
  if (hours > 0) {
    return hours * 60;
  }
  return DEFAULT_GAME_SESSION_MINUTES;
}

function countCalendarMonthsInclusive(start: Date, end: Date): number {
  let y = start.getFullYear();
  let m = start.getMonth();
  const endY = end.getFullYear();
  const endM = end.getMonth();
  let count = 0;
  while (y < endY || (y === endY && m <= endM)) {
    count += 1;
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return Math.max(1, count);
}

function addGameSessionMinutesInRange(
  totalMinutes: number,
  gamingSeen: Set<string>,
  game: Game,
  session: UserGameSession,
  sessionIndex: number,
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): number {
  if (!gameSessionHasActivityInRange(session, rangeStart, rangeEnd, reference)) {
    return totalMinutes;
  }
  const sessionStart = getGameSessionActivityStart(session);
  if (!sessionStart) {
    return totalMinutes;
  }
  const sessionEnd = getGameSessionActivityEnd(session, reference);
  if (!sessionEnd || sessionEnd.getTime() < sessionStart.getTime()) {
    return totalMinutes;
  }

  const sessionMinutes = gameSessionMinutes(game, session);
  const keyBase = `game|${game.title}|${game.editor}|${sessionIndex}`;
  const totalMonths = countCalendarMonthsInclusive(sessionStart, sessionEnd);
  if (totalMonths >= 3) {
    return totalMinutes;
  }
  const minutesPerMonth = sessionMinutes / totalMonths;

  let y = sessionStart.getFullYear();
  let m = sessionStart.getMonth();
  const endY = sessionEnd.getFullYear();
  const endM = sessionEnd.getMonth();

  while (y < endY || (y === endY && m <= endM)) {
    const monthStart = new Date(y, m, 1, 0, 0, 0, 0);
    const monthEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
    if (
      monthStart.getTime() <= rangeEnd.getTime() &&
      monthEnd.getTime() >= rangeStart.getTime()
    ) {
      const monthKey = `${keyBase}|${y}-${String(m + 1).padStart(2, '0')}`;
      if (!gamingSeen.has(monthKey)) {
        gamingSeen.add(monthKey);
        totalMinutes += minutesPerMonth;
      }
    }
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  return totalMinutes;
}

/** Temps cumulé de lecture, visionnage et jeu sur la période (minutes). */
export function computeActivityDurationInRange(
  books: Book[],
  mangas: Manga[],
  comics: Comic[],
  bds: Bd[],
  manwhas: Manwha[],
  movies: Movie[],
  series: Serie[],
  games: Game[],
  rangeStart: Date,
  rangeEnd: Date,
  reference = new Date()
): ActivityDurationTotals {
  const readingSeen = new Set<string>();
  const scanSeen = new Set<string>();
  const viewingSeen = new Set<string>();
  const gamingSeen = new Set<string>();
  let readingMinutes = 0;
  let viewingMinutes = 0;
  let gamingMinutes = 0;

  for (const book of books) {
    if ((book.readTimes ?? 0) <= 0) {
      continue;
    }
    const key = `book|${book.title}|${book.author}`;
    const session = bookSessionMinutes(book);
    readingMinutes = addSessionMinutesInRange(
      readingMinutes,
      readingSeen,
      key,
      book.firstReadDate,
      rangeStart,
      rangeEnd,
      session
    );
    readingMinutes = addSessionMinutesInRange(
      readingMinutes,
      readingSeen,
      key,
      book.lastReadDate,
      rangeStart,
      rangeEnd,
      session
    );
    for (const raw of book.otherReadDates ?? []) {
      readingMinutes = addSessionMinutesInRange(
        readingMinutes,
        readingSeen,
        key,
        raw,
        rangeStart,
        rangeEnd,
        session
      );
    }
  }

  for (const item of mangas) {
    if ((item.readTimes ?? 0) <= 0) {
      continue;
    }
    const key = `manga|${item.title}|${item.author}`;
    const session = mangaSessionMinutes(item);
    readingMinutes = addSessionMinutesInRange(
      readingMinutes,
      readingSeen,
      key,
      item.readDate,
      rangeStart,
      rangeEnd,
      session
    );
    readingMinutes = addMangaScanMinutesInRange(
      readingMinutes,
      scanSeen,
      item,
      rangeStart,
      rangeEnd
    );
  }

  for (const item of comics) {
    if ((item.readTimes ?? 0) <= 0) {
      continue;
    }
    const key = `comic|${item.title}|${item.writer}`;
    const session = pagesItemSessionMinutes(
      item.pages ?? 0,
      item.readTimes ?? 1
    );
    readingMinutes = addSessionMinutesInRange(
      readingMinutes,
      readingSeen,
      key,
      item.readDate,
      rangeStart,
      rangeEnd,
      session
    );
  }

  for (const item of bds) {
    if ((item.readTimes ?? 0) <= 0) {
      continue;
    }
    const key = `bd|${item.title}|${item.writer}`;
    const session = pagesItemSessionMinutes(
      item.pages ?? 0,
      item.readTimes ?? 1
    );
    readingMinutes = addSessionMinutesInRange(
      readingMinutes,
      readingSeen,
      key,
      item.readDate,
      rangeStart,
      rangeEnd,
      session
    );
  }

  for (const item of manwhas) {
    if ((item.readTimes ?? 0) <= 0) {
      continue;
    }
    const key = `manwha|${item.title}|${item.author}`;
    const session = manwhaSessionMinutes(item);
    readingMinutes = addSessionMinutesInRange(
      readingMinutes,
      readingSeen,
      key,
      item.readDate,
      rangeStart,
      rangeEnd,
      session
    );
    readingMinutes = addManwhaScanMinutesInRange(
      readingMinutes,
      scanSeen,
      item,
      rangeStart,
      rangeEnd
    );
  }

  for (const movie of movies) {
    if ((movie.timesWatched ?? 0) <= 0) {
      continue;
    }
    const key = `movie|${movie.title}|${movie.director}`;
    const session = movieSessionMinutes(movie);
    viewingMinutes = addSessionMinutesInRange(
      viewingMinutes,
      viewingSeen,
      key,
      movie.firstViewedDate,
      rangeStart,
      rangeEnd,
      session
    );
    viewingMinutes = addSessionMinutesInRange(
      viewingMinutes,
      viewingSeen,
      key,
      movie.lastViewedDate,
      rangeStart,
      rangeEnd,
      session
    );
    for (const raw of movie.otherSeenDates ?? []) {
      viewingMinutes = addSessionMinutesInRange(
        viewingMinutes,
        viewingSeen,
        key,
        raw,
        rangeStart,
        rangeEnd,
        session
      );
    }
  }

  for (const serie of series) {
    for (const s of serie.seasons ?? []) {
      if ((s.seasonTimesWatched ?? 0) <= 0) {
        continue;
      }
      const key = `serie|${serie.title}|${serie.director}|s${s.seasonNumber}`;
      const session = serieSeasonSessionMinutes(serie, s.seasonNumber);
      viewingMinutes = addSessionMinutesInRange(
        viewingMinutes,
        viewingSeen,
        key,
        s.firstViewedDate,
        rangeStart,
        rangeEnd,
        session
      );
      viewingMinutes = addSessionMinutesInRange(
        viewingMinutes,
        viewingSeen,
        key,
        s.lastViewedDate,
        rangeStart,
        rangeEnd,
        session
      );
      for (const raw of s.otherViewedDates ?? []) {
        viewingMinutes = addSessionMinutesInRange(
          viewingMinutes,
          viewingSeen,
          key,
          raw,
          rangeStart,
          rangeEnd,
          session
        );
      }
    }
  }

  for (const game of games) {
    for (let i = 0; i < (game.sessions ?? []).length; i += 1) {
      gamingMinutes = addGameSessionMinutesInRange(
        gamingMinutes,
        gamingSeen,
        game,
        game.sessions[i],
        i,
        rangeStart,
        rangeEnd,
        reference
      );
    }
  }

  return { readingMinutes, viewingMinutes, gamingMinutes };
}

export function formatActivityDurationLabel(
  totalMinutes: number,
  kind: 'lecture' | 'visionnage' | 'jeu'
): string {
  const noun =
    kind === 'lecture' ? 'lecture' : kind === 'visionnage' ? 'visionnage' : 'jeu';
  if (totalMinutes <= 0) {
    return `0 h de ${noun}`;
  }
  if (totalMinutes >= MINUTES_PER_DAY) {
    const days = Math.round((totalMinutes / MINUTES_PER_DAY) * 10) / 10;
    if (days <= 1) {
      return `1 jour de ${noun}`;
    }
    return `${days} jours de ${noun}`;
  }
  const hours = Math.max(1, Math.round(totalMinutes / 60));
  return `${hours} h de ${noun}`;
}

export function formatRolling30Intro(range: {
  start: Date;
  end: Date;
}): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const a = range.start.toLocaleDateString('fr-FR', opts);
  const b = range.end.toLocaleDateString('fr-FR', opts);
  return `Du ${a} au ${b} (30 jours).`;
}
