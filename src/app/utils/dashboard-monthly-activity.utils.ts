import type { Book } from '../models/book-model';
import type { Movie } from '../models/movie-model';
import type { Manga } from '../models/manga-model';
import type { Comic } from '../models/comic-model';
import type { Bd } from '../models/bd-model';
import type { Manwha } from '../models/manwha-model';
import type { Serie } from '../models/serie-model';
import type { Game } from '../models/game-model';
import type { Music } from '../models/music-model';

export type ActivityCounts = {
  books: number;
  mangas: number;
  comics: number;
  bds: number;
  manwhas: number;
  movies: number;
  series: number;
};

export type ActivitySamples = {
  books: string[];
  mangas: string[];
  comics: string[];
  bds: string[];
  manwhas: string[];
  movies: string[];
  series: string[];
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

/** Mois calendaires complets : du 1er au dernier jour, les 12 derniers mois en partant du mois courant. */
export function getLast12CalendarMonths(reference = new Date()): CalendarMonthRange[] {
  const out: CalendarMonthRange[] = [];
  let y = reference.getFullYear();
  let m = reference.getMonth();
  for (let i = 0; i < 12; i++) {
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
    out.push({ key, label, rangeStart, rangeEnd });
    m -= 1;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
  }
  return out;
}

function takeSampleTitles(titles: string[]): string[] {
  return titles.slice(0, MAX_SAMPLES);
}

function bookActivityDate(book: Book): Date | null {
  return (
    parseActivityDate(book.lastReadDate) ??
    parseActivityDate(book.firstReadDate)
  );
}

function movieActivityDate(movie: Movie): Date | null {
  return (
    parseActivityDate(movie.lastViewedDate) ??
    parseActivityDate(movie.firstViewedDate)
  );
}

function readItemActivityDate(item: {
  readDate: string;
}): Date | null {
  return parseActivityDate(item.readDate);
}

function serieHasActivityInRange(
  serie: Serie,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  for (const s of serie.seasons ?? []) {
    const times = s.seasonTimesWatched ?? 0;
    if (times <= 0) {
      continue;
    }
    const d = parseActivityDate(s.lastViewedDate);
    if (d && isInInclusiveRange(d, rangeStart, rangeEnd)) {
      return true;
    }
  }
  return false;
}

function formatSerieSampleLine(
  serie: Serie,
  rangeStart: Date,
  rangeEnd: Date
): string {
  const seasonNums = (serie.seasons ?? [])
    .filter((s) => {
      const times = s.seasonTimesWatched ?? 0;
      if (times <= 0) {
        return false;
      }
      const d = parseActivityDate(s.lastViewedDate);
      return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
    })
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

export function computeActivityInRange(
  books: Book[],
  mangas: Manga[],
  comics: Comic[],
  bds: Bd[],
  manwhas: Manwha[],
  movies: Movie[],
  series: Serie[],
  _games: Game[],
  _musics: Music[],
  rangeStart: Date,
  rangeEnd: Date
): ActivityWindowResult {
  const b = books.filter((book) => {
    const rt = book.readTimes ?? 0;
    if (rt <= 0) {
      return false;
    }
    const d = bookActivityDate(book);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
  });
  const mg = mangas.filter((m) => {
    const rt = m.readTimes ?? 0;
    if (rt <= 0) {
      return false;
    }
    const d = readItemActivityDate(m);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
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
    const rt = x.readTimes ?? 0;
    if (rt <= 0) {
      return false;
    }
    const d = readItemActivityDate(x);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
  });
  const mv = movies.filter((movie) => {
    if ((movie.timesWatched ?? 0) <= 0) {
      return false;
    }
    const d = movieActivityDate(movie);
    return Boolean(d && isInInclusiveRange(d, rangeStart, rangeEnd));
  });
  const sr = series.filter((serie) =>
    serieHasActivityInRange(serie, rangeStart, rangeEnd),
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
    },
    samples: {
      books: takeSampleTitles(b.map((x) => `${x.title} — ${x.author}`)),
      mangas: takeSampleTitles(mg.map((x) => `${x.title} — ${x.author}`)),
      comics: takeSampleTitles(c.map((x) => `${x.title} — ${x.writer}`)),
      bds: takeSampleTitles(bd.map((x) => `${x.title} — ${x.writer}`)),
      manwhas: takeSampleTitles(mw.map((x) => `${x.title} — ${x.author}`)),
      movies: takeSampleTitles(mv.map((x) => `${x.title} — ${x.director}`)),
      series: takeSampleTitles(
        sr.map((x) => formatSerieSampleLine(x, rangeStart, rangeEnd)),
      ),
    },
  };
}

export function formatRolling30Intro(range: { start: Date; end: Date }): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const a = range.start.toLocaleDateString('fr-FR', opts);
  const b = range.end.toLocaleDateString('fr-FR', opts);
  return `Du ${a} au ${b} (30 jours).`;
}
