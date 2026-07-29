const express = require('express');
const fs = require('fs');
const {
  getBaseMangasFiles,
  parseBaseMangasFullFromFile,
} = require('../../utils/mangas/mangas-utils');
const { toLightManga } = require('../../utils/entity-light-mappers');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseMangasFiles();
    const mangas = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseMangasFullFromFile(content);
    });

    res.json(mangas);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.get('/entities/light', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseMangasFiles();
    const mangas = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseMangasFullFromFile(content).map(toLightManga);
    });

    res.json(mangas);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
