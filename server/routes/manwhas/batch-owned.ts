const express = require('express');
const {
  normalizeBoolean,
  normalizeString,
  updateManwhaInFile,
  getUserManwhasFiles,
} = require('../../utils/manwhas/manwhas-utils');

const router = express.Router();

router.post('/batch-owned', (req: any, res: any) => {
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

    const files = getUserManwhasFiles(userId);
    if (!files.length) {
      res.status(404).json({ error: 'User manwhas not found' });
      return;
    }

    const missing: { title: string; author: string }[] = [];
    let updatedCount = 0;

    manwhas.forEach((rawManwha: any) => {
      const title = normalizeString(rawManwha?.title, 'title');
      const author = normalizeString(rawManwha?.author, 'author');
      if (!title || !author) {
        return;
      }

      const payload = {
        title,
        author,
        owned: normalizeBoolean(rawManwha?.owned, 'owned'),
      };

      let updated = false;
      for (const filePath of files) {
        if (updateManwhaInFile(filePath, payload)) {
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
