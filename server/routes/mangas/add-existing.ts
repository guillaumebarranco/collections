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
  escapeString,
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
  if (fs.existsSync(userDir)) {
    return;
  }
  console.log('creation user', userId);
  const shouldBuild =
    process.env.MAKYA_BUILD === 'true' || process.env.NODE_ENV === 'production';
  const args = shouldBuild ? [createUserScript, userId, '--build'] : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function formatUserManga(manga: any) {
  return `  {\n    title: '${escapeString(
    manga.title
  )}',\n    author: '${escapeString(
    manga.author
  )}',\n    readDate: '',\n    rating: 0,\n    readTimes: 1,\n  },`;
}

function getUserMangasTargetFile(userId: string, isReadlist: boolean) {
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
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file: string) =>
      isReadlist ? file.includes('readlist') : !file.includes('readlist')
    );

  const preferred = files.find((file: string) =>
    isReadlist
      ? file.includes(`${userId}_readlist_mangas`)
      : file.includes(`${userId}_mangas`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User mangas file not found: ${userId}`);
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

    const mangas = Array.isArray(input.mangas) ? input.mangas : [];
    const isReadlist = normalizeBoolean(input.readlist, 'readlist') ?? false;
    const normalizedMangas = mangas
      .map((manga: any) => ({
        title: normalizeString(manga.title, 'title'),
        author: normalizeString(manga.author, 'author'),
      }))
      .filter((manga: any) => manga.title && manga.author);

    if (normalizedMangas.length === 0) {
      res.status(400).json({ error: 'Missing mangas' });
      return;
    }

    const userFiles = getUserMangasFiles(userId);
    const existing = userFiles.flatMap((mangaFile: string) => {
      const fileContent = fs.readFileSync(mangaFile, 'utf8');
      return parseMangasFromFile(fileContent).map((manga: any) => ({
        title: manga.title,
        author: manga.author,
      }));
    });

    const existingSet = new Set(
      existing.map((manga: any) => `${manga.title}|${manga.author}`)
    );

    const toAdd = normalizedMangas.filter(
      (manga: any) => !existingSet.has(`${manga.title}|${manga.author}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Mangas already exist for user' });
      return;
    }

    const userFile = getUserMangasTargetFile(userId, isReadlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    for (const manga of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserManga(manga));
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
