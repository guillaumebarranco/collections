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
  formatBaseManwhaEntry,
  BASE_MANWHAS_API_FILE,
} = require('../../utils/manwhas/manwhas-utils');

const router = express.Router();

function formatUserManwha(user: any): string {
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

    const baseManwhaContent = appendObjectToArrayFile(
      BASE_MANWHAS_API_FILE,
      `${formatBaseManwhaEntry(entityPayload)},`
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
