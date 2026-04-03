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
  )}",\n    rating: 0,\n    timesWatched: 1,\n    firstViewedDate: '',\n    lastViewedDate: '',\n    seenAtCinema: false,\n    owned: false,\n    wantToSeeAgain: false,\n    watchPriority: 1,\n    ratingComment: '',\n    inList: [],\n    borrowed: '',\n    loaned: '',\n  },`;
}

function formatWatchlistMovie(movie: Movie) {
  return `  {\n    title: "${escapeString(
    movie.title
  )}",\n    director: "${escapeString(
    movie.director
  )}",\n    rating: 0,\n    timesWatched: 0,\n    firstViewedDate: '',\n    lastViewedDate: '',\n    seenAtCinema: false,\n    owned: false,\n    wantToSeeAgain: false,\n    watchPriority: 1,\n    ratingComment: '',\n    inList: [],\n    borrowed: '',\n    loaned: '',\n  },`;
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

    const toAdd = normalizedMovies.filter(
      (movie: Movie) => !existingSet.has(`${movie.title}|${movie.director}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Movies already exist for user' });
      return;
    }

    const userFile = getUserMoviesTargetFile(userId, isWatchlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const formatMovie = isWatchlist ? formatWatchlistMovie : formatUserMovie;
    for (const movie of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatMovie(movie));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    res.json({
      ok: true,
      added: toAdd.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
