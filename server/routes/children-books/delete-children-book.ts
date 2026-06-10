const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeChildrenBookFromFile,
  getUserChildrenBooksFiles,
} = require('../../utils/children-books/children-books-utils');

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

    const childrenBookFiles = getUserChildrenBooksFiles(userId);
    let updatedFile: string | null = null;

    for (const childrenBookFile of childrenBookFiles) {
      const fileContent = fs.readFileSync(childrenBookFile, 'utf8');
      try {
        const updatedContent = removeChildrenBookFromFile(fileContent, { title, author });
        fs.writeFileSync(childrenBookFile, updatedContent, 'utf8');
        updatedFile = childrenBookFile;
        break;
      } catch (error: any) {
        if (error.message !== 'ChildrenBook not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'ChildrenBook not found' });
      return;
    }

    res.json({
      ok: true,
      childrenBook: { title, author },
      file: updatedFile,
    });

    console.log(
      'children-book:delete',
      JSON.stringify({ file: updatedFile, title, author })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
