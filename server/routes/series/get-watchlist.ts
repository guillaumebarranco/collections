const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserWatchlistSeriesFiles,
  parseSeriesFromFile,
} = require('../../utils/series/series-utils');

import type { Serie } from '../../../src/app/models/serie-model';

const router = express.Router();

router.get('/watchlist/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const serieFiles = getUserWatchlistSeriesFiles(userId);
    const series: Serie[] = serieFiles.flatMap((serieFile: string) => {
      const fileContent = fs.readFileSync(serieFile, 'utf8');
      return parseSeriesFromFile(fileContent);
    });

    res.json(series);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
