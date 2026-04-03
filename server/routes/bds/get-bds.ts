const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserBdsFiles,
  parseBdsFromFile,
} = require('../../utils/bds/bds-utils');

import type { UserBd } from '../../../src/app/models/bd-model';

const router = express.Router();

router.get('/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const bdFiles = getUserBdsFiles(userId);
    const bds: UserBd[] = bdFiles.flatMap((bdFile: string) => {
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
