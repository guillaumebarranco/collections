const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { escapeStringForTsDoubleQuote: escapeString } = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseBooksFromFile,
  getUserBooksFiles,
  getUserReadlistBooksFiles,
  removeBookFromFile,
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

function formatUserBook(book: any) {
  return `  {\n    title: "${escapeString(
    book.title
  )}",\n    author: "${escapeString(
    book.author
  )}",\n    firstReadDate: '',\n    lastReadDate: '',\n    otherReadDates: [],\n    rating: 0,\n    reading: false,\n    readTimes: 1,\n    owned: false,\n    borrowed: '',\n    loaned: '',\n    readPriority: 1,\n    wantToReadAgain: false,\n    ratingComment: '',\n    quotes: [],\n  },`;
}

function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatOtherReadDates(otherReadDates: unknown): string {
  if (!Array.isArray(otherReadDates) || otherReadDates.length === 0) {
    return '[]';
  }
  return (
    '[' +
    otherReadDates
      .filter((date) => typeof date === 'string' && date.trim())
      .map((date) => `"${escapeString(String(date))}"`)
      .join(', ') +
    ']'
  );
}

/** Livre déjà dans la readlist : passage en « lu » en conservant emprunt, prêt et possession. */
function formatReadBookFromReadlist(book: any) {
  const readDate = getTodayISO();
  const readPriority = Number(book.readPriority);
  return `  {\n    title: "${escapeString(
    book.title
  )}",\n    author: "${escapeString(
    book.author
  )}",\n    firstReadDate: "${readDate}",\n    lastReadDate: "${readDate}",\n    otherReadDates: ${formatOtherReadDates(
    book.otherReadDates
  )},\n    rating: 0,\n    reading: false,\n    readTimes: 1,\n    owned: ${
    book.owned ?? false
  },\n    borrowed: "${escapeString(
    typeof book.borrowed === 'string' ? book.borrowed : ''
  )}",\n    loaned: "${escapeString(
    typeof book.loaned === 'string' ? book.loaned : ''
  )}",\n    readPriority: ${
    Number.isFinite(readPriority) && readPriority > 0 ? readPriority : 1
  },\n    wantToReadAgain: ${
    book.wantToReadAgain ?? false
  },\n    ratingComment: '',\n    quotes: ${formatOtherReadDates(
    book.quotes
  )},\n  },`;
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

router.post('/add-existing', (req: any, res: any) => {
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

    const bookKey = (book: { title: string; author: string }) =>
      `${book.title}|${book.author}`;

    if (isReadlist) {
      const toAdd = normalizedBooks.filter(
        (book: any) => !existingSet.has(bookKey(book))
      );

      if (toAdd.length === 0) {
        res.status(409).json({ error: 'Books already exist for user' });
        return;
      }

      const userFile = getUserBooksTargetFile(userId, true);
      let nextContent = fs.readFileSync(userFile, 'utf8');
      for (const book of toAdd) {
        nextContent = appendObjectToArrayFile(userFile, formatUserBook(book));
        fs.writeFileSync(userFile, nextContent, 'utf8');
      }

      res.json({
        ok: true,
        added: toAdd.length,
        moved: 0,
        file: userFile,
      });
      return;
    }

    const readlistByKey = new Map<string, any>();
    for (const readlistFile of getUserReadlistBooksFiles(userId)) {
      const fileContent = fs.readFileSync(readlistFile, 'utf8');
      for (const book of parseBooksFromFile(fileContent)) {
        readlistByKey.set(bookKey(book), book);
      }
    }

    const toAdd: any[] = [];
    const toMove: any[] = [];
    for (const book of normalizedBooks) {
      const key = bookKey(book);
      if (existingSet.has(key)) continue;
      const readlistBook = readlistByKey.get(key);
      if (readlistBook) {
        toMove.push(readlistBook);
      } else {
        toAdd.push(book);
      }
    }

    if (toAdd.length === 0 && toMove.length === 0) {
      res.status(409).json({ error: 'Books already exist for user' });
      return;
    }

    const userFile = getUserBooksTargetFile(userId, false);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    for (const book of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserBook(book));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }
    for (const book of toMove) {
      nextContent = appendObjectToArrayFile(
        userFile,
        formatReadBookFromReadlist(book)
      );
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const readlistFiles = getUserReadlistBooksFiles(userId);
    for (const book of toMove) {
      for (const readlistFile of readlistFiles) {
        const fileContent = fs.readFileSync(readlistFile, 'utf8');
        try {
          const updatedContent = removeBookFromFile(fileContent, {
            title: book.title,
            author: book.author,
          });
          fs.writeFileSync(readlistFile, updatedContent, 'utf8');
          break;
        } catch (error: any) {
          if (error.message !== 'Book not found') {
            throw error;
          }
        }
      }
    }

    res.json({
      ok: true,
      added: toAdd.length,
      moved: toMove.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
