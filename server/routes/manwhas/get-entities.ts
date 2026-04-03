const express = require('express');
const fs = require('fs');
const {
  getBaseManwhasFiles,
  parseBaseManwhasFullFromFile,
} = require('../../utils/manwhas/manwhas-utils');

import type { BaseManwha } from '../../../src/app/models/manwha-model';

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseManwhasFiles();
    const manwhas: BaseManwha[] = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseManwhasFullFromFile(content);
    });

    res.json(manwhas);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
