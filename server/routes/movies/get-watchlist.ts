const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserWatchlistMoviesFiles,
  parseMoviesFromFile,
} = require('../../utils/movies/movies-utils');

const router = express.Router();

router.get('/watchlist/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const movieFiles = getUserWatchlistMoviesFiles(userId);
    const movies = movieFiles.flatMap((movieFile: string) => {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      return parseMoviesFromFile(fileContent);
    });

    res.json(movies);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
