const express = require('express');
const fs = require('fs');
const {
  parseGamesFromFile,
  getUserGamesFiles,
} = require('../../utils/games/games-utils');

const router = express.Router();

router.get('/:userId', (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const files = getUserGamesFiles(userId);
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
