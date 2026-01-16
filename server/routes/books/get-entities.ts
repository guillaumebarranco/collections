const express = require('express');
const fs = require('fs');
const {
  getBaseBooksFiles,
  parseBaseBooksFullFromFile,
} = require('../../utils/books/books-utils');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseBooksFiles();
    const books = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseBooksFullFromFile(content);
    });

    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
