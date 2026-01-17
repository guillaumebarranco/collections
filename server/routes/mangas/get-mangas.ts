const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserMangasFiles,
  parseMangasFromFile,
} = require('../../utils/mangas/mangas-utils');

const router = express.Router();

router.get('/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const mangaFiles = getUserMangasFiles(userId);
    const mangas = mangaFiles.flatMap((mangaFile: string) => {
      const fileContent = fs.readFileSync(mangaFile, 'utf8');
      return parseMangasFromFile(fileContent);
    });

    res.json(mangas);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
