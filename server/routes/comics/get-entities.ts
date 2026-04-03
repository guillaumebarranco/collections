const express = require('express');
const fs = require('fs');
const {
  getBaseComicsFiles,
  parseBaseComicsFullFromFile,
} = require('../../utils/comics/comics-utils');

import type { BaseComic } from '../../../src/app/models/comic-model';

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseComicsFiles();
    const comics: BaseComic[] = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseComicsFullFromFile(content);
    });

    res.json(comics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
