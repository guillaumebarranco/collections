const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { escapeStringForTsDoubleQuote: escapeString } = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseManwhasFromFile,
  getUserManwhasFiles,
  removeManwhaFromFile,
  getUserReadlistManwhasFiles,
} = require('../../utils/manwhas/manwhas-utils');

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

function formatUserManwha(manwha: any, options?: { rating?: number; ratingComment?: string }) {
  const readDate = getReadDateToday();
  const rating = options?.rating != null ? Number(options.rating) : 0;
  const ratingComment = typeof options?.ratingComment === 'string' ? options.ratingComment : '';
  return `  {\n    title: "${escapeString(manwha.title)}",\n    author: "${escapeString(manwha.author)}",\n    readDate: "${readDate}",\n    readingScanStartDate: "",\n    readingScanStopDate: "",\n    rating: ${rating},\n    reading: false,\n    readTimes: 1,\n    owned: false,\n    readPriority: ${manwha.readPriority ?? 1},\n    wantToReadAgain: false,\n    ratingComment: "${escapeString(ratingComment)}",\n    borrowed: "${escapeString(typeof manwha.borrowed === 'string' ? manwha.borrowed : '')}",\n    loaned: "${escapeString(typeof manwha.loaned === 'string' ? manwha.loaned : '')}",\n  },`;
}

function getUserManwhasTargetFile(userId: string, isReadlist: boolean) {
  const userDir = path.join(usersRootDir, userId, 'manwhas');
  if (!fs.existsSync(userDir)) {
    throw new Error(`User manwhas directory not found: ${userId}`);
  }
  const files = fs
    .readdirSync(userDir)
    .filter((f: string) => f.endsWith('.ts') && f !== 'index.ts')
    .filter((f: string) =>
      isReadlist ? f.includes('readlist') : !f.includes('readlist')
    );
  const preferred = files.find((f: string) =>
    isReadlist
      ? f.includes(`${userId}_readlist_manwhas`)
      : f.includes(`${userId}_manwhas`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) throw new Error(`User manwhas file not found: ${userId}`);
  return path.join(userDir, selected);
}

router.post('/move-manwha-from-readlist-to-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    ensureUserExists(userId);

    const manwhas = Array.isArray(input.manwhas) ? input.manwhas : [];
    const rating = input.rating != null ? Number(input.rating) : undefined;
    const ratingComment = typeof input.ratingComment === 'string' ? input.ratingComment : undefined;
    const normalized = manwhas
      .map((m: any) => ({
        title: normalizeString(m.title, 'title'),
        author: normalizeString(m.author, 'author'),
        readPriority: m.readPriority,
      }))
      .filter((m: any) => m.title && m.author);

    if (normalized.length === 0) {
      res.status(400).json({ error: 'Missing manwhas' });
      return;
    }

    const userFiles = getUserManwhasFiles(userId);
    const existing = userFiles.flatMap((file: string) => {
      const content = fs.readFileSync(file, 'utf8');
      return parseManwhasFromFile(content).map((m: any) => ({ title: m.title, author: m.author }));
    });
    const existingSet = new Set(existing.map((m: any) => `${m.title}|${m.author}`));
    const toAdd = normalized.filter((m: any) => !existingSet.has(`${m.title}|${m.author}`));

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Manwhas already exist for user' });
      return;
    }

    const userFile = getUserManwhasTargetFile(userId, false);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const reviewOptions = (rating != null || ratingComment != null) ? { rating, ratingComment } : undefined;
    for (const manwha of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserManwha(manwha, reviewOptions));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const readlistFiles = getUserReadlistManwhasFiles(userId);
    const title = normalizeString(toAdd[0].title, 'title');
    const author = normalizeString(toAdd[0].author, 'author');
    let updated = false;
    for (const file of readlistFiles) {
      const content = fs.readFileSync(file, 'utf8');
      try {
        const updatedContent = removeManwhaFromFile(content, { title, author });
        fs.writeFileSync(file, updatedContent, 'utf8');
        updated = true;
        break;
      } catch (e: any) {
        if (e.message !== 'Manwha not found') throw e;
      }
    }
    if (!updated) {
      res.status(404).json({ error: 'Manwha not found in readlist' });
      return;
    }

    res.json({ ok: true, added: toAdd.length, file: userFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
