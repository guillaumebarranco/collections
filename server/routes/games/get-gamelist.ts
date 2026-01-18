const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserGamelistFiles,
  parseGamesFromFile,
} = require('../../utils/games/games-utils');

const router = express.Router();

router.get('/gamelist/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const files = getUserGamelistFiles(userId);
    const games = files
      .map((file: string) => {
        const content = fs.readFileSync(file, 'utf8');
        return parseGamesFromFile(content);
      })
      .flat();

    res.json(games);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
