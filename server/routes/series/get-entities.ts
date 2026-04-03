const express = require('express');
const fs = require('fs');
const {
  getBaseSeriesFiles,
  parseBaseSeriesFullFromFile,
} = require('../../utils/series/series-utils');

import type { BaseSerie } from '../../../src/app/models/serie-model';

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseSeriesFiles();
    const series: BaseSerie[] = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseSeriesFullFromFile(content);
    });

    res.json(series);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
