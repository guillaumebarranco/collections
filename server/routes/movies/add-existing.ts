const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeString,
  appendObjectToArrayFile,
  parseMoviesFromFile,
} = require('../../utils/movies/movies-utils');

const router = express.Router();

function escapeString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatUserMovie(movie: any) {
  return `  {\n    title: '${escapeString(
    movie.title
  )}',\n    director: '${escapeString(
    movie.director
  )}',\n    rating: 0,\n    timesWatched: 1,\n    firstViewedDate: '',\n    lastViewedDate: '',\n    seenAtCinema: false,\n  },`;
}

function getUserMoviesTargetFile(userId: string) {
  const userFile = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'app',
    'utils',
    'users',
    userId,
    'movies',
    `${userId}_movies.ts`
  );
  if (!fs.existsSync(userFile)) {
    throw new Error(`User movies file not found: ${userId}`);
  }
  return userFile;
}

router.post('/add-existing', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const movies = Array.isArray(input.movies) ? input.movies : [];
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

    const userFile = getUserMoviesTargetFile(userId);
    const userContent = fs.readFileSync(userFile, 'utf8');
    const existing = parseMoviesFromFile(userContent).map((movie: any) => ({
      title: movie.title,
      director: movie.director,
    }));

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

    let nextContent = userContent;
    for (const movie of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserMovie(movie));
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
