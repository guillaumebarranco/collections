const express = require('express');
const fs = require('fs');
const {
  getBaseGamesFiles,
  parseBaseGamesFullFromFile,
} = require('../../utils/games/games-utils');

import type { BaseGame } from '../../../src/app/models/game-model';

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const games: BaseGame[] = getBaseGamesFiles()
      .map((filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf8');
        return parseBaseGamesFullFromFile(content);
      })
      .flat();

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(games);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
