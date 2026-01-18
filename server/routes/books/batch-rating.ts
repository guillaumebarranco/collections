const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  updateBookInFile,
  getUserBooksFiles,
} = require('../../utils/books/books-utils');

const router = express.Router();

router.post('/batch-rating', (req: any, res: any) => {
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
        rating: normalizeNumber(rawBook?.rating, 'rating'),
      };

      let updated = false;
      for (const [filePath, state] of fileState.entries()) {
        try {
          const nextContent = updateBookInFile(state.content, payload);
          state.content = nextContent;
          state.dirty = true;
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
      if (!state.dirty) continue;
      fs.writeFileSync(filePath, state.content, 'utf8');
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
