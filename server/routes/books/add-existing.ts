const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeString,
  appendObjectToArrayFile,
  parseBooksFromFile,
  getUserBooksFiles,
} = require('../../utils/books/books-utils');

const router = express.Router();

function escapeString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatUserBook(book: any) {
  return `  {\n    title: '${escapeString(book.title)}',\n    author: '${escapeString(
    book.author
  )}',\n    readDate: '',\n    rating: 0,\n    readTimes: 1,\n  },`;
}

function getUserBooksTargetFile(userId: string) {
  const userDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'app',
    'utils',
    'users',
    userId,
    'books'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User books directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        !file.includes('readlist')
    );

  const preferred = files.find((file: string) =>
    file.includes(`${userId}_books`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User books file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/add-existing', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const books = Array.isArray(input.books) ? input.books : [];
    const normalizedBooks = books
      .map((book: any) => ({
        title: normalizeString(book.title, 'title'),
        author: normalizeString(book.author, 'author'),
      }))
      .filter((book: any) => book.title && book.author);

    if (normalizedBooks.length === 0) {
      res.status(400).json({ error: 'Missing books' });
      return;
    }

    const userFiles = getUserBooksFiles(userId);
    const existing = userFiles.flatMap((bookFile: string) => {
      const fileContent = fs.readFileSync(bookFile, 'utf8');
      return parseBooksFromFile(fileContent).map((book: any) => ({
        title: book.title,
        author: book.author,
      }));
    });

    const existingSet = new Set(
      existing.map((book: any) => `${book.title}|${book.author}`)
    );

    const toAdd = normalizedBooks.filter(
      (book: any) => !existingSet.has(`${book.title}|${book.author}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Books already exist for user' });
      return;
    }

    const userFile = getUserBooksTargetFile(userId);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    for (const book of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserBook(book));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    res.json({
      ok: true,
      added: toAdd.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
