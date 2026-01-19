const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  updateComicInFile,
  getUserComicsFiles,
} = require('../../utils/comics/comics-utils');

const router = express.Router();

router.post('/batch-times-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const comics = Array.isArray(input.comics) ? input.comics : [];
    if (comics.length === 0) {
      res.status(400).json({ error: 'Missing comics' });
      return;
    }

    const comicFiles = getUserComicsFiles(userId);
    const missing: { title: string; author: string }[] = [];
    let updatedCount = 0;

    for (const rawComic of comics) {
      const title = normalizeString(rawComic?.title, 'title');
      const author = normalizeString(rawComic?.author, 'author');
      if (!title || !author) {
        res.status(400).json({ error: 'Missing title or author' });
        return;
      }

      const payload = {
        title,
        author,
        readTimes: normalizeNumber(rawComic?.readTimes, 'readTimes'),
      };

      let updated = false;
      for (const filePath of comicFiles) {
        if (updateComicInFile(filePath, payload)) {
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
