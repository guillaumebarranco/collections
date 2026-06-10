const express = require('express');
const fs = require('fs');
const {
  getBaseChildrenBooksFiles,
  parseBaseChildrenBooksFullFromFile,
} = require('../../utils/children-books/children-books-utils');

import type { BaseChildrenBook } from '../../../src/app/models/children-book-model';

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseChildrenBooksFiles();
    const childrenBooks: BaseChildrenBook[] = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseChildrenBooksFullFromFile(content);
    });

    res.json(childrenBooks);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
