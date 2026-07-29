const express = require('express');
const fs = require('fs');
const {
  getBaseBdsFiles,
  parseBaseBdsFullFromFile,
} = require('../../utils/bds/bds-utils');
const { toLightBd } = require('../../utils/entity-light-mappers');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseBdsFiles();
    const bds = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseBdsFullFromFile(content);
    });

    res.json(bds);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.get('/entities/light', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseBdsFiles();
    const bds = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseBdsFullFromFile(content).map(toLightBd);
    });

    res.json(bds);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
