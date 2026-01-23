const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseBdsFromFile,
  getUserBdsFiles,
  escapeString,
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

function formatUserBd(bd: any) {
  return `  {\n    title: '${escapeString(
    bd.title
  )}',\n    designer: '${escapeString(
    bd.designer
  )}',\n    readDate: '',\n    rating: 0,\n    readTimes: 1,\n    owned: false,\n  },`;
}

function getUserBdsTargetFile(userId: string, isReadlist: boolean) {
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
    'bds'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User bds directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file: string) =>
      isReadlist ? file.includes('readlist') : !file.includes('readlist')
    );

  const preferred = files.find((file: string) =>
    isReadlist
      ? file.includes(`${userId}_readlist_bds`)
      : file.includes(`${userId}_bds`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User bds file not found: ${userId}`);
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

    const bds = Array.isArray(input.bds) ? input.bds : [];
    const isReadlist = normalizeBoolean(input.readlist, 'readlist') ?? false;
    const normalizedBds = bds
      .map((bd: any) => ({
        title: normalizeString(bd.title, 'title'),
        designer: normalizeString(bd.designer, 'designer'),
      }))
      .filter((bd: any) => bd.title && bd.designer);

    if (normalizedBds.length === 0) {
      res.status(400).json({ error: 'Missing bds' });
      return;
    }

    const userFiles = getUserBdsFiles(userId);
    const existing = userFiles.flatMap((bdFile: string) => {
      const fileContent = fs.readFileSync(bdFile, 'utf8');
      return parseBdsFromFile(fileContent).map((bd: any) => ({
        title: bd.title,
        designer: bd.designer,
      }));
    });

    const existingSet = new Set(
      existing.map((bd: any) => `${bd.title}|${bd.designer}`)
    );

    const toAdd = normalizedBds.filter(
      (bd: any) => !existingSet.has(`${bd.title}|${bd.designer}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Bds already exist for user' });
      return;
    }

    const userFile = getUserBdsTargetFile(userId, isReadlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    for (const bd of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserBd(bd));
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
