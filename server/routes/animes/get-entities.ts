const express = require('express');
const fs = require('fs');
const {
  getBaseAnimesFiles,
  parseBaseAnimesFullFromFile,
} = require('../../utils/animes/animes-utils');
const { toLightAnime } = require('../../utils/entity-light-mappers');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseAnimesFiles();
    const animes = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseAnimesFullFromFile(content);
    });

    res.json(animes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.get('/entities/light', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseAnimesFiles();
    const animes = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseAnimesFullFromFile(content).map(toLightAnime);
    });

    res.json(animes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
