const express = require('express');
const fs = require('fs');
const path = require('path');
const { parseBaseGamesFullFromFile } = require('../../utils/games/games-utils');

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

    const games = files
      .map((file: string) => {
        const content = fs.readFileSync(path.join(baseGamesDir, file), 'utf8');
        return parseBaseGamesFullFromFile(content);
      })
      .flat();

    res.json(games);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
