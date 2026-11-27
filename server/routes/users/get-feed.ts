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
const { readAlbumsIfPresent } = require('../../utils/musics/musics-utils');
const {
  getUserGamesFiles,
  parseGamesFromFile,
} = require('../../utils/games/games-utils');

import type { UserBook } from '../../../src/app/models/book-model';
import type { UserGame, UserGameSession } from '../../../src/app/models/game-model';
import type {
  FeedItemAlbum,
  FeedItemBook,
  FeedItemGame,
  FeedItemMovie,
  FeedItemSerie,
  FeedUserEntry,
} from '../../../src/app/models/feed-model';
import type { UserAlbum } from '../../../src/app/models/music-model';
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

function loadUserGames(userId: string): UserGame[] {
  try {
    const gameFiles = getUserGamesFiles(userId);
    return gameFiles.flatMap((gameFile: string) => {
      const fileContent = fs.readFileSync(gameFile, 'utf8');
      return parseGamesFromFile(fileContent);
    });
  } catch {
    return [];
  }
}

/** Jour local YYYY-MM-DD. Les sessions sans date de fin courent jusqu'à aujourd'hui, comme dans Mon activité. */
function feedTodayKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function sessionFeedBounds(
  session: UserGameSession,
  today: string
): { start: string; end: string } | null {
  const legacy = session as UserGameSession & { finishedSessionDate?: string };
  const end =
    feedDateDayKey(session.sessionEndDate) ||
    feedDateDayKey(legacy.finishedSessionDate || '');
  const start = feedDateDayKey(session.sessionStartDate);
  if (end) {
    const startDay = start || end;
    return startDay <= end ? { start: startDay, end } : { start: end, end: startDay };
  }
  if (start || session.currentlyPlaying) {
    const startDay = start || today;
    if (startDay > today) return null;
    return { start: startDay, end: today };
  }
  return null;
}

function gameFeedDate(game: UserGame, oneMonthAgo: string, today: string): string {
  let best = '';
  for (const session of game.sessions || []) {
    const bounds = sessionFeedBounds(session, today);
    if (!bounds) continue;
    if (bounds.start > today || bounds.end < oneMonthAgo) continue;
    const day = bounds.end <= today ? bounds.end : today;
    if (!best || day > best) best = day;
  }
  return best;
}

function loadUserAlbums(userId: string): UserAlbum[] {
  try {
    return readAlbumsIfPresent(userId);
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
    const today = feedTodayKey();

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

      const games: FeedItemGame[] = loadUserGames(followedUserId)
        .map((game) => ({
          game,
          date: gameFeedDate(game, oneMonthAgo, today),
        }))
        .filter((item) => item.date && isDateWithinLastMonth(item.date, oneMonthAgo))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, FEED_MAX_ITEMS)
        .map((item) => ({
          title: item.game.title,
          editor: item.game.editor,
          date: item.date,
          rating: item.game.rating,
        }));

      const albums: FeedItemAlbum[] = loadUserAlbums(followedUserId)
        .filter((album) =>
          isDateWithinLastMonth(album.lastListenedDate || '', oneMonthAgo)
        )
        .sort((a, b) =>
          (b.lastListenedDate || '').localeCompare(a.lastListenedDate || '')
        )
        .slice(0, FEED_MAX_ITEMS)
        .map((album) => ({
          title: album.album,
          artist: album.artist,
          date: album.lastListenedDate || '',
          rating: album.rating,
        }));

      return {
        userId: followedUserId,
        movies,
        books,
        series,
        games,
        albums,
      };
    });

    feed.sort((a, b) => {
      const aHas =
        a.movies.length +
          a.books.length +
          a.series.length +
          a.games.length +
          a.albums.length >
        0;
      const bHas =
        b.movies.length +
          b.books.length +
          b.series.length +
          b.games.length +
          b.albums.length >
        0;
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
