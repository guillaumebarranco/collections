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
  const borrowed = typeof book.borrowed === 'string' ? book.borrowed : '';
  const loaned = typeof book.loaned === 'string' ? book.loaned : '';
  const otherReadDates = Array.isArray(book.otherReadDates)
    ? book.otherReadDates
    : [];
  const otherReadDatesTs =
    otherReadDates.length === 0
      ? '[]'
      : `[${otherReadDates.map((d: string) => `"${escapeString(d)}"`).join(', ')}]`;

  return `  {
    title: "${escapeString(book.title)}",
    author: "${escapeString(book.author)}",
    firstReadDate: "${readDate}",
    lastReadDate: "${readDate}",
    otherReadDates: ${otherReadDatesTs},
    rating: ${rating},
    readTimes: 1,
    owned: ${book.owned ?? false},
    borrowed: "${escapeString(borrowed)}",
    loaned: "${escapeString(loaned)}",
    readPriority: ${book.readPriority ?? 1},
    wantToReadAgain: ${book.wantToReadAgain ?? false},
    ratingComment: "${escapeString(ratingComment)}",
  },`;
}

function findReadlistBook(userId: string, title: string, author: string) {
  const readlistFiles = getUserReadlistBooksFiles(userId);
  for (const bookFile of readlistFiles) {
    const fileContent = fs.readFileSync(bookFile, 'utf8');
    const books = parseBooksFromFile(fileContent);
    const found = books.find(
      (book: any) => book.title === title && book.author === author
    );
    if (found) {
      return found;
    }
  }
  return null;
}

function pickPreservedString(
  readlistValue: string | undefined,
  requestValue: string | undefined
): string {
  const fromReadlist = typeof readlistValue === 'string' ? readlistValue : '';
  const fromRequest = typeof requestValue === 'string' ? requestValue : '';
  return fromReadlist.trim() ? fromReadlist : fromRequest;
}

function pickPreservedOtherReadDates(
  readlistValue: string[] | undefined,
  requestValue: string[] | undefined
): string[] {
  const fromReadlist = Array.isArray(readlistValue) ? readlistValue : [];
  if (fromReadlist.length > 0) {
    return fromReadlist;
  }
  return Array.isArray(requestValue) ? requestValue : [];
}

function mergeBookWithReadlistMetadata(requestBook: any, readlistBook: any | null) {
  return {
    ...requestBook,
    borrowed: pickPreservedString(readlistBook?.borrowed, requestBook.borrowed),
    loaned: pickPreservedString(readlistBook?.loaned, requestBook.loaned),
    owned: readlistBook?.owned ?? requestBook.owned ?? false,
    otherReadDates: pickPreservedOtherReadDates(
      readlistBook?.otherReadDates,
      requestBook.otherReadDates
    ),
    readPriority: requestBook.readPriority ?? readlistBook?.readPriority ?? 1,
    wantToReadAgain:
      requestBook.wantToReadAgain ?? readlistBook?.wantToReadAgain ?? false,
  };
}

function formatReadlistBook(book: any) {
  return `  {
    title: "${escapeString(book.title)}",
    author: "${escapeString(book.author)}",
    firstReadDate: '',
    lastReadDate: '',
    otherReadDates: [],
    rating: 0,
    readTimes: 0,
    owned: false,
    borrowed: '',
    loaned: '',
    readPriority: ${book.readPriority ?? 1},
    wantToReadAgain: ${book.wantToReadAgain ?? false},
    ratingComment: '',
  },`;
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
        borrowed: typeof book.borrowed === 'string' ? book.borrowed : '',
        loaned: typeof book.loaned === 'string' ? book.loaned : '',
        owned: book.owned ?? false,
        otherReadDates: Array.isArray(book.otherReadDates) ? book.otherReadDates : [],
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
      const readlistBook = findReadlistBook(userId, book.title, book.author);
      const bookWithMetadata = mergeBookWithReadlistMetadata(book, readlistBook);
      nextContent = appendObjectToArrayFile(
        userFile,
        isReadlist
          ? formatReadlistBook(bookWithMetadata)
          : formatUserBook(bookWithMetadata, reviewOptions)
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
