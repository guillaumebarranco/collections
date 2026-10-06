import { Movie } from '../../../src/app/models/movie-model';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  escapeStringForTsDoubleQuote: escapeString,
} = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseMoviesFromFile,
  getUserMoviesFiles,
  getUserWatchlistMoviesFiles,
  removeMovieFromFile,
  formatMovieLastUpdated,
} = require('../../utils/movies/movies-utils');

const router = express.Router();

const usersRootDir = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const createUserScript = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'scripts',
  'create-user-files.js'
);

function ensureUserExists(userId: string) {
  const userDir = path.join(usersRootDir, userId);
  if (fs.existsSync(userDir)) {
    return;
  }
  console.log('creation user', userId);
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild
    ? [createUserScript, userId, '--build']
    : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function formatUserMovie(movie: Movie) {
  return `  {\n    title: "${escapeString(
    movie.title
  )}",\n    director: "${escapeString(
    movie.director
  )}",\n    rating: 0,\n    timesWatched: 1,\n    firstViewedDate: '',\n    lastViewedDate: '',\n    otherSeenDates: [],\n    seenAtCinema: false,\n    owned: false,\n    wantToSeeAgain: false,\n    watchPriority: 1,\n    ratingComment: '',\n    inList: [],\n    borrowed: '',\n    loaned: '',\n    lastUpdated: "${formatMovieLastUpdated()}",\n  },`;
}

function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatInList(inList: unknown): string {
  if (!Array.isArray(inList) || inList.length === 0) return '[]';
  return (
    '[' +
    inList
      .map((name) => `"${escapeString(String(name))}"`)
      .join(', ') +
    ']'
  );
}

/** Film déjà dans la watchlist : passage en « vu » en conservant listes, emprunt et prêt. */
function formatWatchedMovieFromWatchlist(movie: Movie) {
  const viewedDate = getTodayISO();
  return `  {\n    title: "${escapeString(
    movie.title
  )}",\n    director: "${escapeString(
    movie.director
  )}",\n    rating: 0,\n    timesWatched: 1,\n    firstViewedDate: "${viewedDate}",\n    lastViewedDate: "${viewedDate}",\n    otherSeenDates: [],\n    seenAtCinema: false,\n    owned: false,\n    wantToSeeAgain: false,\n    watchPriority: 1,\n    ratingComment: '',\n    inList: ${formatInList(
    movie.inList
  )},\n    borrowed: "${escapeString(
    typeof movie.borrowed === 'string' ? movie.borrowed : ''
  )}",\n    loaned: "${escapeString(
    typeof movie.loaned === 'string' ? movie.loaned : ''
  )}",\n    lastUpdated: "${formatMovieLastUpdated()}",\n  },`;
}

function formatWatchlistMovie(movie: Movie) {
  return `  {\n    title: "${escapeString(
    movie.title
  )}",\n    director: "${escapeString(
    movie.director
  )}",\n    rating: 0,\n    timesWatched: 0,\n    firstViewedDate: '',\n    lastViewedDate: '',\n    otherSeenDates: [],\n    seenAtCinema: false,\n    owned: false,\n    wantToSeeAgain: false,\n    watchPriority: 1,\n    ratingComment: '',\n    inList: [],\n    borrowed: '',\n    loaned: '',\n    lastUpdated: "${formatMovieLastUpdated()}",\n  },`;
}

function getUserMoviesTargetFile(userId: string, isWatchlist: boolean) {
  const userDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'app',
    'utils',
    'users',
    userId,
    'movies'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User movies directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file: string) =>
      isWatchlist ? file.includes('watchlist') : !file.includes('watchlist')
    );

  const preferred = files.find((file: string) =>
    isWatchlist
      ? file.includes(`${userId}_watchlist_movies`)
      : file.includes(`${userId}_movies`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User movies file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/add-existing', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    ensureUserExists(userId);

    const movies = Array.isArray(input.movies) ? input.movies : [];
    const isWatchlist = normalizeBoolean(input.watchlist, 'watchlist') ?? false;
    const normalizedMovies = movies
      .map((movie: Movie) => ({
        title: normalizeString(movie.title, 'title'),
        director: normalizeString(movie.director, 'director'),
      }))
      .filter((movie: Movie) => movie.title && movie.director);

    if (normalizedMovies.length === 0) {
      res.status(400).json({ error: 'Missing movies' });
      return;
    }

    const userFiles = getUserMoviesFiles(userId);
    const existing = userFiles.flatMap((movieFile: string) => {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      return parseMoviesFromFile(fileContent).map((movie: Movie) => ({
        title: movie.title,
        director: movie.director,
      }));
    });

    const existingSet = new Set(
      existing.map((movie: Movie) => `${movie.title}|${movie.director}`)
    );

    const movieKey = (movie: { title: string; director: string }) =>
      `${movie.title}|${movie.director}`;

    if (isWatchlist) {
      const toAdd = normalizedMovies.filter(
        (movie: Movie) => !existingSet.has(movieKey(movie))
      );

      if (toAdd.length === 0) {
        res.status(409).json({ error: 'Movies already exist for user' });
        return;
      }

      const userFile = getUserMoviesTargetFile(userId, true);
      let nextContent = fs.readFileSync(userFile, 'utf8');
      for (const movie of toAdd) {
        nextContent = appendObjectToArrayFile(
          userFile,
          formatWatchlistMovie(movie)
        );
        fs.writeFileSync(userFile, nextContent, 'utf8');
      }

      res.json({
        ok: true,
        added: toAdd.length,
        moved: 0,
        file: userFile,
      });
      return;
    }

    const watchlistByKey = new Map<string, Movie>();
    for (const watchlistFile of getUserWatchlistMoviesFiles(userId)) {
      const fileContent = fs.readFileSync(watchlistFile, 'utf8');
      for (const movie of parseMoviesFromFile(fileContent)) {
        watchlistByKey.set(movieKey(movie), movie);
      }
    }

    const toAdd: Movie[] = [];
    const toMove: Movie[] = [];
    for (const movie of normalizedMovies) {
      const key = movieKey(movie);
      if (existingSet.has(key)) continue;
      const watchlistMovie = watchlistByKey.get(key);
      if (watchlistMovie) {
        toMove.push(watchlistMovie);
      } else {
        toAdd.push(movie);
      }
    }

    if (toAdd.length === 0 && toMove.length === 0) {
      res.status(409).json({ error: 'Movies already exist for user' });
      return;
    }

    const userFile = getUserMoviesTargetFile(userId, false);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    for (const movie of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserMovie(movie));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }
    for (const movie of toMove) {
      nextContent = appendObjectToArrayFile(
        userFile,
        formatWatchedMovieFromWatchlist(movie)
      );
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const watchlistFiles = getUserWatchlistMoviesFiles(userId);
    for (const movie of toMove) {
      for (const watchlistFile of watchlistFiles) {
        const fileContent = fs.readFileSync(watchlistFile, 'utf8');
        try {
          const updatedContent = removeMovieFromFile(fileContent, {
            title: movie.title,
            director: movie.director,
          });
          fs.writeFileSync(watchlistFile, updatedContent, 'utf8');
          break;
        } catch (error: any) {
          if (error.message !== 'Movie not found') {
            throw error;
          }
        }
      }
    }

    res.json({
      ok: true,
      added: toAdd.length,
      moved: toMove.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
