const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserReadlistChildrenBooksFiles,
  parseChildrenBooksFromFile,
} = require('../../utils/children-books/children-books-utils');

import type { UserChildrenBook } from '../../../src/app/models/children-book-model';

const router = express.Router();

router.get('/readlist/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const childrenBookFiles = getUserReadlistChildrenBooksFiles(userId);
    const childrenBooks: UserChildrenBook[] = childrenBookFiles.flatMap((childrenBookFile: string) => {
      const fileContent = fs.readFileSync(childrenBookFile, 'utf8');
      return parseChildrenBooksFromFile(fileContent);
    });

    res.json(childrenBooks);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
