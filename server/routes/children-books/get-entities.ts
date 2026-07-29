const express = require('express');
const fs = require('fs');
const {
  getBaseChildrenBooksFiles,
  parseBaseChildrenBooksFullFromFile,
} = require('../../utils/children-books/children-books-utils');
const { toLightBook } = require('../../utils/entity-light-mappers');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseChildrenBooksFiles();
    const books = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseChildrenBooksFullFromFile(content);
    });

    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.get('/entities/light', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseChildrenBooksFiles();
    const books = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseChildrenBooksFullFromFile(content).map(toLightBook);
    });

    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
