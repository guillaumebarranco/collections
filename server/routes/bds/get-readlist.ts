const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserReadlistBdsFiles,
  parseBdsFromFile,
} = require('../../utils/bds/bds-utils');

const router = express.Router();

router.get('/readlist/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const bdFiles = getUserReadlistBdsFiles(userId);
    const bds = bdFiles.flatMap((bdFile: string) => {
      const fileContent = fs.readFileSync(bdFile, 'utf8');
      return parseBdsFromFile(fileContent);
    });

    res.json(bds);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
