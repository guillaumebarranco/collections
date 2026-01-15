const express = require('express');
const fs = require('fs');
const {
  getBaseMoviesFiles,
  parseBaseMoviesFullFromFile,
} = require('../../utils/movies/movies-utils');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseMoviesFiles();
    const movies = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseMoviesFullFromFile(content);
    });

    res.json(movies);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
