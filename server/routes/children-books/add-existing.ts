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

function formatUserChildrenBook(childrenBook: any) {
  return `  {\n    title: "${escapeString(
    childrenBook.title
  )}",\n    author: "${escapeString(
    childrenBook.author
  )}",\n    firstReadDate: '',\n    lastReadDate: '',\n    otherReadDates: [],\n    rating: 0,\n    reading: false,\n    readTimes: 1,\n    owned: false,\n    borrowed: '',\n    loaned: '',\n    readPriority: 1,\n    wantToReadAgain: false,\n    ratingComment: '',\n  },`;
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

router.post('/add-existing', (req: any, res: any) => {
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
    const normalizedChildrenBooks = childrenBooks
      .map((childrenBook: any) => ({
        title: normalizeString(childrenBook.title, 'title'),
        author: normalizeString(childrenBook.author, 'author'),
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
    for (const childrenBook of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserChildrenBook(childrenBook));
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
