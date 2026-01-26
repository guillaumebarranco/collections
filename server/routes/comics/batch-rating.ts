const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  updateComicInFile,
  getUserComicsFiles,
} = require('../../utils/comics/comics-utils');

const router = express.Router();

router.post('/batch-rating', (req: any, res: any) => {
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

    const files = getUserComicsFiles(userId);
    if (!files.length) {
      res.status(404).json({ error: 'User comics not found' });
      return;
    }

    const missing: { title: string; writer: string }[] = [];
    let updatedCount = 0;

    comics.forEach((rawComic: any) => {
      const title = normalizeString(rawComic?.title, 'title');
      const writer = normalizeString(rawComic?.writer, 'writer');
      if (!title || !writer) {
        return;
      }

      const payload = {
        title,
        writer,
        rating: normalizeNumber(rawComic?.rating, 'rating'),
      };

      let updated = false;
      for (const filePath of files) {
        if (updateComicInFile(filePath, payload)) {
          updated = true;
          updatedCount += 1;
          break;
        }
      }

      if (!updated) {
        missing.push({ title, writer });
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
