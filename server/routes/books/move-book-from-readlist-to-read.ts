const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseBooksFromFile,
  getUserBooksFiles,
  removeBookFromFile,
  getUserReadlistBooksFiles,
} = require('../../utils/books/books-utils');

const router = express.Router();

const usersRootDir = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const createUserScript = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'scripts',
  'create-user-files.js'
);

function ensureUserExists(userId: string) {
  const userDir = path.join(usersRootDir, userId);
  if (fs.existsSync(userDir)) {
    return;
  }
  console.log('creation user', userId);
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild
    ? [createUserScript, userId, '--build']
    : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function formatUserBook(book: any, options?: { rating?: number; ratingComment?: string }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const readDate = `${year}-${month}-${day}`;
  const rating = options?.rating != null ? Number(options.rating) : 0;
  const ratingComment = typeof options?.ratingComment === 'string' ? options.ratingComment : '';

  return `  {
    title: '${escapeString(book.title)}',
    author: '${escapeString(book.author)}',
    readDate: '${readDate}',
    rating: ${rating},
    readTimes: 1,
    owned: false,
    readPriority: ${book.readPriority ?? 1},
    wantToReadAgain: ${book.wantToReadAgain ?? false},
    ratingComment: '${escapeString(ratingComment)}',
  },`;
}

function formatReadlistBook(book: any) {
  return `  {
    title: '${escapeString(book.title)}',
    author: '${escapeString(book.author)}',
    readDate: '',
    rating: 0,
    readTimes: 0,
    owned: false,
    readPriority: ${book.readPriority ?? 1},
    wantToReadAgain: ${book.wantToReadAgain ?? false},
    ratingComment: '',
  },`;
}

/** Échappe une chaîne pour l’injection dans un fichier .ts (chaîne entre simples quotes). */
function escapeString(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function getUserBooksTargetFile(userId: string, isReadlist: boolean) {
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
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file: string) =>
      isReadlist ? file.includes('readlist') : !file.includes('readlist')
    );

  const preferred = files.find((file: string) =>
    isReadlist
      ? file.includes(`${userId}_readlist_books`)
      : file.includes(`${userId}_books`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User books file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/move-book-from-readlist-to-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    ensureUserExists(userId);

    const books = Array.isArray(input.books) ? input.books : [];
    const isReadlist = normalizeBoolean(input.readlist, 'readlist') ?? false;
    const rating = input.rating != null ? Number(input.rating) : undefined;
    const ratingComment = typeof input.ratingComment === 'string' ? input.ratingComment : undefined;
    const normalizedBooks = books
      .map((book: any) => ({
        title: normalizeString(book.title, 'title'),
        author: normalizeString(book.author, 'author'),
        readPriority: book.readPriority,
        wantToReadAgain: book.wantToReadAgain,
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

    const userFile = getUserBooksTargetFile(userId, isReadlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const reviewOptions = (rating != null || ratingComment != null) ? { rating, ratingComment } : undefined;
    for (const book of toAdd) {
      nextContent = appendObjectToArrayFile(
        userFile,
        isReadlist ? formatReadlistBook(book) : formatUserBook(book, reviewOptions)
      );
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const readlistFiles = getUserReadlistBooksFiles(userId);

    let updatedFile: string | null = null;

    const title = normalizeString(toAdd[0].title, 'title');
    const author = normalizeString(toAdd[0].author, 'author');

    for (const bookFile of readlistFiles) {
      const fileContent = fs.readFileSync(bookFile, 'utf8');
      try {
        const updatedContent = removeBookFromFile(fileContent, {
          title,
          author,
        });
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
      added: toAdd.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
