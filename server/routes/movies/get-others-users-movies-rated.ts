const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserMoviesFiles,
  parseMoviesFromFile,
} = require('../../utils/movies/movies-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserMovie } from '../../../src/app/models/movie-model';

type OthersRatedMovieEntry = Pick<UserMovie, 'title' | 'director'> & {
  rating: number;
  userId: string;
};

const router = express.Router();

function getFollowedUserIdsFromQuery(req: any): string[] {
  const raw = req.query.followedUserIds;
  if (raw == null || typeof raw !== 'string' || !raw.trim()) return [];
  return raw
    .split(',')
    .map((s: string) => normalizeUsername(s.trim()))
    .filter(Boolean);
}

router.get('/others-users-movies-rated', (req: any, res: any) => {
  try {
    const inputUserId = normalizeString(req.query.userId, 'userId');
    const minRating = normalizeNumber(req.query.minRating, 'minRating') ?? 4;
    const followedUserIds = getFollowedUserIdsFromQuery(req);

    const normalizedUserId = inputUserId ? normalizeUsername(inputUserId) : '';
    const otherUsers =
      followedUserIds.length > 0
        ? followedUserIds.filter((id: string) => id !== normalizedUserId)
        : [];

    const results: OthersRatedMovieEntry[] = [];
    for (const userId of otherUsers) {
      try {
        const movieFiles = getUserMoviesFiles(userId);
        const movies: UserMovie[] = movieFiles.flatMap((movieFile: string) => {
          const fileContent = fs.readFileSync(movieFile, 'utf8');
          return parseMoviesFromFile(fileContent);
        });

        movies
          .filter((movie) => (movie.rating ?? 0) >= minRating)
          .forEach((movie) => {
            results.push({
              title: movie.title,
              director: movie.director,
              rating: movie.rating ?? 0,
              userId,
            });
          });
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
