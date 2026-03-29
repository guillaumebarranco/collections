const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { escapeStringForTsDoubleQuote: escapeString } = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseMoviesFromFile,
  getUserMoviesFiles,
  removeMovieFromFile,
  getUserWatchlistMoviesFiles,
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

function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatUserMovie(movie: any, options?: { rating?: number; ratingComment?: string }) {
  const viewedDate = getTodayISO();
  const rating = options?.rating != null ? Number(options.rating) : 0;
  const ratingComment = typeof options?.ratingComment === 'string' ? options.ratingComment : '';
  return `  {\n    title: "${escapeString(
    movie.title
  )}",\n    director: "${escapeString(
    movie.director
  )}",\n    rating: ${rating},\n    timesWatched: 1,\n    firstViewedDate: "${viewedDate}",\n    lastViewedDate: "${viewedDate}",\n    seenAtCinema: false,\n    owned: false,\n    wantToSeeAgain: false,\n    watchPriority: 1,\n    ratingComment: "${escapeString(ratingComment)}",\n    inList: [],\n    borrowed: "${escapeString(typeof movie.borrowed === 'string' ? movie.borrowed : '')}",\n    loaned: "${escapeString(typeof movie.loaned === 'string' ? movie.loaned : '')}",\n  },`;
}

function formatWatchlistMovie(movie: any) {
  return `  {\n    title: "${escapeString(
    movie.title
  )}",\n    director: "${escapeString(
    movie.director
  )}",\n    rating: 0,\n    timesWatched: 0,\n    firstViewedDate: '',\n    lastViewedDate: '',\n    seenAtCinema: false,\n    owned: false,\n    wantToSeeAgain: false,\n    watchPriority: 1,\n    ratingComment: '',\n    inList: [],\n    borrowed: "${escapeString(typeof movie.borrowed === 'string' ? movie.borrowed : '')}",\n    loaned: "${escapeString(typeof movie.loaned === 'string' ? movie.loaned : '')}",\n  },`;
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

router.post('/move-movie-from-watchlist-to-watched', (req: any, res: any) => {
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
    const rating = input.rating != null ? Number(input.rating) : undefined;
    const ratingComment = typeof input.ratingComment === 'string' ? input.ratingComment : undefined;
    const normalizedMovies = movies
      .map((movie: any) => ({
        title: normalizeString(movie.title, 'title'),
        director: normalizeString(movie.director, 'director'),
      }))
      .filter((movie: any) => movie.title && movie.director);

    if (normalizedMovies.length === 0) {
      res.status(400).json({ error: 'Missing movies' });
      return;
    }

    const userFiles = getUserMoviesFiles(userId);
    const existing = userFiles.flatMap((movieFile: string) => {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      return parseMoviesFromFile(fileContent).map((movie: any) => ({
        title: movie.title,
        director: movie.director,
      }));
    });

    const existingSet = new Set(
      existing.map((movie: any) => `${movie.title}|${movie.director}`)
    );

    const toAdd = normalizedMovies.filter(
      (movie: any) => !existingSet.has(`${movie.title}|${movie.director}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Movies already exist for user' });
      return;
    }

    const userFile = getUserMoviesTargetFile(userId, isWatchlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const formatMovie = isWatchlist ? formatWatchlistMovie : formatUserMovie;
    const reviewOptions = (rating != null || ratingComment != null) ? { rating, ratingComment } : undefined;
    for (const movie of toAdd) {
      nextContent = appendObjectToArrayFile(
        userFile,
        isWatchlist ? formatMovie(movie) : formatUserMovie(movie, reviewOptions)
      );
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const watchlistFiles = getUserWatchlistMoviesFiles(userId);

    let updatedFile: string | null = null;

    const title = normalizeString(toAdd[0].title, 'title');
    const director = normalizeString(toAdd[0].director, 'director');

    for (const movieFile of watchlistFiles) {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      try {
        const updatedContent = removeMovieFromFile(fileContent, {
          title,
          director,
        });
        fs.writeFileSync(movieFile, updatedContent, 'utf8');
        updatedFile = movieFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Movie not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Movie not found' });
      return;
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
