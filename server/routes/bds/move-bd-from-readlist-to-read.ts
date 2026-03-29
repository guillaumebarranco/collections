const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { escapeStringForTsDoubleQuote: escapeString } = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseBdsFromFile,
  getUserBdsFiles,
  removeBdFromFile,
  getUserReadlistBdsFiles,
} = require('../../utils/bds/bds-utils');

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

function formatUserBd(bd: any, options?: { rating?: number; ratingComment?: string }) {
  const readDate = getReadDateToday();
  const rating = options?.rating != null ? Number(options.rating) : 0;
  const ratingComment = typeof options?.ratingComment === 'string' ? options.ratingComment : '';
  return `  {\n    title: "${escapeString(bd.title)}",\n    writer: "${escapeString(bd.writer)}",\n    readDate: "${readDate}",\n    rating: ${rating},\n    readTimes: 1,\n    owned: false,\n    readPriority: ${bd.readPriority ?? 1},\n    wantToReadAgain: false,\n    ratingComment: "${escapeString(ratingComment)}",\n    borrowed: "${escapeString(typeof bd.borrowed === 'string' ? bd.borrowed : '')}",\n    loaned: "${escapeString(typeof bd.loaned === 'string' ? bd.loaned : '')}",\n  },`;
}

function getUserBdsTargetFile(userId: string, isReadlist: boolean) {
  const userDir = path.join(usersRootDir, userId, 'bds');
  if (!fs.existsSync(userDir)) {
    throw new Error(`User bds directory not found: ${userId}`);
  }
  const files = fs
    .readdirSync(userDir)
    .filter((f: string) => f.endsWith('.ts') && f !== 'index.ts')
    .filter((f: string) =>
      isReadlist ? f.includes('readlist') : !f.includes('readlist')
    );
  const preferred = files.find((f: string) =>
    isReadlist
      ? f.includes(`${userId}_readlist_bds`)
      : f.includes(`${userId}_bds`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) throw new Error(`User bds file not found: ${userId}`);
  return path.join(userDir, selected);
}

router.post('/move-bd-from-readlist-to-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    ensureUserExists(userId);

    const bds = Array.isArray(input.bds) ? input.bds : [];
    const rating = input.rating != null ? Number(input.rating) : undefined;
    const ratingComment = typeof input.ratingComment === 'string' ? input.ratingComment : undefined;
    const normalized = bds
      .map((b: any) => ({
        title: normalizeString(b.title, 'title'),
        writer: normalizeString(b.writer, 'writer'),
        readPriority: b.readPriority,
      }))
      .filter((b: any) => b.title && b.writer);

    if (normalized.length === 0) {
      res.status(400).json({ error: 'Missing bds' });
      return;
    }

    const userFiles = getUserBdsFiles(userId);
    const existing = userFiles.flatMap((file: string) => {
      const content = fs.readFileSync(file, 'utf8');
      return parseBdsFromFile(content).map((b: any) => ({ title: b.title, writer: b.writer }));
    });
    const existingSet = new Set(existing.map((b: any) => `${b.title}|${b.writer}`));
    const toAdd = normalized.filter((b: any) => !existingSet.has(`${b.title}|${b.writer}`));

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Bds already exist for user' });
      return;
    }

    const userFile = getUserBdsTargetFile(userId, false);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const reviewOptions = (rating != null || ratingComment != null) ? { rating, ratingComment } : undefined;
    for (const bd of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserBd(bd, reviewOptions));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const readlistFiles = getUserReadlistBdsFiles(userId);
    const title = normalizeString(toAdd[0].title, 'title');
    const writer = normalizeString(toAdd[0].writer, 'writer');
    let updated = false;
    for (const file of readlistFiles) {
      const content = fs.readFileSync(file, 'utf8');
      try {
        const updatedContent = removeBdFromFile(content, { title, writer });
        fs.writeFileSync(file, updatedContent, 'utf8');
        updated = true;
        break;
      } catch (e: any) {
        if (e.message !== 'Bd not found') throw e;
      }
    }
    if (!updated) {
      res.status(404).json({ error: 'Bd not found in readlist' });
      return;
    }

    res.json({ ok: true, added: toAdd.length, file: userFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
