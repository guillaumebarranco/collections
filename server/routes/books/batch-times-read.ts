const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  updateBookInFile,
  getUserBooksFiles,
} = require('../../utils/books/books-utils');

const router = express.Router();

router.post('/batch-times-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const books = Array.isArray(input.books) ? input.books : [];
    if (books.length === 0) {
      res.status(400).json({ error: 'Missing books' });
      return;
    }

    const bookFiles = getUserBooksFiles(userId);
    const fileState = new Map(
      bookFiles.map((filePath: string) => [
        filePath,
        { content: fs.readFileSync(filePath, 'utf8'), dirty: false },
      ])
    );

    const missing: { title: string; author: string }[] = [];
    let updatedCount = 0;

    for (const rawBook of books) {
      const title = normalizeString(rawBook?.title, 'title');
      const author = normalizeString(rawBook?.author, 'author');
      if (!title || !author) {
        res.status(400).json({ error: 'Missing title or author' });
        return;
      }

      const payload = {
        title,
        author,
        readTimes: normalizeNumber(rawBook?.readTimes, 'readTimes'),
      };

      let updated = false;
      for (const [filePath, state] of fileState.entries()) {
        const stateObject = state as { content: string; dirty: boolean };
        try {
          const nextContent = updateBookInFile(stateObject.content, payload);
          stateObject.content = nextContent;
          stateObject.dirty = true;
          updated = true;
          updatedCount += 1;
          break;
        } catch (error: any) {
          if (error.message !== 'Book not found') {
            throw error;
          }
        }
      }

      if (!updated) {
        missing.push({ title, author });
      }
    }

    for (const [filePath, state] of fileState.entries()) {
      const stateObject = state as { content: string; dirty: boolean };
      if (!stateObject.dirty) continue;
      fs.writeFileSync(filePath, stateObject.content, 'utf8');
    }

    res.json({
      ok: true,
      updatedCount,
      missing,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
