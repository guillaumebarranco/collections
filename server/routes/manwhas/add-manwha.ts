const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  escapeString,
  appendObjectToArrayFile,
  baseManwhaExists,
  BASE_MANWHAS_API_FILE,
} = require('../../utils/manwhas/manwhas-utils');

const router = express.Router();

function formatBaseManwha(entity: any): string {
  return `  {
    title: '${escapeString(entity.title)}',
    author: '${escapeString(entity.author)}',
    coverUrl: '${escapeString(entity.coverUrl || '')}',
    genre: '${escapeString(entity.genre || '')}',
    nbChapters: ${entity.nbChapters || 0},
    isFinished: ${entity.isFinished ?? true},
  },`;
}

function formatUserManwha(user: any): string {
  return `  {
    title: '${escapeString(user.title)}',
    author: '${escapeString(user.author)}',
    readDate: '${escapeString(user.readDate || '')}',
    rating: ${user.rating ?? 0},
    readTimes: ${user.readTimes ?? 1},
    owned: ${user.owned ?? false},
    readPriority: ${user.readPriority ?? 1},
    wantToReadAgain: ${user.wantToReadAgain ?? false},
  },`;
}

function getUserManwhasTargetFile(userId: string) {
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
    'manwhas'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User manwhas directory not found: ${userId}`);
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
    file.includes(`${userId}_manwhas`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User manwhas file not found: ${userId}`);
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

    if (baseManwhaExists(title, author)) {
      res.status(409).json({ error: 'Manwha already exists in entities' });
      return;
    }

    const nbChapters = normalizeNumber(entity.nbChapters, 'nbChapters') ?? 0;

    const entityPayload = {
      title,
      author,
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      genre: normalizeString(entity.genre, 'genre') || '',
      nbChapters,
      isFinished: normalizeBoolean(entity.isFinished, 'isFinished') ?? true,
    };

    const userPayload = {
      title,
      author,
      rating: normalizeNumber(user.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(user.readTimes, 'readTimes') ?? 1,
      readDate: normalizeString(user.readDate, 'readDate') || '',
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      readPriority: normalizeNumber(user.readPriority, 'readPriority') ?? 1,
      wantToReadAgain: normalizeBoolean(user.wantToReadAgain, 'wantToReadAgain') ?? false,
    };

    const baseManwhaContent = appendObjectToArrayFile(
      BASE_MANWHAS_API_FILE,
      formatBaseManwha(entityPayload)
    );
    fs.writeFileSync(BASE_MANWHAS_API_FILE, baseManwhaContent, 'utf8');

    const userManwhasFile = getUserManwhasTargetFile(userId);
    const userManwhaContent = appendObjectToArrayFile(
      userManwhasFile,
      formatUserManwha(userPayload)
    );
    fs.writeFileSync(userManwhasFile, userManwhaContent, 'utf8');

    res.json({
      ok: true,
      entityFile: BASE_MANWHAS_API_FILE,
      userFile: userManwhasFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
