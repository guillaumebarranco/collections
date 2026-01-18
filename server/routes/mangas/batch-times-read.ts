const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  updateMangaInFile,
  getUserMangasFiles,
} = require('../../utils/mangas/mangas-utils');

const router = express.Router();

router.post('/batch-times-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const mangas = Array.isArray(input.mangas) ? input.mangas : [];
    if (mangas.length === 0) {
      res.status(400).json({ error: 'Missing mangas' });
      return;
    }

    const mangaFiles = getUserMangasFiles(userId);
    const missing: { title: string; author: string }[] = [];
    let updatedCount = 0;

    for (const rawManga of mangas) {
      const title = normalizeString(rawManga?.title, 'title');
      const author = normalizeString(rawManga?.author, 'author');
      if (!title || !author) {
        res.status(400).json({ error: 'Missing title or author' });
        return;
      }

      const payload = {
        title,
        author,
        readTimes: normalizeNumber(rawManga?.readTimes, 'readTimes'),
      };

      let updated = false;
      for (const filePath of mangaFiles) {
        if (updateMangaInFile(filePath, payload)) {
          updated = true;
          updatedCount += 1;
          break;
        }
      }

      if (!updated) {
        missing.push({ title, author });
      }
    }

    res.json({
      ok: true,
      updatedCount,
      missing,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
