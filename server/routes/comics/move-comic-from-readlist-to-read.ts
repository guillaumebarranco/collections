const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { escapeStringForTsDoubleQuote: escapeString } = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseComicsFromFile,
  getUserComicsFiles,
  removeComicFromFile,
  getUserReadlistComicsFiles,
} = require('../../utils/comics/comics-utils');

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
  if (fs.existsSync(userDir)) return;
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild
    ? [createUserScript, userId, '--build']
    : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function getReadDateToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatUserComic(comic: any, options?: { rating?: number; ratingComment?: string }) {
  const readDate = getReadDateToday();
  const rating = options?.rating != null ? Number(options.rating) : 0;
  const ratingComment = typeof options?.ratingComment === 'string' ? options.ratingComment : '';
  return `  {\n    title: "${escapeString(comic.title)}",\n    writer: "${escapeString(comic.writer)}",\n    readDate: "${readDate}",\n    rating: ${rating},\n    readTimes: 1,\n    owned: false,\n    readPriority: ${comic.readPriority ?? 1},\n    wantToReadAgain: false,\n    ratingComment: "${escapeString(ratingComment)}",\n    borrowed: "${escapeString(typeof comic.borrowed === 'string' ? comic.borrowed : '')}",\n    loaned: "${escapeString(typeof comic.loaned === 'string' ? comic.loaned : '')}",\n  },`;
}

function getUserComicsTargetFile(userId: string, isReadlist: boolean) {
  const userDir = path.join(usersRootDir, userId, 'comics');
  if (!fs.existsSync(userDir)) {
    throw new Error(`User comics directory not found: ${userId}`);
  }
  const files = fs
    .readdirSync(userDir)
    .filter((f: string) => f.endsWith('.ts') && f !== 'index.ts')
    .filter((f: string) =>
      isReadlist ? f.includes('readlist') : !f.includes('readlist')
    );
  const preferred = files.find((f: string) =>
    isReadlist
      ? f.includes(`${userId}_readlist_comics`)
      : f.includes(`${userId}_comics`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) throw new Error(`User comics file not found: ${userId}`);
  return path.join(userDir, selected);
}

router.post('/move-comic-from-readlist-to-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    ensureUserExists(userId);

    const comics = Array.isArray(input.comics) ? input.comics : [];
    const rating = input.rating != null ? Number(input.rating) : undefined;
    const ratingComment = typeof input.ratingComment === 'string' ? input.ratingComment : undefined;
    const normalized = comics
      .map((c: any) => ({
        title: normalizeString(c.title, 'title'),
        writer: normalizeString(c.writer, 'writer'),
        readPriority: c.readPriority,
      }))
      .filter((c: any) => c.title && c.writer);

    if (normalized.length === 0) {
      res.status(400).json({ error: 'Missing comics' });
      return;
    }

    const userFiles = getUserComicsFiles(userId);
    const existing = userFiles.flatMap((file: string) => {
      const content = fs.readFileSync(file, 'utf8');
      return parseComicsFromFile(content).map((c: any) => ({ title: c.title, writer: c.writer }));
    });
    const existingSet = new Set(existing.map((c: any) => `${c.title}|${c.writer}`));
    const toAdd = normalized.filter((c: any) => !existingSet.has(`${c.title}|${c.writer}`));

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Comics already exist for user' });
      return;
    }

    const userFile = getUserComicsTargetFile(userId, false);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const reviewOptions = (rating != null || ratingComment != null) ? { rating, ratingComment } : undefined;
    for (const comic of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserComic(comic, reviewOptions));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const readlistFiles = getUserReadlistComicsFiles(userId);
    const title = normalizeString(toAdd[0].title, 'title');
    const writer = normalizeString(toAdd[0].writer, 'writer');
    let updated = false;
    for (const file of readlistFiles) {
      const content = fs.readFileSync(file, 'utf8');
      try {
        const updatedContent = removeComicFromFile(content, { title, writer });
        fs.writeFileSync(file, updatedContent, 'utf8');
        updated = true;
        break;
      } catch (e: any) {
        if (e.message !== 'Comic not found') throw e;
      }
    }
    if (!updated) {
      res.status(404).json({ error: 'Comic not found in readlist' });
      return;
    }

    res.json({ ok: true, added: toAdd.length, file: userFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
