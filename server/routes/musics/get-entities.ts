const express = require('express');
const fs = require('fs');
const {
  getBaseMusicsFiles,
  parseBaseMusicsFullFromFile,
} = require('../../utils/musics/musics-utils');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseMusicsFiles();
    const musics = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseMusicsFullFromFile(content);
    });

    res.json(musics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
