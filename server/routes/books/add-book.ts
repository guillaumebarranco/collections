const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  escapeString,
  appendObjectToArrayFile,
  baseBookExists,
  BASE_BOOKS_API_FILE,
} = require('../../utils/books/books-utils');

const router = express.Router();

function formatBaseBook(entity: any): string {
  return `  {
    title: '${escapeString(entity.title)}',
    author: '${escapeString(entity.author)}',
    coverUrl: '${escapeString(entity.coverUrl || '')}',
    pages: ${entity.pages || 0},
    genre: '${escapeString(entity.genre || '')}',
    saga: '${escapeString(entity.saga || '')}',
    sagaOrder: ${entity.sagaOrder || 0},
    sagaFinished: ${entity.sagaFinished ?? false},
    releaseDate: '${escapeString(entity.releaseDate || '')}',
    description: '${escapeString(entity.description ?? '')}',
    countryOrigin: '${escapeString(entity.countryOrigin ?? '')}',
  },`;
}

function formatUserBook(user: any): string {
  return `  {
    title: '${escapeString(user.title)}',
    author: '${escapeString(user.author)}',
    firstReadDate: '${escapeString(user.firstReadDate || '')}',
    lastReadDate: '${escapeString(user.lastReadDate || '')}',
    rating: ${user.rating ?? 0},
    readTimes: ${user.readTimes ?? 1},
    owned: ${user.owned ?? false},
    borrowed: ${user.borrowed ?? false},
    readPriority: ${user.readPriority ?? 1},
    wantToReadAgain: ${user.wantToReadAgain ?? false},
    ratingComment: '${escapeString(user.ratingComment ?? '')}',
  },`;
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

router.post('/add', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const entity = input.entity || {};
    const user = input.user || {};

    const title = normalizeString(entity.title, 'title');
    const author = normalizeString(entity.author, 'author');
    if (!title || !author) {
      res.status(400).json({ error: 'Missing title or author' });
      return;
    }

    if (baseBookExists(title, author)) {
      res.status(409).json({ error: 'Book already exists in entities' });
      return;
    }

    const entityPayload = {
      title,
      author,
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      pages: normalizeNumber(entity.pages, 'pages') || 0,
      genre: normalizeString(entity.genre, 'genre') || '',
      saga: normalizeString(entity.saga, 'saga') || '',
      sagaOrder: normalizeNumber(entity.sagaOrder, 'sagaOrder') || 0,
      sagaFinished:
        normalizeBoolean(entity.sagaFinished, 'sagaFinished') ?? false,
      releaseDate: normalizeString(entity.releaseDate, 'releaseDate') || '',
      description: normalizeString(entity.description, 'description') ?? '',
      countryOrigin:
        entity.countryOrigin != null
          ? normalizeString(entity.countryOrigin, 'countryOrigin')
          : '',
    };

    const userPayload = {
      title,
      author,
      rating: normalizeNumber(user.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(user.readTimes, 'readTimes') ?? 1,
      firstReadDate: normalizeString(user.firstReadDate, 'firstReadDate') || '',
      lastReadDate: normalizeString(user.lastReadDate, 'lastReadDate') || '',
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      borrowed: normalizeBoolean(user.borrowed, 'borrowed') ?? false,
      readPriority: normalizeNumber(user.readPriority, 'readPriority') ?? 1,
      wantToReadAgain:
        normalizeBoolean(user.wantToReadAgain, 'wantToReadAgain') ?? false,
      ratingComment:
        normalizeString(user.ratingComment, 'ratingComment') ?? '',
    };

    const baseBookContent = appendObjectToArrayFile(
      BASE_BOOKS_API_FILE,
      formatBaseBook(entityPayload)
    );
    fs.writeFileSync(BASE_BOOKS_API_FILE, baseBookContent, 'utf8');

    if (userId !== 'admin') {
      const userBooksFile = getUserBooksTargetFile(userId);
      const userBookContent = appendObjectToArrayFile(
        userBooksFile,
        formatUserBook(userPayload)
      );
      fs.writeFileSync(userBooksFile, userBookContent, 'utf8');

      res.json({
        ok: true,
        entityFile: BASE_BOOKS_API_FILE,
        userFile: userBooksFile,
      });
    } else {
      res.json({
        ok: true,
        entityFile: BASE_BOOKS_API_FILE,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
