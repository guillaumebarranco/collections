const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserReadlistManwhasFiles,
  parseManwhasFromFile,
} = require('../../utils/manwhas/manwhas-utils');

const router = express.Router();

router.get('/readlist/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const manwhaFiles = getUserReadlistManwhasFiles(userId);
    const manwhas = manwhaFiles.flatMap((manwhaFile: string) => {
      const fileContent = fs.readFileSync(manwhaFile, 'utf8');
      return parseManwhasFromFile(fileContent);
    });

    res.json(manwhas);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
