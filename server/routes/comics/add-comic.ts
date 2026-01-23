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
    title: '${escapeString(entity.title)}',
    designer: '${escapeString(entity.designer)}',
    writer: '${escapeString(entity.writer)}',
    coverUrl: '${escapeString(entity.coverUrl || '')}',
    pages: ${entity.pages || 0},
    genre: '${escapeString(entity.genre || '')}',
    nbTomes: ${entity.nbTomes || 0},
    isFinished: ${entity.isFinished ?? true},
  },`;
}

function formatUserComic(user: any): string {
  return `  {
    title: '${escapeString(user.title)}',
    designer: '${escapeString(user.designer)}',
    readDate: '${escapeString(user.readDate || '')}',
    rating: ${user.rating ?? 0},
    readTimes: ${user.readTimes ?? 1},
    owned: ${user.owned ?? false},
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
    const designer = normalizeString(entity.designer, 'designer');
    const writer = normalizeString(entity.writer, 'writer');
    if (!title || !designer || !writer) {
      res.status(400).json({ error: 'Missing title, designer or writer' });
      return;
    }

    if (baseComicExists(title, designer)) {
      res.status(409).json({ error: 'Comic already exists in entities' });
      return;
    }

    const entityPayload = {
      title,
      designer,
      writer,
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      pages: normalizeNumber(entity.pages, 'pages') || 0,
      genre: normalizeString(entity.genre, 'genre') || '',
      nbTomes: normalizeNumber(entity.nbTomes, 'nbTomes') || 0,
      isFinished: normalizeBoolean(entity.isFinished, 'isFinished') ?? true,
    };

    const userPayload = {
      title,
      designer,
      rating: normalizeNumber(user.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(user.readTimes, 'readTimes') ?? 1,
      readDate: normalizeString(user.readDate, 'readDate') || '',
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
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
