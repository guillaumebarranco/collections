const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserAnimesFiles,
  parseAnimesFromFile,
} = require('../../utils/animes/animes-utils');

import type { UserAnimeFileRow } from '../../../src/app/models/anime-model';

const router = express.Router();

router.get('/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const animeFiles = getUserAnimesFiles(userId);
    const animes: UserAnimeFileRow[] = animeFiles.flatMap((animeFile: string) => {
      const fileContent = fs.readFileSync(animeFile, 'utf8');
      return parseAnimesFromFile(fileContent);
    });

    res.json(animes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
