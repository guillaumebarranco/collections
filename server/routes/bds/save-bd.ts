const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  updateBdInFile,
  getUserBdsFiles,
} = require('../../utils/bds/bds-utils');

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
    const author = normalizeString(input.author, 'author');
    if (!title || !author) {
      res.status(400).json({ error: 'Missing title or author' });
      return;
    }

    const payload = {
      title,
      author,
      rating: normalizeNumber(input.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(input.readTimes, 'readTimes') ?? 1,
      readDate: normalizeString(input.readDate, 'readDate') || '',
    };

    const bdFiles = getUserBdsFiles(userId);
    if (!bdFiles.length) {
      res.status(404).json({ error: 'User bds not found' });
      return;
    }

    let updatedCount = 0;
    for (const filePath of bdFiles) {
      if (updateBdInFile(filePath, payload)) {
        updatedCount += 1;
      }
    }

    if (!updatedCount) {
      res.status(404).json({ error: 'Bd not found' });
      return;
    }

    res.json({ ok: true, updated: updatedCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
