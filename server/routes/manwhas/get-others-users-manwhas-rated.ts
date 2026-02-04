const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserManwhasFiles,
  parseManwhasFromFile,
} = require('../../utils/manwhas/manwhas-utils');
const { loadUsers, normalizeUsername } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/others-users-manwhas-rated', (req: any, res: any) => {
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
        const manwhaFiles = getUserManwhasFiles(userId);
        const manwhas = manwhaFiles.flatMap((manwhaFile: string) => {
          const fileContent = fs.readFileSync(manwhaFile, 'utf8');
          return parseManwhasFromFile(fileContent);
        });

        manwhas
          .filter((manwha: any) => (manwha.rating ?? 0) >= minRating)
          .forEach((manwha: any) => {
            results.push({
              title: manwha.title,
              author: manwha.author,
              rating: manwha.rating ?? 0,
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
