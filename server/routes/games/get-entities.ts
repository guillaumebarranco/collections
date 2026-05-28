const express = require('express');
const fs = require('fs');
const path = require('path');
const { parseBaseGamesFullFromFile } = require('../../utils/games/games-utils');

import type { BaseGame } from '../../../src/app/models/game-model';

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseGamesDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'src',
      'app',
      'utils',
      'entities',
      'games'
    );

    const files = fs
      .readdirSync(baseGamesDir)
      .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts');

    const games: BaseGame[] = files
      .map((file: string) => {
        const content = fs.readFileSync(path.join(baseGamesDir, file), 'utf8');
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
