const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  appendObjectToArrayFile,
  parseSeriesFromFile,
  getUserSeriesFiles,
} = require('../../utils/series/series-utils');

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

function escapeString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatUserSerie(serie: any) {
  return `  {
    title: '${escapeString(serie.title)}',
    director: '${escapeString(serie.director)}',
    rating: 0,
    timesWatched: 1,
    stoppedAtSeason: 0,
  },`;
}

function getUserSeriesTargetFile(userId: string) {
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
    'series'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User series directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts');

  const preferred = files.find((file: string) =>
    file.includes(`${userId}_series`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User series file not found: ${userId}`);
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

    const series = Array.isArray(input.series) ? input.series : [];
    const normalizedSeries = series
      .map((serie: any) => ({
        title: normalizeString(serie.title, 'title'),
        director: normalizeString(serie.director, 'director'),
      }))
      .filter((serie: any) => serie.title && serie.director);

    if (normalizedSeries.length === 0) {
      res.status(400).json({ error: 'Missing series' });
      return;
    }

    const userFiles = getUserSeriesFiles(userId);
    const existing = userFiles.flatMap((serieFile: string) => {
      const fileContent = fs.readFileSync(serieFile, 'utf8');
      return parseSeriesFromFile(fileContent).map((serie: any) => ({
        title: serie.title,
        director: serie.director,
      }));
    });

    const existingSet = new Set(
      existing.map((serie: any) => `${serie.title}|${serie.director}`)
    );

    const toAdd = normalizedSeries.filter(
      (serie: any) => !existingSet.has(`${serie.title}|${serie.director}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Series already exist for user' });
      return;
    }

    const userFile = getUserSeriesTargetFile(userId);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    for (const serie of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserSerie(serie));
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
