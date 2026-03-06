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

const router = express.Router();

const FEED_MAX_ITEMS = 5;
const FEED_DAYS_LOOKBACK = 30;

function getOneMonthAgoDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - FEED_DAYS_LOOKBACK);
  return d.toISOString().slice(0, 10);
}

function isDateWithinLastMonth(dateStr: string, oneMonthAgo: string): boolean {
  if (!dateStr || typeof dateStr !== 'string' || dateStr.length < 10) return false;
  return dateStr >= oneMonthAgo;
}

function loadUserMovies(userId: string): any[] {
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

function loadUserBooks(userId: string): any[] {
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

function loadUserSeries(userId: string): any[] {
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

router.get('/:userId/feed', (req: any, res: any) => {
  try {
    const userId = normalizeUsername(req.params.userId);
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const followedIds = getFollowedUserIds(userId);
    const oneMonthAgo = getOneMonthAgoDateString();

    const feed = followedIds.map((followedUserId: string) => {
      const movies = loadUserMovies(followedUserId)
        .filter((m: any) => isDateWithinLastMonth(m.lastViewedDate ?? '', oneMonthAgo))
        .sort((a: any, b: any) => (b.lastViewedDate || '').localeCompare(a.lastViewedDate || ''))
        .slice(0, FEED_MAX_ITEMS)
        .map((m: any) => ({
          title: m.title,
          director: m.director,
          date: m.lastViewedDate,
          rating: m.rating,
        }));

      const books = loadUserBooks(followedUserId)
        .filter((b: any) => isDateWithinLastMonth(b.readDate ?? '', oneMonthAgo))
        .sort((a: any, b: any) => (b.readDate || '').localeCompare(a.readDate || ''))
        .slice(0, FEED_MAX_ITEMS)
        .map((b: any) => ({
          title: b.title,
          author: b.author,
          date: b.readDate,
          rating: b.rating,
        }));

      const allSeries = loadUserSeries(followedUserId);
      const seriesWithMaxDate = allSeries.map((s: any) => {
        const dates = (s.seasons || [])
          .map((se: any) => se.lastViewedDate)
          .filter(Boolean);
        const maxDate = dates.length ? dates.sort().reverse()[0] : '';
        return { ...s, _maxViewedDate: maxDate };
      });
      const series = seriesWithMaxDate
        .filter((s: any) => isDateWithinLastMonth(s._maxViewedDate || '', oneMonthAgo))
        .sort((a: any, b: any) =>
          (b._maxViewedDate || '').localeCompare(a._maxViewedDate || '')
        )
        .slice(0, FEED_MAX_ITEMS)
        .map((s: any) => ({
          title: s.title,
          director: s.director,
          date: s._maxViewedDate,
          rating: s.rating,
        }));

      return {
        userId: followedUserId,
        movies,
        books,
        series,
      };
    });

    feed.sort((a: any, b: any) => {
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
