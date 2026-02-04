const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserBdsFiles,
  parseBdsFromFile,
} = require('../../utils/bds/bds-utils');
const { loadUsers, normalizeUsername } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/others-users-bds-rated', (req: any, res: any) => {
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
        const bdFiles = getUserBdsFiles(userId);
        const bds = bdFiles.flatMap((bdFile: string) => {
          const fileContent = fs.readFileSync(bdFile, 'utf8');
          return parseBdsFromFile(fileContent);
        });

        bds
          .filter((bd: any) => (bd.rating ?? 0) >= minRating)
          .forEach((bd: any) => {
            results.push({
              title: bd.title,
              writer: bd.writer,
              rating: bd.rating ?? 0,
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
