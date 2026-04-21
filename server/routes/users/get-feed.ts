const express = require('express');
const fs = require('fs');
const {
  getFollowedUserIds,
  normalizeUsername,
} = require('../../utils/users/follows-utils');
const {
  getUserMoviesFiles,
  parseMoviesFromFile,
} = require('../../utils/movies/movies-utils');
const {
  getUserBooksFiles,
  parseBooksFromFile,
} = require('../../utils/books/books-utils');
const {
  getUserSeriesFiles,
  parseSeriesFromFile,
} = require('../../utils/series/series-utils');

import type { UserBook } from '../../../src/app/models/book-model';
import type {
  FeedItemBook,
  FeedItemMovie,
  FeedItemSerie,
  FeedUserEntry,
} from '../../../src/app/models/feed-model';
import type { UserMovie } from '../../../src/app/models/movie-model';
import type { UserSerieFileRow, UserSerieSeason } from '../../../src/app/models/serie-model';

const router = express.Router();

const FEED_MAX_ITEMS = 5;
const FEED_DAYS_LOOKBACK = 30;

function getOneMonthAgoDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - FEED_DAYS_LOOKBACK);
  return d.toISOString().slice(0, 10);
}

function isDateWithinLastMonth(dateStr: string, oneMonthAgo: string): boolean {
  const day = feedDateDayKey(dateStr);
  if (!day || day.length < 10) return false;
  return day >= oneMonthAgo;
}

/** Jour calendaire YYYY-MM-DD pour comparer des `lastViewedDate` hétérogènes (ISO, date seule, etc.). */
function feedDateDayKey(dateStr: string): string {
  const t = (dateStr || '').trim();
  if (!t) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) {
    return t.slice(0, 10);
  }
  const ms = Date.parse(t);
  if (!Number.isNaN(ms)) {
    return new Date(ms).toISOString().slice(0, 10);
  }
  return t;
}

function maxFeedSeasonDayKey(seasons: UserSerieSeason[]): string {
  let best = '';
  for (const se of seasons || []) {
    const k = feedDateDayKey(se.lastViewedDate);
    if (!k) continue;
    if (!best || k > best) {
      best = k;
    }
  }
  return best;
}

function loadUserMovies(userId: string): UserMovie[] {
  try {
    const movieFiles = getUserMoviesFiles(userId);
    return movieFiles.flatMap((movieFile: string) => {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      return parseMoviesFromFile(fileContent);
    });
  } catch {
    return [];
  }
}

function loadUserBooks(userId: string): UserBook[] {
  try {
    const bookFiles = getUserBooksFiles(userId);
    return bookFiles.flatMap((bookFile: string) => {
      const fileContent = fs.readFileSync(bookFile, 'utf8');
      return parseBooksFromFile(fileContent);
    });
  } catch {
    return [];
  }
}

function loadUserSeries(userId: string): UserSerieFileRow[] {
  try {
    const serieFiles = getUserSeriesFiles(userId);
    return serieFiles.flatMap((serieFile: string) => {
      const fileContent = fs.readFileSync(serieFile, 'utf8');
      return parseSeriesFromFile(fileContent);
    });
  } catch {
    return [];
  }
}

/**
 * Dernière saison vue pour le jour `_maxViewedDate` (clé YYYY-MM-DD), départage par numéro de saison.
 */
function pickFeedSerieSeasonForMaxDate(
  row: UserSerieFileRow & { _maxViewedDate: string }
): UserSerieSeason | undefined {
  const maxDay = row._maxViewedDate;
  const seasons: UserSerieSeason[] = row.seasons || [];
  if (!maxDay) return undefined;
  const matching = seasons.filter((se) => feedDateDayKey(se.lastViewedDate) === maxDay);
  let pick: UserSerieSeason | undefined;
  for (const se of matching) {
    if (!pick || se.seasonNumber > pick.seasonNumber) {
      pick = se;
    }
  }
  return pick;
}

/**
 * Note : `seasonRating` de la saison ci-dessus, sinon note globale legacy `rating`.
 */
function resolveFeedSerieDisplay(row: UserSerieFileRow & { _maxViewedDate: string }): {
  rating?: number;
  seasonNumber?: number;
} {
  const pick = pickFeedSerieSeasonForMaxDate(row);
  let rating: number | undefined;
  if (pick) {
    const sr = pick.seasonRating;
    if (sr != null && sr > 0) {
      rating = sr;
    }
  }
  if (rating === undefined) {
    const legacy = row.rating;
    if (legacy != null && legacy > 0) {
      rating = legacy;
    }
  }
  const rawSn = pick?.seasonNumber;
  const seasonNumber =
    rawSn != null && !Number.isNaN(Number(rawSn)) && Number(rawSn) >= 1
      ? Number(rawSn)
      : undefined;

  return {
    rating,
    seasonNumber,
  };
}

router.get('/:userId/feed', (req: any, res: any) => {
  try {
    const userId = normalizeUsername(req.params.userId);
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const followedIds = getFollowedUserIds(userId);
    const oneMonthAgo = getOneMonthAgoDateString();

    const feed: FeedUserEntry[] = followedIds.map((followedUserId: string) => {
      const movies: FeedItemMovie[] = loadUserMovies(followedUserId)
        .filter((m) => isDateWithinLastMonth(m.lastViewedDate ?? '', oneMonthAgo))
        .sort((a, b) => (b.lastViewedDate || '').localeCompare(a.lastViewedDate || ''))
        .slice(0, FEED_MAX_ITEMS)
        .map((m) => ({
          title: m.title,
          director: m.director,
          date: m.lastViewedDate,
          rating: m.rating,
        }));

      const books: FeedItemBook[] = loadUserBooks(followedUserId)
        .filter((b) => isDateWithinLastMonth(b.lastReadDate || b.firstReadDate || '', oneMonthAgo))
        .sort((a, b) =>
          ((b.lastReadDate || b.firstReadDate) || '').localeCompare(
            (a.lastReadDate || a.firstReadDate) || ''
          )
        )
        .slice(0, FEED_MAX_ITEMS)
        .map((b) => ({
          title: b.title,
          author: b.author,
          date: b.lastReadDate || b.firstReadDate,
          rating: b.rating,
        }));

      const allSeries = loadUserSeries(followedUserId);
      const seriesWithMaxDate = allSeries.map((s) => {
        const maxDayKey = maxFeedSeasonDayKey(s.seasons || []);
        return { ...s, _maxViewedDate: maxDayKey };
      });
      type SerieWithFeedMeta = UserSerieFileRow & {
        _maxViewedDate: string;
      };
      const series: FeedItemSerie[] = seriesWithMaxDate
        .filter((s) => isDateWithinLastMonth(s._maxViewedDate || '', oneMonthAgo))
        .sort((a, b) => (b._maxViewedDate || '').localeCompare(a._maxViewedDate || ''))
        .slice(0, FEED_MAX_ITEMS)
        .map((s) => {
          const row = s as SerieWithFeedMeta;
          const { rating, seasonNumber } = resolveFeedSerieDisplay(row);
          return {
            title: row.title,
            director: row.director,
            date: row._maxViewedDate,
            rating,
            seasonNumber,
          };
        });

      return {
        userId: followedUserId,
        movies,
        books,
        series,
      };
    });

    feed.sort((a, b) => {
      const aHas = a.movies.length + a.books.length + a.series.length > 0;
      const bHas = b.movies.length + b.books.length + b.series.length > 0;
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });

    res.json({ feed });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
