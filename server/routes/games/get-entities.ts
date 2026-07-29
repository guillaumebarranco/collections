const express = require('express');
const fs = require('fs');
const {
  getBaseGamesFiles,
  parseBaseGamesFullFromFile,
} = require('../../utils/games/games-utils');
const { toLightGame } = require('../../utils/entity-light-mappers');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseGamesFiles();
    const games = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseGamesFullFromFile(content);
    });

    res.setHeader('Cache-Control', 'no-store');
    res.json(games);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.get('/entities/light', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseGamesFiles();
    const games = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseGamesFullFromFile(content).map(toLightGame);
    });

    res.setHeader('Cache-Control', 'no-store');
    res.json(games);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
