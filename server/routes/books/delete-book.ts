const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeBookFromFile,
  getUserBooksFiles,
} = require('../../utils/books/books-utils');

const router = express.Router();

router.post('/delete', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const title = normalizeString(input.title, 'title');
    const author = normalizeString(input.author, 'author');
    if (!title || !author) {
      res.status(400).json({ error: 'Missing title or author' });
      return;
    }

    const bookFiles = getUserBooksFiles(userId);
    let updatedFile: string | null = null;

    for (const bookFile of bookFiles) {
      const fileContent = fs.readFileSync(bookFile, 'utf8');
      try {
        const updatedContent = removeBookFromFile(fileContent, { title, author });
        fs.writeFileSync(bookFile, updatedContent, 'utf8');
        updatedFile = bookFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Book not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    res.json({
      ok: true,
      book: { title, author },
      file: updatedFile,
    });

    console.log(
      'book:delete',
      JSON.stringify({ file: updatedFile, title, author })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
