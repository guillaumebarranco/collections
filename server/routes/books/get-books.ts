const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserBooksFiles,
  parseBooksFromFile,
} = require('../../utils/books/books-utils');

const router = express.Router();

router.get('/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const bookFiles = getUserBooksFiles(userId);
    const books = bookFiles.flatMap((bookFile: string) => {
      const fileContent = fs.readFileSync(bookFile, 'utf8');
      return parseBooksFromFile(fileContent);
    });

    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
