const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  updateComicInFile,
  getUserComicsFiles,
} = require('../../utils/comics/comics-utils');

const router = express.Router();

router.post('/', (req: any, res: any) => {
  try {
    const input = req.body || {};

    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const title = normalizeString(input.title, 'title');
    const designer = normalizeString(input.designer, 'designer');
    if (!title || !designer) {
      res.status(400).json({ error: 'Missing title or designer' });
      return;
    }

    const payload = {
      title,
      designer,
      rating: normalizeNumber(input.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(input.readTimes, 'readTimes') ?? 1,
      readDate: normalizeString(input.readDate, 'readDate') || '',
    };

    const comicFiles = getUserComicsFiles(userId);
    if (!comicFiles.length) {
      res.status(404).json({ error: 'User comics not found' });
      return;
    }

    let updatedCount = 0;
    for (const filePath of comicFiles) {
      if (updateComicInFile(filePath, payload)) {
        updatedCount += 1;
      }
    }

    if (!updatedCount) {
      res.status(404).json({ error: 'Comic not found' });
      return;
    }

    res.json({ ok: true, updated: updatedCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
