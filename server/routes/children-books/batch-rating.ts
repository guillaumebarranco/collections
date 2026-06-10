const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  updateChildrenBookInFile,
  getUserChildrenBooksFiles,
} = require('../../utils/children-books/children-books-utils');

const router = express.Router();

router.post('/batch-rating', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const childrenBooks = Array.isArray(input['children-books']) ? input['children-books'] : [];
    if (childrenBooks.length === 0) {
      res.status(400).json({ error: 'Missing children-books' });
      return;
    }

    const childrenBookFiles = getUserChildrenBooksFiles(userId);
    const fileState = new Map(
      childrenBookFiles.map((filePath: string) => [
        filePath,
        { content: fs.readFileSync(filePath, 'utf8'), dirty: false },
      ])
    );

    const missing: { title: string; author: string }[] = [];
    let updatedCount = 0;

    for (const rawChildrenBook of childrenBooks) {
      const title = normalizeString(rawChildrenBook?.title, 'title');
      const author = normalizeString(rawChildrenBook?.author, 'author');
      if (!title || !author) {
        res.status(400).json({ error: 'Missing title or author' });
        return;
      }

      const payload = {
        title,
        author,
        rating: normalizeNumber(rawChildrenBook?.rating, 'rating'),
      };

      let updated = false;
      for (const [filePath, state] of fileState.entries()) {
        const stateObject = state as { content: string; dirty: boolean };
        try {
          const nextContent = updateChildrenBookInFile(stateObject.content, payload);
          stateObject.content = nextContent;
          stateObject.dirty = true;
          updated = true;
          updatedCount += 1;
          break;
        } catch (error: any) {
          if (error.message !== 'ChildrenBook not found') {
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
