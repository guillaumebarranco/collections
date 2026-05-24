const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  escapeString,
  appendObjectToArrayFile,
  baseMangaExists,
  BASE_MANGAS_API_FILE,
} = require('../../utils/mangas/mangas-utils');

const router = express.Router();

function formatBaseManga(entity: any): string {
  return `  {
    title: "${escapeString(entity.title)}",
    author: "${escapeString(entity.author)}",
    coverUrl: "${escapeString(entity.coverUrl || '')}",
    genre: "${escapeString(entity.genre || '')}",
    nbTomes: ${entity.nbTomes || 0},
    startDate: "${escapeString(entity.startDate ?? '')}",
    endDate: "${escapeString(entity.endDate ?? '')}",
    saga: "${escapeString(entity.saga ?? '')}",
    description: "${escapeString(entity.description ?? '')}",
  },`;
}

function formatUserManga(user: any): string {
  return `  {
    title: "${escapeString(user.title)}",
    author: "${escapeString(user.author)}",
    readDate: "${escapeString(user.readDate || '')}",
    readingScanStartDate: "${escapeString(user.readingScanStartDate || '')}",
    readingScanStopDate: "${escapeString(user.readingScanStopDate || '')}",
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

function getUserMangasTargetFile(userId: string) {
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
    'mangas'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User mangas directory not found: ${userId}`);
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
    file.includes(`${userId}_mangas`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User mangas file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/add', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const baseMangaOnly =
      normalizeBoolean(input.baseMangaOnly, 'baseMangaOnly') ?? false;
    const userId = normalizeString(input.userId, 'userId');
    if (!baseMangaOnly && !userId) {
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

    if (baseMangaExists(title, author)) {
      res.status(409).json({ error: 'Manga already exists in entities' });
      return;
    }

    const entityPayload = {
      title,
      author,
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      genre: normalizeString(entity.genre, 'genre') || '',
      nbTomes: normalizeNumber(entity.nbTomes, 'nbTomes') || 0,
      startDate: normalizeString(entity.startDate, 'startDate') || '',
      endDate: normalizeString(entity.endDate, 'endDate') || '',
      description: normalizeString(entity.description, 'description') ?? '',
    };

    const userPayload = {
      title,
      author,
      rating: normalizeNumber(user.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(user.readTimes, 'readTimes') ?? 1,
      readDate: normalizeString(user.readDate, 'readDate') || '',
      readingScanStartDate:
        normalizeString(user.readingScanStartDate, 'readingScanStartDate') || '',
      readingScanStopDate:
        normalizeString(user.readingScanStopDate, 'readingScanStopDate') || '',
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      readPriority: normalizeNumber(user.readPriority, 'readPriority') ?? 1,
      wantToReadAgain: normalizeBoolean(user.wantToReadAgain, 'wantToReadAgain') ?? false,
      ratingComment:
        normalizeString(user.ratingComment, 'ratingComment') ?? '',
      borrowed: normalizeString(user.borrowed, 'borrowed') ?? '',
      loaned: normalizeString(user.loaned, 'loaned') ?? '',
    };

    const baseMangaContent = appendObjectToArrayFile(
      BASE_MANGAS_API_FILE,
      formatBaseManga(entityPayload)
    );
    fs.writeFileSync(BASE_MANGAS_API_FILE, baseMangaContent, 'utf8');

    if (!baseMangaOnly) {
      const userMangasFile = getUserMangasTargetFile(userId);
      const userMangaContent = appendObjectToArrayFile(
        userMangasFile,
        formatUserManga(userPayload)
      );
      fs.writeFileSync(userMangasFile, userMangaContent, 'utf8');

      res.json({
        ok: true,
        entityFile: BASE_MANGAS_API_FILE,
        userFile: userMangasFile,
      });
      return;
    }

    res.json({
      ok: true,
      entityFile: BASE_MANGAS_API_FILE,
      baseMangaOnly: true,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
