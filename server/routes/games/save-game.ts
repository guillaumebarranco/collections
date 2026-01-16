const express = require('express');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateGameInFile,
  getUserGamesFiles,
} = require('../../utils/games/games-utils');

const router = express.Router();

router.post('/', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const games = Array.isArray(input.games) ? input.games : [input];

    const payload = games.map((game: any) => ({
      title: normalizeString(game.title, 'title'),
      editor: normalizeString(game.editor, 'editor'),
      rating: normalizeNumber(game.rating, 'rating') ?? 0,
      timesFinished: normalizeNumber(game.timesFinished, 'timesFinished') ?? 0,
      additionnalEstimatedTime:
        normalizeNumber(game.additionnalEstimatedTime, 'additionnalEstimatedTime') ?? 0,
      platined: normalizeBoolean(game.platined, 'platined') ?? false,
    }));

    const files = getUserGamesFiles(userId);
    if (!files.length) {
      res.status(404).json({ error: 'User games not found' });
      return;
    }

    let updatedCount = 0;
    for (const filePath of files) {
      payload.forEach((game: any) => {
        if (game.title && game.editor) {
          if (updateGameInFile(filePath, game)) {
            updatedCount += 1;
          }
        }
      });
    }

    res.json({ ok: true, updated: updatedCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
