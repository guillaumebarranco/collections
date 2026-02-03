const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserMoviesFiles,
  parseMoviesFromFile,
} = require('../../utils/movies/movies-utils');
const { loadUsers, normalizeUsername } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/others-users-movies-rated', (req: any, res: any) => {
  try {
    const inputUserId = normalizeString(req.query.userId, 'userId');
    const minRating = normalizeNumber(req.query.minRating, 'minRating') ?? 4;

    const normalizedUserId = inputUserId ? normalizeUsername(inputUserId) : '';
    const users = loadUsers();
    const otherUsers = users
      .map((user: any) => user.username)
      .filter(
        (username: string) => normalizeUsername(username) !== normalizedUserId
      );

    const results: any[] = [];
    for (const userId of otherUsers) {
      try {
        const movieFiles = getUserMoviesFiles(userId);
        const movies = movieFiles.flatMap((movieFile: string) => {
          const fileContent = fs.readFileSync(movieFile, 'utf8');
          return parseMoviesFromFile(fileContent);
        });

        movies
          .filter((movie: any) => (movie.rating ?? 0) >= minRating)
          .forEach((movie: any) => {
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
