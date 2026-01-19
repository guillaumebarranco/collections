const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserComicsFiles,
  parseComicsFromFile,
} = require('../../utils/comics/comics-utils');

const router = express.Router();

router.get('/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const comicFiles = getUserComicsFiles(userId);
    const comics = comicFiles.flatMap((comicFile: string) => {
      const fileContent = fs.readFileSync(comicFile, 'utf8');
      return parseComicsFromFile(fileContent);
    });

    res.json(comics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
