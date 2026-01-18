const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  updateManwhaInFile,
  getUserManwhasFiles,
} = require('../../utils/manwhas/manwhas-utils');

const router = express.Router();

router.post('/batch-times-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const manwhas = Array.isArray(input.manwhas) ? input.manwhas : [];
    if (manwhas.length === 0) {
      res.status(400).json({ error: 'Missing manwhas' });
      return;
    }

    const manwhaFiles = getUserManwhasFiles(userId);
    const missing: { title: string; author: string }[] = [];
    let updatedCount = 0;

    for (const rawManwha of manwhas) {
      const title = normalizeString(rawManwha?.title, 'title');
      const author = normalizeString(rawManwha?.author, 'author');
      if (!title || !author) {
        res.status(400).json({ error: 'Missing title or author' });
        return;
      }

      const payload = {
        title,
        author,
        readTimes: normalizeNumber(rawManwha?.readTimes, 'readTimes'),
      };

      let updated = false;
      for (const filePath of manwhaFiles) {
        if (updateManwhaInFile(filePath, payload)) {
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
