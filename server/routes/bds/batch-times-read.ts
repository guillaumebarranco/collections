const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  updateBdInFile,
  getUserBdsFiles,
} = require('../../utils/bds/bds-utils');

const router = express.Router();

router.post('/batch-times-read', (req: any, res: any) => {
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

    const bdFiles = getUserBdsFiles(userId);
    const missing: { title: string; designer: string }[] = [];
    let updatedCount = 0;

    for (const rawBd of bds) {
      const title = normalizeString(rawBd?.title, 'title');
      const designer = normalizeString(rawBd?.designer, 'designer');
      if (!title || !designer) {
        res.status(400).json({ error: 'Missing title or designer' });
        return;
      }

      const payload = {
        title,
        designer,
        readTimes: normalizeNumber(rawBd?.readTimes, 'readTimes'),
      };

      let updated = false;
      for (const filePath of bdFiles) {
        if (updateBdInFile(filePath, payload)) {
          updated = true;
          updatedCount += 1;
          break;
        }
      }

      if (!updated) {
        missing.push({ title, designer });
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
