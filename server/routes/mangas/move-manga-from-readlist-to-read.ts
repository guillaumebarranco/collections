const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseMangasFromFile,
  getUserMangasFiles,
  removeMangaFromFile,
  getUserReadlistMangasFiles,
} = require('../../utils/mangas/mangas-utils');

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

function escapeString(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function getReadDateToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatUserManga(manga: any, options?: { rating?: number; ratingComment?: string }) {
  const readDate = getReadDateToday();
  const rating = options?.rating != null ? Number(options.rating) : 0;
  const ratingComment = typeof options?.ratingComment === 'string' ? options.ratingComment : '';
  return `  {\n    title: '${escapeString(manga.title)}',\n    author: '${escapeString(manga.author)}',\n    readDate: '${readDate}',\n    rating: ${rating},\n    readTimes: 1,\n    owned: false,\n    readPriority: ${manga.readPriority ?? 1},\n    wantToReadAgain: false,\n    ratingComment: '${escapeString(ratingComment)}',\n  },`;
}

function getUserMangasTargetFile(userId: string, isReadlist: boolean) {
  const userDir = path.join(usersRootDir, userId, 'mangas');
  if (!fs.existsSync(userDir)) {
    throw new Error(`User mangas directory not found: ${userId}`);
  }
  const files = fs
    .readdirSync(userDir)
    .filter((f: string) => f.endsWith('.ts') && f !== 'index.ts')
    .filter((f: string) =>
      isReadlist ? f.includes('readlist') : !f.includes('readlist')
    );
  const preferred = files.find((f: string) =>
    isReadlist
      ? f.includes(`${userId}_readlist_mangas`)
      : f.includes(`${userId}_mangas`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) throw new Error(`User mangas file not found: ${userId}`);
  return path.join(userDir, selected);
}

router.post('/move-manga-from-readlist-to-read', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    ensureUserExists(userId);

    const mangas = Array.isArray(input.mangas) ? input.mangas : [];
    const rating = input.rating != null ? Number(input.rating) : undefined;
    const ratingComment = typeof input.ratingComment === 'string' ? input.ratingComment : undefined;
    const normalized = mangas
      .map((m: any) => ({
        title: normalizeString(m.title, 'title'),
        author: normalizeString(m.author, 'author'),
        readPriority: m.readPriority,
      }))
      .filter((m: any) => m.title && m.author);

    if (normalized.length === 0) {
      res.status(400).json({ error: 'Missing mangas' });
      return;
    }

    const userFiles = getUserMangasFiles(userId);
    const existing = userFiles.flatMap((file: string) => {
      const content = fs.readFileSync(file, 'utf8');
      return parseMangasFromFile(content).map((m: any) => ({ title: m.title, author: m.author }));
    });
    const existingSet = new Set(existing.map((m: any) => `${m.title}|${m.author}`));
    const toAdd = normalized.filter((m: any) => !existingSet.has(`${m.title}|${m.author}`));

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Mangas already exist for user' });
      return;
    }

    const userFile = getUserMangasTargetFile(userId, false);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const reviewOptions = (rating != null || ratingComment != null) ? { rating, ratingComment } : undefined;
    for (const manga of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserManga(manga, reviewOptions));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const readlistFiles = getUserReadlistMangasFiles(userId);
    const title = normalizeString(toAdd[0].title, 'title');
    const author = normalizeString(toAdd[0].author, 'author');
    let updated = false;
    for (const file of readlistFiles) {
      const content = fs.readFileSync(file, 'utf8');
      try {
        const updatedContent = removeMangaFromFile(content, { title, author });
        fs.writeFileSync(file, updatedContent, 'utf8');
        updated = true;
        break;
      } catch (e: any) {
        if (e.message !== 'Manga not found') throw e;
      }
    }
    if (!updated) {
      res.status(404).json({ error: 'Manga not found in readlist' });
      return;
    }

    res.json({ ok: true, added: toAdd.length, file: userFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
