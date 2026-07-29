const express = require('express');
const fs = require('fs');
const {
  getBaseComicsFiles,
  parseBaseComicsFullFromFile,
} = require('../../utils/comics/comics-utils');
const { toLightComic } = require('../../utils/entity-light-mappers');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseComicsFiles();
    const comics = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseComicsFullFromFile(content);
    });

    res.json(comics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.get('/entities/light', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseComicsFiles();
    const comics = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseComicsFullFromFile(content).map(toLightComic);
    });

    res.json(comics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
