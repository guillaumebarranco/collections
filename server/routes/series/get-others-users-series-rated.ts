const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserSeriesFiles,
  parseSeriesFromFile,
} = require('../../utils/series/series-utils');
const { loadUsers, normalizeUsername } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/others-users-series-rated', (req: any, res: any) => {
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
        const serieFiles = getUserSeriesFiles(userId);
        const series = serieFiles.flatMap((serieFile: string) => {
          const fileContent = fs.readFileSync(serieFile, 'utf8');
          return parseSeriesFromFile(fileContent);
        });

        series
          .filter((serie: any) => {
            // Pour les séries, on prend la note moyenne des saisons
            const seasons = serie.seasons || [];
            if (seasons.length === 0) return false;
            const avgRating =
              seasons.reduce(
                (sum: number, s: any) => sum + (s.seasonRating || 0),
                0
              ) / seasons.length;
            return avgRating >= minRating;
          })
          .forEach((serie: any) => {
            const seasons = serie.seasons || [];
            const avgRating =
              seasons.length > 0
                ? seasons.reduce(
                    (sum: number, s: any) => sum + (s.seasonRating || 0),
                    0
                  ) / seasons.length
                : 0;
            results.push({
              title: serie.title,
              director: serie.director,
              rating: avgRating,
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
