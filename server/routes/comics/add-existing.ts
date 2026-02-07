const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseComicsFromFile,
  getUserComicsFiles,
  escapeString,
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
  if (fs.existsSync(userDir)) {
    return;
  }
  console.log('creation user', userId);
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild
    ? [createUserScript, userId, '--build']
    : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function formatUserComic(comic: any) {
  return `  {\n    title: '${escapeString(
    comic.title
  )}',\n    writer: '${escapeString(
    comic.writer
  )}',\n    readDate: '',\n    rating: 0,\n    readTimes: 1,\n    owned: false,\n    readPriority: 1,\n  },`;
}

function getUserComicsTargetFile(userId: string, isReadlist: boolean) {
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
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file: string) =>
      isReadlist ? file.includes('readlist') : !file.includes('readlist')
    );

  const preferred = files.find((file: string) =>
    isReadlist
      ? file.includes(`${userId}_readlist_comics`)
      : file.includes(`${userId}_comics`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User comics file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/add-existing', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    ensureUserExists(userId);

    const comics = Array.isArray(input.comics) ? input.comics : [];
    const isReadlist = normalizeBoolean(input.readlist, 'readlist') ?? false;
    const normalizedComics = comics
      .map((comic: any) => ({
        title: normalizeString(comic.title, 'title'),
        writer: normalizeString(comic.writer, 'writer'),
      }))
      .filter((comic: any) => comic.title && comic.writer);

    if (normalizedComics.length === 0) {
      res.status(400).json({ error: 'Missing comics' });
      return;
    }

    const userFiles = getUserComicsFiles(userId);
    const existing = userFiles.flatMap((comicFile: string) => {
      const fileContent = fs.readFileSync(comicFile, 'utf8');
      return parseComicsFromFile(fileContent).map((comic: any) => ({
        title: comic.title,
        writer: comic.writer,
      }));
    });

    const existingSet = new Set(
      existing.map((comic: any) => `${comic.title}|${comic.writer}`)
    );

    const toAdd = normalizedComics.filter(
      (comic: any) => !existingSet.has(`${comic.title}|${comic.writer}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Comics already exist for user' });
      return;
    }

    const userFile = getUserComicsTargetFile(userId, isReadlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    for (const comic of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserComic(comic));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    res.json({
      ok: true,
      added: toAdd.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
