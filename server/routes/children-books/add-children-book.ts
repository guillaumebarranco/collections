const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeGenre,
  formatGenreTsArray,
  formatOtherReadDatesTs,
  escapeString,
  appendObjectToArrayFile,
  baseChildrenBookExists,
  BASE_CHILDREN_BOOKS_API_FILE,
} = require('../../utils/children-books/children-books-utils');

const router = express.Router();

function formatBaseChildrenBook(entity: any): string {
  const genreTs = formatGenreTsArray(entity.genre || []);
  return `  {
    title: "${escapeString(entity.title)}",
    author: "${escapeString(entity.author)}",
    coverUrl: "${escapeString(entity.coverUrl || '')}",
    pages: ${entity.pages || 0},
    genre: ${genreTs},
    saga: "${escapeString(entity.saga || '')}",
    sagaOrder: ${entity.sagaOrder || 0},
    sagaFinished: ${entity.sagaFinished ?? false},
    releaseDate: "${escapeString(entity.releaseDate || '')}",
    description: "${escapeString(entity.description ?? '')}",
    countryOrigin: "${escapeString(entity.countryOrigin ?? '')}",
    selectDisplayOrder: ${entity.selectDisplayOrder != null ? Number(entity.selectDisplayOrder) : 0},
  },`;
}

function formatUserChildrenBook(user: any): string {
  return `  {
    title: "${escapeString(user.title)}",
    author: "${escapeString(user.author)}",
    firstReadDate: "${escapeString(user.firstReadDate || '')}",
    lastReadDate: "${escapeString(user.lastReadDate || '')}",
    otherReadDates: ${formatOtherReadDatesTs(
      Array.isArray(user.otherReadDates)
        ? user.otherReadDates.filter((d: unknown) => typeof d === 'string' && d.trim())
        : []
    )},
    rating: ${user.rating ?? 0},
    reading: false,
    readTimes: ${user.readTimes ?? 1},
    owned: ${user.owned ?? false},
    borrowed: "${escapeString(user.borrowed ?? '')}",
    loaned: "${escapeString(user.loaned ?? '')}",
    readPriority: ${user.readPriority ?? 1},
    wantToReadAgain: ${user.wantToReadAgain ?? false},
    ratingComment: "${escapeString(user.ratingComment ?? '')}",
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
    const isReadlist = normalizeBoolean(input.readlist, 'readlist') ?? false;

    const title = normalizeString(entity.title, 'title');
    const author = normalizeString(entity.author, 'author');
    if (!title || !author) {
      res.status(400).json({ error: 'Missing title or author' });
      return;
    }

    if (baseChildrenBookExists(title, author)) {
      res.status(409).json({ error: 'ChildrenBook already exists in entities' });
      return;
    }

    const entityPayload = {
      title,
      author,
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      pages: normalizeNumber(entity.pages, 'pages') || 0,
      genre: normalizeGenre(entity.genre),
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
      readTimes: isReadlist
        ? 0
        : normalizeNumber(user.readTimes, 'readTimes') ?? 1,
      firstReadDate: normalizeString(user.firstReadDate, 'firstReadDate') || '',
      lastReadDate: normalizeString(user.lastReadDate, 'lastReadDate') || '',
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      borrowed: normalizeString(user.borrowed, 'borrowed') ?? '',
      loaned: normalizeString(user.loaned, 'loaned') ?? '',
      readPriority: normalizeNumber(user.readPriority, 'readPriority') ?? 1,
      wantToReadAgain:
        normalizeBoolean(user.wantToReadAgain, 'wantToReadAgain') ?? false,
      ratingComment:
        normalizeString(user.ratingComment, 'ratingComment') ?? '',
      otherReadDates: Array.isArray(user.otherReadDates)
        ? user.otherReadDates.filter(
            (d: unknown) => typeof d === 'string' && d.trim()
          )
        : [],
    };

    const baseChildrenBookContent = appendObjectToArrayFile(
      BASE_CHILDREN_BOOKS_API_FILE,
      formatBaseChildrenBook(entityPayload)
    );
    fs.writeFileSync(BASE_CHILDREN_BOOKS_API_FILE, baseChildrenBookContent, 'utf8');

    if (userId !== 'admin') {
      const userChildrenBooksFile = getUserChildrenBooksTargetFile(
        userId,
        isReadlist
      );
      const userChildrenBookContent = appendObjectToArrayFile(
        userChildrenBooksFile,
        formatUserChildrenBook(userPayload)
      );
      fs.writeFileSync(userChildrenBooksFile, userChildrenBookContent, 'utf8');

      res.json({
        ok: true,
        entityFile: BASE_CHILDREN_BOOKS_API_FILE,
        userFile: userChildrenBooksFile,
      });
    } else {
      res.json({
        ok: true,
        entityFile: BASE_CHILDREN_BOOKS_API_FILE,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
