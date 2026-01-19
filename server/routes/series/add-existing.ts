const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseSeriesFromFile,
  getUserAllSeriesFiles,
  findBaseSerie,
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

function buildSeasons(nbSeasons: number) {
  const count = Math.max(0, Number(nbSeasons) || 0);
  return Array.from({ length: count }, (_, index) => ({
    seasonNumber: index + 1,
    seasonRating: 0,
    seasonTimesWatched: 0,
  }));
}

function formatSeasons(seasons: any[]) {
  const lines = seasons.map(
    (season: any) => `      {
        seasonNumber: ${season.seasonNumber},
        seasonRating: ${season.seasonRating},
        seasonTimesWatched: ${season.seasonTimesWatched},
      }`
  );
  return `    seasons: [\n${lines.join(',\n')}\n    ],`;
}

function formatUserSerie(serie: any) {
  const seasons = buildSeasons(serie.nbSeasons);
  return `  {
    title: '${escapeString(serie.title)}',
    director: '${escapeString(serie.director)}',
    rating: 0,
    timesWatched: 1,
    stoppedAtSeason: 0,
${formatSeasons(seasons)}
  },`;
}

function formatWatchlistSerie(serie: any) {
  const seasons = buildSeasons(serie.nbSeasons);
  return `  {
    title: '${escapeString(serie.title)}',
    director: '${escapeString(serie.director)}',
    rating: 0,
    timesWatched: 0,
    stoppedAtSeason: 0,
${formatSeasons(seasons)}
  },`;
}

function getUserSeriesTargetFile(userId: string, isWatchlist: boolean) {
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

  const scopedFiles = files.filter((file: string) =>
    isWatchlist ? file.includes('watchlist') : !file.includes('watchlist')
  );

  const preferred = scopedFiles.find((file: string) =>
    isWatchlist
      ? file.includes(`${userId}_watchlist_series`)
      : file.includes(`${userId}_series`)
  );
  const selected = preferred || scopedFiles.sort()[0];
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
    const isWatchlist = normalizeBoolean(input.watchlist, 'watchlist') ?? false;
    const normalizedSeries = series
      .map((serie: any) => ({
        title: normalizeString(serie.title, 'title'),
        director: normalizeString(serie.director, 'director'),
        nbSeasons: 0,
      }))
      .filter((serie: any) => serie.title && serie.director);

    if (normalizedSeries.length === 0) {
      res.status(400).json({ error: 'Missing series' });
      return;
    }

    const userFiles = getUserAllSeriesFiles(userId);
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

    const toAdd = normalizedSeries
      .filter(
        (serie: any) => !existingSet.has(`${serie.title}|${serie.director}`)
      )
      .map((serie: any) => {
        const baseSerie = findBaseSerie(serie.title, serie.director);
        return {
          ...serie,
          nbSeasons: baseSerie?.nbSeasons ?? 0,
        };
      });

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Series already exist for user' });
      return;
    }

    const userFile = getUserSeriesTargetFile(userId, isWatchlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const formatSerie = isWatchlist ? formatWatchlistSerie : formatUserSerie;
    for (const serie of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatSerie(serie));
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
