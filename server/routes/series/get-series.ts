const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserSeriesFiles,
  parseSeriesFromFile,
} = require('../../utils/series/series-utils');

const router = express.Router();

router.get('/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const serieFiles = getUserSeriesFiles(userId);
    const series = serieFiles.flatMap((serieFile: string) => {
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
