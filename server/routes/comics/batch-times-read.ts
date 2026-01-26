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
    const missing: { title: string; writer: string }[] = [];
    let updatedCount = 0;

    for (const rawComic of comics) {
      const title = normalizeString(rawComic?.title, 'title');
      const writer = normalizeString(rawComic?.writer, 'writer');
      if (!title || !writer) {
        res.status(400).json({ error: 'Missing title or writer' });
        return;
      }

      const payload = {
        title,
        writer,
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
        missing.push({ title, writer });
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
