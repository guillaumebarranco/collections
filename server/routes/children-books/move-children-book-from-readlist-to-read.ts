const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { escapeStringForTsDoubleQuote: escapeString } = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseChildrenBooksFromFile,
  getUserChildrenBooksFiles,
  removeChildrenBookFromFile,
  getUserReadlistChildrenBooksFiles,
} = require('../../utils/children-books/children-books-utils');

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

function formatUserChildrenBook(childrenBook: any, options?: { rating?: number; ratingComment?: string }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const readDate = `${year}-${month}-${day}`;
  const rating = options?.rating != null ? Number(options.rating) : 0;
  const ratingComment = typeof options?.ratingComment === 'string' ? options.ratingComment : '';
  const borrowed = typeof childrenBook.borrowed === 'string' ? childrenBook.borrowed : '';
  const loaned = typeof childrenBook.loaned === 'string' ? childrenBook.loaned : '';
  const otherReadDates = Array.isArray(childrenBook.otherReadDates)
    ? childrenBook.otherReadDates
    : [];
  const otherReadDatesTs =
    otherReadDates.length === 0
      ? '[]'
      : `[${otherReadDates.map((d: string) => `"${escapeString(d)}"`).join(', ')}]`;

  return `  {
    title: "${escapeString(childrenBook.title)}",
    author: "${escapeString(childrenBook.author)}",
    firstReadDate: "${readDate}",
    lastReadDate: "${readDate}",
    otherReadDates: ${otherReadDatesTs},
    rating: ${rating},
    reading: false,
    readTimes: 1,
    owned: ${childrenBook.owned ?? false},
    borrowed: "${escapeString(borrowed)}",
    loaned: "${escapeString(loaned)}",
    readPriority: ${childrenBook.readPriority ?? 1},
    wantToReadAgain: ${childrenBook.wantToReadAgain ?? false},
    ratingComment: "${escapeString(ratingComment)}",
  },`;
}

function findReadlistChildrenBook(userId: string, title: string, author: string) {
  const readlistFiles = getUserReadlistChildrenBooksFiles(userId);
  for (const childrenBookFile of readlistFiles) {
    const fileContent = fs.readFileSync(childrenBookFile, 'utf8');
    const childrenBooks = parseChildrenBooksFromFile(fileContent);
    const found = childrenBooks.find(
      (childrenBook: any) => childrenBook.title === title && childrenBook.author === author
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

function mergeChildrenBookWithReadlistMetadata(requestChildrenBook: any, readlistChildrenBook: any | null) {
  return {
    ...requestChildrenBook,
    borrowed: pickPreservedString(readlistChildrenBook?.borrowed, requestChildrenBook.borrowed),
    loaned: pickPreservedString(readlistChildrenBook?.loaned, requestChildrenBook.loaned),
    owned: readlistChildrenBook?.owned ?? requestChildrenBook.owned ?? false,
    otherReadDates: pickPreservedOtherReadDates(
      readlistChildrenBook?.otherReadDates,
      requestChildrenBook.otherReadDates
    ),
    readPriority: requestChildrenBook.readPriority ?? readlistChildrenBook?.readPriority ?? 1,
    wantToReadAgain:
      requestChildrenBook.wantToReadAgain ?? readlistChildrenBook?.wantToReadAgain ?? false,
  };
}

function formatReadlistChildrenBook(childrenBook: any) {
  return `  {
    title: "${escapeString(childrenBook.title)}",
    author: "${escapeString(childrenBook.author)}",
    firstReadDate: '',
    lastReadDate: '',
    otherReadDates: [],
    rating: 0,
    reading: false,
    readTimes: 0,
    owned: false,
    borrowed: '',
    loaned: '',
    readPriority: ${childrenBook.readPriority ?? 1},
    wantToReadAgain: ${childrenBook.wantToReadAgain ?? false},
    ratingComment: '',
  },`;
}

function getUserChildrenBooksTargetFile(userId: string, isReadlist: boolean) {
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
    'children-books'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User children-books directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file: string) =>
      isReadlist ? file.includes('readlist') : !file.includes('readlist')
    );

  const preferred = files.find((file: string) =>
    isReadlist
      ? file.includes(`${userId}_readlist_children_books`)
      : file.includes(`${userId}_children_books`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User children-books file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/move-children-book-from-readlist-to-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    ensureUserExists(userId);

    const childrenBooks = Array.isArray(input['children-books']) ? input['children-books'] : [];
    const isReadlist = normalizeBoolean(input.readlist, 'readlist') ?? false;
    const rating = input.rating != null ? Number(input.rating) : undefined;
    const ratingComment = typeof input.ratingComment === 'string' ? input.ratingComment : undefined;
    const normalizedChildrenBooks = childrenBooks
      .map((childrenBook: any) => ({
        title: normalizeString(childrenBook.title, 'title'),
        author: normalizeString(childrenBook.author, 'author'),
        readPriority: childrenBook.readPriority,
        wantToReadAgain: childrenBook.wantToReadAgain,
        borrowed: typeof childrenBook.borrowed === 'string' ? childrenBook.borrowed : '',
        loaned: typeof childrenBook.loaned === 'string' ? childrenBook.loaned : '',
        owned: childrenBook.owned ?? false,
        otherReadDates: Array.isArray(childrenBook.otherReadDates) ? childrenBook.otherReadDates : [],
      }))
      .filter((childrenBook: any) => childrenBook.title && childrenBook.author);

    if (normalizedChildrenBooks.length === 0) {
      res.status(400).json({ error: 'Missing children-books' });
      return;
    }

    const userFiles = getUserChildrenBooksFiles(userId);
    const existing = userFiles.flatMap((childrenBookFile: string) => {
      const fileContent = fs.readFileSync(childrenBookFile, 'utf8');
      return parseChildrenBooksFromFile(fileContent).map((childrenBook: any) => ({
        title: childrenBook.title,
        author: childrenBook.author,
      }));
    });

    const existingSet = new Set(
      existing.map((childrenBook: any) => `${childrenBook.title}|${childrenBook.author}`)
    );

    const toAdd = normalizedChildrenBooks.filter(
      (childrenBook: any) => !existingSet.has(`${childrenBook.title}|${childrenBook.author}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'ChildrenBooks already exist for user' });
      return;
    }

    const userFile = getUserChildrenBooksTargetFile(userId, isReadlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const reviewOptions = (rating != null || ratingComment != null) ? { rating, ratingComment } : undefined;
    for (const childrenBook of toAdd) {
      const readlistChildrenBook = findReadlistChildrenBook(userId, childrenBook.title, childrenBook.author);
      const childrenBookWithMetadata = mergeChildrenBookWithReadlistMetadata(childrenBook, readlistChildrenBook);
      nextContent = appendObjectToArrayFile(
        userFile,
        isReadlist
          ? formatReadlistChildrenBook(childrenBookWithMetadata)
          : formatUserChildrenBook(childrenBookWithMetadata, reviewOptions)
      );
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const readlistFiles = getUserReadlistChildrenBooksFiles(userId);

    let updatedFile: string | null = null;

    const title = normalizeString(toAdd[0].title, 'title');
    const author = normalizeString(toAdd[0].author, 'author');

    for (const childrenBookFile of readlistFiles) {
      const fileContent = fs.readFileSync(childrenBookFile, 'utf8');
      try {
        const updatedContent = removeChildrenBookFromFile(fileContent, {
          title,
          author,
        });
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
      added: toAdd.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
