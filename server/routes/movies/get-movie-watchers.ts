const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeString,
  getUserMoviesFiles,
  parseMoviesFromFile,
} = require('../../utils/movies/movies-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserMovie } from '../../../src/app/models/movie-model';

export type MovieWatcherRow = {
  userId: string;
  rating: number;
  timesWatched: number;
};

const router = express.Router();

const USERS_MOVIES_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);

router.get('/movie-watchers', (req: any, res: any) => {
  try {
    const title = normalizeString(req.query.title, 'title');
    const director = normalizeString(req.query.director, 'director');
    if (!title?.trim() || !director?.trim()) {
      return res
        .status(400)
        .json({ error: 'Query params title and director are required' });
    }

    const targetTitle = title.trim();
    const targetDirector = director.trim();

    const results: MovieWatcherRow[] = [];

    if (!fs.existsSync(USERS_MOVIES_DIR)) {
      return res.json(results);
    }

    const entries = fs.readdirSync(USERS_MOVIES_DIR, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const rawUserId = ent.name;
      try {
        const movieFiles = getUserMoviesFiles(rawUserId);
        const movies: UserMovie[] = movieFiles.flatMap((movieFile: string) => {
          const fileContent = fs.readFileSync(movieFile, 'utf8');
          return parseMoviesFromFile(fileContent);
        });

        const match = movies.find(
          (m) =>
            m.title === targetTitle &&
            m.director === targetDirector &&
            (m.timesWatched ?? 0) > 0
        );
        if (match) {
          results.push({
            userId: normalizeUsername(rawUserId),
            rating: match.rating ?? 0,
            timesWatched: match.timesWatched ?? 0,
          });
        }
      } catch (error: any) {
        if (!String(error.message || '').includes('not found')) {
          throw error;
        }
      }
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
