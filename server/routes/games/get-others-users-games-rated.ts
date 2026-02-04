const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserGamesFiles,
  parseGamesFromFile,
} = require('../../utils/games/games-utils');
const { loadUsers, normalizeUsername } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/others-users-games-rated', (req: any, res: any) => {
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
        const gameFiles = getUserGamesFiles(userId);
        const games = gameFiles.flatMap((gameFile: string) => {
          const fileContent = fs.readFileSync(gameFile, 'utf8');
          return parseGamesFromFile(fileContent);
        });

        games
          .filter((game: any) => (game.rating ?? 0) >= minRating)
          .forEach((game: any) => {
            results.push({
              title: game.title,
              editor: game.editor,
              rating: game.rating ?? 0,
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
