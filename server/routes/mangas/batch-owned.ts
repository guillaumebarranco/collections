const express = require('express');
const {
  normalizeBoolean,
  normalizeString,
  updateMangaInFile,
  getUserMangasFiles,
} = require('../../utils/mangas/mangas-utils');

const router = express.Router();

router.post('/batch-owned', (req: any, res: any) => {
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

    const files = getUserMangasFiles(userId);
    if (!files.length) {
      res.status(404).json({ error: 'User mangas not found' });
      return;
    }

    const missing: { title: string; author: string }[] = [];
    let updatedCount = 0;

    mangas.forEach((rawManga: any) => {
      const title = normalizeString(rawManga?.title, 'title');
      const author = normalizeString(rawManga?.author, 'author');
      if (!title || !author) {
        return;
      }

      const payload = {
        title,
        author,
        owned: normalizeBoolean(rawManga?.owned, 'owned'),
      };

      let updated = false;
      for (const filePath of files) {
        if (updateMangaInFile(filePath, payload)) {
          updated = true;
          updatedCount += 1;
          break;
        }
      }

      if (!updated) {
        missing.push({ title, author });
      }
    });

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
