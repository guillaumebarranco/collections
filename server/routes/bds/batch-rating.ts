const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  updateBdInFile,
  getUserBdsFiles,
} = require('../../utils/bds/bds-utils');

const router = express.Router();

router.post('/batch-rating', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const bds = Array.isArray(input.bds) ? input.bds : [];
    if (bds.length === 0) {
      res.status(400).json({ error: 'Missing bds' });
      return;
    }

    const files = getUserBdsFiles(userId);
    if (!files.length) {
      res.status(404).json({ error: 'User bds not found' });
      return;
    }

    const missing: { title: string; writer: string }[] = [];
    let updatedCount = 0;

    bds.forEach((rawBd: any) => {
      const title = normalizeString(rawBd?.title, 'title');
      const writer = normalizeString(rawBd?.writer, 'writer');
      if (!title || !writer) {
        return;
      }

      const payload = {
        title,
        writer,
        rating: normalizeNumber(rawBd?.rating, 'rating'),
      };

      let updated = false;
      for (const filePath of files) {
        if (updateBdInFile(filePath, payload)) {
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
