const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseManwhasFromFile,
  getUserManwhasFiles,
  escapeString,
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
  if (fs.existsSync(userDir)) {
    return;
  }
  console.log('creation user', userId);
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild ? [createUserScript, userId, '--build'] : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function formatUserManwha(manwha: any) {
  return `  {\n    title: '${escapeString(
    manwha.title
  )}',\n    author: '${escapeString(
    manwha.author
  )}',\n    readDate: '',\n    rating: 0,\n    readTimes: 1,\n    owned: false,\n    readPriority: 0,\n  },`;
}

function formatReadlistManwha(manwha: any) {
  return `  {\n    title: '${escapeString(
    manwha.title
  )}',\n    author: '${escapeString(
    manwha.author
  )}',\n    readDate: '',\n    rating: 0,\n    readTimes: 0,\n    owned: false,\n    readPriority: ${manwha.readPriority ?? 0},\n  },`;
}

function getUserManwhasTargetFile(userId: string, isReadlist: boolean) {
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
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file: string) =>
      isReadlist ? file.includes('readlist') : !file.includes('readlist')
    );

  const preferred = files.find((file: string) =>
    isReadlist
      ? file.includes(`${userId}_readlist_manwhas`)
      : file.includes(`${userId}_manwhas`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User manwhas file not found: ${userId}`);
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

    const manwhas = Array.isArray(input.manwhas) ? input.manwhas : [];
    const isReadlist = normalizeBoolean(input.readlist, 'readlist') ?? false;
    const normalizedManwhas = manwhas
      .map((manwha: any) => ({
        title: normalizeString(manwha.title, 'title'),
        author: normalizeString(manwha.author, 'author'),
      }))
      .filter((manwha: any) => manwha.title && manwha.author);

    if (normalizedManwhas.length === 0) {
      res.status(400).json({ error: 'Missing manwhas' });
      return;
    }

    const userFiles = getUserManwhasFiles(userId);
    const existing = userFiles.flatMap((manwhaFile: string) => {
      const fileContent = fs.readFileSync(manwhaFile, 'utf8');
      return parseManwhasFromFile(fileContent).map((manwha: any) => ({
        title: manwha.title,
        author: manwha.author,
      }));
    });

    const existingSet = new Set(
      existing.map((manwha: any) => `${manwha.title}|${manwha.author}`)
    );

    const toAdd = normalizedManwhas.filter(
      (manwha: any) => !existingSet.has(`${manwha.title}|${manwha.author}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Manwhas already exist for user' });
      return;
    }

    const userFile = getUserManwhasTargetFile(userId, isReadlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const formatManwha = isReadlist ? formatReadlistManwha : formatUserManwha;
    for (const manwha of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatManwha(manwha));
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
