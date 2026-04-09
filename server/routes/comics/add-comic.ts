const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  escapeString,
  appendObjectToArrayFile,
  baseComicExists,
  BASE_COMICS_API_FILE,
} = require('../../utils/comics/comics-utils');

const router = express.Router();

function formatBaseComic(entity: any): string {
  return `  {
    title: "${escapeString(entity.title)}",
    writer: "${escapeString(entity.writer)}",
    designer: "${escapeString(entity.designer)}",
    coverUrl: "${escapeString(entity.coverUrl || '')}",
    releaseDate: "${escapeString(entity.releaseDate ?? '')}",
    pages: ${entity.pages || 0},
    genre: "${escapeString(entity.genre || '')}",
    saga: "${escapeString(entity.saga || '')}",
    sagaOrder: ${entity.sagaOrder ?? 0},
    description: "${escapeString(entity.description ?? '')}",
  },`;
}

function formatUserComic(user: any): string {
  return `  {
    title: "${escapeString(user.title)}",
    writer: "${escapeString(user.writer)}",
    readDate: "${escapeString(user.readDate || '')}",
    rating: ${user.rating ?? 0},
    readTimes: ${user.readTimes ?? 1},
    owned: ${user.owned ?? false},
    readPriority: ${user.readPriority ?? 1},
    wantToReadAgain: ${user.wantToReadAgain ?? false},
    ratingComment: "${escapeString(user.ratingComment ?? '')}",
    borrowed: "${escapeString(user.borrowed ?? '')}",
    loaned: "${escapeString(user.loaned ?? '')}",
  },`;
}

function getUserComicsTargetFile(userId: string) {
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
    'comics'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User comics directory not found: ${userId}`);
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
    file.includes(`${userId}_comics`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User comics file not found: ${userId}`);
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
    const writer = normalizeString(entity.writer, 'writer');
    const designer = normalizeString(entity.designer, 'designer');
    if (!title || !writer) {
      res.status(400).json({ error: 'Missing title or writer' });
      return;
    }

    if (baseComicExists(title, writer)) {
      res.status(409).json({ error: 'Comic already exists in entities' });
      return;
    }

    const entityPayload = {
      title,
      writer,
      designer,
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      releaseDate: normalizeString(entity.releaseDate, 'releaseDate') || '',
      pages: normalizeNumber(entity.pages, 'pages') || 0,
      genre: normalizeString(entity.genre, 'genre') || '',
      saga: normalizeString(entity.saga, 'saga') || '',
      sagaOrder: normalizeNumber(entity.sagaOrder, 'sagaOrder') ?? 0,
      description: normalizeString(entity.description, 'description') ?? '',
    };

    const userPayload = {
      title,
      writer,
      rating: normalizeNumber(user.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(user.readTimes, 'readTimes') ?? 1,
      readDate: normalizeString(user.readDate, 'readDate') || '',
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      readPriority: normalizeNumber(user.readPriority, 'readPriority') ?? 1,
      wantToReadAgain: normalizeBoolean(user.wantToReadAgain, 'wantToReadAgain') ?? false,
      ratingComment:
        normalizeString(user.ratingComment, 'ratingComment') ?? '',
      borrowed: normalizeString(user.borrowed, 'borrowed') ?? '',
      loaned: normalizeString(user.loaned, 'loaned') ?? '',
    };

    const baseComicContent = appendObjectToArrayFile(
      BASE_COMICS_API_FILE,
      formatBaseComic(entityPayload)
    );
    fs.writeFileSync(BASE_COMICS_API_FILE, baseComicContent, 'utf8');

    const userComicsFile = getUserComicsTargetFile(userId);
    const userComicContent = appendObjectToArrayFile(
      userComicsFile,
      formatUserComic(userPayload)
    );
    fs.writeFileSync(userComicsFile, userComicContent, 'utf8');

    res.json({
      ok: true,
      entityFile: BASE_COMICS_API_FILE,
      userFile: userComicsFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
